const express = require("express");
const app = express();
require("dotenv").config();
const sf_login = require("./utils/sf_login");
const sf_search = require("./utils/sf_search");

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
  sf_login();
});

app.post("/search", (req, res) => {
  sf_search(req, res);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
