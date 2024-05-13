"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/author-error").Update;
const Warnings = require("../../api/warnings/author-warning").Update;
const { Schemas } = require("../constants");

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.AUTHOR);
  }

  async update(awid, dtoIn) {
    let uuAppErrorMap = {};

    // hds 1
    const validationResult = this.validator.validate(
      "authorUpdateDtoInType",
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
      throw new Errors.AuthorDoesNotExist(uuAppErrorMap, {
        authorId: dtoIn.id,
      });
    }

    // hds 2
    const toUpdate = { ...dtoIn, awid };

    let updatedAuthor;
    try {
      updatedAuthor = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.AuthorDaoUpdateFailed(uuAppErrorMap, { cause: e });
      }
      throw e;
    }

    // hds 3
    return { ...updatedAuthor, uuAppErrorMap };
  }
}

module.exports = new UpdateAbl();
