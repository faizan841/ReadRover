import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../hooks/useAuth";
import {
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Container,
  Paper,
  useTheme,
} from "@mui/material";
const CurrentlyReading = React.lazy(() =>
  import("../components/CurrentlyReading")
);
const FriendFeed = React.lazy(() => import("../components/FriendFeed"));
const ProgressDialog = React.lazy(() => import("../components/ProgressDialog"));

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [friendFeed, setFriendFeed] = useState([]);
  const [readingChallenge, setReadingChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openProgressDialog, setOpenProgressDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleUpdateActivityVisibility = useCallback(async () => {
    try {
      await api.post(
        "/api/users/update-activity-visibility",
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      console.log("Activity visibility updated successfully");
    } catch (error) {
      console.error("Error updating activity visibility:", error);
    }
  }, []);

  const fetchFriendFeed = useCallback(async () => {
    try {
      const response = await api.get("/api/users/friend-feed", {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setFriendFeed(response.data || []);
    } catch (error) {
      console.error("Error fetching friend feed:", error);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [currentlyReadingRes, friendFeedRes, challengeRes] =
        await Promise.all([
          api.get("/api/books/currently-reading", {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }),
          api.get("/api/users/friend-feed", {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }),
          api.get("/api/users/reading-challenge", {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }),
        ]);
      setCurrentlyReading(currentlyReadingRes.data || []);
      setFriendFeed(friendFeedRes.data || []);
      setReadingChallenge(challengeRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to fetch dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) {
      handleUpdateActivityVisibility().then(() => {
        fetchDashboardData();
      });
      const interval = setInterval(fetchFriendFeed, 10000); // Refresh friend feed every 10 seconds
      return () => clearInterval(interval);
    }
  }, [
    authLoading,
    user,
    fetchDashboardData,
    fetchFriendFeed,
    handleUpdateActivityVisibility,
  ]);

  const handleActivityUpdate = (updatedActivity) => {
    setFriendFeed((prevFeed) =>
      prevFeed.map((activity) =>
        activity._id === updatedActivity._id ? updatedActivity : activity
      )
    );
  };

  const handleOpenProgressDialog = (book) => {
    setSelectedBook(book);
    setOpenProgressDialog(true);
  };

  const handleCloseProgressDialog = () => {
    setOpenProgressDialog(false);
    setSelectedBook(null);
  };

  const handleSaveProgress = async (bookId, progress, pagesRead) => {
    try {
      await api.put(
        `/api/books/${bookId}/progress`,
        { progress, pagesRead },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      fetchDashboardData();
      setSnackbar({
        open: true,
        message: "Progress updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      setSnackbar({
        open: true,
        message: "Failed to update progress",
        severity: "error",
      });
    }
    handleCloseProgressDialog();
  };

  const handleFinishBook = async (bookId) => {
    try {
      await api.put(
        `/api/books/${bookId}/finish`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      fetchDashboardData();
      setSnackbar({
        open: true,
        message: "Book marked as finished",
        severity: "success",
      });
    } catch (error) {
      console.error("Error finishing book:", error);
      setSnackbar({
        open: true,
        message: "Failed to mark book as finished",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome back, {user.username}!
          </Typography>
        </Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <CurrentlyReading
                books={currentlyReading}
                handleOpenProgressDialog={handleOpenProgressDialog}
                handleFinishBook={handleFinishBook}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
              }}
            >
              <FriendFeed
                activities={friendFeed}
                onActivityUpdate={handleActivityUpdate}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <React.Suspense fallback={<CircularProgress />}>
        <ProgressDialog
          open={openProgressDialog}
          onClose={handleCloseProgressDialog}
          book={selectedBook}
          onSave={handleSaveProgress}
        />
      </React.Suspense>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Container>
  );
}
