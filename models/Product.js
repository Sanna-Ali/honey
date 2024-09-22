const mongoose = require("mongoose");
const Joi = require("joi");
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    // required: true,
  },
  category: {
    type: String,
    ref: "Category",
    // required: true,
  },

  subCategory: {
    type: String,
    ref: "SubCategory",
  },

  description: {
    type: String,
  },

  productImages: {
    type: Array,
    //required: true
  },
  quantity: {
    type: Number,
    //required: true,
  },
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, required: true, default: 0 },
    },
  ],
  theRating: {
    type: Number,
    // required: true,
    default: 0,
  },
  discountedPrice: {
    type: Number,
  },
  deletedAt: { type: Date, default: null },
  thestatus: { type: String, default: "active", enum: ["active", "inactive"] },
  typeOfHoney: {
    type: String,
    //required: true,
  },
  packageSize: {
    type: String, //required: true
  },
  matrerialSize: {
    type: String, // required: true
  },
  materialModel: {
    type: String,
    // required: true,
  },
  numb: {
    type: Number, //required: true
  },
  modelDimensions: {
    type: String, //required: true
  },
  netWeight: {
    type: String,
    //required: true
  },
  itemWeight: {
    type: String, // required: true
  },
  storge: {
    type: String, //required: true
  },
  countryOfOrigin: {
    type: String, //required: true
  },
  portenSize: {
    type: String, //required: true
  },
  energyKJ: {
    type: String, //required: true
  },
  energyKCal: {
    type: String, //required: true
  },
  fat: {
    type: String, //required: true
  },
  saturatedFattyAcids: {
    type: String, //required: true
  },
  coalFuelRate: {
    type: String, //required: true
  }, //?
  sugar: {
    type: String, // required: true
  },
  salt: {
    type: String, //required: true
  },
  eggWhite: {
    type: String, // required: true
  },
  ingredientients: {
    type: String, // required: true
  },
  ApplicationOfUse: {
    type: String, //required: true
  },
  discountedPrice: {
    type: Number, //required: true
    default: null
  },
  homepage: {
    type: Boolean, //required: true
  },
  new: {
    type: Boolean, //required: true
  }, 
  star: {
    type: Boolean, //required: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true

});

// Product Model
const Product = mongoose.model("Product", ProductSchema);

