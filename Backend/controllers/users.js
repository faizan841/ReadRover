const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Review = require("../models/Review");
const Activity = require("../models/Activity");

exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, bio, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { username, bio, profilePicture } },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const following = user.following;
    const feed = await Review.find({ user: { $in: following } })
      .sort({ date: -1 })
      .populate("user", "username profilePicture")
      .populate("book", "title authors");
    res.json(feed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const notification = user.notifications.id(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }
    notification.read = true;
    await user.save();
    res.json(user.notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const recentActivity = [
      {
        _id: "1",
        content: "Started reading 'The Great Gatsby'",
        date: new Date(),
      },
      {
        _id: "2",
        content: "Finished 'To Kill a Mockingbird'",
        date: new Date(Date.now() - 86400000),
      },
    ];
    res.json(recentActivity);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getReadingChallenge = async (req, res) => {
  try {
    const readingChallenge = {
      goal: 50,
      progress: 10,
    };
    res.json(readingChallenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "username email profilePicture"
    );
    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("username email profilePicture");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.sendFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friendToAdd = await User.findById(req.params.id);

    if (!friendToAdd) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (friendToAdd.friendRequests.includes(req.user.id)) {
      return res.status(400).json({ msg: "Friend request already sent" });
    }

    friendToAdd.friendRequests.push(req.user.id);
    await friendToAdd.save();

    friendToAdd.notifications.push({
      type: "friendRequest",
      content: `${user.username} sent you a friend request`,
    });

    res.json({ msg: "Friend request sent successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.acceptFriendRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friendToAccept = await User.findById(req.params.id);

    if (!friendToAccept) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.friendRequests.includes(req.params.id)) {
      return res.status(400).json({ msg: "No friend request from this user" });
    }

    user.friendRequests = user.friendRequests.filter(
      (id) => id.toString() !== req.params.id
    );
    user.friends.push(req.params.id);
    friendToAccept.friends.push(req.user.id);

    await user.save();
    await friendToAccept.save();

    friendToAccept.notifications.push({
      type: "friendRequestAccepted",
      content: `${user.username} accepted your friend request`,
    });

    res.json({ msg: "Friend request accepted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "friendRequests",
      "username email profilePicture"
    );
    res.json(user.friendRequests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getFriendFeed = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const feed = await Activity.find({ visibleTo: req.user.id })
      .sort({ date: -1 })
      .limit(20)
      .populate("user", "username profilePicture")
      .populate("book", "title authors thumbnail description")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      })
      .populate({
        path: "comments.replies",
        populate: {
          path: "user",
          select: "username profilePicture",
        },
      });

    res.json(feed);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.addFriend = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.friendId);

    if (!friend) {
      return res.status(404).json({ msg: "Friend not found" });
    }

    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ msg: "Already friends" });
    }

    user.friends.push(friend._id);
    friend.friends.push(user._id);
    await user.save();
    await friend.save();

    await Activity.updateMany(
      { user: friend._id },
      { $addToSet: { visibleTo: user._id } }
    );

    await Activity.updateMany(
      { user: user._id },
      { $addToSet: { visibleTo: friend._id } }
    );

    res.json(user.friends);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateActivityVisibility = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await Activity.updateMany(
      { user: { $in: user.friends } },
      { $addToSet: { visibleTo: user._id } }
    );

    await Activity.updateMany(
      { user: user._id },
      { $addToSet: { visibleTo: { $each: user.friends } } }
    );

    res.json({ msg: "Activity visibility updated" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
