const fs = require("fs");
const moment = require("Moment");

moment.locale("it");

const logger = (msg, API_KEY, method) => {
  const filename = moment().format("YYYY_MM_DD") + ".txt";
  const log = `${moment().format("HH:mm:ss")} - METODO: ${method} - API_KEY: ${API_KEY} - MSG: ${JSON.stringify(msg)} \n`;

  fs.appendFile("./logs/" + filename, log, (err) => {
    if (err) throw err;
  });

  
};

module.exports = logger;
