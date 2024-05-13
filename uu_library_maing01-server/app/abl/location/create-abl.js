"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/location-error").Create;
const Warnings = require("../../api/warnings/location-warning").Create;
const { Schemas } = require("../constants");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async create(awid, dtoIn) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate(
      "locationCreateDtoInType",
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

    if (dtoIn.name) {
      let location = await this.dao.getByName(awid, dtoIn.name);
      if (location) {
        throw new Errors.LocationAlreadyExists({ uuAppErrorMap });
      }
    }

    uuObject.awid = awid;
    let location;
    try {
      location = await this.dao.create(uuObject);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.LocationDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    return {
      ...location,
      uuAppErrorMap,
    };
  }
}

module.exports = new CreateAbl();
