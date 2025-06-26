const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const path = require("path");
const {
  Product,
  validateAddProduct,
  validateUpdateProduct,
} = require("../models/Product");
const fs = require("fs");
const { User } = require("../models/User");
const { Notification } = require("../models/Notification");
const LoggerService = require("../services/logger.service");
const logger = new LoggerService("product");
/**-----------------------------------------------
 * @desc    Add New Product
 * @route   /api/product/plusprod
 * @method  POST
 * @access   private (only admin)
 ------------------------------------------------*/

module.exports.addProductMultiPhs = asyncHandler(async (req, res) => {
  if (!req.files.length) {
    logger.info("Kein Bild beim Hochladen bereitgestellt");
    return res.status(400).json({ message: "kein Bild bereitgestellt" });
  }

  const { error } = validateAddProduct(req.body);
  if (error) {
    for (let p of req.files) {
      fs.unlink(path.join(__dirname, `../images/${p.filename}`), (error) => {
        logger.error("Fehler beim Löschen ungültiger Bilder", { error });
        console.log(error);
      });
    }
    logger.info("Validierungsfehler beim Hinzufügen eines Produkts", {
      details: error.details[0].message,
    });
    return res.status(400).json({ message: error.details[0].message });
  }

  let imagesPaths = [];
  let paath;
  for (let p of req.files) {
    paath = path.join(process.env.SERVER_DOMAIN, `/images/${p.filename}`);
    imagesPaths.push(paath);
  }
  // new product
  const product = new Product({
    hidden: req.body.hidden,
    name: req.body.name,
    description: req.body.description,
    productImages: imagesPaths,
    category: req.body.category,
    subCategory: req.body.subCategory,
    price: req.body.price,
    quantity: req.body.quantity,
    ratings: req.body.ratings,
    theRating: req.body.theRating,
    deletedAt: req.body.deletedAt,
    thestatus: req.body.thestatus,
    typeOfHoney: req.body.typeOfHoney,
    packageSize: req.body.packageSize,
    matrerialSize: req.body.matrerialSize,
    materialModel: req.body.materialModel,
    numb: req.body.numb,
    modelDimensions: req.body.modelDimensions,
    netWeight: req.body.netWeight,
    itemWeight: req.body.itemWeight,
    storge: req.body.storge,
    countryOfOrigin: req.body.countryOfOrigin,
    portenSize: req.body.portenSize,
    energyKJ: req.body.energyKJ,
    energyKCal: req.body.energyKCal,
    fat: req.body.fat,
    saturatedFattyAcids: req.body.saturatedFattyAcids,
    coalFuelRate: req.body.coalFuelRate,
    sugar: req.body.sugar,
    salt: req.body.salt,
    eggWhite: req.body.eggWhite,
    ingredientients: req.body.ingredientients,
    ApplicationOfUse: req.body.ApplicationOfUse,
    discountedPrice: req.body.discountedPrice,
  });
  await product.save();
  logger.info("Neues Produkt erfolgreich hinzugefügt", {
    productId: product._id,
    name: product.name,
  });
  res.status(201).json(product);
});
/**-----------------------------------------------
 * @desc    update Product
 * @route   /api/product/id ( product id)
 * @method  PUT
 * @access   private (only admin)
 ------------------------------------------------*/
module.exports.updateproduct = asyncHandler(async (req, res) => {
  const { error } = validateUpdateProduct(req.body);
  if (error) {
    for (let p of req.files) {
      fs.unlink(path.join(__dirname, `../images/${p.filename}`), (error) => {
        console.log(error, 1);
      });
    }
    return res.status(400).json({ message: error.details[0].message });
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    for (let p of req.files) {
      fs.unlink(path.join(__dirname, `../images/${p.filename}`), (error) => {
        console.log(error, 2);
      });
    }
    return res.status(404).json({ message: "Produkt nicht gefunden" });
  }
  let imagesPaths = [];
  if (req.files.length) {
    for (let p of req.files) {
      imagesPaths.push(
        path.join(process.env.SERVER_DOMAIN, `/images/${p.filename}`)
      );
    }
    const oldImages = product.productImages;
    for (let o of oldImages) {
      fs.unlink(o, (error) => {
        console.log(error, 3);
      });
    }
    req.body.productImages = imagesPaths;
  }
  console.log(req.body);
  const updatedproduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedproduct);
});

/**-----------------------------------------------
 * @desc    Add Rating
 * @route   /api/product/addrating/id (productId)
 * @method  POST
 * @access  private (only user)
 ------------------------------------------------*/
module.exports.rating = asyncHandler(async (req, res) => {
  const theuserId = req.user.id;
  const newrating = req.body.rating;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(400).json({ message: "Produkt nicht gefunden" });
  }
  const userRating = product.ratings.find(
    (rating) => rating.userId.toString() === theuserId.toString()
  );
  if (userRating) {
    userRating.rating = newrating || 0;
  } else {
    product.ratings.push({ userId: theuserId, rating: newrating });
  }
  // Calculate the average rating for the product
  const users = product.ratings.length;
  const sumRatings = product.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0
  );
  if (users > 0) {
    product.theRating = +sumRatings / +users;
  } else {
    product.theRating = newrating;
  }

  await product.save();
  // Save the updated product
  res.status(200).json({ message: "bewertet erfolgreich", product });
});
/**-----------------------------------------------
 * @desc    Get product by id
 * @route   /api/product/id
 * @method  GET
 * @access   public
 ------------------------------------------------*/
