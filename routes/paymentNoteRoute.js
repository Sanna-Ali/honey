const router = require("express").Router();
const {
 getPaymentNoteById,
 getPaymentsNotes,
 deletePaymentNoteById
} = require("../Controllers/paymentNote");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

// /api/paymentnote/
router.get("/", verifyTokenAndAdmin, getPaymentsNotes);

// /api/paymentnote/paymentNoteId
router.route("/:id")
  .get(verifyTokenAndAdmin, getPaymentNoteById)
  .delete(verifyTokenAndAdmin, deletePaymentNoteById)
 
module.exports = router;
