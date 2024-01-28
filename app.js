require("dotenv").config();

const express = require("express");
const app = express();
const router = require("./src/routes");
const db = require("./models");
const message = require("./config/message");
var port = process.env.PORT || 4040;

db.sequelizeSync();

app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: false }));
app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));
app.use("/", router);

app.all("*", function (req, res) {
  return res
    .status(message["404_NOT_FOUND"].status)
    .send(message["404_NOT_FOUND"]);
});

app.listen(port, function () {
  console.log(`Server is listening at localhost:{$port}`);
});
