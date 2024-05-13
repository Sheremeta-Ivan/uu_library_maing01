"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");
const Errors = require("../../api/errors/book-error").Create;
const Warnings = require("../../api/warnings/book-warning").Create;
const InstanceChecker = require("../../component/instance-checker");
const Book = require("../../component/book-utils");
const { Profiles, Schemas, Library } = require("../constants");

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.BOOK);
  }

  async create(awid, dtoIn, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const validationResult = this.validator.validate(
      "bookCreateDtoInType",
      dtoIn,
    );
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      uuAppErrorMap,
      Warnings.UnsupportedKeys.CODE,
      Errors.InvalidDtoIn,
    );

    const uuObject = {
      ...dtoIn,
      yearOfPublication: dtoIn.yearOfPublication || null,
      coverImage: "",
    };

    // hds 2
    const allowedStateRules = {
      [Profiles.AUTHORITIES]: new Set([
        Library.States.ACTIVE,
        Library.States.UNDER_CONSTRUCTION,
      ]),
      [Profiles.EXECUTIVES]: new Set([
        Library.States.ACTIVE,
        Library.States.UNDER_CONSTRUCTION,
      ]),
    };

    await InstanceChecker.ensureInstanceAndState(
      awid,
      allowedStateRules,
      authorizationResult,
      Errors,
      uuAppErrorMap,
    );

    // hds 3
    if (dtoIn.authorIdList && dtoIn.authorIdList.length) {
      const { validAuthors, invalidAuthors } = await Book.checkAuthorExistence(
        awid,
        dtoIn.authorIdList,
      );

      if (invalidAuthors.length > 0) {
        ValidationHelper.addWarning(
          uuAppErrorMap,
          Warnings.SomeAuthorsDoesNotExist.code,
          Warnings.SomeAuthorsDoesNotExist.message,
          { authorIdList: invalidAuthors },
        );
      }

      if (validAuthors.length === 0) {
        throw new Errors.AllAuthorsDoNotExist(
          { uuAppErrorMap },
          { authorId: dtoIn.authorIdList },
        );
      }

      uuObject.authorIdList = validAuthors;
    }

    // hds 4
    if (dtoIn.locationId) {
      uuObject.locationId = await Book.checkLocationExistence(
        awid,
        dtoIn.locationId,
        Errors,
        uuAppErrorMap,
      );
    }

    // hds 5
    if (dtoIn.locationId) {
      await Book.checkFreeCapacity(
        awid,
        dtoIn.locationId,
        Errors,
        uuAppErrorMap,
      );
    }

    // hds 6
    if (dtoIn.coverImage) {
      const coverImage = await Book.checkAndGetImageAsStream(
        dtoIn.coverImage,
        Errors,
        uuAppErrorMap,
      );

      try {
        const binary = await UuBinaryAbl.createBinary(awid, {
          data: coverImage,
          filename: dtoIn.coverImage.filename,
          contentType: dtoIn.coverImage.contentType,
        });
        uuObject.coverImage = binary.code;
      } catch (e) {
        throw new Errors.UuBinaryCreateFailed({ uuAppErrorMap }, e);
      }
    }

    if (!dtoIn.coverImage) {
      uuObject.coverImage = await Book.getDefaultImage(awid);
    }

    // hds 7
    uuObject.awid = awid;
    let book;
    try {
      book = await this.dao.create(uuObject);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.BookDaoCreateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    return {
      ...book,
      uuAppErrorMap,
    };
  }
}

module.exports = new CreateAbl();
