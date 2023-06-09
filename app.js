const express = require("express");
const morgan = require("morgan");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(morgan("dev"));
app.use("/users", userRoutes);

module.exports = app;
