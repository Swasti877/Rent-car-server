const mongoose = require("mongoose");
const { Schema } = mongoose;

const carSchema = new Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  mileage: {
    type: Number,
    required: true,
  },
  price_per_day: {
    type: Number,
    required: true,
  },
  carType: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Car", carSchema);
