import express from "express";
import {
  fetchActiveCases,
  fetchClosedCases,
  fetchInProgressCases,
  fetchPendingCases,
  fetchResolvedCases,
  fetchOnHoldCases,
  fetchDismissedCases,
  fetchArchivedCases,
  fetchUnderReviewCases,
  fetchAwaitingTrialCases,
  insertNewCase,
  fetchAllCases,
  fetchCaseByCaseId,
  updateCase,
  archiveCase,
} from "../db/adminSide/cases.js";
// import upload from "../middleware/upload.js";
import multer from "multer";

const router = express.Router();

router.get("/active", async (req, res) => {
  try {
    const response = await fetchActiveCases();

    if (response.success) {
      return res.status(200).json(response.response);
    } else {
      return res.status(500).json({ message: "Fetching active cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching active cases",
    });
  }
});

router.get("/closed", async (req, res) => {
  try {
    const response = await fetchClosedCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(500).json({ message: "Fetching closed cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching closed cases",
    });
  }
});

router.get("/inprogress", async (req, res) => {
  try {
    const response = await fetchInProgressCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in progress cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching in progress cases",
    });
  }
});

router.get("/pending", async (req, res) => {
  try {
    const response = await fetchPendingCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in pending cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching pending cases",
    });
  }
});

router.get("/resolved", async (req, res) => {
  try {
    const response = await fetchResolvedCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in resolved cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching resolved cases",
    });
  }
});

router.get("/onhold", async (req, res) => {
  try {
    const response = await fetchOnHoldCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in on hold cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching on hold cases",
    });
  }
});

router.get("/dismissed", async (req, res) => {
  try {
    const response = await fetchDismissedCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in dismissed cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching dismissed cases",
    });
  }
});

router.get("/archived", async (req, res) => {
  try {
    const response = await fetchArchivedCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in archived cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching archived cases",
    });
  }
});

router.get("/underreview", async (req, res) => {
  try {
    const response = await fetchUnderReviewCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in under review cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching under review cases",
    });
  }
});

router.get("/awaitingtrial", async (req, res) => {
  try {
    const response = await fetchAwaitingTrialCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res
        .status(500)
        .json({ message: "Fetching in awaiting trial cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching awaiting trial cases",
    });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/new-case", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "no file uploaded" });
  }
  try {
    // console.log(req.file.originalname);
    const { caseTitle, clientId, lawyerId, status, link, adminId } = req.body;

    const filePath = req.file ? req.file.path : link;
    const fileName = req.file ? req.file.originalname : "Link Provided";

    const response = await insertNewCase(
      caseTitle,
      clientId,
      lawyerId,
      status,
      fileName,
      filePath,
      adminId
    );
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await fetchAllCases();

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json(error);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/edit-case", upload.single("file"), async (req, res) => {
  try {
    // Log the incoming file and data
    // console.log("Uploaded file:", req.file);
    // console.log("Body data:", req.body);
    const data = req.body;

    const response2 = await fetchCaseByCaseId(data.caseId);

    data.fileName = response2.response[0].file_name;
    data.filePath = response2.response[0].file_path;

    if (req.file) {
      // File was uploaded
      data.fileName = req.file.originalname;
      data.filePath = req.file.path;
    } else if (req.body.file) {
      // Link was used instead
      const link = req.body.file;
      const linkName = link.split("/").pop(); // get the filename from the URL

      data.fileName = linkName || "Link Provided";
      data.filePath = link;
    }

    // console.log(response2.response[0].file_name);
    // console.log(response2.response[0].file_path);

    // console.log(data);
    // Log the data being sent for the case update
    // console.log("Data to update:", data);

    // Call the update function
    const response = await updateCase(data);

    if (response) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json({ error: "Update failed" });
    }
  } catch (error) {
    console.error("Error in /edit-case:", error); // Better logging of the error
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/archived-case", async (req, res) => {
  try {
    const { caseId, adminId } = req.body;
    const response = await archiveCase(caseId, adminId);

    if (!response.success)
      return res.status(404).json({ message: response.message });

    res.status(200).json({ message: response.message });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