// Validate Add New Product
function validateAddProduct(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      "string.base": "Der Produktname muss eine Zeichenfolge sein.",
      "string.empty": "Der Produktname darf nicht leer sein.",
      "string.min": "Der Produktname muss mindestens 2 Zeichen lang sein.",
      "string.max": "Der Produktname darf nicht länger als 50 Zeichen sein.",
      "any.required": "Der Produktname ist ein Pflichtfeld.",
    }),
    description: Joi.string().trim().min(2).messages({
      "string.base": "Die Produktbeschreibung muss eine Zeichenfolge sein.",
      // "string.empty": "Die Produktbeschreibung darf nicht leer sein.",
      "string.min":
        "Die Produktbeschreibung muss mindestens 2 Zeichen lang sein.",
      // "any.required": "Die Produktbeschreibung ist ein Pflichtfeld.",
    }),
    // productImage: Joi.string().allow(null, "").messages({
    //   "string.base": "Das Produktbild muss eine gültige URL oder leer sein.",
    // }),
    category: Joi.string().required().messages({
      "string.base": "Die Kategorie muss eine gültige Kategorie sein.",
      "any.required": "Die Kategorie ist ein Pflichtfeld.",
    }),
    subCategory: Joi.string().messages({
      "string.base": "Die Unterkategorie muss eine gültige Unterkategorie sein.",
    }),
    price: Joi.number().messages({
      "number.base": "Der Preis muss eine Zahl sein.",
      //"number.empty": "Der Preis darf nicht leer sein.",
      //"any.required": "Der Preis ist ein Pflichtfeld.",
    }),
    quantity: Joi.number().messages({
      "number.base": "Die Menge muss eine Zahl sein.",
      // "number.empty": "Die Menge darf nicht leer sein.",
      //"any.required": "Die Menge ist ein Pflichtfeld.",
    }),
    status: Joi.string().messages({
      "string.base": "Der Status muss eine gültige Option sein.",
      // "string.empty": "Der Status darf nicht leer sein.",
      //"any.required": "Der Status ist ein Pflichtfeld.",
    }),

    // deletedAt: Joi.date().default(null).messages({
    //   "date.base": "Das gelöschtes Datum-Feld muss ein gültiges Datum sein.",
    // }),

    // thestatus: Joi.string()
    //   .valid("active", "inactive")
    //   .default("active")
    //   .messages({
    //     "any.only": "Der Produktstatus muss 'active' oder 'inactive' sein.",
    //   }),

    typeOfHoney: Joi.string().messages({
      "string.base": "Das Feld Typ des Honigs muss ein Text sein.",
    }),

    packageSize: Joi.string().messages({
      "string.base": "Das Feld Paketgröße muss ein Text sein.",
    }),

    matrerialSize: Joi.string().messages({
      "string.base": "Das Feld Materialgröße muss ein Text sein.",
    }),

    materialModel: Joi.string().messages({
      "string.base": "Das Feld Materialmodell muss ein Text sein.",
    }),

    numb: Joi.number().messages({
      "number.base": "Das Feld Nummer muss eine Zahl sein.",
    }),

    modelDimensions: Joi.string().messages({
      "string.base": "Das Feld Modellabmessungen muss ein Text sein.",
    }),

    netWeight: Joi.string().messages({
      "string.base": "Das Feld Nettogewicht muss ein Text sein.",
    }),

    itemWeight: Joi.string().messages({
      "string.base": "Das Feld Artikelgewicht muss ein Text sein.",
    }),

    storge: Joi.string().messages({
      "string.base": "Das Feld Lagerung muss ein Text sein.",
    }),

    countryOfOrigin: Joi.string().messages({
      "string.base": "Das Feld Herkunftsland muss ein Text sein.",
    }),

    portenSize: Joi.string().messages({
      "string.base": "Das Feld Portalgröße muss ein Text sein.",
    }),

    energyKJ: Joi.string().messages({
      "string.base": "Das Feld Energie (kJ) muss ein Text sein.",
    }),

    energyKCal: Joi.string().messages({
      "string.base": "Das Feld Energie (kcal) muss ein Text sein.",
    }),

    fat: Joi.string().messages({
      "string.base": "Das Feld Fett muss ein Text sein.",
    }),

    saturatedFattyAcids: Joi.string().messages({
      "string.base": "Das Feld Gesättigte Fettsäuren muss ein Text sein.",
    }),

    coalFuelRate: Joi.string().messages({
      "string.base": "Das Feld Kohlebrennwert muss ein Text sein.",
    }),

    sugar: Joi.string().messages({
      "string.base": "Das Feld Zucker muss ein Text sein.",
    }),

    salt: Joi.string().messages({
      "string.base": "Das Feld Salz muss ein Text sein.",
    }),

    eggWhite: Joi.string().messages({
      "string.base": "Das Feld Eiweiß muss ein Text sein.",
    }),

    ingredientients: Joi.string().messages({
      "string.base": "Das Feld Zutaten muss ein Text sein.",
    }),

    ApplicationOfUse: Joi.string().messages({
      "string.base": "Das Feld Anwendungsbereich muss ein Text sein.",
    }),
    discountedPrice: Joi.number().messages({
      "number.base": "Der Rabattpreis muss eine Zahl sein.",
      // "number.min": "Der Rabattpreis muss größer als 0 sein.",
    }),
  });

  return schema.validate(obj);
}

