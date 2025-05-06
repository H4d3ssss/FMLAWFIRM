import express from "express";
import {
  ifClientExist,
  insertClient,
  ifClientExistAndForApproval,
  ifClientExistAndApproved,
  fetchClientsViaEmail,
  generateTemporaryClientPassword,
  validatePasswordOrTemporaryPassword,
} from "../db/clients.js";
import bcrypt from "bcrypt";
import { userExist } from "../db/users.js";
import { createActivityLog } from "../db/activities.js";

const router = express.Router();

router.post("/resetpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const response = await generateTemporaryClientPassword(email);
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.email.trim() ||
      !data.password.trim() ||
      !data.confirmPassword.trim() ||
      !data.address.trim() ||
      !data.dateOfBirth.trim() ||
      !data.contactNumber.trim() ||
      !data.sex.trim()
    ) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    const clientExist = await ifClientExist(data.email);
    const clientExistAndForApproval = await ifClientExistAndForApproval(
      data.email
    );
    if (clientExist) {
      if (clientExistAndForApproval) {
        return res.status(202).json({ message: "Wait for admin's approval" });
      }
      return res.status(409).json({ error: "Email already exists" });
    }

    if (data.password !== data.confirmPassword) {
      return res.status(400).json({ error: "Password dont match" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const response = await insertClient(data);
    const adminId = req.session.user.lawyerId;
    console.log(adminId);
    if (response.success) {
      const data1 = {
        adminId,
        action: "CREATED CLIENT",
        description: "Created client: " + data.email,
        targetTable: "clients",
        target_id: null,
      };

      const response1 = await createActivityLog(data1);
      // console.log(response1);
      return res.status(200).json({ message: "Wait for admin's approval" });
    } else {
      res
        .status(500)
        .json({ message: "failed to add client", error: response.error.stack });
    }
  } catch (err) {
    console.log(err.stack);
    res
      .status(500)
      .json({ message: "An error has occured while inserting client" });
  }
});

// router.post("/login", async (req, res) => {
//   // pang client lang kasi to eh
//   try {
//     const data = req.body;

//     const response = await ifClientExist(data.email);

//     console.log(response);
//     if (response) {
//       const forApproval = await ifClientExistAndForApproval(data.email);
//       if (forApproval) {
//         return res.status(409).json({ message: "Wait for admin's approval" });
//       }
//       const responseApproved = await ifClientExistAndApproved(data.email);
//       if (responseApproved) {
//         const user = await fetchClientsViaEmail(data.email);
//         const user1 = await validatePasswordOrTemporaryPassword(data.email);
//         const validated = await bcrypt.compare(
//           data.password,
//           user.response[0].password
//         );
//         const validated1 = await bcrypt.compare(
//           data.password,
//           user1.response[0].temporary_password || ""
//         );
//         if (validated || validated1) {
//           // req.session.user = user;
//           req.session.user = {
//             username: user.response[0].email,
//             role: user.response[0].role,
//           }; // ipasa lang yung credentials ng user sa sessions
//           // console.log("ETO YUNG REQ SESSION LANG");
//           // console.log(req.session);
//           // console.log("ETO YUNG REQ SESSION USER");
//           // console.log(req.session.user);
//           return res.status(200).json({ message: "You are logged in" });
//         } else {
//           return res.status(400).json({ message: "Wrong credentials" });
//         }
//       }
//     }
//     return res.status(401).json({ message: "Email is not registered yet" });
//   } catch (error) {
//     console.log(error.stack);
//     res.status(500).json({ error: error });
//   }
// });

router.post("/login", async (req, res) => {
  try {
    const data = req.body;
    // console.log(data.email);
    const user = await userExist(data.email);
    // console.log(user);
    if (!user.success) return res.status(402).json({ message: user.message });
    if (user.response[0].email !== data.email)
      return res.status(401).json({ message: "Wrong email" });
    if (user.response[0].role === "Client") {
      const isValid = await bcrypt.compare(
        data.password,
        user.response[0].password
      );
      const isValid1 = await bcrypt.compare(
        data.password,
        user.response[0].temporary_password || ""
      );

      if (isValid || isValid1) {
        // console.log(user.response[0]);
        // console.log(req.session.user);
        req.session.user = {
          userId: user.response[0].user_id,
          email: user.response[0].email,
          role: user.response[0].role,
          clientId: user.response[0].client_id,
        };
        // console.log(req.session.user);
        res.status(200).json(req.session.user);
      } else {
        res.status(401).json({ message: "Bad Credentials" });
      }
    } else {
      // to admin route
      const isValid = await bcrypt.compare(
        data.password,
        user.response[0].password
      );

      const isValid1 = await bcrypt.compare(
        data.password,
        user.response[0].temporary_password || ""
      );
      console.log(isValid1);
      if (!isValid && !isValid1)
        return res.status(401).json({ message: "Bad Credentials" });
      // console.log(user.response[0]);
      req.session.user = {
        userId: user.response[0].user_id,
        email: user.response[0].email,
        role: user.response[0].role,
        lawyerId: user.response[0].lawyer_id,
      };
      // console.log(req.session.user);
      res.status(200).json(req.session.user);
    }

    // if (!isValid) return res.status(401).json({ message: "Bad Credentials" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.stack });
  }
});

router.get("/authenticate-user", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  res.status(200).json(req.session.user);
});

router.get("/logout", async (req, res) => {
  // this should clear out the cookies in the browser
  // also i havent added a function that'll generate a token in the login route (should i also add in the sign up route?)
  // i stil think that they arent needed yet sooo.....
  req.session.destroy;
  res.clearCookie("mySessionId");
  res.status(200).json({ message: "you are logged out" });
});

export default router;
