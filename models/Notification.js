const mongoose = require("mongoose");
const Joi = require("joi");
const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: { 
    type: String,},
  to: {
    type: String,
    required: true,
  },
  content:{
    type: Object
  },
  read: {
    type: Boolean,
    default: false
  },
  kind:{
    type:String,
  }
}, {
  timestamps: true
});

const Notification = mongoose.model("notification", NotificationSchema);
module.exports = {
  Notification
};