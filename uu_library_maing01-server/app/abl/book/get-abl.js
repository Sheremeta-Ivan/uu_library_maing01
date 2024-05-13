"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../../api/errors/book-error").Get;
const Warnings = require("../../api/warnings/book-warning").Get;
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Library } = require("../constants");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.BOOK);
  }

  async get(awid, dtoIn, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const validationResult = this.validator.validate("bookGetDtoInType", dtoIn);

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UnsupportedKeys.code,
      Errors.InvalidDtoIn,
    );

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([
        Library.States.ACTIVE,
        Library.States.UNDER_CONSTRUCTION,
        Library.States.CLOSED,
      ]),
      [Profiles.EXECUTIVES]: new Set([
        Library.States.ACTIVE,
        Library.States.UNDER_CONSTRUCTION,
      ]),
      [Profiles.READERS]: new Set([Library.States.ACTIVE]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors,
      uuAppErrorMap,
    );

    //hds 3
    const book = await this.dao.get(awid, dtoIn.id);
    if (!book) {
      throw new Errors.BookDoesNotExist(uuAppErrorMap, { bookId: dtoIn.id });
    }

    //hds 4
    return {
      ...book,
      uuAppErrorMap,
    };
  }
}

module.exports = new GetAbl();
