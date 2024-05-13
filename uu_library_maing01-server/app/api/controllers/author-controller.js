const CreateAbl = require("../../abl/author/create-abl");
const GetAbl = require("../../abl/author/get-abl");
const ListAbl = require("../../abl/author/list-abl");
const UpdateAbl = require("../../abl/author/update-abl");
const DeleteAbl = require("../../abl/author/delete-abl");

class AuthorController {
  static create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  static get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  static update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }

  static delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = AuthorController;
