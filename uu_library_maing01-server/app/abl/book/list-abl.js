"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;

const Errors = require("../../api/errors/book-error").List;
const Warnings = require("../../api/warnings/book-warning").List;
const InstanceChecker = require("../../component/instance-checker");
const { Profiles, Schemas, Library } = require("../constants");

const DEFAULTS = {
  sortBy: "name",
  order: "asc",
  pageIndex: 0,
  pageSize: 100,
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.BOOK);
  }

  async list(awid, dtoIn, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const validationResult = this.validator.validate(
      "bookListDtoInType",
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

    // hds 3
    let list;
    if (!dtoIn.authorIdList && !dtoIn.locationId) {
      list = await this.dao.list(
        awid,
        dtoIn.sortBy,
        dtoIn.order,
        dtoIn.pageInfo,
      );
    } else if (dtoIn.locationId && !dtoIn.authorIdList) {
      list = await this.dao.listByLocationId(
        awid,
        dtoIn.locationId,
        dtoIn.sortBy,
        dtoIn.order,
        dtoIn.pageInfo,
      );
    } else if (dtoIn.authorIdList && !dtoIn.locationId) {
      list = await this.dao.listByAuthorIdList(
        awid,
        dtoIn.authorIdList,
        dtoIn.sortBy,
        dtoIn.order,
        dtoIn.pageInfo,
      );
    } else {
      list = await this.dao.listByLocationIdAndAuthorIdList(
        awid,
        dtoIn.locationId,
        dtoIn.authorIdList,
        dtoIn.sortBy,
        dtoIn.order,
        dtoIn.pageInfo,
      );
    }

    // hds 4
    return {
      ...list,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
