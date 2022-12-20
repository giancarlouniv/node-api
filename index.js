const express = require("express");
const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;

const usersRoute = require("./routes/User.route");

app.use("/users", usersRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
