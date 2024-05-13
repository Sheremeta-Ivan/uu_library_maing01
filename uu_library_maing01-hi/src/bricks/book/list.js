//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import BookListProvider from "./list-provider";
import AuthorListProvider from "../author/list-provider";
import LocationListProvider from "../location/list-provider";
import ListView from "./list-view";
import Config from "./config/config";

//@@viewOff:imports

export const List = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "List",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <BookListProvider>
        {({ bookDataList, filterList, sorterList }) => (
          <AuthorListProvider>
            {({ authorDataList }) => (
              <LocationListProvider>
                {({ locationDataList }) => (
                  <ListView
                    bookDataList={bookDataList}
                    authorDataList={authorDataList}
                    locationDataList={locationDataList}
                    filterList={filterList}
                    sorterList={sorterList}
                  />
                )}
              </LocationListProvider>
            )}
          </AuthorListProvider>
        )}
      </BookListProvider>
    );
    //@@viewOff:render
  },
});

export default List;
