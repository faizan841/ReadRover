import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
  Divider,
  IconButton,
  Stack,
  Paper,
  Collapse,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Book as BookIcon,
  Comment as CommentIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import axios from "axios";

const getActivityIcon = (type) => {
  switch (type) {
    case "started":
      return <BookIcon color="primary" />;
    case "finished":
      return <BookIcon color="success" />;
    case "progress":
      return <BookIcon color="info" />;
    case "comment":
      return <CommentIcon color="secondary" />;
    default:
      return <BookIcon />;
  }
};

export default function FriendFeed({ activities, onActivityUpdate }) {
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  const handleCommentChange = (activityId, value) => {
    setComments({ ...comments, [activityId]: value });
  };

  const handleReplyChange = (commentId, value) => {
    setReplies({ ...replies, [commentId]: value });
  };

  const handleCommentSubmit = async (activityId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/activities/${activityId}/comments`,
        { content: comments[activityId] },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      onActivityUpdate(response.data);
      setComments({ ...comments, [activityId]: "" });
      setExpandedComments({ ...expandedComments, [activityId]: true });
    } catch (error) {
      console.error("Error submitting comment:", error);
      showSnackbar("Failed to submit comment. Please try again.", "error");
    }
  };

  const handleReplySubmit = async (activityId, commentId) => {
    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_REACT_APP_BASE_URL
        }/api/activities/${activityId}/comments/${commentId}/replies`,
        { content: replies[commentId] },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      onActivityUpdate(response.data);
      setReplies({ ...replies, [commentId]: "" });
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
      showSnackbar("Failed to submit reply. Please try again.", "error");
    }
  };

  const toggleComments = (activityId) => {
    setExpandedComments({
      ...expandedComments,
      [activityId]: !expandedComments[activityId],
    });
  };

  const handleBookClick = (book) => {
    if (book.googleBooksId) {
      navigate(`/book/${book.googleBooksId}`);
    } else if (book.title) {
      // If we don't have a Google Books ID, we can try searching by title
      navigate(`/browse?query=${encodeURIComponent(book.title)}`);
    } else {
      showSnackbar("Book details are not available.", "warning");
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

  if (activities.length === 0) {
    return (
      <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Friend Activity
        </Typography>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="body1">
              No friend activity to show. Add some friends to see their
              activities here!
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Friend Activity
      </Typography>
      <Stack spacing={3}>
        {activities.map((activity) => (
          <Card key={activity._id} elevation={3}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Avatar
                  alt={activity.user.username}
                  src={activity.user.profilePicture}
                  sx={{ mr: 2 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" component="span">
                    {activity.user.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {activity.content}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.date).toLocaleString()}
                  </Typography>
                </Box>
                {getActivityIcon(activity.type)}
              </Box>
              {activity.book && (
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 2,
                    cursor: "pointer",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                  onClick={() => handleBookClick(activity.book)}
                >
                  <Box sx={{ display: "flex" }}>
                    <Box
                      component="img"
                      sx={{
                        width: 80,
                        height: 120,
                        objectFit: "cover",
                        mr: 2,
                      }}
                      src={activity.book.thumbnail || "/placeholder.svg"}
                      alt={activity.book.title || "Book cover"}
                    />
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {activity.book.title || "Untitled Book"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {activity.book.description
                          ? `${activity.book.description.substring(0, 100)}...`
                          : "No description available."}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                  Comments:
                </Typography>
                <IconButton
                  onClick={() => toggleComments(activity._id)}
                  aria-label={
                    expandedComments[activity._id]
                      ? "Collapse comments"
                      : "Expand comments"
                  }
                >
                  {expandedComments[activity._id] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
              </Box>
              <Collapse in={expandedComments[activity._id]}>
                <List disablePadding>
                  {activity.comments &&
                    activity.comments.map((comment) => (
                      <React.Fragment key={comment._id}>
                        <ListItem alignItems="flex-start" disableGutters>
                          <ListItemAvatar>
                            <Avatar
                              alt={comment.user.username}
                              src={comment.user.profilePicture}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={comment.user.username}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {comment.content}
                                </Typography>
                                <Typography
                                  component="span"
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{ display: "block" }}
                                >
                                  {new Date(comment.date).toLocaleString()}
                                </Typography>
                              </React.Fragment>
                            }
                          />
                          <IconButton
                            size="small"
                            onClick={() => setReplyingTo(comment._id)}
                            aria-label="Reply to comment"
                          >
                            <ReplyIcon fontSize="small" />
                          </IconButton>
                        </ListItem>
                        {comment.replies &&
                          comment.replies.map((reply) => (
                            <ListItem
                              key={reply._id}
                              sx={{ pl: 4 }}
                              disableGutters
                            >
                              <ListItemAvatar>
                                <Avatar
                                  alt={reply.user.username}
                                  src={reply.user.profilePicture}
                                  sx={{ width: 32, height: 32 }}
                                />
                              </ListItemAvatar>
                              <ListItemText
                                primary={reply.user.username}
                                secondary={
                                  <React.Fragment>
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.primary"
                                    >
                                      {reply.content}
                                    </Typography>
                                    <Typography
                                      component="span"
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: "block" }}
                                    >
                                      {new Date(reply.date).toLocaleString()}
                                    </Typography>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                          ))}
                        {replyingTo === comment._id && (
                          <ListItem sx={{ pl: 4 }} disableGutters>
                            <TextField
                              fullWidth
                              variant="outlined"
                              size="small"
                              placeholder="Add a reply..."
                              value={replies[comment._id] || ""}
                              onChange={(e) =>
                                handleReplyChange(comment._id, e.target.value)
                              }
                            />
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleReplySubmit(activity._id, comment._id)
                              }
                              sx={{ ml: 1 }}
                              aria-label="Send reply"
                            >
                              <SendIcon />
                            </IconButton>
                          </ListItem>
                        )}
                      </React.Fragment>
                    ))}
                </List>
              </Collapse>
              <Box sx={{ display: "flex", mt: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  placeholder="Add a comment..."
                  value={comments[activity._id] || ""}
                  onChange={(e) =>
                    handleCommentChange(activity._id, e.target.value)
                  }
                />
                <IconButton
                  color="primary"
                  onClick={() => handleCommentSubmit(activity._id)}
                  sx={{ ml: 1 }}
                  aria-label="Post comment"
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
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
