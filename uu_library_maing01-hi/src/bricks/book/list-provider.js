//@@viewOn:imports
import { createComponent, useDataList, useEffect, useRef, useMemo } from "uu5g05";
import Config from "./config/config";
import Calls from "../../calls.js";
//@@viewOff:imports

export const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const bookDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
        reload: handleReload,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
        getImage: handleGetImage,
      },
    });

    const filterList = useRef([]);
    const sorterList = useRef([]);
    const imageUrlListRef = useRef([]);

    function handleLoad(criteria) {
      filterList.current = criteria?.filterList || [];

      let sorter;
      if (criteria?.sorterList) {
        sorter = criteria.sorterList.at(criteria.sorterList.length - 1);
        sorterList.current = sorter ? [sorter] : [];
      } else {
        sorter = sorterList.current.at(0);
      }

      const dtoIn = getLoadDtoIn(filterList.current, sorter, criteria?.pageInfo);
      return Calls.Book.list(dtoIn);
    }

    function handleLoadNext(pageInfo) {
      const criteria = getLoadDtoIn(filterList.current, sorterList.current, pageInfo);

      const dtoIn = { ...criteria, pageInfo };
      return Calls.Book.list(dtoIn);
    }

    function handleReload() {
      return handleLoad({ filterList: filterList.current, sorterList: sorterList.current });
    }

    async function handleGetImage(book) {
      const dtoIn = { code: book.coverImage };
      const imageFile = await Calls.Book.getImage(dtoIn);
      const imageUrl = generateAndRegisterImageUrl(imageFile);
      return { ...book, imageFile, imageUrl };
    }

    function generateAndRegisterImageUrl(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      imageUrlListRef.current.push(imageUrl);
      return imageUrl;
    }

    function handleCreate(values) {
      return Calls.Book.create(values);
    }

    async function handleUpdate(values) {
      const book = await Calls.Book.update(values);
      const imageUrl = values.coverImage && generateAndRegisterImageUrl(values.coverImage);
      return { ...book, imageFile: values.coverImage, imageUrl };
    }

    function handleDelete(book) {
      const dtoIn = { id: book.id };
      return Calls.Book.delete(dtoIn);
    }

    useEffect(() => {
      return () => imageUrlListRef.current.forEach((url) => URL.revokeObjectURL(url));
    }, []);

    const value = useMemo(() => {
      return { bookDataList, filterList: filterList.current, sorterList: sorterList.current };
    }, [bookDataList]);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getLoadDtoIn(filterList, sorter, pageInfo) {
  const filterMap = filterList.reduce((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {});

  let dtoIn = { ...filterMap };

  if (sorter) {
    dtoIn.sortBy = sorter.key;
    dtoIn.order = sorter.ascending ? "asc" : "desc";
  }

  if (pageInfo) {
    dtoIn.pageInfo = pageInfo;
  }
  return dtoIn;
}
//@@viewOff:helpers
export default ListProvider;
