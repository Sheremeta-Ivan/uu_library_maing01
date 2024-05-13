"use strict";

const LibraryMainUseCaseError = require("./library-main-use-case-error");
const BOOK_ERROR_PREFIX = `${LibraryMainUseCaseError.ERROR_PREFIX}location/`;

const Create = {
  UC_CODE: `${BOOK_ERROR_PREFIX}create/`,
  InvalidDtoIn: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  LocationAlreadyExists: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationAlreadyExists`;
      this.message = "Location with the same name already exists.";
    }
  },
  LocationDaoCreateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}createDaoFailed`;
      this.message = "Create location by location DAO create failed.";
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
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
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
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
    }
  },
  LocationDaoUpdateFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}updateDaoFailed`;
      this.message = "Update location by location DAO update failed.";
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
  LocationDoesNotExist: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}locationDoesNotExist`;
      this.message = "Location does not exist.";
    }
  },
  LocationDaoDeleteFailed: class extends LibraryMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}deleteDaoFailed`;
      this.message = "Delete location by location DAO delete failed.";
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
