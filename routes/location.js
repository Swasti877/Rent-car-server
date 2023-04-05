const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Location = require("../models/Location");

// Route 1: Add Location using POST method
router.post(
  "/addLocation",
  [
    body("locationName", "Enter Valid Value").isLength({ min: 1 }),
    body("address", "Enter Valid Data").isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.errors });
    }

    try {
      const { locationName, address } = req.body;
      await Location.create({
        locationName,
        address,
      });

      return res.send({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

//Route 2: Update the location using PUT Method
router.put(
  "/updateLocation",
  [
    body("locationName", "Enter Valid Value").isLength({ min: 1 }),
    body("address", "Enter Valid Data").isLength({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.errors });
    }

    try {
      if (req.body._id.length !== 24) {
        return res.status(404).send({ error: "Not Found!" });
      }

      const { locationName, address } = req.body;

      const tempLocation = {
        locationName,
        address,
      };

      const location = await Location.findByIdAndUpdate(
        req.body._id,
        { $set: tempLocation },
        { new: true }
      );
      if (!location) {
        return res.status(404).send({ error: "Not Found!" });
      } else {
        return res.status(200).send({ success: true });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }
);

// Route 3: Delete location using Delete Method
router.delete("/deleteLocation", async (req, res) => {
  try {
    if (req.body._id.length !== 24) {
      return res.status(404).send({ error: "Not Found!" });
    }

    const tempLocation = await Location.findByIdAndDelete(req.body._id);
    if (!tempLocation) {
      return res.status(404).send({ error: "File not Found!" });
    } else {
      return res.status(200).send({ success: true });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ errors: "Internal Server Error" });
  }
});

// Route 4: Fetch All Location
router.get("/fetchAllLocations", async (req, res) => {
  try {
    const data = await Location.find({});
    return res.status(200).send({ locationsArray: data });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ errors: "Internal Server Error" });
  }
});

module.exports = router;
