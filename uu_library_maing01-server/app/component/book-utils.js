//@@viewOn:imports
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Schemas } = require("../abl/constants");
const { Base64 } = require("uu_appg01_server").Utils;
const FileHelper = require("../helpers/file-helper");
//@@viewOff:imports

//@@viewOn:components
class BookUtils {
  constructor() {
    this.authorDao = DaoFactory.getDao(Schemas.AUTHOR);
    this.locationDao = DaoFactory.getDao(Schemas.LOCATION);
    this.bookDao = DaoFactory.getDao(Schemas.BOOK);
    this.libraryDao = DaoFactory.getDao(Schemas.LIBRARY_MAIN);
  }

  async checkAuthorExistence(awid, authorIdList = []) {
    const validAuthors = [];
    const invalidAuthors = [];
    let authorFound;
    const storedAuthors = await this.authorDao.listByIdList(awid, authorIdList);
    authorIdList.forEach((id) => {
      authorFound = storedAuthors.itemList.find(
        (it) => it.id.toString() === id,
      );
      if (authorFound) {
        validAuthors.push(id.toString());
      } else {
        invalidAuthors.push(id.toString());
      }
    });

    return {
      validAuthors: [...new Set(validAuthors)],
      invalidAuthors: [...new Set(invalidAuthors)],
    };
  }

  async checkLocationExistence(awid, locationId, errors, uuAppErrorMap) {
    const location = await this.locationDao.get(awid, locationId);
    if (!location) {
      throw new errors.LocationDoesNotExist({ uuAppErrorMap }, { locationId });
    } else {
      return location.id;
    }
  }

  async checkFreeCapacity(awid, locationId, errors, uuAppErrorMap) {
    const location = await this.locationDao.get(awid, locationId);
    const countOfBooks = await this.bookDao.getCountByLocationId(
      awid,
      locationId,
    );
    if (countOfBooks >= location.capacity) {
      throw new errors.LocationIsFull(
        { uuAppErrorMap },
        { locationId, capacity: location.capacity },
      );
    }
  }

  async checkAndGetImageAsStream(image, errors, uuAppErrorMap) {
    let streamToReturn;
    //check if stream or base64
    if (image.readable) {
      //check if the stream is valid
      const { valid: isValidStream, stream } =
        await FileHelper.validateImageStream(image);
      if (!isValidStream) {
        throw new errors.InvalidImage({ uuAppErrorMap });
      }
      streamToReturn = stream;
    } else {
      //check if the base64 is valid
      let binaryBuffer = Base64.urlSafeDecode(image, "binary");
      if (!FileHelper.validateImageBuffer(binaryBuffer).valid) {
        throw new errors.InvalidImage({ uuAppErrorMap });
      }

      streamToReturn = FileHelper.toStream(binaryBuffer);
    }

    return streamToReturn;
  }

  async getDefaultImage(awid) {
    const library = await this.libraryDao.getByAwid(awid);
    return library.defaultImage;
  }
}
//@@viewOff:components

//@@viewOn:exports
module.exports = new BookUtils();
//@@viewOff:exports
