const express = require("express");
const app = express();
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const cors = require("cors");
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
  console.log(req.header("Origin"));
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

app.use(express.json());
const healthRoutes = require("./routes/health.route");
const domainRoutes = require("./routes/domain.route");
const batchRoutes = require("./routes/batch.route");
const programRoutes = require("./routes/program.route");

const verifyToken = require("./utils/jwt.middleware");

// The bottom codes will make protected routes
// app.use('/health', verifyToken, healthRoutes)
// app.use('/domain', verifyToken, domainRoutes)
// app.use('/batch', verifyToken, batchRoutes)
// app.use('/program', verifyToken, programRoutes)

// app.use("/base/health", verifyToken, healthRoutes);
// app.use("/base/domain", verifyToken, domainRoutes);
// app.use("/base/batch", verifyToken, batchRoutes);
// app.use("/base/program", verifyToken, programRoutes);

app.use("/base/health", healthRoutes);
app.use("/base/domain", domainRoutes);
app.use("/base/batch", batchRoutes);
app.use("/base/program", programRoutes);

const swaggerSpec = require("./utils/swaggerConfig");
app.use("/base/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(process.env.PORT, () => {
  console.log(`Base Service running at port ${process.env.PORT}`);
});
