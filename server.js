//Belron\server.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const chatbotRoutes = require("./routes/chatbotRoutes");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const feedbackRoutes = require("./routes/feedback");

const app = express();
app.use(fileUpload()); 

app.use(cookieParser());

app.use("/api", feedbackRoutes);

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use("/", chatbotRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
