const router = require("express").Router();
const {
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQans,
  getFAQque,
} = require("../Controllers/FAQcontroller");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
// /api/FAQ/add
router.post("/add", verifyTokenAndAdmin, addFAQ);
// /api/FAQ/update/id
router.post("/update/:id", verifyTokenAndAdmin, updateFAQ);
// /api/FAQ/delete
router.delete("/delete/:id", verifyTokenAndAdmin, deleteFAQ);
// /api/FAQ/ans/:number
router.get("/ans/:number", getFAQans);
// /api/FAQ/que
router.get("/que", getFAQque);
module.exports = router;