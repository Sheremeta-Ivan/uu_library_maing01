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

describe("uuCmd book/update", () => {
  test("Access denied - not authorize", async () => {
    try {
      await TestHelper.executePostCommand("book/update", {
        id: "60f1b8f3d2c1b5a8d3c4f7f1",
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
      yearOfPublication: 2021,
      locationId: location.id,
    };

    const book = await TestHelper.executePostCommand("book/create", dtoIn);

    const dtoInUpdate = {
      id: book.id,
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
    };

    const updatedBook = await TestHelper.executePostCommand(
      "book/update",
      dtoInUpdate,
    );

    expect(updatedBook.data.name).toEqual("Second Book");
    expect(updatedBook.data.authorIdList).toEqual([author.id]);
    expect(updatedBook.data.yearOfPublication).toEqual(2021);
    expect(updatedBook.data.locationId).toEqual(location.id);
  });
  test("Invalid dtoIn", async () => {
    await TestHelper.login("Authorities");

    try {
      await TestHelper.executePostCommand("book/update", {});
    } catch (e) {
      expect(e.code).toEqual("uu-library-main/book/update/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.message).toEqual("DtoIn is not valid.");
    }
  });
  test("Invalid combination - delete image", async () => {
    await TestHelper.login("Authorities");

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );

    const imagePathBook = path.resolve(
      __dirname,
      "test_files/default_image.png",
    );

    const dtoIn = {
      name: "First Book",
      authorIdList: [author.id],
      locationId: location.id,
      yearOfPublication: 2021,
      coverImage: fs.createReadStream(imagePathBook),
    };

    const book = await TestHelper.executePostCommand("book/create", dtoIn);
    const imagePathUpdate = path.resolve(
      __dirname,
      "test_files/harry-potter1.jpg",
    );

    const dtoInUpdate = {
      id: book.id,
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
      coverImage: fs.createReadStream(imagePathUpdate),
      deleteCoverImage: true,
    };

    try {
      await TestHelper.executePostCommand("book/update", dtoInUpdate);
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/update/invalidInputCombination",
      );
      expect(e.message).toEqual(
        "Invalid input combination - it is not possible to update and delete the image at the same time.",
      );
      expect(e.status).toEqual(400);
    }
  });
  test("Book does not exist", async () => {
    await TestHelper.login("Authorities");

    const dtoIn = {
      id: "60f1b8f3d2c1b5a8d3c4f7f1",
      name: "First Book",
      authorIdList: ["60f1b8f3d2c1b5a8d3c4f7f1"],
      yearOfPublication: 2021,
      locationId: "60f1b8f3d2c1b5a8d3c4f7f1",
    };

    try {
      await TestHelper.executePostCommand("book/update", dtoIn);
    } catch (e) {
      expect(e.code).toEqual("uu-library-main/book/update/bookDoesNotExist");
      expect(e.paramMap.bookId).toEqual(dtoIn.id);
      expect(e.message).toEqual("Book does not exist.");
    }
  });
  test("All authors do not exist", async () => {
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

    const book = await TestHelper.executePostCommand("book/create", dtoIn);

    const dtoInUpdate = {
      id: book.id,
      name: "Second Book",
      authorIdList: ["60f1b8f3d2c1b5a8d3c4f7f1"],
      yearOfPublication: 2021,
      locationId: location.id,
    };

    try {
      await TestHelper.executePostCommand("book/update", dtoInUpdate);
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/update/allAuthorsDoNotExist",
      );
      expect(e.paramMap.authorId).toEqual(dtoInUpdate.authorIdList);
      expect(e.message).toEqual("All selected authors do not exist.");
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
      expect(e.message).toEqual("Selected location does not exist.");
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
      expect(e.message).toEqual("The given location is full.");
    }
  });
  test("UuBinaryCreateFailed", async () => {
    await TestHelper.login("Authorities");

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );
    const imagePath = path.resolve(__dirname, "test_files/harry-potter1.jpg");
    const dtoIn = {
      name: "First Book",
      authorIdList: [author.id],
      locationId: location.id,
      yearOfPublication: 2021,
      coverImage: fs.createReadStream(imagePath),
    };

    const book = await TestHelper.executePostCommand("book/create", dtoIn);

    const dtoInUpdate = {
      id: book.id,
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
      coverImage: fs.createReadStream(imagePath),
    };

    try {
      await TestHelper.executePostCommand("book/update", dtoInUpdate);
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/update/uuBinaryCreateFailed",
      );
      expect(e.message).toEqual("Create uuBinary failed.");
    }
  });
  test("UuBinaryUpdateFailed", async () => {
    await TestHelper.login("Authorities");

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );
    const imagePathBook = path.resolve(
      __dirname,
      "test_files/default_image.png",
    );

    const dtoIn = {
      name: "First Book",
      authorIdList: [author.id],
      locationId: location.id,
      yearOfPublication: 2021,
      coverImage: fs.createReadStream(imagePathBook),
    };

    const book = await TestHelper.executePostCommand("book/create", dtoIn);
    const imagePathUpdate = path.resolve(
      __dirname,
      "test_files/harry-potter1.jpg",
    );

    const dtoInUpdate = {
      id: book.id,
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
      coverImage: fs.createReadStream(imagePathUpdate),
    };

    try {
      await TestHelper.executePostCommand("book/update", dtoInUpdate);
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/update/uuBinaryUpdateFailed",
      );
      expect(e.message).toEqual("Update uuBinary failed.");
    }
  });
  test("UuBinaryDeleteFailed", async () => {
    await TestHelper.login("Authorities");

    const author = await TestHelper.executePostCommand(
      "author/create",
      AuthorDtoIn,
    );

    const location = await TestHelper.executePostCommand(
      "location/create",
      LocationDtoIn,
    );
    const imagePath = path.resolve(__dirname, "test_files/harry-potter1.jpg");
    const dtoIn = {
      name: "First Book",
      authorIdList: [author.id],
      locationId: location.id,
      yearOfPublication: 2021,
      coverImage: fs.createReadStream(imagePath),
    };

    const book = await TestHelper.executePostCommand("book/create", dtoIn);

    const dtoInUpdate = {
      id: book.id,
      name: "Second Book",
      authorIdList: [author.id],
      yearOfPublication: 2021,
      locationId: location.id,
      deleteCoverImage: true,
    };

    try {
      await TestHelper.executePostCommand("book/update", dtoInUpdate);
    } catch (e) {
      expect(e.code).toEqual(
        "uu-library-main/book/update/uuBinaryDeleteFailed",
      );
      expect(e.message).toEqual("Delete uuBinary failed.");
    }
  });
});
