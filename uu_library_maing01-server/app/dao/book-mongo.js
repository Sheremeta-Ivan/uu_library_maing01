"use strict";
const { ObjectId } = require("bson");
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class BookMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, locationId: 1 });
    await super.createIndex({ awid: 1, authorIdList: 1 });
    await super.createIndex({ awid: 1, name: 1 });
  }

  async create(uuObject) {
    if (uuObject.authorIdList) {
      uuObject.authorIdList = uuObject.authorIdList.map(
        (authorId) => new ObjectId(authorId),
      );
    }
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async update(uuObject) {
    if (uuObject.authorIdList) {
      uuObject.authorIdList = uuObject.authorIdList.map(
        (authorId) => new ObjectId(authorId),
      );
    }
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }

  async list(awid, sortBy, order, pageInfo) {
    const filter = { awid };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async listByLocationId(awid, locationId, sortBy, order, pageInfo) {
    const filter = {
      awid,
      locationId: new ObjectId(locationId),
    };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async listByAuthorIdList(awid, authorIdList, sortBy, order, pageInfo) {
    const filter = {
      awid,
      authorIdList: {
        $in: authorIdList.map((id) => new ObjectId(id)),
      },
    };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async listByLocationIdAndAuthorIdList(
    awid,
    locationId,
    authorIdList,
    sortBy,
    order,
    pageInfo,
  ) {
    const filter = {
      awid,
      locationId: new ObjectId(locationId),
      authorIdList: {
        $in: authorIdList.map((id) => new ObjectId(id)),
      },
    };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async getCountByLocationId(awid, locationId) {
    return await super.count({ awid, locationId: new ObjectId(locationId) });
  }
}

module.exports = BookMongo;
