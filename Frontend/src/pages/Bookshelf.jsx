import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api";
import BookshelfTable from "../components/BookshelfTable";

export default function Bookshelf() {
  const [books, setBooks] = useState([]);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/books`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      console.log("Fetched books:", response.data);
      setBooks(response.data.books || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      showSnackbar("Failed to fetch books. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenReviewDialog = (book) => {
    setSelectedBook(book);
    setReview(book.review || "");
    setRating(book.rating || 0);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedBook(null);
    setReview("");
    setRating(0);
  };

  const handleSaveReview = async () => {
    try {
      await api.post(
        `/api/books/${selectedBook._id}/reviews`,
        { content: review, rating },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      showSnackbar("Review saved successfully", "success");
      handleCloseReviewDialog();
      fetchBooks();
    } catch (error) {
      console.error("Error saving review:", error);
      showSnackbar("Failed to save review. Please try again.", "error");
    }
  };

  const handleMarkAsReading = async (book) => {
    try {
      const response = await api.put(
        `/api/books/${book._id}/reading`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );

      if (response.status === 200) {
        showSnackbar("Book marked as currently reading", "success");
        fetchBooks();
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error marking book as reading:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        showSnackbar(
          `Failed to mark book as reading: ${
            error.response.data.msg || "Unknown error"
          }`,
          "error"
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        showSnackbar(
          "Failed to mark book as reading: No response received from server",
          "error"
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        showSnackbar(
          `Failed to mark book as reading: ${error.message}`,
          "error"
        );
      }
    }
  };

  const handleRemoveFromReading = async (book) => {
    try {
      await api.put(
        `/api/books/${book._id}/not-reading`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      showSnackbar("Book removed from currently reading", "success");
      fetchBooks();
    } catch (error) {
      console.error("Error removing book from reading:", error);
      showSnackbar(
        "Failed to remove book from reading. Please try again.",
        "error"
      );
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/api/books/${bookId}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      showSnackbar("Book deleted successfully", "success");
      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      showSnackbar("Failed to delete book. Please try again.", "error");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookshelf
      </Typography>
      {books.length === 0 ? (
        <Typography>
          Your bookshelf is empty. Add some books to get started!
        </Typography>
      ) : (
        <BookshelfTable
          books={books}
          handleOpenReviewDialog={handleOpenReviewDialog}
          handleMarkAsReading={handleMarkAsReading}
          handleRemoveFromReading={handleRemoveFromReading}
          handleDeleteBook={handleDeleteBook}
        />
      )}
      <Dialog open={openReviewDialog} onClose={handleCloseReviewDialog}>
        <DialogTitle>{selectedBook?.title}</DialogTitle>
        <DialogContent>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Your Review"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Cancel</Button>
          <Button onClick={handleSaveReview}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
