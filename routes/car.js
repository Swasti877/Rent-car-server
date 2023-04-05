const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const Car = require("../models/Car");

// Route 1: Add a Car using POST method
router.post(
  "/addCar",
  [
    body("make", "Write appropriate manufacture").isLength({ min: 1 }),
    body("model", "Write appropriate model").isLength({ min: 1 }),
    body("year", "Should be Number").isDecimal(),
    body("color", "Write a appropriate Color").isLength({ min: 1 }),
    body("mileage", "Should be Number").isDecimal(),
    body("price_per_day", "Should be a number").isDecimal(),
    body("carType", "Field cant be Empty").isLength({ min: 1 }),
    body("status", "Field cant be Empty").isLength({ min: 1 }),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.errors, success });
    }

    try {
      const {
        make,
        model,
        year,
        color,
        mileage,
        price_per_day,
        carType,
        status,
      } = req.body;

      await Car.create({
        make,
        model,
        year,
        color,
        mileage,
        price_per_day,
        carType: carType.toUpperCase(),
        status,
      });
      success = true;
      return res.status(200).send({ success });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .send({ errors: [{ msg: "Internal Server Error" }], success });
    }
  }
);

// Route 2: Delete a Car using Delete method
router.delete("/deleteCar", async (req, res) => {
  try {
    let success = false;

    if (req.body._id.length !== 24) {
      return res.status(404).send({ errors: [{ msg: "Not Found" }], success });
    }

    const car = await Car.findByIdAndDelete(req.body._id);
    if (!car) {
      return res.status(404).send({ errors: [{ msg: "Not Found" }], success });
    } else {
      success = true;
      res.status(200).send({ success });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

// Route 2: Update the data of the Car using Put method
router.put("/updateCar", async (req, res) => {
  let success = false;
  try {
    if (req.body._id.length !== 24) {
      return res.status(404).send({ errors: [{ msg: "Not Found" }], success });
    }
    const {
      make,
      model,
      year,
      color,
      mileage,
      price_per_day,
      carType,
      status,
    } = req.body;

    const tempCar = {
      make,
      model,
      year,
      color,
      mileage,
      price_per_day,
      carType: carType.toUpperCase(),
      status,
    };

    const car = await Car.findByIdAndUpdate(
      req.body._id,
      { $set: tempCar },
      { new: true }
    );
    if (!car) {
      return res.status(404).send({ errors: [{ msg: "Not Found" }], success });
    } else {
      success = true;
      return res.status(200).send({ success });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

// Route 3: Fetch All Car using the GET Method
router.get("/fetchAllCars", async (req, res) => {
  try {
    let success = false;
    const carList = await Car.find({});

    success = true;
    res.send({ carList, success });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

// Route 4: Group by function for Car
router.get("/groupbyCarType", async (req, res) => {
  let success = false;
  try {
    const response = await Car.aggregate([
      {
        $group: { _id: "$carType", count: { $count: {} } },
      },
    ]);
    res.send({ data: response, success });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

module.exports = router;
