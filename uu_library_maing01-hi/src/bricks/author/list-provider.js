//@@viewOn:imports
import { createComponent, useDataList, useMemo, useRef } from "uu5g05";
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
    const authorDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
        create: handleCreate,
      },
      itemHandlerMap: {
        update: handleUpdate,
        delete: handleDelete,
      },
    });

    const criteriaRef = useRef({});

    function handleLoad(criteria) {
      const dtoIn = { ...criteria };
      dtoIn.order = criteria.order || "asc";

      criteriaRef.current = dtoIn;
      return Calls.Author.list(dtoIn);
    }

    function handleLoadNext(pageInfo) {
      const dtoIn = { ...criteriaRef.current, pageInfo };
      return Calls.Author.list(dtoIn);
    }

    function handleCreate(dtoIn) {
      return Calls.Author.create(dtoIn);
    }

    async function handleUpdate(values) {
      const author = await Calls.Author.update(values);
      return { ...author };
    }

    function handleDelete(author) {
      const dtoIn = { id: author.id };
      return Calls.Author.delete(dtoIn);
    }

    //@@viewOff:private
    const value = useMemo(
      () => ({
        authorDataList,
      }),
      [authorDataList],
    );
    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

export default ListProvider;
