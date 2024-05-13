const bookCreateDtoInType = shape({
  name: string(1, 255).isRequired(),
  authorIdList: array(id(), 1, 20).isRequired(),
  locationId: id().isRequired(),
  yearOfPublication: integer(9999),
  coverImage: binary(),
});

const bookGetDtoInType = shape({
  id: id().isRequired()
});

const bookListDtoInType = shape({
  sortBy: oneOf(["name"]),
  order: oneOf(["asc", "desc"]),
  authorIdList: array(id(), 1, 20),
  locationId: id(),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer()
  })
});

const bookUpdateDtoInType = shape({
  id: id().isRequired(),
  name: string(1, 255),
  authorIdList: array(id(), 20),
  locationId: id(),
  yearOfPublication: integer(9999),
  coverImage: binary(),
  deleteCoverImage: boolean()
});

const bookDeleteDtoInType = shape({
  id: id().isRequired()
});
