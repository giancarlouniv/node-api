const login = require("./login");
const fetch = require("node-fetch");
const check_lenght = require("../utils/check_lenght");
const logger = require("../utils/logger");
const check_api_key = require("../utils/check_api_key");

const method_name = "search";

/*
  * This is the endpoint that will be called by the Salesforce
    - API_KEY che forniremo noi (chi è il chiamante: P2R, forgeManager, ecc.)
    - NOMINATIVO dell'utente che sta chiamando (nome e cognome) lato applicativo
    - TIPO DI UTENTE DA CERCARE (B2B o B2C)
    - CAMPI RICERCA:
      - B2C:  Nome 			→ FirstName
              Cognome 		→ LastName
              Codice Fiscale 	→ FiscalCode__c
              Mail			→ PersonEmail
              Cellulare		→ PersonMobilePhone
              
      - B2B:  Ragione Sociale 	→ Name
              Partita IVA 		→ VatNumber__c
              Codice Fiscale 	    → FiscalCode__c
              Mail			    → Email__c
              Cellulare		    → Phone
*/

const search = async (req, res) => {
  const API_KEY = req.body.API_KEY;
  if (!API_KEY) {
    logger("Missing API_KEY", "???API_KEY???", method_name);
    res.status(400).json({ message: "Missing API_KEY", status: false });
    return;
  }

  let checkApiKey = check_api_key(API_KEY);
  console.log("checkApiKey", checkApiKey);

  if (!checkApiKey) {
    logger("Invalid API_KEY", API_KEY, method_name);
    res.status(400).json({ message: "Invalid API_KEY", status: false });
    return;
  }

  const login_response = await login(req.body.API_KEY);

  if (!login_response.status)
    return { status: false, message: login_response.message };

  const token = login_response.data.access_token;
  const instance_url = login_response.data.instance_url;

  const accountType = req.body.AccountType__c;

  const USER_NAME = req.body.USER_NAME;
  if (!USER_NAME) {
    logger("Missing USER_NAME", API_KEY, method_name);
    res.status(400).json({ message: "Missing USER_NAME", status: false });
    return;
  }

  if (Object.keys(req.body).length < 4) {
    logger("Missing parameters", API_KEY, method_name);
    res.status(400).json({ message: "Missing parameters", status: false });
    return;
  }

  let query = "";

  Object.keys(req.body).forEach((param) => {
    if (param != "AccountType__c" && param != "USER_NAME")
      if (!check_lenght(req.body[param], 3)) {
        logger("Campi di ricerca non validi", API_KEY, method_name);
        res
          .status(400)
          .json({ message: "Campi di ricerca non validi", status: false });
        return;
      }
  });

  if (accountType === "B2C") {
    query +=
      "SELECT+ExternalId__c,AccountType__c,FirstName,LastName,FiscalCode__c,PersonEmail,PersonMobilePhone,LastModifiedDate+FROM+Account+WHERE+AccountType__c+=+'B2C'";

    if (req.body.FirstName)
      query += "+AND+FirstName+LIKE+'%25" + req.body.FirstName + "%25'";

    if (req.body.LastName)
      query += "+AND+LastName+LIKE+'%25" + req.body.LastName + "%25'";

    if (req.body.FiscalCode__c)
      query += "+AND+FiscalCode__c+LIKE+'%25" + req.body.FiscalCode__c + "%25'";

    if (req.body.PersonEmail)
      query += "+AND+PersonEmail+LIKE+'%25" + req.body.PersonEmail + "%25'";

    query += "+ORDER+BY+LastName+ASC";
  } else if (accountType === "B2B") {
    query +=
      "SELECT+ExternalId__c,AccountType__c,Name,VatNumber__c,FiscalCode__c,Email__c,Phone,LastModifiedDate+FROM+Account+WHERE+AccountType__c+<>+'B2C'";

    if (req.body.Name) query += "+AND+Name+LIKE+'%25" + req.body.Name + "%25'";

    if (req.body.VatNumber__c)
      query += "+AND+VatNumber__c+LIKE+'%25" + req.body.VatNumber__c + "%25'";

    if (req.body.FiscalCode__c)
      query += "+AND+FiscalCode__c+LIKE+'%25" + req.body.FiscalCode__c + "%25'";

    if (req.body.Email__c)
      query += "+AND+Email__c+LIKE+'%25" + req.body.Email__c + "%25'";

    if (req.body.Phone)
      query += "+AND+Phone+LIKE+'%25" + req.body.Phone + "%25'";

    query += "+ORDER+BY+Name+ASC";
  } else {
    logger("AccountType__c non valido", API_KEY, method_name);
    res
      .status(400)
      .json({ message: "AccountType__c non valido", status: false });
    return;
  }

  const url = instance_url + "/services/data/v55.0/query/?q=" + query;

  var headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  let error_obj = {
    status: false,
    message: "Search failed",
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

module.exports = search;
