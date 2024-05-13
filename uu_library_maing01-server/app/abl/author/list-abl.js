"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../../api/errors/author-error").List;
const Warnings = require("../../api/warnings/author-warning").List;
const { Schemas } = require("../constants");

const DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.AUTHOR);
  }

  async list(awid, dtoIn) {
    let uuAppErrorMap = {};

    // hds 1
    const validationResult = this.validator.validate(
      "authorListDtoInType",
      dtoIn,
    );

    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UnsupportedKeys.code,
      Errors.InvalidDtoIn,
    );

    if (!dtoIn.sortBy) dtoIn.sortBy = DEFAULTS.sortBy;
    if (!dtoIn.order) dtoIn.order = DEFAULTS.order;
    if (!dtoIn.pageInfo) dtoIn.pageInfo = {};
    if (!dtoIn.pageInfo.pageSize) dtoIn.pageInfo.pageSize = DEFAULTS.pageSize;
    if (!dtoIn.pageInfo.pageIndex)
      dtoIn.pageInfo.pageIndex = DEFAULTS.pageIndex;

    const authors = await this.dao.list(
      awid,
      dtoIn.sortBy,
      dtoIn.order,
      dtoIn.pageInfo,
    );

    return {
      ...authors,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
