const mongoose = require("mongoose");
const { Schema } = mongoose;

const RetalSchema = new Schema({
  carID: {
    type: Schema.Types.ObjectId,
    ref: "Car",
  },
  locationID: {
    type: Schema.Types.ObjectId,
    ref: "Location",
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rentalStartDate: {
    type: Date,
    required: true,
  },
  rentalEndDate: {
    type: Date,
    required: true,
  },
  rentalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Rental", RetalSchema);
