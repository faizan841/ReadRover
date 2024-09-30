const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllBooks,
  getCurrentlyReadingBooks,
  addBook,
  markAsReading,
  removeFromCurrentlyReading,
  getBookById,
  updateBook,
  deleteBook,
  addReview,
  updateBookProgress,
  finishBook,
} = require("../controllers/books");

// Get all books (with pagination)
router.get("/", auth, getAllBooks);

// Get currently reading books
router.get("/currently-reading", auth, getCurrentlyReadingBooks);

// Add a new book
router.post("/", auth, addBook);

// Mark a book as currently reading
router.put("/:id/reading", auth, markAsReading);

// Remove a book from currently reading
router.put("/:id/not-reading", auth, removeFromCurrentlyReading);

// Get a specific book by its ID
router.get("/:id", auth, getBookById);

// Update a book (including adding a review)
router.put("/:id", auth, updateBook);

// Delete a book
router.delete("/:id", auth, deleteBook);

// Add a review
router.post("/:id/reviews", auth, addReview);

// Update book progress
router.put("/:id/progress", auth, updateBookProgress);

// Mark a book as finished
router.put("/:id/finish", auth, finishBook);

module.exports = router;
