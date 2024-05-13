"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/author-error").Create;
const Warnings = require("../../api/warnings/author-warning").Create;
const { Schemas } = require("../constants");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.AUTHOR);
  }

  async create(awid, dtoIn) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate(
      "authorCreateDtoInType",
      dtoIn,
    );
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UnsupportedKeys.code,
      Errors.InvalidDtoIn,
    );

    const uuObject = {
      ...dtoIn,
    };

    if (dtoIn.surname) {
      let author = await this.dao.getBySurname(awid, dtoIn.surname);
      if (author) {
        throw new Errors.AuthorAlreadyExists({ uuAppErrorMap });
      }
    }

    uuObject.awid = awid;
    let author;
    try {
      author = await this.dao.create(uuObject);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.CreateAuthorDaoFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    return {
      ...author,
      uuAppErrorMap,
    };
  }
}

module.exports = new CreateAbl();
