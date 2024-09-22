const mongoose = require("mongoose");
const Joi = require("joi");
const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: { type: String },
  to: { type: String },
  subject: { type: String },
  message: { type: String },
  thestatus: {
    type: String,
    default: "unread",
    enum: ["unread", "read"],
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
}, {
  timestamps: true

});
function validateaddmessage(obj) {
  const schema = Joi.object({
    subject: Joi.string().required().messages({
      "string.base": "Der Betreff muss eine Zeichenfolge sein.",
      "string.empty": "Der Betreff darf nicht leer sein.",
      "any.required": "Der Betreff ist ein Pflichtfeld.",
    }),
    message: Joi.string().required().messages({
      "string.base": "Der Betreff muss eine Zeichenfolge sein.",
      "string.empty": "Der Betreff darf nicht leer sein.",
      "any.required": "Der Betreff ist ein Pflichtfeld.",
    }),
  });
  return schema.validate(obj);
}

function validateaddreply(obj) {
  const schema = Joi.object({
    to: Joi.string().email().required().messages({
      "string.base": "Die E-Mail muss eine Zeichenfolge sein.",
      "string.empty": "Die E-Mail darf nicht leer sein.",
      "any.required": "Die E-Mail ist ein Pflichtfeld.",
      "string.email": "Die E-Mail muss eine gÃ¼ltige E-Mail-Adresse sein.",
    }),
    subject: Joi.string().required().messages({
      "string.base": "Der Betreff muss eine Zeichenfolge sein.",
      "string.empty": "Der Betreff darf nicht leer sein.",
      "any.required": "Der Betreff ist ein Pflichtfeld.",
    }),
    message: Joi.string().required().messages({
      "string.base": "Die Nachricht muss eine Zeichenfolge sein.",
      "string.empty": "Die Nachricht darf nicht leer sein.",
      "any.required": "Die Nachricht ist ein Pflichtfeld.",
    }),
  });
  return schema.validate(obj);
}

const Message = mongoose.model("message", messageSchema);

module.exports = {
  Message,
  validateaddmessage,
  validateaddreply,
};
