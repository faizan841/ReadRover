const Book = require("../models/Book");
const Review = require("../models/Review");
const Discussion = require("../models/Discussion");
const User = require("../models/User");
const Activity = require("../models/Activity");

// Get all books (with pagination)
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json({ books });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get currently reading books
const getCurrentlyReadingBooks = async (req, res) => {
  try {
    const books = await Book.find({
      user: req.user.id,
      currentlyReading: true,
    });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a new book
const addBook = async (req, res) => {
  const { googleBooksId, title, authors, thumbnail, totalPages } = req.body;

  try {
    const newBook = new Book({
      user: req.user.id,
      googleBooksId,
      title,
      authors,
      thumbnail,
      pageCount: totalPages,
    });

    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Server error. Could not add book." });
  }
};

// Mark a book as currently reading
const markAsReading = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user.id });
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    book.currentlyReading = true;
    await book.save();

    const activity = new Activity({
      user: req.user.id,
      book: book._id,
      type: "started",
      content: `Started reading "${book.title}"`,
    });
    await activity.save();

    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Remove a book from currently reading
const removeFromCurrentlyReading = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user.id });
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    book.currentlyReading = false;
    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a book by ID
const getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ googleBooksId: req.params.id })
      .populate("reviews")
      .populate("discussions");

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Update a book
const updateBook = async (req, res) => {
  try {
    const { review, rating, startDate, endDate, currentlyReading } = req.body;
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    if (review) book.review = review;
    if (rating) book.rating = rating;
    if (startDate) book.startDate = startDate;
    if (endDate) book.endDate = endDate;
    if (currentlyReading !== undefined)
      book.currentlyReading = currentlyReading;

    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: "Book removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Add a review
const addReview = async (req, res) => {
  try {
    const { rating, content } = req.body;

    if (!content) {
      return res.status(400).json({ msg: "Review content is required" });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    const review = new Review({
      user: req.user.id,
      book: req.params.id,
      rating,
      content,
    });

    await review.save();

    if (!book.reviews) {
      book.reviews = [];
    }
    book.reviews.push(review._id);
    book.ratingsCount = (book.ratingsCount || 0) + 1;
    book.averageRating = book.averageRating
      ? (book.averageRating * (book.ratingsCount - 1) + rating) /
        book.ratingsCount
      : rating;

    await book.save();
    res.json(review);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update book progress
const updateBookProgress = async (req, res) => {
  const { progress, pagesRead, comment } = req.body;
  try {
    let book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    book.progress = progress;
    book.pagesRead = pagesRead;

    if (comment) {
      book.progressComments = book.progressComments || [];
      book.progressComments.push({ comment, date: Date.now() });
    }

    await book.save();

    const activity = new Activity({
      user: req.user.id,
      book: book._id,
      type: "progress",
      content: `Updated progress on "${book.title}" to ${progress}%`,
      progress: progress,
    });

    await activity.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Finish book
const finishBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ msg: "Book not found" });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    book.progress = 100;
    book.pagesRead = book.pageCount;
    book.currentlyReading = false;
    book.dateFinished = Date.now();

    book.progressComments = book.progressComments || [];
    book.progressComments.push({
      comment: "Finished reading",
      date: Date.now(),
    });

    await book.save();

    const activity = new Activity({
      user: req.user.id,
      book: book._id,
      type: "finished",
      content: `Finished reading "${book.title}"`,
    });

    await activity.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
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
};
