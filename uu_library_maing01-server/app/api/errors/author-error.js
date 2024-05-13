"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error");
const BOOK_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}author/`;

const Create = {
  UC_CODE: `${BOOK_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  AuthorAlreadyExists: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}authorAlreadyExists`;
      this.message = "Author with the same surname already exists.";
    }
  },
  CreateAuthorDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createDaoFailed`;
      this.message = "Create author by author DAO create failed.";
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
  AuthorDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}authorDoesNotExist`;
      this.message = "Author does not exist.";
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
  AuthorDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}authorDoesNotExist`;
      this.message = "Author does not exist.";
    }
  },
  AuthorDaoUpdateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}updateDaoFailed`;
      this.message = "Update author by author DAO update failed.";
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
  AuthorDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}authorDoesNotExist`;
      this.message = "Author does not exist.";
    }
  },
  DeleteAuthorDaoFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}deleteDaoFailed`;
      this.message = "Delete author by author DAO delete failed.";
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
