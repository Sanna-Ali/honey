const router = require('express').Router()

const photoUpload = require("../middlewares/photoUpload");
const {getOrder, getOrders, updateOrderStatus, addOrder, getSales, getLocationInfo, getUserOrders} = require('../Controllers/orderController')
const {verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyTokenAndAuthorization} = require('../middlewares/verifyToken')


// /api/order/update-status
router.put('/update-status', verifyTokenAndAdmin, updateOrderStatus)
// /api/order/user/userId
router.get('/user/:id', verifyTokenAndOnlyUser, getUserOrders)

// /api/order/all
router.get('/all', getOrders)



// /api/order/sales
router.get('/sales', getSales)



// /api/order/userId
router.post('/:id', verifyTokenAndOnlyUser, addOrder)


// /api/order/userId
router.get('/:id/:orderId', verifyTokenAndAuthorization, getOrder)


module.exports = router