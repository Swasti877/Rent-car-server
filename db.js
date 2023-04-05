const mongoose = require("mongoose");

const mongooseURI =
  "mongodb+srv://Swasti87:Swasti87@cluster0.buy3hvx.mongodb.net/?retryWrites=true&w=majority";

const mongooseConnect = async () => {
  console.log("Trying to Connect");
  await mongoose.connect(mongooseURI);

  console.log("mongoose connected!");
};

module.exports = mongooseConnect;
