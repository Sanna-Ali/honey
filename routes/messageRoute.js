const router = require("express").Router();
const {
  addmessage,
  getmessagesForAdmin,
  getmessagesForUser,
  getmessage,
  addreply,
  deleteMessage,
} = require("../Controllers/messageController");

const validateObjectId = require("../middlewares/validateObjectId");

const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../middlewares/verifyToken");



// /api/message/add
router.route("/add").post(verifyToken, addmessage);
// /api/message/reply
router.route("/reply").post(verifyTokenAndAdmin, addreply);
// /api/message/admin
router.route("/admin").get(verifyTokenAndAdmin, getmessagesForAdmin);
// /api/message/user
router.route("/user").get(verifyToken, getmessagesForUser)

// /api/message/message id
router.route("/:id").get(validateObjectId, verifyToken, getmessage);


// /api/message/message id 
router.route("/:id").delete(verifyToken, deleteMessage)
module.exports = router;
