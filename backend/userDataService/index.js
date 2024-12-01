const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cookieParser());
app.use(express.json());
const crossOrigin = process.env.CROSS_ORIGIN;

// app.use(
//   cors({
//     origin: crossOrigin,
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
const verifyToken = require("./utils/jwt.middleware");

const healthRoutes = require("./routes/health.route");
const studentRoutes = require("./routes/student.route");
const lrmRoutes = require("./routes/lrm.route");
const cronRoutes = require("./routes/crons.route");
// app.use("/user/health", verifyToken, healthRoutes);
// app.use("/user/student", verifyToken, studentRoutes);
// app.use("/user/lrm", verifyToken, lrmRoutes);

app.use("/user/health", healthRoutes);
app.use("/user/student", studentRoutes);
app.use("/user/lrm", lrmRoutes);
app.use("/user/crons", cronRoutes);
const swaggerSpec = require("./utils/swaggerConfig");
app.use("/user/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.listen(process.env.PORT, () => {
  console.log(`userDataService service running at port ${process.env.PORT}`);
});
