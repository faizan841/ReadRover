import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

export default function ProgressDialog({ open, onClose, book, onSave }) {
  const [pagesRead, setPagesRead] = useState(0);
  const [progressComment, setProgressComment] = useState("");

  useEffect(() => {
    if (book) {
      setPagesRead(book.pagesRead || 0);
      setProgressComment("");
    }
  }, [book]);

  const handleSave = () => {
    const progress = Math.round((pagesRead / book.pageCount) * 100);
    onSave(book._id, progress, pagesRead, progressComment);
  };

  if (!book) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Update Progress: {book.title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography gutterBottom>Pages Read</Typography>
          <TextField
            type="number"
            value={pagesRead}
            onChange={(e) =>
              setPagesRead(
                Math.max(
                  0,
                  Math.min(book.pageCount, parseInt(e.target.value) || 0)
                )
              )
            }
            fullWidth
            variant="outlined"
            inputProps={{ min: 0, max: book.pageCount }}
          />
        </Box>
        <Box sx={{ mt: 3, display: "flex", alignItems: "center" }}>
          <CircularProgress
            variant="determinate"
            value={(pagesRead / book.pageCount) * 100}
            size={60}
          />
          <Typography variant="h6" sx={{ ml: 2 }}>
            {Math.round((pagesRead / book.pageCount) * 100)}% Complete
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>Comment (optional)</Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={progressComment}
            onChange={(e) => setProgressComment(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Progress
        </Button>
      </DialogActions>
    </Dialog>
  );
}
