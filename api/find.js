const fetch = require("node-fetch");
require("dotenv").config();
const login = require("./login");
const logger = require("../utils/logger");
const check_api_key = require("../utils/check_api_key");

const method_name = "find";

const find = async (req, res) => {
  const API_KEY = req.body.API_KEY;
  if (!API_KEY) {
    logger("Missing API_KEY", "???API_KEY???", method_name);
    res.status(400).json({ message: "Missing API_KEY", status: false });
    return;
  }

  let checkApiKey = await check_api_key(API_KEY);
  if (!checkApiKey) {
    logger("Invalid API_KEY", API_KEY, method_name);
    res.status(400).json({ message: "Invalid API_KEY", status: false });
    return;
  }

  const login_response = await login(API_KEY);

  if (!login_response.status)
    return { status: "ko", message: login_response.message };

  const token = login_response.data.access_token;
  const instance_url = login_response.data.instance_url;

  const ExternalId__c = req.body.ExternalId__c;

  if (!ExternalId__c) {
    logger("Missing ExternalId__c", API_KEY, method_name);
    res.status(400).json({ message: "Missing ExternalId__c", status: false });
    return;
  }

  // TODO: controllo sulla validità dell'API_KEY

  const USER_NAME = req.body.USER_NAME;
  if (!USER_NAME) {
    logger("Missing USER_NAME", API_KEY, method_name);
    res.status(400).json({ message: "Missing USER_NAME", status: false });
    return;
  }

  const url =
    instance_url +
    "/services/data/v55.0/sobjects/Account/ExternalId__c/" +
    ExternalId__c;

  var headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  let error_obj = {
    status: false,
    message: "Find failed",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    const { status } = response;

    const data = await response.json();

    if (status != 200) {
      logger(data, API_KEY, method_name);
      return error_obj;
    }

    return {
      status: true,
      message: "success",
      data: data,
    };
  } catch (error) {
    return error_obj;
  }
};

module.exports = find;
