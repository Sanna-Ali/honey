const router = require("express").Router();

const {
  getAllUsers, 
  getUser,
  updateUser,
  deleteUser,
  profilePhotoUploadCtrl,
  updateEmail,
  verifyNewEmailUserAccount,
  getLocationInfo
} = require("../Controllers/userController");

const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { User } = require("../models/User");


// /api/users/info/userId
router.get('/info/:id', verifyTokenAndOnlyUser, getLocationInfo)

// /api/users/profile-photo-upload
router
  .route("/profile-photo-upload/:id")
  .post(verifyTokenAndOnlyUser, profilePhotoUploadCtrl);

// /api/users
router.route("/").get(verifyTokenAndAdmin, getAllUsers);

// /api/users/:id
router
  .route("/:id")
  .get(validateObjectId, verifyTokenAndAuthorization, getUser)
  .put(validateObjectId, verifyTokenAndOnlyUser, updateUser)
  .delete(validateObjectId, verifyTokenAndAuthorization, deleteUser);

  
// /api/users/update-email/:id
  router.route('/update-email/:id').post(verifyToken, updateEmail)

  
// /api/users/updateEmail/:userId/verify/:token
router.get("/updateEmail/:userId/verify/:token", verifyNewEmailUserAccount);

  module.exports = router;
