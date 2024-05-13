import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";

const Calls = {
  async call(method, url, dtoIn, clientOptions) {
    const response = await Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
    return response.data;
  },

  Book: {
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("book/list");
      return Calls.call("get", commandUri, dtoIn);
    },
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("book/get");
      return Calls.call("get", commandUri, dtoIn);
    },
    getImage(dtoIn) {
      const commandUri = Calls.getCommandUri("uu-app-binarystore/getBinaryData");
      return Calls.call("get", commandUri, dtoIn);
    },
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("book/create");
      return Calls.call("post", commandUri, dtoIn);
    },
    update(dtoIn) {
      const commandUri = Calls.getCommandUri("book/update");
      return Calls.call("post", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("book/delete");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  Location: {
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("location/list");
      return Calls.call("get", commandUri, dtoIn);
    },
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("location/get");
      return Calls.call("get", commandUri, dtoIn);
    },
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("location/create");
      return Calls.call("post", commandUri, dtoIn);
    },
    update(dtoIn) {
      const commandUri = Calls.getCommandUri("location/update");
      return Calls.call("post", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("location/delete");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  Author: {
    list(dtoIn) {
      const commandUri = Calls.getCommandUri("author/list");
      return Calls.call("get", commandUri, dtoIn);
    },
    get(dtoIn) {
      const commandUri = Calls.getCommandUri("author/get");
      return Calls.call("get", commandUri, dtoIn);
    },
    create(dtoIn) {
      const commandUri = Calls.getCommandUri("author/create");
      return Calls.call("post", commandUri, dtoIn);
    },
    update(dtoIn) {
      const commandUri = Calls.getCommandUri("author/update");
      return Calls.call("post", commandUri, dtoIn);
    },
    delete(dtoIn) {
      const commandUri = Calls.getCommandUri("author/delete");
      return Calls.call("post", commandUri, dtoIn);
    },
  },

  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("get", commandUri);
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("get", commandUri);
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  getCommandUri(useCase, baseUri = Environment.appBaseUri) {
    return (!baseUri.endsWith("/") ? baseUri + "/" : baseUri) + (useCase.startsWith("/") ? useCase.slice(1) : useCase);
  },
};

export default Calls;
