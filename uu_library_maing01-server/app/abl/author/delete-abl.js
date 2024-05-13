"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/author-error").Delete;
const Warnings = require("../../api/warnings/author-warning").Delete;
const { Schemas } = require("../constants");

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.AUTHOR);
  }

  async delete(awid, dtoIn) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate(
      "authorDeleteDtoInType",
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

    try {
      await this.dao.delete(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.DeleteAuthorDaoFailed({ uuAppErrorMap }, { cause: e });
      }
      throw e;
    }

    return {
      uuAppErrorMap,
    };
  }
}

module.exports = new DeleteAbl();
