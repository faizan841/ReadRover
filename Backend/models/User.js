const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "https://example.com/default-profile-picture.jpg",
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  bio: { type: String },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bookshelves: [
    {
      name: { type: String },
      books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    },
  ],
  readingChallenges: [
    {
      year: { type: Number },
      goal: { type: Number },
      progress: { type: Number, default: 0 },
    },
  ],
  notifications: [
    {
      type: { type: String },
      content: { type: String },
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    },
  ],
  badges: [{ type: String }],
  readingStreak: { type: Number, default: 0 },
});

module.exports = mongoose.model("User", UserSchema);
