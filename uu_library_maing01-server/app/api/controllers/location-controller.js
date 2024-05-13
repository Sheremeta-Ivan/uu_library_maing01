const CreateAbl = require("../../abl/location/create-abl");
const GetAbl = require("../../abl/location/get-abl");
const UpdateAbl = require("../../abl/location/update-abl");
const DeleteAbl = require("../../abl/location/delete-abl");
const ListAbl = require("../../abl/location/list-abl");

class LocationController {
  static create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  static get(ucEnv) {
    return GetAbl.get(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  static update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  static delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
  static list(ucEnv) {
    return ListAbl.list(ucEnv.getUri().getAwid(), ucEnv.getDtoIn());
  }
}

module.exports = LocationController;
