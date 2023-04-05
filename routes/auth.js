const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");

const JWTSECRET = "uMeG94CzHg";

//Route: 1 Create a new User using POST METHOD
router.post(
  "/createUser",
  [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password should atleast 5 character").isLength({
      min: 5,
    }),
    body("firstName", "Enter First Name").isLength({ min: 1 }),
    body("lastName", "Enter Last Name").isLength({ min: 1 }),
    body("phoneNumber", "Enter Valid Phone Number")
      .isDecimal()
      .isLength({ min: 1, max: 10 }),
    body("drivingLicenseNumber", "Enter Drving Licence").isLength({ min: 1 }),
  ],
  async (req, res) => {
    let success = false;
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.errors });
    }

    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        drivingLicenseNumber,
      } = req.body;
      // check if the user exist or Not
      let success = false;
      const user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Account Already Exists" }], success });
      } else {
        const salt = await bcryptjs.genSalt(10);
        const secPass = bcryptjs.hashSync(password, salt);

        // Saving user in Database.
        const user = await User.create({
          email,
          password: secPass,
          firstName,
          lastName,
          phoneNumber,
          drivingLicenseNumber,
        });

        const data = {
          user: {
            id: user.id,
          },
        };

        const token = jwt.sign(data, JWTSECRET);
        success = true;
        return res.send({ success, token });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .send({ errors: [{ msg: "Internal Server Error" }], success });
    }
  }
);

// Route: 2 Login with credential using POST METHOD
router.post(
  "/login",
  [
    body("email", "Enter Valid Email").isEmail(),
    body("password", "Password should atleast 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.errors });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .send({ errors: [{ msg: "Invalid Credentails" }], success });
      } else {
        const comparePassword = await bcryptjs.compare(password, user.password);
        if (!comparePassword) {
          return res
            .status(404)
            .send({ errors: [{ msg: "Invalid Credentails" }], success });
        } else {
          const data = {
            user: {
              id: user.id,
            },
          };
          const token = jwt.sign(data, JWTSECRET);
          success = true;
          return res.send({ success, token });
        }
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ errors: [{ msg: "Internal Server Error" }], success });
    }
  }
);

module.exports = router;
