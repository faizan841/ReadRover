import React, { useState } from "react";
import { TextField, Button, Box, Typography, Snackbar } from "@mui/material";
import axios from "axios";

export default function AddFriend({ onFriendAdded }) {
  const [friendUsername, setFriendUsername] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleAddFriend = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://readrover-backend.onrender.com/api/users/add-friend/${friendUsername}`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setSnackbar({
        open: true,
        message: "Friend added successfully!",
        severity: "success",
      });
      setFriendUsername("");
      if (onFriendAdded) {
        onFriendAdded(response.data);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.msg || "Error adding friend",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add a Friend
      </Typography>
      <form onSubmit={handleAddFriend}>
        <TextField
          fullWidth
          label="Friend's Username"
          value={friendUsername}
          onChange={(e) => setFriendUsername(e.target.value)}
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Friend
        </Button>
      </form>
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
