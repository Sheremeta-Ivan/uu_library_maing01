"use strict";
const LibraryMainAbl = require("../../abl/library-main-abl.js");

class LibraryMainController {
  init(ucEnv) {
    return LibraryMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return LibraryMainAbl.load(ucEnv.getUri(), ucEnv.getSession());
  }

  loadBasicData(ucEnv) {
    return LibraryMainAbl.loadBasicData(ucEnv.getUri(), ucEnv.getSession());
  }
}

module.exports = new LibraryMainController();
