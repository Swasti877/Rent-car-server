const mongoose = require("mongoose");
const { Schema } = mongoose;

const RetalSchema = new Schema({
  carID: {
    type: Schema.Types.ObjectId,
    ref: "Car",
  },
  locationID: {
    type: Array,
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
  rentalStartTime: {
    type: String,
  },
  rentalEndTime: {
    type: String,
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
