const router = require("express").Router();
// const { Product, validateAddProduct } = require("../models/Product");
const photoUpload = require("../middlewares/photoUpload");
const {
  verifyTokenAndAdmin,
  verifyTokenAndOnlyUser,
  verifyToken,
  verifyTokenAndAuthorization,
  handleToken,
} = require("../middlewares/verifyToken");

const validateObjectId = require("../middlewares/validateObjectId");
const {
  rating,
  getProductById,
  updateproduct,
  getAllProducts,
  getAllProductsAdmin,
  deleteproductbyIdf,
  addProductMultiPhs,
  addPropsToProd,
  gethomepageProducts,
  searchForProduct
} = require("../Controllers/productController");

// /api/product/homepageshow
router.get("/homepageshow", handleToken, gethomepageProducts)

// /api/product/:id/addProps
router.post("/:id/addProps", verifyTokenAndAdmin, addPropsToProd)

// api/product/search
router.get("/search", searchForProduct);  

router.post("/plusprod", verifyTokenAndAdmin, addProductMultiPhs)

//   /api/product/addproduct
//router.post("/addproduct", verifyTokenAndAdmin, photoUpload.single("image") ,addProductCtrl)



// /api/product/admin
router.get("/admin", verifyTokenAndAdmin, getAllProductsAdmin);

// /api/product/addrating
router.post("/addrating/:id",validateObjectId,verifyToken,rating); // ??

// api/product
router.get("/", getAllProducts);  // ?? no protect


// api/product/productId
router.get("/:id", validateObjectId, getProductById);


// api/product/productId
router.put("/:id", validateObjectId, verifyTokenAndAdmin,  updateproduct);


// // api/product/soft/productId
// router.delete("/soft/:id", validateObjectId, verifyTokenAndAdmin, deleteproductbyId); // ??

// /api/product/destroy/id
router.delete("/destroy/:id", validateObjectId, verifyTokenAndAdmin, deleteproductbyIdf  // ??
);

module.exports = router;
