//@@viewOn:imports
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Schemas } = require("../abl/constants");
//@@viewOff:imports

//@@viewOn:components
class InstanceChecker {
  constructor() {
    this.dao = DaoFactory.getDao(Schemas.LIBRARY_MAIN);
  }

  async ensureInstanceAndState(awid, allowedStateRules, authorizationResult, errors, uuAppErrorMap = {}) {
    // HDS 1
    const library = await this.ensureInstance(awid, errors, uuAppErrorMap);

    // HDS 2
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    // note: the "biggest" profile is always in first position
    const allowedStates = allowedStateRules[authorizedProfiles[0]];

    // HDS 3
    if (!allowedStates.has(library.state)) {
      throw new errors.LibraryIsNotInProperState(
        { uuAppErrorMap },
        {
          awid,
          state: library.state,
          expectedState: Array.from(allowedStates),
        },
      );
    }

    return library;
  }

  async ensureInstance(awid, errors, uuAppErrorMap) {
    // HDS 1
    let library = await this.dao.getByAwid(awid);

    // HDS 2
    if (!library) {
      // 2.1.A
      throw new errors.LibraryDoesNotExist({ uuAppErrorMap }, { awid });
    }

    return library;
  }
}
//@@viewOff:components

//@@viewOn:exports
module.exports = new InstanceChecker();
//@@viewOff:exports
