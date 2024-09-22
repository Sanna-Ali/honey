const router = require("express").Router();
const {
  addFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQans,
  getFAQque,
} = require("../Controllers/FAQcontroller");
const { getStatisticsOfLaundry } = require("../Controllers/ss");

router.get("/", getStatisticsOfLaundry);

module.exports = router;