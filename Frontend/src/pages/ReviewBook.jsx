import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

export default function ReviewBook() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await api.get(`/api/books/${bookId}`, {
          headers: { "x-auth-token": token },
        });
        setBook(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book:", error);
        setError(
          error.response?.data?.msg ||
            error.message ||
            "An unknown error occurred"
        );
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleSubmitReview = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await api.put(
        `/api/books/${bookId}`,
        {
          review,
          rating,
          startDate,
          endDate,
          currentlyReading: false,
        },
        {
          headers: { "x-auth-token": token },
        }
      );
      setSnackbar({
        open: true,
        message: "Review submitted successfully",
        severity: "success",
      });
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.msg ||
          error.message ||
          "An unknown error occurred",
        severity: "error",
      });
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

  if (error) {
    return (
      <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  if (!book) {
    return (
      <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
        <Typography>Book not found.</Typography>
        <Button onClick={() => navigate("/dashboard")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4 }}>
      <Card sx={{ display: "flex", mb: 4 }}>
        <CardMedia
          component="img"
          sx={{ width: 140 }}
          image={book.thumbnail || "/placeholder.svg"}
          alt={book.title}
        />
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h1" variant="h5">
            {book.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {book.authors.join(", ")}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Your Review
      </Typography>
      <Rating
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Write your review"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>

      <Button variant="contained" color="primary" onClick={handleSubmitReview}>
        Submit Review
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}
