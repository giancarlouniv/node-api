const fetch = require("node-fetch");
require("dotenv").config();
const logger = require("../utils/logger");

const method_name = "login";

const login = async (api_key) => {
  let error_obj = {
    status: false,
    message: "Login failed",
  };

  try {
    const response = await fetch(process.env.SF_LOGIN, {
      method: "POST",
    });
    const { status } = response;
    const data = await response.json();

    if (status !== 200) {
      logger(data, api_key, method_name);
      return error_obj;
    }

    return {
      status: true,
      message: "Login success",
      data: data,
    };
  } catch (error) {
    return error_obj;
  }
};

module.exports = login;
