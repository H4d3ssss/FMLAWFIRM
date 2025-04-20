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

const router = express.Router();

const isLawyer = (req, res, next) => {
  if (req.session.user && req.session.user.role === "Lawyer") {
    next();
  } else {
    return res.redirect("/login");
  }
};

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
    console.log(data);
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

    if (response.success) {
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

    const user = await userExist(data.email);
    // console.log(user);
    if (!user.success) return res.status(401).json({ message: user.message });

    if (user.response[0].email !== data.email)
      return res.status(401).json({ message: "Bad Credentials" });

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
        // console.log(req.session.user);
        req.session.user = {
          email: user.response[0].email,
          role: user.response[0].role,
        };
        console.log(req.session.user);
        res.status(200).json({ role: "Client" });
      } else {
        res.status(401).json({ message: "Bad Credentials" });
      }
    } else {
      // to admin route
      const isValid = await bcrypt.compare(
        data.password,
        user.response[0].password
      );

      if (!isValid) return res.status(401).json({ message: "Bad Credentials" });

      req.session.user = {
        email: user.response[0].email,
        role: user.response[0].role,
      };
      console.log(req.session.user);
      res.status(200).json({ role: "Lawyer" });
    }

    // if (!isValid) return res.status(401).json({ message: "Bad Credentials" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.stack });
  }
});

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const requireRole = (role) => (req, res, next) => {
  if (req.session.user?.role !== role) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

router.get("/getme", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "You are unauthorized" });
  console.log(req.session.user.role);
  res.status(200).json({ role: req.session.user.role });
});

router.get("/logout", async (req, res) => {
  // this should clear out the cookies in the browser
  // also i havent added a function that'll generate a token in the login route (should i also add in the sign up route?)
  // i stil think that they arent needed yet sooo.....
  req.session.destroy;
  res.clearCookie("connect.sid");
  res.status(200).json({ message: "you are logged out" });
});

export default router;
