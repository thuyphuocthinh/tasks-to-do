import * as express from "express";
import { Express } from "express";
import * as dotenv from "dotenv";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as database from "./config/database";
import routesVersion1 from "./api/v1/routes/index.route";

const app: Express = express();
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
const port: string | number = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
