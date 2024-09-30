const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const activitiesController = require("../controllers/activities");

// Add a comment to an activity
router.post("/:id/comments", auth, activitiesController.addComment);

// Add a reply to a comment
router.post(
  "/:activityId/comments/:commentId/replies",
  auth,
  activitiesController.addReply
);

module.exports = router;
