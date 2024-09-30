const Activity = require("../models/Activity");
const User = require("../models/User");

exports.addComment = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    const user = await User.findById(req.user.id).select("-password");
    const newComment = {
      user: req.user.id,
      content: req.body.content,
    };

    activity.comments.unshift(newComment);

    if (!activity.visibleTo.includes(req.user.id)) {
      activity.visibleTo.push(req.user.id);
    }

    if (!activity.visibleTo.includes(activity.user.toString())) {
      activity.visibleTo.push(activity.user);
    }

    await activity.save();

    const populatedActivity = await Activity.findById(req.params.id)
      .populate("user", "username profilePicture")
      .populate("book", "title authors thumbnail description")
      .populate("comments.user", "username profilePicture")
      .populate("comments.replies.user", "username profilePicture");

    console.log(`New comment on activity ${activity._id} by user ${user._id}`);

    res.json(populatedActivity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.addReply = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId);
    if (!activity) {
      return res.status(404).json({ msg: "Activity not found" });
    }

    const comment = activity.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    const user = await User.findById(req.user.id).select("-password");
    const newReply = {
      user: req.user.id,
      content: req.body.content,
    };

    comment.replies.push(newReply);

    if (!activity.visibleTo.includes(req.user.id)) {
      activity.visibleTo.push(req.user.id);
    }
    if (!activity.visibleTo.includes(activity.user.toString())) {
      activity.visibleTo.push(activity.user);
    }
    if (!activity.visibleTo.includes(comment.user.toString())) {
      activity.visibleTo.push(comment.user);
    }

    await activity.save();

    const populatedActivity = await Activity.findById(req.params.activityId)
      .populate("user", "username profilePicture")
      .populate("book", "title authors thumbnail description")
      .populate("comments.user", "username profilePicture")
      .populate("comments.replies.user", "username profilePicture");

    console.log(
      `New reply on activity ${activity._id}, comment ${comment._id} by user ${user._id}`
    );

    res.json(populatedActivity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
