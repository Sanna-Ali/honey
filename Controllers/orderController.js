const asyncHandler = require("express-async-handler");
const { Order, validateAddOrder } = require("../models/Order");
const { Product } = require("../models/Product");
const { User } = require("../models/User");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { PaymentNote } = require("../models/PaymentNote");
const { Notification } = require("../models/Notification");
const { RebateCode } = require("../models/DiscountCode");
const { json } = require("body-parser");

/**-----------------------------------------------
* @desc    Add Order
* @route   /api/order/:id (userId)
* @method  POST
* @access   private (only user)
------------------------------------------------*/
const addOrder = asyncHandler(async (req, res) => {
  console.log(req.body)
  let code
  if(req.body.code){
   code = await RebateCode.findOne({code: req.body.code})
  // new
  console.log(code)
  if(!code){
    return res.status(404).json({message: "Invalid Discount Code"})
  }
  }
  //
  if (!req.files.length) {
    return res.status(400).json({ message: "kein Bild bereitgestellt" });
  }
  console.log(typeof(req.body.products))
  const { error } = validateAddOrder(req.body);
  if (error) {
    fs.unlink(
      path.join(__dirname, `../images/${req.files[0].filename}`),
      (error) => {
        console.log(error);
      }
    );
    return res.status(400).json({ message: error.details[0].message });
  }
  const imagePath = path.join(process.env.SERVER_DOMAIN,`/images/${req.files[0].filename}`);
  // ===========================================================================
  // const cart = await Cart.findOne({ userId: req.params.id });
  // if (!cart) {
  //   fs.unlink(
  //     path.join(__dirname, `../images/${req.files[0].filename}`),
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  //   return res.status(404).json("Warenkorb nicht gefunden");
  // }
    // ===========================================================================

  // new 
  let products = req.body.products
  products = JSON.parse(products)
  console.log(products)
  //
  let message;
  let allProductsAvailable = true;
  for (const product of products) {
    const productInDb = await Product.findById(product.productId);
    if(!productInDb){
      return res.status(400).json({ message: "product not found" });
    }
    if (product.quantity > productInDb.quantity) {
      message = `Nicht genügend Menge auf Lager für ${productInDb.name}, ${productInDb.quantity} nur verfügbar`;
      allProductsAvailable = false;
      break;
    }
  }
  if (!allProductsAvailable) {
    return res.status(400).json({ success: false, message: message });
  }

  const order = new Order({
    userId: req.params.id,
    products,
    cost: req.body.cost, // new
    discountedCost: req.body.discountedCost, // new
    code: req.body.code
  });
  await order.save();
  // new
  if(req.body.code){
  code.usedTimes += 1
  await code.save()
} 
  // 
  await User.findByIdAndUpdate(
    req.params.id,
    {
      cityname: req.body.cityname,
      citynumber: req.body.citynumber,
      streetnumber: req.body.streetnumber,
      homenumber: req.body.homenumber,
      $push: { orders: order._id },
    },
    {
      new: true,
    }
  );
  // await cart.deleteOne();
  let messages = ""
  let isNotification = false
  for (const product of products) {
    const productInDb = await Product.findById(product.productId);
    productInDb.quantity -= product.quantity;
    await productInDb.save();
    if(productInDb.quantity < 10 && productInDb.quantity != 0)
{    messages+= `Attention: quantity of ${productInDb.name} has been less than 10 `
isNotification = true
}  else if(productInDb.quantity == 0){
  isNotification = true
  messages+= `Attention: quantity of ${productInDb.name} has been ended `
}
  }
  console.log(11)
  if(isNotification){
  const notificationn = new Notification({
    title: "product lack alert",
    message: messages,
    to: "admin",
  })

  await notificationn.save()
}

  console.log(22)

  console.log(33)
  const paymentNote = new PaymentNote({
    userId: req.user.id,
    paymentNote: imagePath,
    orderId: order._id,
  });
  await paymentNote.save();

  order.paymentNote = paymentNote._id.toString()
  await order.save()
  console.log(1)
  const notification = new Notification({
    title: "New Order",
    message: "A new order has been added",
    to: "admin",
    content: {orderId : order._id.toString()}
  })
  console.log(2)
  await notification.save()
  console.log(3)

  return res.status(200).json({
    message:
      "Vielen Dank für Ihre Bestellung ! Sobald die Bestellung bearbeitet wurde , erhalten Sie eine Nachricht",
    order,
  });
});

