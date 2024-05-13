const { TestHelper } = require("uu_appg01_server-test");
const path = require("path");
const fs = require("fs");

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

describe("uuCmd book/create", () => {
  test("Access denied - not authorize", async () => {
    try {
      await TestHelper.executePostCommand("book/create", {
        name: "First Book",
        authorIdList: ["60f1b8f3d2c1b5a8d3c4f7f1"],
        yearOfPublication: 2021,
        locationId: "60f1b8f3d2c1b5a8d3c4f7f1",
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
      locationId: location.id,
      yearOfPublication: 2021,
    };
    const defaultImage =
      "4b98c9fcc77da9a19354f17ccf6325dd9e98aa8f9d158d04e05176c027e1abc4";
    const result = await TestHelper.executePostCommand("book/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.authorIdList).toEqual(dtoIn.authorIdList);
    expect(result.data.locationId).toEqual(dtoIn.locationId);
    expect(result.data.yearOfPublication).toEqual(dtoIn.yearOfPublication);
    expect(result.data.coverImage).toEqual(defaultImage);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});
  });
  test("All data correct Executives", async () => {
    await TestHelper.login("Executives");

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
      locationId: location.id,
      yearOfPublication: 2021,
    };
    const defaultImage =
      "4b98c9fcc77da9a19354f17ccf6325dd9e98aa8f9d158d04e05176c027e1abc4";
    const result = await TestHelper.executePostCommand("book/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.authorIdList).toEqual(dtoIn.authorIdList);
    expect(result.data.locationId).toEqual(dtoIn.locationId);
    expect(result.data.yearOfPublication).toEqual(dtoIn.yearOfPublication);
    expect(result.data.coverImage).toEqual(defaultImage);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});
  });
  test("Invalid dtoIn", async () => {
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("book/create", {});
    } catch (e) {
      expect(e.code).toEqual("uu-library-main/book/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(3);
      expect(e.status).toEqual(400);
    }
  });
  test("Location does not exist", async () => {
    await TestHelper.login("Authorities");

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const dtoIn = {
      name: "First Book",
      authorIdList: [author.id],
      locationId: "60f1b8f3d2c1b5a8d3c4f7f1",
      yearOfPublication: 2021,
    };

    try {
      await TestHelper.executePostCommand("book/create", dtoIn);
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/create/locationDoesNotExist",
      );
      expect(e.paramMap.locationId).toEqual("60f1b8f3d2c1b5a8d3c4f7f1");
      expect(e.status).toEqual(400);
    }
  });
  test("Location is full", async () => {
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
      locationId: location.id,
      yearOfPublication: 2021,
    };

    try {
      await TestHelper.executePostCommand("book/create", dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-library-main/book/create/locationIsFull");
      expect(e.paramMap.locationId).toEqual(location.id);
      expect(e.paramMap.capacity).toEqual(location.capacity);
      expect(e.status).toEqual(400);
    }
  });
  test("Author does not exist", async () => {
    await TestHelper.login("Authorities");

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );
    const dtoIn = {
      name: "First Book",
      authorIdList: ["60f1b8f3d2c1b5a8d3c4f7f1"],
      locationId: location.id,
      yearOfPublication: 2021,
    };

    try {
      await TestHelper.executePostCommand("book/create", dtoIn);
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/create/allAuthorsDoNotExist",
      );
      expect(e.paramMap.authorId).toEqual(dtoIn.authorIdList);
      expect(e.status).toEqual(400);
    }
  });
  test("Create book with cover image", async () => {
    await TestHelper.login("Authorities");

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );

    const imagePath = path.resolve(__dirname, "test_files/default_image.png");

    const dtoIn = {
      name: "First Book",
      authorIdList: [author.id],
      locationId: location.id,
      yearOfPublication: 2021,
      coverImage: fs.createReadStream(imagePath),
    };

    const result = await TestHelper.executePostCommand("book/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.authorIdList).toEqual(dtoIn.authorIdList);
    expect(result.data.locationId).toEqual(dtoIn.locationId);
    expect(result.data.yearOfPublication).toEqual(dtoIn.yearOfPublication);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});
    expect(result.data.coverImage).toBeDefined();
  });
});
