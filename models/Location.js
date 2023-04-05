const mongoose = require("mongoose");

const { Schema } = mongoose;

const locationSchema = new Schema({
  locationName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Location", locationSchema);
