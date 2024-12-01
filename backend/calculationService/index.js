const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const cors = require("cors");

const crossOrigin = process.env.CROSS_ORIGIN;

// app.use(
//   cors({
//     // origin: crossOrigin,
//     credentials: true,
//   })
// );
// app.use(cors())
const allowedOrigins = [
  "http://npsapi.prashantdey.in",
  "http://nps.prashantdey.in",
  "https://npsapi.prashantdey.in",
  "https://nps.prashantdey.in",
  "https://prashantdey.in",
  "http://prashantdey.in",
  "http://herovired.com",
  "http://npsapipk.herovired.com",
  "https://npsapipk.herovired.com",
  "https://npsapi.herovired.com",
  "http://npsapi.herovired.com",
  "http://npspk.herovired.com",
  "https://nps.herovired.com",
  "http://nps.herovired.com",
  "http://localhost:3000",
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (allowedOrigins.includes(req.header("Origin"))) {
    corsOptions = {
      origin: req.header("Origin"),
      credentials: true,
    };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));

app.use((req, res, next) => {
  const origin = req.header("Origin");
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  next();
});
app.use(cookieParser());
app.use(express.json());

const verifyToken = require("./utils/jwt.middleware");

const healthRoutes = require("./routes/health.route");
const calculateRoutes = require("./routes/calculate.route");

app.use("/calculation/health", healthRoutes);
// app.use("/calculation/stat", calculateRoutes);

// app.use("/calculation/health", verifyToken, healthRoutes);
app.use("/calculation/stat", verifyToken, calculateRoutes);

// For authenticated routes:
// app.use('/questionType', questionTypeRoute, verifyToken)

const swaggerSpec = require("./utils/swaggerConfig");
app.use("/calculation/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(process.env.PORT, () => {
  console.log(`NPS Calculation service running at port ${process.env.PORT}`);
});
