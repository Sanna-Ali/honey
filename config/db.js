const mongoose = require("mongoose");
const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log("connected To MongoDB");
    });
  } catch (error) {
    console.log("Connection to MongoDB Failed", error);
  }
};
module.exports = connectToDb;
