"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/location-error").Get;
const Warnings = require("../../api/warnings/location-warning").Get;
const { Schemas } = require("../constants");

class GetAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async get(awid, dtoIn) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate(
      "locationGetDtoInType",
      dtoIn,
    );
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UnsupportedKeys.code,
      Errors.InvalidDtoIn,
    );

    const location = await this.dao.get(awid, dtoIn.id);
    if (!location) {
      throw new Errors.LocationDoesNotExist(
        { uuAppErrorMap },
        { locationId: dtoIn.id },
      );
    }

    return {
      ...location,
      uuAppErrorMap,
    };
  }
}

module.exports = new GetAbl();
