const express = require("express");
const app = express();
const login = require("./api/login");
const search = require("./api/search");
const find = require("./api/find");

const db = require("./utils/db");

require("dotenv").config();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/login", async (req, res) => {
  res.json(await login());
});

app.post("/search", async (req, res) => {
  res.json(await search(req, res));
});

app.post("/find", async (req, res) => {
  res.json(await find(req, res));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
