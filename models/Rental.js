const mongoose = require("mongoose");
const { Schema } = mongoose;

const RetalSchema = new Schema({
  carID: {
    type: Schema.Types.ObjectId,
    ref: "Car",
    required: true,
  },
  locationIDPickUp: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  locationIDDropOff: {
    type: Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rentalStartDate: {
    type: Date,
    required: true,
  },
  rentalEndDate: {
    type: Date,
    required: true,
  },
  rentalStartTime: {
    type: String,
    required: true,
  },
  rentalEndTime: {
    type: String,
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
  transactionID: {
    type: String,
  },
});

module.exports = mongoose.model("Rental", RetalSchema);
