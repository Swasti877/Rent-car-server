const express = require("express");
const router = express.Router();
const { body, validationResult, check } = require("express-validator");
const Car = require("../models/Car");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

let currImgName;
const allowedFiles = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    currImgName = uuidv4() + path.extname(file.originalname);
    imgName = cb(null, currImgName);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedFiles.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploads = multer({ storage, fileFilter });

// Route 1: Add a Car using POST method
router.post(
  "/addCar",
  uploads.single("photo"),
  [
    check("photo")
      .custom((value, { req }) => {
        console.log(req.file);
        if (allowedFiles.includes(req.file.mimetype)) return true;
        else return false;
      })
      .withMessage("JPEG, JPG, PNG File are Allowed"),
    body("make", "Write appropriate manufacture").isLength({ min: 1 }),
    body("model", "Write appropriate model").isLength({ min: 1 }),
    body("year", "Year Should be Number").isDecimal(),
    body("color", "Write a appropriate Color").isLength({ min: 1 }),
    body("mileage", "Should be Number").isDecimal(),
    body("price_per_day", "Should be a number").isDecimal(),
    body("carType", "Cartype cant be Empty").isLength({ min: 1 }),
    body("status", "Select Status").isLength({ min: 1 }),
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

      const car = await Car.create({
        make: make.toUpperCase,
        model,
        year,
        color,
        mileage,
        price_per_day,
        carType: carType.toUpperCase(),
        status,
        img: currImgName,
      });

      success = true;
      return res.status(200).send({ _id: car._id, img: currImgName, success });
    } catch (err) {
      console.log(err);

      res
        .status(500)
        .send({ errors: [{ errors: "Internal Server Error" }], success });
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
      if (car.img !== undefined) {
        try {
          fs.unlink(".\\public\\" + car.img, (err) => {
            console.log(err);
            console.log("File Deleted!");
          });
        } catch (err) {
          console.log(err);
        }
      }
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
router.put(
  "/updateCar",
  body("make", "Write appropriate manufacture").isLength({ min: 1 }),
  body("model", "Write appropriate model").isLength({ min: 1 }),
  body("year", "Year Should be Number").isDecimal(),
  body("color", "Write a appropriate Color").isLength({ min: 1 }),
  body("mileage", "Should be Number").isDecimal(),
  body("price_per_day", "Should be a number").isDecimal(),
  body("carType", "Cartype cant be Empty").isLength({ min: 1 }),
  body("status", "Select Status").isLength({ min: 1 }),
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.errors, success });
    }

    try {
      if (req.body._id.length !== 24) {
        return res
          .status(404)
          .send({ errors: [{ msg: "Not Found" }], success });
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
        make: make.toUpperCase(),
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
        return res
          .status(404)
          .send({ errors: [{ msg: "Not Found" }], success });
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
  }
);

// Route 3: Fetch All Car using the GET Method
router.get("/fetchAllCars", async (req, res) => {
  let success = false;
  try {
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

// Route 6: fetching only Avialiable Car
router.get("/fetchAvialiableCars", async (req, res) => {
  let success = false;
  try {
    const carList = await Car.find({ status: true });

    success = true;
    res.send({ carList, success });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

// Route 5: Group by function for Car
router.get("/groupbyCarType", async (req, res) => {
  let success = false;
  try {
    const response = await Car.aggregate([
      { $match: { status: { $eq: true } } },
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

//Route 6: Group by the car Maker
router.get("/groupbyCarMake", async (req, res) => {
  let success = false;
  try {
    const response = await Car.aggregate([
      { $match: { status: { $eq: true } } },
      { $group: { _id: "$make", count: { $count: {} } } },
    ]);

    success = true;
    res.send({ data: response, success });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

// Route 7: Fetch a Car Image
router.get("/fetchImage/:imgName", async (req, res) => {
  let success = false;
  try {
    const { imgName } = req.params;
    success = true;
    res.sendFile(path.resolve("./public") + "/" + imgName);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

// Route For testing purpose
router.get("/test", async (req, res) => {
  let success = false;
  try {
    const carTypeArray = [];
    const data = await Car.find({ carType: { $in: carTypeArray } });
    res.send(data);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ errors: [{ msg: "Internal Server Error" }], success });
  }
});

module.exports = router;