/**-----------------------------------------------
* @desc    get Order
* @route   /api/order/:id (userId)/:orderId
* @method  get
* @access   private (user and admin)
------------------------------------------------*/
const getOrder = asyncHandler(async (req, res) => {
  console.log(req.body)
  const order = await Order.findById(req.params.orderId).populate('products.productId', 'productImages');
  if (!order) {
    return res.status(404).json({ message: "Keine Bestellung gefunden" });
  }
  const user = await User.findById(order.userId)
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  let username = user.firstname + ' ' + user.lastname
  res.status(200).json({order, username});
});

/**-----------------------------------------------
* @desc    get all Orders
* @route   /api/order/all
* @method  get
* @access   private (only admin)
------------------------------------------------*/
const getOrders = asyncHandler(async (req, res) => {
  const query = req.query.keyword;
  let orders;
  if (query == "cancelled") {
    orders = await Order.find({ thestatus: "cancelled" }).sort({
      createAt: -1,
    });
  } else if (query == "pending") {
    orders = await Order.find({ thestatus: "pending" }).sort({ createAt: -1 });
  } else if (query == "accepted") {
    orders = await Order.find({ thestatus: "accepted" }).sort({ createAt: -1 });
  } else {
    orders = await Order.find().populate("userId", 'firstname lastname')
  }
  if (!orders.length) {
    return res.status(404).json({ message: "Keine Bestellungen gefunden" });
  }
  res.status(200).json(orders);
});

/**-----------------------------------------------
* @desc    update Order status
* @route   /api/order/update-status
* @method  put
* @access   private (only admin)
------------------------------------------------*/
const updateOrderStatus = asyncHandler(async (req, res) => {
  console.log(req.body)
  if (!req.body.status) {
    return res.status(400).json({ message: "Status erforderlich" });
  }
  let order = await Order.findById(req.body.orderId);
  if (!order) {
    return res.status(404).json({ message: "Bestellung nicht gefunden" });
  }
  if (req.body.status == "accepted" && order.status != "accepted") {
    let date = new Date().toISOString().split("T")[0];
    order.saleDate = date;
   // const user = await User.findById(order.userId)
    p = order.products.map(async(e) => await Product.findById(e.productId))
    const notificationn = new Notification({
      title: "Order Accepted",
      message: "Your order has been accepted",
      to: order.userId,
      content: {orderId: order._id}
    })
    await notificationn.save()
  }
  await order.save();
  let updatedOrder = await Order.findByIdAndUpdate(
    req.body.orderId,
    {
      thestatus: req.body.status,
    },
    {
      new: true,
    }
  );

  if (order.thestatus != "cancelled" && req.body.status == "cancelled") {
    let products = order.products;
    for (const product of products) {
      const productInDb = await Product.findById(product.productId);
      productInDb.quantity += product.quantity;
      await productInDb.save();
    }
  }
  res.status(200).json(updatedOrder);
});

/**-----------------------------------------------
* @desc    get sales  
* @route   /api/order/sales
* @method  Get
* @access   private (only admin)
------------------------------------------------*/
const getSales = asyncHandler(async (req, res) => {
  let sales = await Order.find({ saleDate: { $ne: null } })
    .select("products saleDate")
    .sort({ saleDate: -1 });

  if (!sales.length) {
    return res.status(404).json({ message: "Keine Verkäufe" });
  }
  //
  const salesByDayOfWeek = {};
  sales.forEach((sale) => {
    console.log(sale)
    const saleDayOfWeek = moment(sale.saleDate, "YYYY-MM-DD").format(
      "YYYY-MM-DD"
    );

    if (!salesByDayOfWeek[saleDayOfWeek]) {
      salesByDayOfWeek[saleDayOfWeek] = [];
    }

    salesByDayOfWeek[saleDayOfWeek].push(sale);
  });
  res.status(200).json(salesByDayOfWeek);
});

/**-----------------------------------------------
* @desc    get Orders for user 
* @route   /api/order/user/:id
* @method  Get
* @access   private (user himself)
------------------------------------------------*/
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.params.id });
  if (!orders.length) {
    return res.status(404).json({ message: "Keine Bestellungen gefunden" });
  }
  res.status(200).json(orders);
});
module.exports = {
  updateOrderStatus,
  getOrder,
  getOrders,
  addOrder,
  getSales,
  getUserOrders,
};
