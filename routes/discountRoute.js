const router = require('express').Router()
const {addCode, deleteCode, getAllcodes, getDiscountCodeProportion} = require('../Controllers/dicountCodeController')
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken')


// /api/discount/getproportion?code=code
router.get('/getproportion', getDiscountCodeProportion)


// /api/discount/all
router.get('/all', verifyTokenAndAdmin, getAllcodes)

// /api/discount
router.delete('/:id', verifyTokenAndAdmin, deleteCode)

// /api/discount
router.post('/', verifyTokenAndAdmin, addCode)

module.exports = router