const db = require("../utils/db");

module.exports = {
  index: (callback) => {
    db.query("SELECT * FROM users", (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
  show: (id, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
};
