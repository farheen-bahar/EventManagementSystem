require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("./config/db");
const logRequests = require("./middleware/log-requests");
const {
  notFoundErrorHandler,
  genericErrorHandler,
} = require("./middleware/http-error-handlers");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const otproutes = require("./routes/OTP");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(logRequests);
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api", otproutes);

app.get("/", function (req, res) {
  console.log("route / is accessed.");
  res.send("Hi");
});
app.use(notFoundErrorHandler);
app.use(genericErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
