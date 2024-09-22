const router = require("express").Router();
const {
  addcategory,
  addsubcategory,
  getCategories,
  getCategory,
  deleteCategory,
  getSubCategories,
  updatecate,
  deleteSubCategory,
  updateSubCate,
} = require("../Controllers/categoryController");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /api/category/add-category // verifyTokenAndAdmin,        photoUpload.single('image')
router.post("/add-Category", verifyTokenAndAdmin, addcategory);

// /api/category/add-sub-category  //verifyTokenAndAdmin
router.post("/add-sub-category",verifyTokenAndAdmin, addsubcategory);

// api/category/update/categoryId
router.put(
  "/update/:id",
   verifyTokenAndAdmin,
  updatecate
);
// api/category/sub/update/sub-categoryId
router.put(
  "/sub/update/:id",
   verifyTokenAndAdmin,
   updateSubCate
);


// /api/category
router.get("/", getCategories);


// /api/category/sub-category/:id
router.delete("/sub-category/:id", verifyTokenAndAdmin, deleteSubCategory);


// /api/category/sub-category
router.get("/sub-category", getSubCategories);

// /api/category/:id
router.get("/:id", getCategory);

// /api/category/:id
router.delete("/:id", verifyTokenAndAdmin, deleteCategory);
module.exports = router;
