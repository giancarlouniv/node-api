const db = require("./db");
const logger = require("./logger");

const method_name = "check_api_key";

const check_api_key = (api_key) => {
  const ris = db.query(
    "SELECT * FROM users WHERE api_key = ?",
    [api_key],
    async (err, result) => {
      if (err) {
        logger("Error checking api_key", api_key, method_name);
        console.log(err);
      }
      // by vincent
      return result.length > 0;
    }
  );
};

module.exports = check_api_key;
