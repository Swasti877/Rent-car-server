const express = require("express");
const cors = require("cors");
const connectToMongoose = require("./db.js");
const auth = require("./routes/auth");
const car = require("./routes/car");
const location = require("./routes/location");
const rental = require("./routes/rental");
const app = express();
const bodyParser = require('body-parser');
const port = 5000;

connectToMongoose();

//MiddleWare
app.use(cors());

// Routes
app.use(bodyParser.json());
app.use("/api/auth", auth);
app.use("/api/car", car);
app.use("/api/location", location);
app.use("/api/rental", rental);

// Listen
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
