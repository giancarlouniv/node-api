const User = require("../models/User.model");
const UserResource = require("../resources/User.resource");

class UserController {
  static async index(req, res) {
    User.index((err, result) => {
      if (err) {
        return res.status(400).send({ msg: err });
      }
      res.json(UserResource.resourceItems(result));
    });
  }

  static async show(req, res) {
    User.show(req.params.id, (err, result) => {
      if (err) {
        return res.status(400).send({ msg: err });
      }
      res.json(UserResource.resourceItems(result));
    });
  }
}

module.exports = UserController;
