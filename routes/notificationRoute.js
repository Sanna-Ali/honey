const router = require("express").Router();
const {
  getAdminNotifications,
  getUserNotifications,
  getAdminNotificationsForMessages
} = require("../Controllers/notificationController");
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser } = require("../middlewares/verifyToken");

// /api/notification/admin
router.get("/admin", verifyTokenAndAdmin, getAdminNotifications);

// /api/notification/message/admin
router.get("/message/admin", verifyTokenAndAdmin, getAdminNotificationsForMessages);

// /api/notification/user/:id (userId)
router.get("/user/:id",verifyTokenAndOnlyUser, getUserNotifications);

module.exports = router;