module.exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json("Produkt nicht gefunden");
  }
});

/**-----------------------------------------------
 * @desc    get Products
 * @route   /api/product/
 * @method  get
 * @access   public
 ------------------------------------------------*/
module.exports.getAllProducts = asyncHandler(async (req, res) => {
  const { category, price, subCategory } = req.query;
  let products;
  if (category) {
    products = await Product.find({
      category,
      deletedAt: null,
      thestatus: "active",
      hidden: false,
    }).sort({
      createdAt: -1,
    });
  } else if (subCategory) {
    products = await Product.find({
      price,
      deletedAt: null,
      thestatus: "active",
      hidden: false,
    }).sort({
      createdAt: -1,
    });
  } else if (price) {
    products = await Product.find({
      price,
      deletedAt: null,
      thestatus: "active",
      hidden: false,
    }).sort({
      createdAt: -1,
    });
  } else {
    products = await Product.find({
      deletedAt: null,
      thestatus: "active",
      hidden: false,
    }).sort({
      createdAt: -1,
    });
  }
  res.status(200).json(products);
});
// /**-----------------------------------------------
//  * @desc    delete Product
//  * @route   api/product/soft/id (productId)
//  * @method  delete
//  * @access  private (only admin)
//  ------------------------------------------------*/
// module.exports.deleteproductbyId = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (product) {
//     if (product.deletedAt != null) {
//       return res.status(400).json("Produkt bereits soft gelöscht");
//     }
//     product.deletedAt = new Date();
//     await product.save();
//     return res.status(200).json("Soft gelöscht");
//   } else {
//     return res.status(400).json("Produkt nicht gefunden");
//   }
// });
/**-----------------------------------------------
 * @desc    delete Product
 * @route   /api/product/destroy/id (productId)
 * @method  delete
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.deleteproductbyIdf = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json("endgültig gelöscht");
  } else {
    return res.status(404).json("Produkt nicht gefunden ");
  }
});

/**-----------------------------------------------
 * @desc    get Products for admin 
 * @route   /api/product/admin
 * @method  get
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.getAllProductsAdmin = asyncHandler(async (req, res) => {
  let products;
  if (req.query.keyword == "inactive") {
    products = await Product.find({
      thestatus: "inactive",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(products);
  } else if (req.query.keyword == "deleted") {
    products = await Product.find({ deletedAt: { $ne: null } });
    return res.status(200).json(products);
  } else {
    products = await Product.find({
      deletedAt: null,
      thestatus: "active",
    }).sort({
      createdAt: -1,
    });
    return res.status(200).json(products);
  }
});
/**-----------------------------------------------
 * @desc    search for Product
 * @route   /api/product/search?keyword=something
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.searchForProduct = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  if (keyword) {
    const products = await Product.find({
      name: { $regex: keyword, $options: "i" },
    });
    if (products.length == 0) {
      return res.status(404).json("Produkt nicht gefunden");
    }
    res.status(200).json(products);
  }
});

/**-----------------------------------------------
 * @desc    add or remove product from homepag 
 * @route   /api/product/:id/homepageshow
 * @method  post
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.addPropsToProd = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Produkt nicht gefunden" });
  }
  console.log(req.body);
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedProduct);
});

/**-----------------------------------------------
 * @desc    get homepage products
 * @route   /api/product/homepageshow
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.gethomepageProducts = asyncHandler(async (req, res) => {
  console.log(req.user);
  const products = await Product.find({
    hidden: false,
    $or: [
      { star: true },
      { new: true },
      { homepage: true },
      { discountedPrice: { $ne: null } },
    ],
  });
  let notifications;
  if (!req.user?.id) {
    notifications = [];
    console.log(44);
    return res.status(200).json({ products });
  } else {
    console.log(55);
    const user = await User.findById(req.user.id);
    if (!user) {
      notifications = [];
      console.log(66);
      return res
        .status(200)
        .json({ products, notificationsCount: notifications.length });
    } else {
      console.log(77);

      if (user?.isAdmin) {
        notifications = await Notification.find({
          to: "admin",
          read: false,
          kind: { $ne: "m" },
        });
        notificationsForMessages = await Notification.find({
          to: "admin",
          read: false,
          kind: "m",
        });
        return res.status(200).json({
          notificationCount: notifications.length,
          notificationsForMessagesCount: notificationsForMessages.length,
          products,
        });
      } else {
        notifications = await Notification.find({
          to: req.user.id,
          read: false,
        });
        return res.status(200).json({
          notificationCount: notifications.length,
          products,
        });
      }
    }
  }
});
