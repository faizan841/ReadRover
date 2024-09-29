import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  CardActionArea,
  styled,
  keyframes,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Book, ArrowBack } from "@mui/icons-material";

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const StyledCard = styled(Card)(({ theme }) => ({
  transition: "all 0.3s ease-in-out",
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[10],
  },
}));

const BookCover = styled(CardMedia)(({ theme }) => ({
  height: 300,
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(to right, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.1) 100%)",
  },
}));

const BookTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

const BookAuthor = styled(Typography)(({ theme }) => ({
  fontFamily: "'Merriweather', serif",
  fontStyle: "italic",
  color: theme.palette.text.secondary,
}));

const FloatingBook = styled(Book)(({ theme }) => ({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  color: theme.palette.primary.main,
  fontSize: 60,
}));

export default function BrowseResults() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const searchTerm = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
        );
        setSearchResults(response.data.items || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
        showSnackbar(
          "Error fetching search results. Please try again.",
          "error"
        );
      }
      setLoading(false);
    };

    if (searchTerm) {
      fetchSearchResults();
    }
  }, [searchTerm]);

  const handleAddBook = async (book, action) => {
    try {
      let response;
      if (action === "currentlyReading") {
        const addBookResponse = await api.post(
          `/api/books`,
          {
            googleBooksId: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            thumbnail: book.volumeInfo.imageLinks?.thumbnail,
            totalPages: book.volumeInfo.pageCount,
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );

        if (addBookResponse.status === 201) {
          response = await api.put(
            `/api/books/${addBookResponse.data.book._id}/reading`,
            {},
            {
              headers: { "x-auth-token": localStorage.getItem("token") },
            }
          );
        } else {
          throw new Error("Failed to add book to bookshelf");
        }
      } else {
        response = await api.post(
          `/api/books`,
          {
            googleBooksId: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            thumbnail: book.volumeInfo.imageLinks?.thumbnail,
            totalPages: book.volumeInfo.pageCount,
          },
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        const message =
          action === "currentlyReading"
            ? `"${book.volumeInfo.title}" added to your currently reading list!`
            : `"${book.volumeInfo.title}" added to your bookshelf!`;
        showSnackbar(message, "success");
        setSearchResults((prevResults) =>
          prevResults.map((item) =>
            item.id === book.id ? { ...item, addedToBookshelf: true } : item
          )
        );
      }
    } catch (error) {
      console.error("Error adding book:", error);
      showSnackbar("Error adding book. Please try again.", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
      }}
    >
      <Button
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
        startIcon={<ArrowBack />}
        variant="contained"
        color="primary"
      >
        Back to Dashboard
      </Button>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: theme.palette.primary.main,
        }}
      >
        Discover New Worlds
      </Typography>
      <Typography
        variant="h5"
        gutterBottom
        align="center"
        sx={{
          fontFamily: "'Merriweather', serif",
          fontStyle: "italic",
          color: theme.palette.secondary.main,
          mb: 4,
        }}
      >
        Search Results for "{searchTerm}"
      </Typography>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="50vh"
        >
          <FloatingBook />
        </Box>
      ) : searchResults.length > 0 ? (
        <Grid container spacing={4}>
          {searchResults.map((book, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <StyledCard>
                  <CardActionArea onClick={() => handleBookClick(book.id)}>
                    <BookCover
                      component="img"
                      image={
                        book.volumeInfo.imageLinks?.thumbnail ||
                        "/placeholder.svg"
                      }
                      alt={book.volumeInfo.title}
                    />
                    <CardContent>
                      <BookTitle
                        gutterBottom
                        variant="h6"
                        component="div"
                        noWrap
                      >
                        {book.volumeInfo.title}
                      </BookTitle>
                      <BookAuthor variant="body2" noWrap>
                        {book.volumeInfo.authors?.join(", ")}
                      </BookAuthor>
                    </CardContent>
                  </CardActionArea>
                  {book.addedToBookshelf ? (
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ mt: 1, p: 1, textAlign: "center" }}
                    >
                      Added to Bookshelf
                    </Typography>
                  ) : (
                    <FormControl fullWidth sx={{ mt: 1, p: 1 }}>
                      <Select
                        value=""
                        displayEmpty
                        onChange={(e) => handleAddBook(book, e.target.value)}
                        sx={{
                          "&:before": {
                            borderColor: theme.palette.primary.main,
                          },
                          "&:after": {
                            borderColor: theme.palette.primary.main,
                          },
                        }}
                      >
                        <MenuItem value="" disabled>
                          Add to...
                        </MenuItem>
                        <MenuItem value="bookshelf">Add to Bookshelf</MenuItem>
                        <MenuItem value="currentlyReading">
                          Currently Reading
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </StyledCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50vh"
        >
          <Typography variant="h6" gutterBottom color="text.primary">
            No results found for "{searchTerm}"
          </Typography>
          <FloatingBook />
        </Box>
      )}
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
