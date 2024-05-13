const Errors = require("../errors/book-error.js");

const Warnings = {
  Create: {
    UnsupportedKeys: {
      code: `${Errors.Create.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
    SomeAuthorsDoesNotExist: {
      code: `${Errors.Create.UC_CODE}someAuthorsDoesNotExist`,
      message: "One or more authors with given id do not exist.",
    },
  },
  Get: {
    UnsupportedKeys: {
      code: `${Errors.Get.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
  List: {
    UnsupportedKeys: {
      code: `${Errors.List.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
  Update: {
    UnsupportedKeys: {
      code: `${Errors.Update.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
    SomeAuthorsDoesNotExist: {
      code: `${Errors.Update.UC_CODE}someAuthorsDoesNotExist`,
      message: "One or more authors with given id do not exist.",
    },
  },
  Delete: {
    UnsupportedKeys: {
      code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
      message: "DtoIn contains unsupported keys.",
    },
  },
};

module.exports = Warnings;
