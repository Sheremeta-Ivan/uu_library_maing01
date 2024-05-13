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
    const locationDataList = useDataList({
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
      return Calls.Location.list(dtoIn);
    }

    function handleLoadNext(pageInfo) {
      const dtoIn = { ...criteriaRef.current, pageInfo };
      return Calls.Location.list(dtoIn);
    }

    function handleCreate(dtoIn) {
      return Calls.Location.create(dtoIn);
    }

    async function handleUpdate(values) {
      const location = await Calls.Location.update(values);
      return { ...location };
    }

    function handleDelete(location) {
      const dtoIn = { id: location.id };
      return Calls.Location.delete(dtoIn);
    }

    //@@viewOff:private
    const value = useMemo(
      () => ({
        locationDataList,
      }),
      [locationDataList],
    );
    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

export default ListProvider;
