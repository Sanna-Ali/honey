const { RebateCode, validateDiscountCode } = require("../models/DiscountCode");
const asyncHandler = require("express-async-handler");

/**-----------------------------------------------
 * @desc add code 
 * @route   /api/discount
 * @method  post
 * @access  private (admin)
 ------------------------------------------------*/
const addCode = asyncHandler(async (req, res) => {
  const { error } = validateDiscountCode(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  let code = await RebateCode.findOne({ code: req.body.code });
  if (code) {
    return res.status(400).json("code existierte bereits");
  }
  const rebateCode = new RebateCode({
    code: req.body.code,
    discount: req.body.discount,
  });
  await rebateCode.save();
  res
    .status(200)
    .json({ message: "code erfolgreich erstellt", rebateCode });
});

/**-----------------------------------------------
 * @desc     delete code 
 * @route   /api/discount
 * @method  delete
 * @access  private (admin)
 ------------------------------------------------*/

const deleteCode = asyncHandler(async (req, res) => {
  let code = await RebateCode.findById(req.params.id);
  if (!code) {
    return res
      .status(404)
      .json({message: "code nicht gefunden" });
  }
  const deletedCode = await RebateCode.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ message: "code erfolgreich gelöscht", deletedCode });
});

/**-----------------------------------------------
 * @desc    get all codes
 * @route   /api/discount
 * @method  get
 * @access  private (admin)
 ------------------------------------------------*/
const getAllcodes = asyncHandler(async (req, res) => {
  const codes = await RebateCode.find();
  if (!codes.length) {
    return res
      .status(404)
      .json({ success: false, message: "Keine Codes gefunden" });
  }
  res.status(200).json(codes );
});


/**-----------------------------------------------
 * @desc   get Discount Code Proportion
 * @route   /api/code/getproportion?code=code
 * @method  post
 * @access  private (user)
 ------------------------------------------------*/
 const getDiscountCodeProportion = asyncHandler( async(req, res) => {
  const code = await RebateCode.findOne({code: req.query.code})
  if(!code){
    return res.status(404).json({message: "Ungültiger Code"})
  }
  res.status(200).json({proportion: code.discount})
})

module.exports = {
  addCode,
  deleteCode,
  getAllcodes,
  getDiscountCodeProportion
};
