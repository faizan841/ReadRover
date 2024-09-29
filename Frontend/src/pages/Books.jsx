import React, { useState, useEffect } from "react";
import api from "../api";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
} from "@mui/material";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get(`/api/books`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      console.log(response);
      setBooks(response.data.books || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to fetch books. Please try again later.");
      setLoading(false);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        All Books
      </Typography>
      {books.length === 0 ? (
        <Typography>No books found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={
                    book.thumbnail || "/placeholder.svg?height=140&width=140"
                  }
                  alt={book.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    by {book.authors ? book.authors.join(", ") : "Unknown"}
                  </Typography>
                  <Button size="small" color="primary" sx={{ mt: 1 }}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