function validateUpdateProduct(obj) {
  const schema = Joi.object({
    name: Joi.string().trim().min(2).max(50).messages({
      "string.base": "Der Produktname muss eine Zeichenfolge sein.",
      "string.empty": "Der Produktname darf nicht leer sein.",
      "string.min": "Der Produktname muss mindestens 2 Zeichen lang sein.",
      "string.max": "Der Produktname darf nicht länger als 50 Zeichen sein.",
      "any.required": "Der Produktname ist ein Pflichtfeld.",
    }),
    description: Joi.string().trim().min(2).messages({
      "string.base": "Die Produktbeschreibung muss eine Zeichenfolge sein.",
      // "string.empty": "Die Produktbeschreibung darf nicht leer sein.",
      "string.min":
        "Die Produktbeschreibung muss mindestens 2 Zeichen lang sein.",
      // "any.required": "Die Produktbeschreibung ist ein Pflichtfeld.",
    }),
    // productImage: Joi.string().allow(null, "").messages({
    //   "string.base": "Das Produktbild muss eine gültige URL oder leer sein.",
    // }),
    category: Joi.string().messages({
      "string.base": "Die Kategorie muss eine gültige Kategorie sein.",
      // "any.required": "Die Kategorie ist ein Pflichtfeld.",
    }),
    price: Joi.number().messages({
      "number.base": "Der Preis muss eine Zahl sein.",
      //"number.empty": "Der Preis darf nicht leer sein.",
      //"any.required": "Der Preis ist ein Pflichtfeld.",
    }),
    quantity: Joi.number().messages({
      "number.base": "Die Menge muss eine Zahl sein.",
      // "number.empty": "Die Menge darf nicht leer sein.",
      //"any.required": "Die Menge ist ein Pflichtfeld.",
    }),
    status: Joi.string().messages({
      "string.base": "Der Status muss eine gültige Option sein.",
      // "string.empty": "Der Status darf nicht leer sein.",
      //"any.required": "Der Status ist ein Pflichtfeld.",
    }),

    typeOfHoney: Joi.string().messages({
      "string.base": "Das Feld Typ des Honigs muss ein Text sein.",
    }),

    packageSize: Joi.string().messages({
      "string.base": "Das Feld Paketgröße muss ein Text sein.",
    }),

    matrerialSize: Joi.string().messages({
      "string.base": "Das Feld Materialgröße muss ein Text sein.",
    }),

    materialModel: Joi.string().messages({
      "string.base": "Das Feld Materialmodell muss ein Text sein.",
    }),

    numb: Joi.number().messages({
      "number.base": "Das Feld Nummer muss eine Zahl sein.",
    }),

    modelDimensions: Joi.string().messages({
      "string.base": "Das Feld Modellabmessungen muss ein Text sein.",
    }),

    netWeight: Joi.string().messages({
      "string.base": "Das Feld Nettogewicht muss ein Text sein.",
    }),

    itemWeight: Joi.string().messages({
      "string.base": "Das Feld Artikelgewicht muss ein Text sein.",
    }),

    storge: Joi.string().messages({
      "string.base": "Das Feld Lagerung muss ein Text sein.",
    }),

    countryOfOrigin: Joi.string().messages({
      "string.base": "Das Feld Herkunftsland muss ein Text sein.",
    }),

    portenSize: Joi.string().messages({
      "string.base": "Das Feld Portalgröße muss ein Text sein.",
    }),

    energyKJ: Joi.string().messages({
      "string.base": "Das Feld Energie (kJ) muss ein Text sein.",
    }),

    energyKCal: Joi.string().messages({
      "string.base": "Das Feld Energie (kcal) muss ein Text sein.",
    }),

    fat: Joi.string().messages({
      "string.base": "Das Feld Fett muss ein Text sein.",
    }),

    saturatedFattyAcids: Joi.string().messages({
      "string.base": "Das Feld Gesättigte Fettsäuren muss ein Text sein.",
    }),

    coalFuelRate: Joi.string().messages({
      "string.base": "Das Feld Kohlebrennwert muss ein Text sein.",
    }),

    sugar: Joi.string().messages({
      "string.base": "Das Feld Zucker muss ein Text sein.",
    }),

    salt: Joi.string().messages({
      "string.base": "Das Feld Salz muss ein Text sein.",
    }),

    eggWhite: Joi.string().messages({
      "string.base": "Das Feld Eiweiß muss ein Text sein.",
    }),

    ingredientients: Joi.string().messages({
      "string.base": "Das Feld Zutaten muss ein Text sein.",
    }),

    ApplicationOfUse: Joi.string().messages({
      "string.base": "Das Feld Anwendungsbereich muss ein Text sein.",
    }),
    discountedPrice: Joi.number().messages({
      "number.base": "Der Rabattpreis muss eine Zahl sein.",
      // "number.min": "Der Rabattpreis muss größer als 0 sein.",
    }),
  });

  return schema.validate(obj);
}

module.exports = {
  Product,
  validateAddProduct,
  validateUpdateProduct,
};
