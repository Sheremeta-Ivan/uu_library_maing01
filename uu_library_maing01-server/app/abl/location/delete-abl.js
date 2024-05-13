"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/location-error").Delete;
const Warnings = require("../../api/warnings/location-warning").Delete;
const { Schemas } = require("../constants");

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.LOCATION);
  }

  async delete(awid, dtoIn) {
    let uuAppErrorMap = {};

    const validationResult = this.validator.validate(
      "locationDeleteDtoInType",
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

    try {
      await this.dao.delete(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.LocationDaoDeleteFailed(
          { uuAppErrorMap },
          { cause: e },
        );
      }
      throw e;
    }

    return {
      uuAppErrorMap,
    };
  }
}

module.exports = new DeleteAbl();
