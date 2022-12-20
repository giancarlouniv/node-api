const request = require("request");
const fs = require("fs");
const sf_login = require("./sf_login");

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

module.exports = function (req, res) {

  const token = fs.readFileSync("./token.txt", "utf8");
  const instance_url = fs.readFileSync("./instance_url.txt", "utf8");

  const accountType = req.body.AccountType__c;

  let query = "";

  if (Object.keys(req.body).length < 2) {
    res.json({ message: "Missing parameters", status: "ko" }, 400);
    return;
  }

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
  }

  const url = instance_url + "/services/data/v55.0/query/?q=" + query;

  var headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };

  request.get(url, { headers: headers }, function (error, response, body) {
    res.send(JSON.parse(body).records);
  });
};
