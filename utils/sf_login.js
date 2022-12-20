const request = require("request");
const fs = require("fs");
require("dotenv").config();

module.exports = function () {
  request.post(process.env.SF_LOGIN, function (error, response, body) {
    const token = JSON.parse(body).access_token;
    fs.writeFile("./token.txt", token, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

    const instance_url = JSON.parse(body).instance_url;
    fs.writeFile("./instance_url.txt", instance_url, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });
  });
};
