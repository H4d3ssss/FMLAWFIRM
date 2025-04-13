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
} from "../db/adminSide/cases.js";
const router = express.Router();

router.get("/active", async (req, res) => {
  try {
    const response = await fetchActiveCases();

    if (response.success) {
      return res.status(200).json(response);
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

export default router;
