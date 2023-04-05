const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Rental = require("../models/Rental");

// Route 1: Add rental Detail using POST Method
router.post(
  "/addRental",
  [
    body("carID", "Enter valid data").isLength({ min: 1 }),
    body("locationID", "Enter valid data").isLength({ min: 1 }),
    body("userID", "Enter valid data").isLength({ min: 1 }),
    body("rentalStartDate", "Enter valid data").isDate(),
    body("rentalEndDate", "Enter valid data").isDate(),
    body("rentalPrice", "Enter valid data").isDecimal(),
    body("paymentStatus", "Enter valid data").isBoolean(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send({ errors: error.errors });
    }

    try {
      const {
        carID,
        locationID,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
      } = req.body;

      if (
        carID.length != 24 ||
        locationID.length != 24 ||
        userID.length != 24
      ) {
        return res.status(400).send({ error: "Invalid Data" });
      }

      await Rental.create({
        carID,
        locationID,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
      });
      return res.status(200).send({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

//Route 2: Update Rental Information using PUT Method
router.put(
  "/updateRental",
  [
    body("rentalStartDate", "Enter valid data").isDate(),
    body("rentalEndDate", "Enter valid data").isDate(),
    body("rentalPrice", "Enter valid data").isDecimal(),
    body("paymentStatus", "Enter valid data").isBoolean(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).send({ errors: error.errors });
    }

    try {
      const {
        _id,
        carID,
        locationID,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
      } = req.body;

      if (
        _id.length != 24 ||
        carID.length != 24 ||
        locationID.length != 24 ||
        userID.length != 24
      ) {
        return res.status(400).send({ error: "Invalid Data" });
      }

      const temp = {
        carID,
        locationID,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
      };

      const tempRental = await Rental.findByIdAndUpdate(
        _id,
        { $set: temp },
        { new: true }
      );
      if (!tempRental) {
        return res.status(404).send({ error: "File not Found" });
      } else {
        return res.status(200).send({ success: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Route 3: Delete the Rental Data
router.delete("/deleteRental", async (req, res) => {
  try {
    const { _id } = req.body;
    if (_id.length != 24) {
      return res.status(400).send({ error: "Invalid Data" });
    }

    const tempRental = await Rental.findByIdAndDelete(_id);
    if (!tempRental) {
      return res.status(404).send({ error: "No File Found" });
    } else {
      return res.status(200).send({ success: true });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// Route 4: Fetch All Rental Data
router.get("/fetchAllRentals", async (req, res) => {
  try {
    const data = await Rental.find({});
    res.status(200).send({ rentalsArray: data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
