import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Box,
  Tab,
  Tabs,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import NavBar from "./NavBar";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Friends() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchFriendRequests();
    fetchFriends();
  }, []);

  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get(
        "https://readrover-backend.onrender.com/api/users/friend-requests",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setFriendRequests(res.data);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(
        "https://readrover-backend.onrender.com/api/users/friends",
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setFriends(res.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://readrover-backend.onrender.com/api/users/search?query=${searchQuery}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setSearchResults(res.data);
    } catch (error) {
      console.error("Error searching users:", error);
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await axios.post(
        `https://readrover-backend.onrender.com/api/users/friend-request/${userId}`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      // Update UI to show request sent
      setSearchResults(
        searchResults.map((user) =>
          user._id === userId ? { ...user, requestSent: true } : user
        )
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const acceptFriendRequest = async (userId) => {
    try {
      await axios.post(
        `https://readrover-backend.onrender.com/api/users/accept-friend-request/${userId}`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      fetchFriendRequests();
      fetchFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="friend tabs"
          >
            <Tab label="Find Friends" />
            <Tab label="Friend Requests" />
            <Tab label="My Friends" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Find Friends
          </Typography>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button type="submit" startIcon={<SearchIcon />}>
                    Search
                  </Button>
                ),
              }}
            />
          </form>
          <List>
            {searchResults.map((user) => (
              <ListItem key={user._id}>
                <ListItemAvatar>
                  <Avatar src={user.profilePicture} />
                </ListItemAvatar>
                <ListItemText primary={user.username} secondary={user.email} />
                {!user.requestSent && (
                  <Button onClick={() => sendFriendRequest(user._id)}>
                    Send Friend Request
                  </Button>
                )}
                {user.requestSent && (
                  <Typography variant="body2" color="textSecondary">
                    Friend Request Sent
                  </Typography>
                )}
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Friend Requests
          </Typography>
          <List>
            {friendRequests.map((request) => (
              <ListItem key={request._id}>
                <ListItemAvatar>
                  <Avatar src={request.profilePicture} />
                </ListItemAvatar>
                <ListItemText
                  primary={request.username}
                  secondary={request.email}
                />
                <Button onClick={() => acceptFriendRequest(request._id)}>
                  Accept
                </Button>
              </ListItem>
            ))}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            My Friends
          </Typography>
          <List>
            {friends.map((friend) => (
              <ListItem key={friend._id}>
                <ListItemAvatar>
                  <Avatar src={friend.profilePicture} />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.username}
                  secondary={friend.email}
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </Box>
    </>
  );
}
