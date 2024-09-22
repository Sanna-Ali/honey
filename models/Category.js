const mongoose = require("mongoose");
const Joi = require("joi");
const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    constant: {
      type: Boolean,
      default: false,
    },
    categoryImage: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
CategorySchema.virtual("subcategories", {
  ref: "SubCategory",
  foreignField: "categoryId",
  localField: "_id",
});

CategorySchema.virtual("products", {
  ref: "Product",
  foreignField: "category",
  localField: "name",
});
const Category = mongoose.model("Category", CategorySchema);
function validateaddCategory(obj) {
  const schema = Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Der Kategoriename muss ein Text sein.",
      "any.required": "Der Kategoriename ist erforderlich.",
    }),
    // description: Joi.string().required().messages({
    //   "string.base": "Die Beschreibung muss ein Text sein.",
    //   "any.required": "Eine Beschreibung ist erforderlich.",
    // }),
    constant: Joi.string().messages(),
    hidden: Joi.string().messages()

  });
  return schema.validate(obj);
}
function validateUpdateCategory(obj) {
  const schema = Joi.object({
    name: Joi.string().messages({
      "string.base": "Der Kategoriename muss ein Text sein.",
    }),
    // description: Joi.string().messages({
    //   "string.base": "Die Beschreibung muss ein Text sein.",
    // }),
    constant: Joi.string().messages(),
    hidden: Joi.string().messages()
  });
  return schema.validate(obj);
}

module.exports = { Category, validateaddCategory, validateUpdateCategory };
