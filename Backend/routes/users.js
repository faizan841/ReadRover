const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const usersController = require("../controllers/users");

router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.get("/profile", auth, usersController.getUserProfile);
router.put("/profile", auth, usersController.updateUserProfile);
router.get("/feed", auth, usersController.getUserFeed);
router.get("/notifications", auth, usersController.getUserNotifications);
router.put("/notifications/:id", auth, usersController.markNotificationAsRead);
router.get("/recent-activity", auth, usersController.getRecentActivity);
router.get("/reading-challenge", auth, usersController.getReadingChallenge);
router.get("/friends", auth, usersController.getFriends);
router.get("/search", auth, usersController.searchUsers);
router.post("/friend-request/:id", auth, usersController.sendFriendRequest);
router.post(
  "/accept-friend-request/:id",
  auth,
  usersController.acceptFriendRequest
);
router.get("/friend-requests", auth, usersController.getFriendRequests);
router.get("/friend-feed", auth, usersController.getFriendFeed);
router.post("/add-friend/:friendId", auth, usersController.addFriend);
router.post(
  "/update-activity-visibility",
  auth,
  usersController.updateActivityVisibility
);

module.exports = router;
