"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/author-error").Get;
const Warnings = require("../../api/warnings/author-warning").Get;
const { Schemas } = require("../constants");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.AUTHOR);
  }

  async get(awid, dtoIn) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate(
      "authorGetDtoInType",
      dtoIn,
    );

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UnsupportedKeys.code,
      Errors.InvalidDtoIn,
    );

    const author = await this.dao.get(awid, dtoIn.id);
    if (!author) {
      throw new Errors.AuthorDoesNotExist(
        { uuAppErrorMap },
        { authorId: dtoIn.id },
      );
    }

    return {
      ...author,
      uuAppErrorMap,
    };
  }
}

module.exports = new GetAbl();
