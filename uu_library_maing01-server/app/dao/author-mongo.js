"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;
const { ObjectId } = require("bson");

class AuthorMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async update(uuObject) {
    let filter = { id: uuObject.id, awid: uuObject.awid };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    return await super.deleteOne({ awid, id });
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async getBySurname(awid, surname) {
    return await super.findOne({ awid, surname });
  }

  async getByAwid(awid) {
    return await super.findOne({ awid });
  }

  async listByIdList(awid, authorIdList) {
    const filter = {
      _id: {
        $in: authorIdList.map((id) => new ObjectId(id)),
      },
    };
    return await super.find(filter);
  }

  async list(awid, sortBy, order, pageInfo) {
    const filter = { awid };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = AuthorMongo;
