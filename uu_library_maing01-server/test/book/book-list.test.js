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

describe("uuCmd book/list", () => {
  test("Access denied - not authorized", async () => {
    try {
      await TestHelper.executeGetCommand("book/list");
    } catch (e) {
      expect(e.code).toEqual("uu-appg01/authorization/accessDenied");
      expect(e.paramMap).toEqual(undefined);
      expect(e.status).toEqual(403);
    }
  });
  test("All data correct Authorities", async () => {
    await TestHelper.login("Authorities");

    const AuthorDtoIn = {
      name: "Ivan",
      surname: "Sheremeta",
      birthDate: 1999,
      originCountry: "Ukraine",
    };

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const LocationDtoIn = {
      name: "Homeplace",
      capacity: 100,
    };

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );

    const dtoIn1 = {
      name: "First Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
    };
    const dtoIn2 = {
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2023,
      locationId: location.id,
    };
    const dtoIn3 = {
      name: "Third Book",
      authorIdList: [author.id],
      yearOfPublication: 2020,
      locationId: location.id,
    };

    const book1 = await TestHelper.executePostCommand("book/create", dtoIn1);
    const book2 = await TestHelper.executePostCommand("book/create", dtoIn2);
    const book3 = await TestHelper.executePostCommand("book/create", dtoIn3);

    const result = await TestHelper.executeGetCommand("book/list");
    expect(result.data.pageInfo.total).toEqual(3);
    expect(result.data.pageInfo.pageIndex).toEqual(0);
    expect(result.data.pageInfo.pageSize).toEqual(100);
  });
  test("List by location", async () => {
    await TestHelper.login("Authorities");

    const AuthorDtoIn = {
      name: "Ivan",
      surname: "Sheremeta",
      birthDate: 1999,
      originCountry: "Ukraine",
    };

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const LocationDtoIn = {
      name: "Homeplace",
      capacity: 100,
    };

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );

    const dtoIn1 = {
      name: "First Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
    };

    const dtoIn2 = {
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2023,
      locationId: location.id,
    };

    const dtoIn3 = {
      name: "Third Book",
      authorIdList: [author.id],
      yearOfPublication: 2020,
      locationId: location.id,
    };

    const book1 = await TestHelper.executePostCommand("book/create", dtoIn1);
    const book2 = await TestHelper.executePostCommand("book/create", dtoIn2);
    const book3 = await TestHelper.executePostCommand("book/create", dtoIn3);

    const result = await TestHelper.executeGetCommand("book/list", {
      locationId: location.id,
    });

    expect(result.data.pageInfo.total).toEqual(3);
    expect(result.data.pageInfo.pageIndex).toEqual(0);
    expect(result.data.pageInfo.pageSize).toEqual(100);
  });
  test("List by author", async () => {
    await TestHelper.login("Authorities");

    const AuthorDtoIn = {
      name: "Ivan",
      surname: "Sheremeta",
      birthDate: 1999,
      originCountry: "Ukraine",
    };

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const LocationDtoIn = {
      name: "Homeplace",
      capacity: 100,
    };

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );

    const dtoIn1 = {
      name: "First Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
    };

    const dtoIn2 = {
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2023,
      locationId: location.id,
    };

    const dtoIn3 = {
      name: "Third Book",
      authorIdList: [author.id],
      yearOfPublication: 2020,
      locationId: location.id,
    };

    const book1 = await TestHelper.executePostCommand("book/create", dtoIn1);
    const book2 = await TestHelper.executePostCommand("book/create", dtoIn2);
    const book3 = await TestHelper.executePostCommand("book/create", dtoIn3);

    const result = await TestHelper.executeGetCommand("book/list", {
      authorIdList: [author.id],
    });

    expect(result.data.pageInfo.total).toEqual(3);
    expect(result.data.pageInfo.pageIndex).toEqual(0);
    expect(result.data.pageInfo.pageSize).toEqual(100);
  });
  test("List by author and location", async () => {
    await TestHelper.login("Authorities");

    const AuthorDtoIn = {
      name: "Ivan",
      surname: "Sheremeta",
      birthDate: 1999,
      originCountry: "Ukraine",
    };

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const LocationDtoIn = {
      name: "Homeplace",
      capacity: 100,
    };

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );

    const dtoIn1 = {
      name: "First Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
    };

    const dtoIn2 = {
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2023,
      locationId: location.id,
    };

    const dtoIn3 = {
      name: "Third Book",
      authorIdList: [author.id],
      yearOfPublication: 2020,
      locationId: location.id,
    };

    const book1 = await TestHelper.executePostCommand("book/create", dtoIn1);
    const book2 = await TestHelper.executePostCommand("book/create", dtoIn2);
    const book3 = await TestHelper.executePostCommand("book/create", dtoIn3);

    const result = await TestHelper.executeGetCommand("book/list", {
      authorIdList: [author.id],
      locationId: location.id,
    });

    expect(result.data.pageInfo.total).toEqual(3);
    expect(result.data.pageInfo.pageIndex).toEqual(0);
    expect(result.data.pageInfo.pageSize).toEqual(100);
  });
});
