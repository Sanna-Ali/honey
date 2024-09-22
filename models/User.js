const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

// User Schema
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M59.9998 120C92.7644 120 120 92.8234 120 60C120 27.2353 92.7057 0 59.941 0C27.1174 0 0 27.2353 0 60C0 92.8234 27.1764 120 59.9998 120ZM59.9998 26.1177C71.2351 26.1177 80.1763 36 80.1763 47.8824C80.1763 60.5293 71.2938 70.1765 59.9998 70.0588C48.6469 69.9411 39.8235 60.5293 39.8235 47.8824C39.7058 36 48.7057 26.1177 59.9998 26.1177ZM95.7644 94.8235L95.9408 95.5882C86.8822 105.235 73.4703 110.765 59.9998 110.765C46.4704 110.765 33.0586 105.235 24 95.5882L24.1764 94.8235C29.2939 87.7646 41.8823 80.0588 59.9998 80.0588C78.0585 80.0588 90.7056 87.7646 95.7644 94.8235Z" fill="#D19D41"/>
        </svg>`
      },
// url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
    cityname: {
      type: String,
    },
    citynumber: {
      type: String,
    },
    streetnumber: {
      type: String,
    },
    homenumber: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate Auth Token
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "20d",
    }
  );
};

// Generate Auth Token //generaterefreshToken
UserSchema.methods.generaterefreshToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_REF,
    {
      expiresIn: "20d",
    }
  );
};
// User Model
const User = mongoose.model("User", UserSchema);
function validateLoginUser(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().required().email().messages({
      "string.base": "Die E-Mail-Adresse muss eine Zeichenkette sein.",
      "string.empty": "Die E-Mail-Adresse darf nicht leer sein.",
      "any.required": "Die E-Mail-Adresse ist erforderlich.",
      "string.email":
        "Die E-Mail-Adresse muss eine gültige E-Mail-Adresse sein.",
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Das Passwort muss eine Zeichenkette sein.",
      "string.empty": "Das Passwort darf nicht leer sein.",
      "string.min": "Das Passwort muss mindestens 8 Zeichen lang sein.",
      "any.required": "Das Passwort ist erforderlich.",
    }),
  });
  return schema.validate(obj);
}

// Valider les données d'inscription de l'utilisateur
function validateRegisterUser(obj) {
  const schema = Joi.object({
    firstname: Joi.string().trim().min(2).max(50).required().messages({
      "string.base": "Der Vorname muss eine Zeichenkette sein.",
      "string.empty": "Der Vorname darf nicht leer sein.",
      "string.min": "Der Vorname muss mindestens 2 Zeichen lang sein.",
      "string.max": "Der Vorname darf nicht länger als 50 Zeichen lang sein.",
      "any.required": "Der Vorname ist erforderlich.",
    }),
    lastname: Joi.string().trim().min(2).max(100).required().messages({
      "string.base": "Der Nachname muss eine Zeichenkette sein.",
      "string.empty": "Der Nachname darf nicht leer sein.",
      "string.min": "Der Nachname muss mindestens 2 Zeichen lang sein.",
      "string.max": "Der Nachname darf nicht länger als 100 Zeichen lang sein.",
      "any.required": "Der Nachname ist erforderlich.",
    }),
    email: Joi.string().trim().required().email().messages({
      "string.base": "Die E-Mail-Adresse muss eine Zeichenkette sein.",
      "string.empty": "Die E-Mail-Adresse darf nicht leer sein.",
      "string.email":
        "Die E-Mail-Adresse muss eine gültige E-Mail-Adresse sein.",
      "any.required": "Die E-Mail-Adresse ist erforderlich.",
    }),
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Das Passwort muss eine Zeichenkette sein.",
      "any.required": "Das alte Passwort ist erforderlich.",
      "string.min": "Das alte Passwort muss mindestens 8 Zeichen lang sein",
      "string.empty": "Das Passwort darf nicht leer sein.",
    }),
    phone: Joi.string().messages({
      "string.base": "Die Telefonnummer muss eine Zeichenkette sein.",
    }),
  });
  return schema.validate(obj);
}

// Valider les données de mise à jour de l'utilisateur
function validateUpdateUser(obj) {
  const schema = Joi.object({
    firstname: Joi.string().trim().min(2).max(50).messages({
      "string.base": "Der Vorname muss eine Zeichenkette sein.",
      "string.empty": "Der Vorname darf nicht leer sein.",
      "string.min": "Der Vorname muss mindestens 2 Zeichen lang sein.",
      "string.max": "Der Vorname darf nicht länger als 50 Zeichen lang sein.",
    }),
    lastname: Joi.string().trim().min(2).max(100).messages({
      "string.base": "Der Nachname muss eine Zeichenkette sein.",
      "string.empty": "Der Nachname darf nicht leer sein.",
      "string.min": "Der Nachname muss mindestens 2 Zeichen lang sein.",
      "string.max": "Der Nachname darf nicht länger als 100 Zeichen lang sein.",
    }),
    cityname: Joi.string().trim().messages({
      "string.base": "Der stadtname muss eine Zeichenkette sein.",
      "string.empty": "Der stadtname darf nicht leer sein.",
    }),
    citynumber: Joi.string().trim().messages({
      "string.base": "Der stadtnummer muss eine Zeichenkette sein.",
      "string.empty": "Der stadtnummer darf nicht leer sein.",
    }),
    streetnumber:Joi.string().trim().messages({
      "string.base": "Der hausnummer eine Zeichenkette sein.",
      "string.empty": "Der hausnummer darf nicht leer sein.",
    }) ,
    homenumber: Joi.string().trim().messages({
      "string.base": "Der privatnummer muss eine Zeichenkette sein.",
      "string.empty": "Der privatnummer darf nicht leer sein.",
    }),
    phone:Joi.string().trim().messages({
      "string.base": "Der telefonnummer muss eine Zeichenkette sein.",
      "string.empty": "Der telefonnummer darf nicht leer sein.",
    }),
  });
  return schema.validate(obj);
}
/// Valider l'adresse email
function validateEmail(obj) {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(100).required().email().messages({
      "string.base": "Die E-Mail-Adresse muss eine Zeichenkette sein.",
      "string.empty": "Die E-Mail-Adresse darf nicht leer sein.",
      "string.min": "Die E-Mail-Adresse muss mindestens 5 Zeichen lang sein.",
      "string.max":
        "Die E-Mail-Adresse darf nicht länger als 100 Zeichen lang sein.",
      "any.required": "Die E-Mail-Adresse ist erforderlich.",
    }),
  });
  return schema.validate(obj);
}

// Valider le nouveau mot de passe
function validateNewPassword(obj) {
  const schema = Joi.object({
    password: Joi.string().trim().min(8).required().messages({
      "string.base": "Der Betreff muss eine Zeichenfolge sein.",
      "string.empty": "Der Betreff darf nicht leer sein.",
      "any.required": "Das Passwort ist erforderlich.",
      "string.min": "Das Passwort muss mindestens 8 Zeichen lang sein.",
    }),
  });
  return schema.validate(obj);
}
function validateChangedPassword(obj) {
  const schema = Joi.object({
    oldPassword: Joi.string().trim().min(8).required().messages({
      "string.base": "Das Passwort muss eine Zeichenkette sein.",
      "any.required": "Das alte Passwort ist erforderlich.",
      "string.min": "Das alte Passwort muss mindestens 8 Zeichen lang sein",
      "string.empty": "Das Passwort darf nicht leer sein.",
    }),
    newPassword: Joi.string().trim().min(8).required().messages({
      "string.base": "Das Passwort muss eine Zeichenkette sein.",
      "string.empty": "Das Passwort darf nicht leer sein.",
      "string.min": "Das Passwort muss mindestens 8 Zeichen lang sein.",
      "any.required": "Das Passwort ist erforderlich.",
    }),
    confirmPassword: Joi.string().trim().min(8).required().messages({
      "string.base": "Die Passwortbestätigung muss eine Zeichenkette sein.",
      "string.empty": "Die Passwortbestätigung darf nicht leer sein.",
      "string.min":
        "Die Passwortbestätigung muss mindestens 8 Zeichen lang sein.",
      "any.required": "Die Passwortbestätigung ist erforderlich.",
    }),
  });
  return schema.validate(obj);
}
module.exports = {
  User,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateEmail,
  validateNewPassword,
  validateChangedPassword,
};
