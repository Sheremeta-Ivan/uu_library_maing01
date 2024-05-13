//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import LocationListProvider from "./list-provider";
import ListView from "./list-view";

//@@viewOff:imports

export const List = createVisualComponent({
  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <LocationListProvider>
        {({ locationDataList }) => {
          return <ListView locationDataList={locationDataList} />;
        }}
      </LocationListProvider>
    );

    //@@viewOff:render
  },
});

export default List;
