const router = require("express").Router();

const {
  registerUserCtrl,
  loginUserCtrl,
  verifyUserAccountCtrl,
  refresh,
  logout,
} = require("../Controllers/authController");

// /api/auth/register
router.post("/register", registerUserCtrl);

// /api/auth/login
router.post("/login", loginUserCtrl);

// /api/auth/:userId/verify/:token
router.get("/:userId/verify/:token", verifyUserAccountCtrl);
// /api/auth/refresh

router.get("/refresh", refresh);
// /api/auth/logout
router.get("/logout", logout);
module.exports = router;
