const mongoose = require("mongoose");
const Joi = require("joi");
const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, {
  timestamps: true

});
function validateaddFAQ(obj) {
  const schema = Joi.object({
    question: Joi.string().required().messages({
      "string.base": "Die Frage muss eine Zeichenfolge sein.",
      "string.empty": "Die Frage darf nicht leer sein.",
      "any.required": "Die Frage ist ein Pflichtfeld.",
    }),
    answer: Joi.string().required().messages({
      "string.base": "Die Antwort muss eine Zeichenfolge sein.",
      "string.empty": "Die Antwort darf nicht leer sein.",
      "any.required": "Die Antwort ist ein Pflichtfeld.",
    }),
  });
  return schema.validate(obj);
}
function validateaupdFAQ(obj) {
  const schema = Joi.object({
    question: Joi.string().messages({
      "string.base": "Die Frage muss eine Zeichenfolge sein.",
    }),
    answer: Joi.string().required().messages({
      "string.base": "Die Antwort muss eine Zeichenfolge sein.",
    }),
  });

  return schema.validate(obj);
}

const FAQ = mongoose.model("FAQ", FAQSchema);
module.exports = {
  FAQ,
  validateaddFAQ,
  validateaupdFAQ,
};