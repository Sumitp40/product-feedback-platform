const Feedback = require("../models/Feedback");

/**
 * @desc Create feedback
 * @route POST /api/feedback
 */
const createFeedback = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const feedback = await Feedback.create({
      productId,
      rating,
      comment,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: "Create feedback failed" });
  }
};

/**
 * @desc Get all feedback (with pagination)
 * @route GET /api/feedback
 */
const getAllFeedback = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments();

    res.json({
      feedbacks,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch feedback failed" });
  }
};

/**
 * @desc Analytics – average rating per product
 * @route GET /api/feedback/analytics/average-rating
 */
const getAverageRating = async (req, res) => {
  try {
    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: "$productId",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Analytics failed" });
  }
};

/**
 * @desc Delete feedback
 * @route DELETE /api/feedback/:id
 */
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
  getAverageRating,
  deleteFeedback, // ✅ THIS WAS MISSING
};
