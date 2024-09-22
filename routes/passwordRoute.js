const router = require("express").Router();
const {
  sendResetPasswordLinkCtrl,
  getResetPasswordLinkCtrl,
  resetPasswordCtrl,
  changePasswordCtrl,
} = require("../Controllers/passwordController");
const { verifyToken } = require("../middlewares/verifyToken");

// /api/password/reset-password-link
router.post("/reset-password-link", sendResetPasswordLinkCtrl);

// /api/password/reset-password/:userId/:token
router
  .route("/reset-password/:userId/:token")
  .post(resetPasswordCtrl)
  .get(getResetPasswordLinkCtrl)
 
// /api/password/change-password
router.post("/change-password",verifyToken,changePasswordCtrl);
module.exports = router;
