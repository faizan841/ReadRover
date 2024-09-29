import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CategoryIcon from "@mui/icons-material/Category";
import StarIcon from "@mui/icons-material/Star";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  transition: "transform 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const BookImage = styled("img")({
  width: "100%",
  maxHeight: "400px",
  objectFit: "contain",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
});

const BookInfoChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function BookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookData();
  }, [bookId]);

  const fetchBookData = async () => {
    setLoading(true);
    try {
      const googleBooksApiUrl = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
      const googleBookRes = await axios.get(googleBooksApiUrl);

      if (googleBookRes.data) {
        const googleBookData = {
          title: googleBookRes.data.volumeInfo.title,
          authors: googleBookRes.data.volumeInfo.authors || [],
          description:
            googleBookRes.data.volumeInfo.description ||
            "No description available",
          thumbnail:
            googleBookRes.data.volumeInfo.imageLinks?.thumbnail ||
            "/placeholder.svg",
          publishedDate:
            googleBookRes.data.volumeInfo.publishedDate || "Unknown",
          pageCount: googleBookRes.data.volumeInfo.pageCount || "N/A",
          categories: googleBookRes.data.volumeInfo.categories || [
            "Uncategorized",
          ],
          averageRating: googleBookRes.data.volumeInfo.averageRating || 0,
          ratingsCount: googleBookRes.data.volumeInfo.ratingsCount || 0,
        };

        setBook(googleBookData);
        setError(null);
      } else {
        setError("Book not found in Google Books API");
      }
    } catch (error) {
      console.error("Error fetching from Google Books API:", error);
      setError("Failed to fetch book data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Book not found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <StyledPaper elevation={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <BookImage src={book.thumbnail} alt={book.title} />
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
              {book.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {book.authors.join(", ")}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <BookInfoChip
                icon={<StarIcon />}
                label={`${book.averageRating.toFixed(1)} (${
                  book.ratingsCount
                } ratings)`}
              />
            </Box>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {book.description}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
              <BookInfoChip
                icon={<CalendarTodayIcon />}
                label={`Published: ${new Date(
                  book.publishedDate
                ).toLocaleDateString()}`}
              />
              <BookInfoChip
                icon={<MenuBookIcon />}
                label={`Pages: ${book.pageCount}`}
              />
              <BookInfoChip
                icon={<CategoryIcon />}
                label={`Categories: ${book.categories.join(", ")}`}
              />
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
}
