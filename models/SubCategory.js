const mongoose = require("mongoose");
const Joi = require("joi");

const SubCategorySchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },

});

SubCategorySchema.virtual("products", {
  ref: "Product",
  foreignField: "subCategory",
  localField: "name",
});

function validateUpdateSubCategory(obj) {
  const schema = Joi.object({
    categoryId: Joi.string().messages({"string.base": "Der Kategoriename muss ein Text sein."}),
    name: Joi.string().messages({"string.base": "Der Kategoriename muss ein Text sein."}),
  });
  return schema.validate(obj);
}

const SubCategory = mongoose.model("SubCategory", SubCategorySchema);
module.exports = { 
  SubCategory,
  validateUpdateSubCategory
 };
