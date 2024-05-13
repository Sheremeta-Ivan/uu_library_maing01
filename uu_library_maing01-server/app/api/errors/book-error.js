"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error");
const BOOK_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}book/`;

const Create = {
  UC_CODE: `${BOOK_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryDoesNotExist`;
      this.message = "UuObject library does not exist.";
    }
  },
  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}libraryIsNotInProperState`;
      this.message = "UuObject library is not in proper state.";
    }
  },
  AllAuthorsDoNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}allAuthorsDoNotExist`;
      this.message = "All selected authors do not exist.";
    }
  },
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationDoesNotExist`;
      this.message = "Selected location does not exist.";
    }
  },
  LocationIsFull: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsFull`;
      this.message = "The given location is full.";
    }
  },
  InvalidImage: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidImage`;
      this.message = "The image is invalid or it is not an image.";
    }
  },
  UuBinaryCreateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuBinaryCreateFailed`;
      this.message = "Create uuBinary Failed.";
    }
  },
  BookDaoCreateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}bookDaoCreateFailed`;
      this.message = "Create book by book DAO create failed.";
    }
  },
};

const Get = {
  UC_CODE: `${BOOK_ERROR_PREFIX}get/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}libraryDoesNotExist`;
      this.message = "UuObject library does not exist.";
    }
  },
  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}libraryIsNotInProperState`;
      this.message = "UuObject library is not in proper state.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
};

const List = {
  UC_CODE: `${BOOK_ERROR_PREFIX}list/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}libraryDoesNotExist`;
      this.message = "UuObject library does not exist.";
    }
  },
  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}libraryIsNotInProperState`;
      this.message = "UuObject library is not in proper state.";
    }
  },
};

const Update = {
  UC_CODE: `${BOOK_ERROR_PREFIX}update/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  InvalidInputCombination: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidInputCombination`;
      this.message =
        "Invalid input combination - it is not possible to update and delete the image at the same time.";
    }
  },
  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}libraryDoesNotExist`;
      this.message = "UuObject library does not exist.";
    }
  },
  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}libraryIsNotInProperState`;
      this.message = "UuObject library is not in proper state.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  AllAuthorsDoNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}allAuthorsDoNotExist`;
      this.message = "All selected authors do not exist.";
    }
  },
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}locationDoesNotExist`;
      this.message = "Selected location does not exist.";
    }
  },
  LocationIsFull: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}locationIsFull`;
      this.message = "The given location is full.";
    }
  },
  InvalidImage: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidImage`;
      this.message = "The image is invalid or it is not an image.";
    }
  },
  UuBinaryCreateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuBinaryCreateFailed`;
      this.message = "Create uuBinary Failed.";
    }
  },
  UuBinaryUpdateBinaryDataFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}uuBinaryUpdateBinaryDataFailed`;
      this.message = "Update uuBinary data failed.";
    }
  },
  BookDaoUpdateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}bookDaoUpdateFailed`;
      this.message = "Update book by book DAO update failed.";
    }
  },
};

const Delete = {
  UC_CODE: `${BOOK_ERROR_PREFIX}delete/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LibraryDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}libraryDoesNotExist`;
      this.message = "UuObject library does not exist.";
    }
  },
  LibraryIsNotInProperState: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}libraryIsNotInProperState`;
      this.message = "UuObject library is not in proper state.";
    }
  },
  BookDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}bookDoesNotExist`;
      this.message = "Book does not exist.";
    }
  },
  uuBinaryDeleteFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}uuBinaryDeleteFailed`;
      this.message = "Delete uuBinary failed.";
    }
  },
  DeleteBookDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}deleteDaoFailed`;
      this.message = "Delete book by book DAO delete failed.";
    }
  },
};

module.exports = {
  Create,
  Get,
  List,
  Update,
  Delete,
};
