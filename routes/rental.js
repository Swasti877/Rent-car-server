const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Rental = require("../models/Rental");
const Car = require("../models/Car");
const jwt = require("jsonwebtoken");
const JWTSECRET = "uMeG94CzHg";

// Route 1: Add rental Detail using POST Method
router.post(
  "/addRental",
  [
    body("carID", "Enter valid data").isLength({ min: 24, max: 24 }),
    body("locationIDPickUp", "Enter valid data").isLength({ min: 24, max: 24 }),
    body("locationIDDropOff", "Enter valid data").isLength({
      min: 24,
      max: 24,
    }),
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
        locationIDPickUp,
        locationIDDropOff,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
        rentalStartTime,
        rentalEndTime,
      } = req.body;

      if (
        carID.length != 24 ||
        locationIDPickUp.length != 24 ||
        locationIDDropOff.length != 24 ||
        userID.length != 24
      ) {
        return res.status(400).send({ error: "Invalid Data" });
      }

      const tempRental = await Rental.create({
        carID,
        locationIDPickUp,
        locationIDDropOff,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
        rentalStartTime,
        rentalEndTime,
      });
      if (tempRental) {
        await Car.updateOne({ _id: carID }, { $set: { status: false } }); // Changing the Status to false
        success = true;
        return res.status(200).send({ success, _id: tempRental._id });
      }
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
        locationIDPickUp,
        locationIDDropOff,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
        rentalStartTime,
        rentalEndTime,
      } = req.body;

      if (
        _id.length != 24 ||
        carID.length != 24 ||
        locationIDPickUp.length != 24 ||
        locationIDDropOff.length != 24 ||
        userID.length != 24
      ) {
        return res.status(400).send({ error: "Invalid Data" });
      }

      const temp = {
        carID,
        locationIDPickUp,
        locationIDDropOff,
        userID,
        rentalStartDate,
        rentalEndDate,
        rentalPrice,
        paymentStatus,
        rentalStartTime,
        rentalEndTime,
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

// Route 5: To change any particular column value
router.get(
  "/changeValue",
  [body("_id", "Invalid data").isLength({ min: 24, max: 24 })],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.errors, success });
    }
    try {
      const { _id, colName, colValue } = req.body;
      await Rental.updateOne({ _id }, { $set: { colName, colValue } });
      success = true;
      return res.send({ success });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ errors: [{ msg: "Internal Server Error" }], success });
    }
  }
);

//Route 6: Fetch the OrderHistory According w.r.t User
router.post("/fetchOrderHistory", async (req, res) => {
  let success = false;
  try {
    const { authToken } = req.body;
    const decodedToken = jwt.verify(authToken, JWTSECRET);
    const { id } = decodedToken.user;
    const orderHistory = await Rental.find({
      userID: { $eq: id },
    });

    if (orderHistory) {
      // when user has order history
      success = true;
      res.send({ orderHistory, success });
    } else {
      res
        .status(404)
        .send({ errors: [{ msg: "Internal Server Error" }], success });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

module.exports = router;
