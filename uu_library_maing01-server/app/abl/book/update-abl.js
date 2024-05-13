"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } =
  require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { UuBinaryAbl } = require("uu_appg01_binarystore-cmd");
const Errors = require("../../api/errors/book-error").Update;
const Warnings = require("../../api/warnings/book-warning").Update;
const InstanceChecker = require("../../component/instance-checker");
const Book = require("../../component/book-utils");
const { Profiles, Schemas, Library } = require("../constants");

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao(Schemas.BOOK);
  }

  async update(awid, dtoIn, session, authorizationResult) {
    let uuAppErrorMap = {};
    const defaultImage = await Book.getDefaultImage(awid);

    // hds 1
    const validationResult = this.validator.validate(
      "bookUpdateDtoInType",
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
    if (dtoIn.coverImage && dtoIn.deleteCoverImage) {
      throw new Errors.InvalidInputCombination({ uuAppErrorMap });
    }
    // hds 3
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

    // hds 4
    const book = await this.dao.get(awid, dtoIn.id);
    if (!book) {
      throw new Errors.BookDoesNotExist(
        { uuAppErrorMap },
        { bookId: dtoIn.id },
      );
    }

    // hds 5
    const toUpdate = { ...dtoIn };
    if (dtoIn.authorIdList) {
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

      toUpdate.authorIdList = validAuthors;
    }

    // hds 6
    if (dtoIn.locationId) {
      toUpdate.locationId = await Book.checkLocationExistence(
        awid,
        dtoIn.locationId,
        Errors,
        uuAppErrorMap,
      );
    }

    // hds 7
    if (dtoIn.locationId) {
      await Book.checkFreeCapacity(
        awid,
        dtoIn.locationId,
        Errors,
        uuAppErrorMap,
      );
    }

    // hds 8
    if (dtoIn.coverImage) {
      let binary;
      const coverImage = await Book.checkAndGetImageAsStream(
        dtoIn.coverImage,
        Errors.Update,
        uuAppErrorMap,
      );

      if (!book.coverImage || defaultImage === book.coverImage) {
        try {
          binary = await UuBinaryAbl.createBinary(awid, {
            data: coverImage,
            filename: dtoIn.coverImage.filename,
            contentType: dtoIn.coverImage.contentType,
          });
        } catch (e) {
          throw new Errors.Update.UuBinaryCreateFailed({ uuAppErrorMap }, e);
        }
      } else {
        try {
          binary = await UuBinaryAbl.updateBinaryData(awid, {
            data: coverImage,
            code: book.coverImage,
            filename: dtoIn.coverImage.filename,
            contentType: dtoIn.coverImage.contentType,
            revisionStrategy: "NONE",
          });
        } catch (e) {
          throw new Errors.Update.UuBinaryUpdateBinaryDataFailed(
            { uuAppErrorMap },
            e,
          );
        }
      }
      toUpdate.coverImage = binary.code;
    }

    // hds 9
    if (dtoIn.deleteCoverImage && book.coverImage) {
      if (defaultImage !== book.coverImage) {
        try {
          await UuBinaryAbl.deleteBinary(awid, {
            code: book.coverImage,
            forceDelete: true,
          });
        } catch (e) {
          throw new Errors.Update.UuBinaryDeleteFailed({ uuAppErrorMap }, e);
        }
      }
      toUpdate.coverImage = defaultImage;
    }

    // hds 10
    toUpdate.awid = awid;
    let updatedBook;
    try {
      updatedBook = await this.dao.update(toUpdate);
    } catch (e) {
      if (e instanceof ObjectStoreError) {
        throw new Errors.BookDaoUpdateFailed({ uuAppErrorMap }, e);
      }
      throw e;
    }

    return {
      ...updatedBook,
      uuAppErrorMap,
    };
  }
}

module.exports = new UpdateAbl();
