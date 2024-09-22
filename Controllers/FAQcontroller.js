const asyncHandler = require("express-async-handler");
const { FAQ, validateaddFAQ, validateaupdFAQ } = require("../models/FAQ");
/**-----------------------------------------------
* @desc Add FAQ
* @route /api/FAQ/add
* @method POST
* @access  private (only Admin)
------------------------------------------------*/
module.exports.addFAQ = asyncHandler(async (req, res) => {
  const { error } = validateaddFAQ(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let faq = new FAQ({
    question: req.body.question,
    answer: req.body.answer,
  });
  await faq.save();
  res.status(200).json(faq);
});
/**-----------------------------------------------
* @desc   Add FAQ
* @route /api/FAQ/update/:id
* @method POST
* @access  private (only Admin)
------------------------------------------------*/
module.exports.updateFAQ = asyncHandler(async (req, res) => {
  const { error } = validateaupdFAQ(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    return res.status(404).json({ message: "FAQ nicht gefunden" });
  }
  const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedFAQ);
});
/**-----------------------------------------------
* @desc Delete FAQ
* @route /api/FAQ/delete
* @method delete
* @access  private (only Admin)
------------------------------------------------*/
module.exports.deleteFAQ = asyncHandler(async (req, res) => {
  const faq = await FAQ.findById(req.params.id);
  if (!faq) {
    return res
      .status(404)
      .json({ message: "Der FAQ-Eintrag wurde nicht gefunden" });
  }
  await FAQ.findByIdAndDelete(req.params.id);
  return res
    .status(200)
    .json({ message: "Der FAQ-Eintrag wurde erfolgreich gelöscht." });
});

/**-----------------------------------------------
* @desc get ans
* @route /api/FAQ/ans
* @method GET
* @access  puplic
------------------------------------------------*/
module.exports.getFAQans = asyncHandler(async (req, res) => {
  const { number } = req.params;

  const faq = await FAQ.findOne({ number });

  if (!faq) {
    return res.status(404).json({ error: "FAQ nicht gefunden" });
  }

  res.json(faq.answer);
});
/**-----------------------------------------------
* @desc get ques
* @route /api/FAQ/que
* @method GET
* @access  puplic
------------------------------------------------*/
module.exports.getFAQque = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({}).sort({createdAt: -1});
  if (!faqs.length) {
    return res.status(404).json({ error: "FAQ nicht gefunden" });
  }
  res.json(faqs);
});