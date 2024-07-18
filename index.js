const express = require("express");
const dotenv = require("dotenv");
const app = express();
const database = require("./config/database");
const Tasks = require("./models/tasks.model");
const routesVersion1 = require("./api/v1/routes/index.route");
// dotenv
dotenv.config();

// database
database.connect();

// routes
routesVersion1(app);

// app port
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
