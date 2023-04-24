const express = require("express");
const router = express.Router();
const Car = require("../models/Car.js");
const diffrenceInDays = require("../Functions/DateAndTime.js");
const stripe = require("stripe")(
  "sk_test_51KUrPtSJMMQQJFOHNYS9dzkHBc0R3enELueZZnHlyjMFdfdVyzN7YXQMI3h64J3QYQ7mOQhrijdDZA9HEI6nhqQI0084NqYFwJ"
);

// Route 1: For creating a Paymnet Intent
router.post("/create-paymentIntent", async (req, res) => {
  try {
    if (Object.keys(req.body.cartCar).length === 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 100,
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
      });
    } else {
      const { pickUpDate, dropOffDate } = req.body.cartCar.bookDetails;
      const car_id = req.body.cartCar.car._id;
      if (car_id.length !== 24) {
        return res.status(404).send({ errors: [{ msg: "Not Found" }] });
      }

      const car = await Car.findOne({ _id: car_id });
      const paymentIntent = await stripe.paymentIntents.create({
        amount:
          car.price_per_day * diffrenceInDays(pickUpDate, dropOffDate) * 100,
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = router;
