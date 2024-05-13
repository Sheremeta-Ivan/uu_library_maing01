const authorCreateDtoInType = shape({
  name: string(1, 255).isRequired(),
  surname: string(1, 255).isRequired(),
  birthDate: integer(1, 2024).isRequired(),
  originCountry: string(1, 255).isRequired(),
});

const authorGetDtoInType = shape({
  id: id().isRequired(),
});

const authorListDtoInType = shape({
  sortBy: oneOf(["name"]),
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const authorUpdateDtoInType = shape({
  id: id().isRequired(),
  name: string(1, 255),
  surname: string(1, 255),
  birthDate: integer(1, 2024),
  originCountry: string(1, 255),
});

const authorDeleteDtoInType = shape({
  id: id().isRequired(),
});
