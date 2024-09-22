const mongoose = require('mongoose')
const Joi = require('joi')

const rebateCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discount:{
        type: Number,
        required: [true, 'discount is required']
    },
    usedTimes:{
        type: Number,
        default :0
    }
},{
  timestamps: true

})

const RebateCode = mongoose.model("rebateCode", rebateCodeSchema)

// Validate Register User
function validateDiscountCode(obj) {
    const schema = Joi.object({
      code: Joi.string().trim().required() .messages({
        "string.base": "Der Code muss eine Zeichenfolge sein.",
        "string.empty": "Der Code darf nicht leer sein.",
        "any.required": "Der Code ist ein Pflichtfeld.",
      }),
      discount: Joi.number().required().messages({
        "number.base": "Der Rabatt muss eine Zahl sein.",
        "number.empty": "Der Rabatt darf nicht leer sein.",
        "any.required": "Der Rabatt ist ein Pflichtfeld.",
      }),
    });
    return schema.validate(obj);
  }
module.exports = {
    RebateCode,
    validateDiscountCode
}