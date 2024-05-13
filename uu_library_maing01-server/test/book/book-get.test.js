const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
  });
});

afterEach(async () => {
  await TestHelper.teardown();
});

const AuthorDtoIn = {
  name: "Ivan",
  surname: "Sheremeta",
  birthDate: 1999,
  originCountry: "Ukraine",
};

const LocationDtoIn = {
  name: "Homeplace",
  capacity: 100,
};

describe("uuCmd book/get", () => {
  test("Access denied - not authorize", async () => {
    try {
      await TestHelper.executeGetCommand("book/get", {
        id: "60f1b8f3d2c1b5a8d3c4f7f1",
      });
    } catch (e) {
      expect(e.code).toEqual("uu-appg01/authorization/accessDenied");
      expect(e.paramMap).toEqual(undefined);
      expect(e.status).toEqual(403);
    }
  });
  test("All data correct Authorities", async () => {
    await TestHelper.login("Authorities");

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );

    const dtoIn = {
      name: "First Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
    };

    const book = await TestHelper.executePostCommand("book/create", dtoIn);

    const dtoOut = await TestHelper.executeGetCommand("book/get", {
      id: book.id,
    });

    expect(dtoOut.data.name).toEqual(dtoIn.name);
    expect(dtoOut.data.authorIdList).toEqual(dtoIn.authorIdList);
    expect(dtoOut.data.yearOfPublication).toEqual(dtoIn.yearOfPublication);
    expect(dtoOut.data.locationId).toEqual(dtoIn.locationId);
  });
  test("Book not found", async () => {
    await TestHelper.login("Authorities");

    try {
      await TestHelper.executeGetCommand("book/get", {
        id: "60f1b8f3d2c1b5a8d3c4f7f1",
      });
    } catch (e) {
      expect(e.code).toEqual("uu-library-main/book/get/bookDoesNotExist");
      expect(e.paramMap).toEqual({ bookId: "60f1b8f3d2c1b5a8d3c4f7f1" });
      expect(e.status).toEqual(400);
    }
  });
  test("Invalid dtoIn", async () => {
    await TestHelper.login("Authorities");

    try {
      await TestHelper.executeGetCommand("book/get", {});
    } catch (e) {
      expect(e.code).toEqual("uu-library-main/book/get/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });
});
