"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/location-error").Update;
const Warnings = require("../../api/warnings/location-warning").Update;
const { Schemas } = require("../constants");

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async update(awid, dtoIn) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate(
      "locationUpdateDtoInType",
      dtoIn,
    );

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UnsupportedKeys.code,
      Errors.InvalidDtoIn,
    );

    let location = await this.dao.get(awid, dtoIn.id);
    if (!location) {
      throw new Errors.LocationDoesNotExist(
        { uuAppErrorMap },
        { locationId: dtoIn.id },
      );
    }

    const toUpdate = { ...dtoIn, awid };

    let updatedLocation;
    try {
      updatedLocation = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.LocationDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    return {
      ...updatedLocation,
      uuAppErrorMap,
    };
  }
}

module.exports = new UpdateAbl();
