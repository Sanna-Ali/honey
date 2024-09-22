const asyncHandler = require("express-async-handler");
const { PaymentNote } = require("../models/PaymentNote");
const { User } = require("../models/User");

const getPaymentsNotes = asyncHandler(async (req, res) => {
  const paymentNotes = await PaymentNote.find().sort({ createdAt: -1 });
  if (!paymentNotes.length) {
    return res.status(404).json({ message: "Keine Zahlungshinweise gefunden" });
  }
  res.status(200).json(paymentNotes);
});

const getPaymentNoteById = asyncHandler(async (req, res) => {
  const paymentNote = await PaymentNote.findById(req.params.id);
  if (!paymentNote) {
    return res.status(404).json({ message: "Zahlungshinweis nicht gefunden" });
  }
  paymentNote.status = "read";
  await paymentNote.save();
  const user = await User.findById(paymentNote.userId)
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  let username = user.firstname + ' ' + user.lastname
  res.status(200).json({paymentNote, username});
});

const deletePaymentNoteById = asyncHandler(async (req, res) => {
  const paymentNote = await PaymentNote.findById(req.params.id);
  if (!paymentNote) {
    return res.status(404).json({ message: "Zahlungshinweis nicht gefunden" });
  }
  await PaymentNote.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ message: "Der Zahlungshinweis wurde erfolgreich gelöscht" });
});

module.exports = {
  getPaymentsNotes,
  getPaymentNoteById,
  deletePaymentNoteById,
};
