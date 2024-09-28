const mongoose = require("mongoose");

const BookClubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  currentBook: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  meetings: [
    {
      date: { type: Date },
      topic: { type: String },
    },
  ],
});

module.exports = mongoose.model("BookClub", BookClubSchema);
