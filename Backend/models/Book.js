const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  googleBooksId: { type: String, required: true },
  title: { type: String, required: true },
  authors: [{ type: String, required: true }],
  thumbnail: { type: String },
  pageCount: { type: Number },
  currentlyReading: { type: Boolean, default: false },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  discussions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Discussion" }],
  ratingsCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  progress: { type: Number, default: 0 },
  pagesRead: { type: Number, default: 0 },
  progressComments: [
    {
      comment: String,
      date: { type: Date, default: Date.now },
    },
  ],
  dateFinished: { type: Date },
});

module.exports = mongoose.model("Book", BookSchema);
