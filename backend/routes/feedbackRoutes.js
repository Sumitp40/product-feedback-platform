const express = require("express");
const router = express.Router();

const {
  createFeedback,
  getAllFeedback,
  getAverageRating,
  deleteFeedback
} = require("../controllers/feedbackController");

// Create feedback
router.post("/", createFeedback);

// Get feedback (with pagination)
router.get("/", getAllFeedback);

// Analytics
router.get("/analytics/average-rating", getAverageRating);

// Delete feedback
router.delete("/:id", deleteFeedback);

module.exports = router;
