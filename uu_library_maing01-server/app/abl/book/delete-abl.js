"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");

const Errors = require("../../api/errors/book-error").Delete;
const Warnings = require("../../api/warnings/book-warning").Delete;
const InstanceChecker = require("../../component/instance-checker");
const Book = require("../../component/book-utils");
const { Profiles, Schemas, Library } = require("../constants");

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.BOOK);
  }

  async delete(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};

    // hds 1
    const validationResult = this.validator.validate(
      "bookDeleteDtoInType",
      dtoIn,
    );

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
    const book = await this.dao.get(awid, dtoIn.id);
    if (!book) {
      throw new Errors.BookDoesNotExist(uuAppErrorMap, { bookId: dtoIn.id });
    }

    // hds 4
    if (book.coverImage) {
      const defaultImage = await Book.getDefaultImage(awid);
      if (book.coverImage !== defaultImage) {
        try {
          await UuBinaryAbl.deleteBinary(awid, { code: book.coverImage });
        } catch (e) {
          if (e instanceof ObjectStoreError) {
            throw new Errors.uuBinaryDeleteFailed(
              { uuAppErrorMap },
              { code: book.coverImage },
            );
          }
          throw e;
        }
      }
    }

    // hds 5
    try {
      await this.dao.delete(awid, dtoIn.id);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.DeleteBookDaoFailed({ uuAppErrorMap }, { cause: e });
      }
      throw e;
    }

    // hds 6
    return { uuAppErrorMap };
  }
}

module.exports = new DeleteAbl();
