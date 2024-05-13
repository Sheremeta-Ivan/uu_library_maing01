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

describe("uuCmd book/delete", () => {
  test("Access denied - not authorized", async () => {
    try {
      await TestHelper.executePostCommand("book/delete", {
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

    const dtoInDelete = {
      id: book.id,
    };

    const dtoOut = await TestHelper.executePostCommand(
      "book/delete",
      dtoInDelete,
    );

    expect(dtoOut.data).toEqual({ uuAppErrorMap: {} });
  });
  test("Book does not exist", async () => {
    await TestHelper.login("Authorities");

    try {
      await TestHelper.executePostCommand("book/delete", {
        id: "60f1b8f3d2c1b5a8d3c4f7f1",
      });
    } catch (e) {
      expect(e.code).toEqual("uu-library-main/book/delete/bookDoesNotExist");
      expect(e.paramMap).toEqual({ bookId: "60f1b8f3d2c1b5a8d3c4f7f1" });
      expect(e.status).toEqual(400);
    }
  });
  test("Binary delete failed", async () => {
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

    const book = await TestHelper.executePostCommand("book/create", dtoIn);

    try {
      await TestHelper.executePostCommand("book/delete", {
        id: book.id,
      });
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/delete/uuBinaryDeleteFailed",
      );
      expect(e.paramMap).toEqual({});
      expect(e.status).toEqual(500);
    }
  });
});
