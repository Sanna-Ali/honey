const asyncHandler = require("express-async-handler");
const {
  Category,
  validateaddCategory,
  validateUpdateCategory,
} = require("../models/Category");
const { SubCategory, validateUpdateSubCategory } = require("../models/SubCategory");
const fs = require("fs");
const path = require("path");
/**-----------------------------------------------
 * @desc    add category
 * @route   /api/category/add-category
 * @method  POST
 * @access   private (only admin)
 ------------------------------------------------*/
module.exports.addcategory = asyncHandler(async (req, res) => {
  console.log(req.files)
  if (!req.files?.length) {
    return res.status(400).json({ message: "Keine Bilddatei angegeben" });
  }

  const { error } = validateaddCategory(req.body);
  if (error) {
    fs.unlink(
      path.join(__dirname, `../images/${req.files[0].filename}`),
      (error) => {
        console.log(error);
      }
    );
    return res.status(400).json({ message: error.details[0].message });
  }
  const imagePath = path.join(process.env.SERVER_DOMAIN,`/images/${req.files[0].filename}`)
console.log(imagePath)
  let name = req.body.name.toLowerCase();
  let category = await Category.findOne({ name: name });
  if (category) {
    fs.unlink(
      path.join(__dirname, `../images/${req.files[0].filename}`),
      (error) => {
        console.log(error);
      }
    );
    return res.status(400).json({message: "kategorie existiert bereits"});
  } else {
    category = new Category({
      name: req.body.name.toLowerCase(),
      // description: req.body.description,
      categoryImage: imagePath,
      constant: req.body.constant
    });
    await category.save();
    console.log(category)
    res.status(201).json(category);
  }
});

/**-----------------------------------------------
 * @desc add sub category
 * @route   /api/category/add-sub-category
 * @method  post
 * @access  private (admin)
 ------------------------------------------------*/
module.exports.addsubcategory = asyncHandler(async (req, res) => {
  let category = await Category.findById(req.body.categoryId);
  if (!category) {
    // if(req.files.length)
    // fs.unlink(
    //   path.join(__dirname, `../images/${req.files[0].filename}`),
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    return res.status(404).json({message: "Kategorie nicht gefunden"});
  }
  let name = req.body.name;
  let subCategory = await SubCategory.findOne({ name: name });
  if (subCategory) {
    // if(req.files.length)
    // fs.unlink(
    //   path.join(__dirname, `../images/${req.files[0].filename}`),
    //   (error) => {
    //     console.log(error);
    //   }
    // );
    return res.status(400).json({message: "unterkategorie existiert bereits"});
  } else {
//     let imagePath
//     if(req.files.length)
//  imagePath = path.join(__dirname, `../${req.files[0].filename}`);
    subCategory = new SubCategory({
      categoryId: req.body.categoryId,
      name: req.body.name.toLowerCase(),
      // subCategoryImage: imagePath    
    });
    await subCategory.save();
    res.status(201).json(subCategory);
  }
});

/**-----------------------------------------------
 * @desc   get categories
 * @route   /api/category
 * @method  get
 * @access  public
 ------------------------------------------------*/
module.exports.getCategories = asyncHandler(async (req, res) => {
  let categories = await Category.find().populate("subcategories").populate("products");
  if (!categories.length) {
    return res.status(400).json({message: "keine Kategorien"});
  }
  res.status(201).json(categories);
});
/**-----------------------------------------------
 * @desc    delete category by id 
 * @route   /api/category/:id
 * @method  DELETE
 * @access  privte
 ------------------------------------------------*/
module.exports.deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Kategorie nicht gefunden" });
  }
    await Category.findByIdAndDelete(req.params.id);
    await SubCategory.deleteMany({ categoryId: req.params.id });
    res.status(200).json({ message: "Deleted" });
});
/**-----------------------------------------------
 * @desc    get category by id 
 * @route   /api/category/:id
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate("subcategories").populate("products");;
  if (!category) {
    return res.status(404).json({ message: "Kategorie nicht gefunden" });
  }
  res.status(200).json(category);
});

/**-----------------------------------------------
 * @desc    update category
 * @route   api/category/update/categoryId
 * @method  PUT
 * @access   private (only admin)
 ------------------------------------------------*/
module.exports.updatecate = asyncHandler(async (req, res) => {
  const { error } = validateUpdateCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const category = await Category.findById(req.params.id);
  if (!category) {
    if(req.files.length){
    fs.unlink(
      path.join(__dirname, `../images/${req.files[0].filename}`),
      (error) => {
        console.log(error);
      }
    );}
    return res.status(404).json({ message: "Kategorie nicht gefunden" });
  }
  if (req.files.length) {
    req.body.categoryImage = path.join(process.env.SERVER_DOMAIN,`/images/${req.files[0].filename}`);
    const oldUrl = category.categoryImage;
    fs.unlink(oldUrl, (error) => {
      console.log(error);
    });
  }
  if(req.body.name){
  req.body.name.toLowerCase()
  }
  const updatedcategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedcategory);
});

/**-----------------------------------------------
 * @desc   get sub-categories
 * @route   /api/category/sub-category
 * @method  get
 * @access  public
 ------------------------------------------------*/
module.exports.getSubCategories = asyncHandler(async (req, res) => {
  let subcategories = await SubCategory.find({categoryId: req.body.categoryId}).populate("products");;
  console.log(subcategories);
  if (!subcategories.length) {
    return res.status(400).json({message: "keine Unterkategorien"});
  }
  res.status(201).json(subcategories);
});

/**-----------------------------------------------
 * @desc   delete sub-category
 * @route   /api/category/sub-category/:id
 * @method  delete
 * @access  private (only admin)
 ------------------------------------------------*/
 module.exports.deleteSubCategory = asyncHandler(async (req, res) => {
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return res.status(404).json({ message: "Kategorie nicht gefunden" });
  }
    await SubCategory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "sub category has been Deleted successfully" });
});



/**-----------------------------------------------
 * @desc    update sub-category
 * @route   api/category/sub/update/subCategoryId
 * @method  PUT
 * @access   private (only admin)
 ------------------------------------------------*/
 module.exports.updateSubCate = asyncHandler(async (req, res) => {
  const { error } = validateUpdateSubCategory(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const subCategory = await SubCategory.findById(req.params.id);
  if (!subCategory) {
    return res.status(404).json({ message: "sub-Kategorie nicht gefunden" });
  }
  if(req.body.name){
  req.body.name.toLowerCase()
  }
  const updatedSubCategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedSubCategory);
});
