const mongoose = require("mongoose");
const paymentNoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  paymentNote: {
    type: String,
   
  },
  status:{
    type: String,
    enum: ['read', 'unread'],
    default: 'unread'
  },
  orderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
}, {
  timestamps: true

});
const PaymentNote = mongoose.model("PaymentNote", paymentNoteSchema);
module.exports = {
    PaymentNote
}