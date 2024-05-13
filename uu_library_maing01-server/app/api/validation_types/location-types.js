const locationCreateDtoInType = shape({
  name: string(1, 255).isRequired(),
  capacity: integer(9999).isRequired(),
});

const locationGetDtoInType = shape({
  id: id().isRequired(),
});

const locationListDtoInType = shape({
  sortBy: oneOf(["name", "capacity"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const locationUpdateDtoInType = shape({
  id: id().isRequired(),
  name: string(1, 255),
  capacity: integer(9999),
});

const locationDeleteDtoInType = shape({
  id: id().isRequired(),
});
