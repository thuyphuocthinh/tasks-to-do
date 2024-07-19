const express = require("express");
const dotenv = require("dotenv");
const app = express();
const database = require("./config/database");
const routesVersion1 = require("./api/v1/routes/index.route");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// dotenv
dotenv.config();

// cookie-parser
app.use(cookieParser("TPT"));

// cors
app.use(cors());

// body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database
database.connect();

// routes
routesVersion1(app);

// app port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
