const mongoose = require("mongoose");
const Joi = require('joi')
const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        // required: true,
      },
      quantity: { type: Number, required: true },
      price: { type: Number },
      totalPrice: { type: Number, required: true },
    },
  ],

  thestatus: {
    type: String,
    enum: ["pending", "cancelled", "accepted"],
    default: "pending",
  },
  
  paymentNote: {
    type: String,
   
  },
  cost:{
    type: Number,
    
},
discountedCost:{
    type: Number,
    
},
saleDate: {
  type: String,
  default: null
}, 
code: {
  type: String,
  default: null
}
}, {
  timestamps: true

});

const Order = mongoose.model("order", OrderSchema);


function validateAddOrder(obj) {
  const schema = Joi.object({
    products: Joi.required().messages({
      "string.base": "Der products muss eine Zeichenkette sein.",
      "string.empty": "Der products  darf nicht leer sein.",
      "any.required": "Der products ist erforderlich.",
    }),
    firstname: Joi.string().required().messages({
      "string.base": "Der Vorname muss eine Zeichenkette sein.",
      "string.empty": "Der Vorname darf nicht leer sein.",
      "any.required": "Der Vorname ist erforderlich.",
    }),
    cityname: Joi.string().required().messages({
      "string.base": "Der stadtname muss eine Zeichenfolge sein.",
      "string.empty": "Der stadtname darf nicht leer sein.",
      "any.required": "Der stadtname ist ein Pflichtfeld.",
    }),
    citynumber: Joi.string().required().messages({
      "string.base": "Der stadtnummer muss eine Zeichenfolge sein.",
      "string.empty": "Der stadtnummer darf nicht leer sein.",
      "any.required": "Der stadtnummer ist ein Pflichtfeld.",
    }),
    streetnumber: Joi.string().required().messages({
      "string.base": "Der hausnummer muss eine Zeichenfolge sein.",
      "string.empty": "Der hausnummer darf nicht leer sein.",
      "any.required": "Der hausnummer ist ein Pflichtfeld.",
    }),
    homenumber: Joi.string().required().messages({
      "string.base": "Der privatnummer muss eine Zeichenfolge sein.",
      "string.empty": "Der privatnummer darf nicht leer sein.",
      "any.required": "Der privatnummer ist ein Pflichtfeld.",
    }),
    code: Joi.string().messages({
      "string.base": "Der privatnummer muss eine Zeichenfolge sein.",
      "string.empty": "Der privatnummer darf nicht leer sein.",
    }),
    cost: Joi.number().required().messages({
      "any.required": "Der cost ist ein Pflichtfeld.",
    }),    
    discountedCost: Joi.number().messages({}),
  });
  return schema.validate(obj);
}

module.exports = {
  Order,
  validateAddOrder
}