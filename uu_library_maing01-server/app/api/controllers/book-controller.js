"use strict";
const CreateAbl = require("../../abl/book/create-abl");
const GetAbl = require("../../abl/book/get-abl");
const ListAbl = require("../../abl/book/list-abl");
const UpdateAbl = require("../../abl/book/update-abl");
const DeleteAbl = require("../../abl/book/delete-abl");

class BookController {
  static create(ucEnv) {
    return CreateAbl.create(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getAuthorizationResult(),
    );
  }

  static get(ucEnv) {
    return GetAbl.get(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getAuthorizationResult(),
    );
  }

  static list(ucEnv) {
    return ListAbl.list(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getAuthorizationResult(),
    );
  }

  static update(ucEnv) {
    return UpdateAbl.update(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult(),
    );
  }

  static delete(ucEnv) {
    return DeleteAbl.delete(
      ucEnv.getUri().getAwid(),
      ucEnv.getDtoIn(),
      ucEnv.getSession(),
      ucEnv.getAuthorizationResult(),
    );
  }
}

module.exports = BookController;
