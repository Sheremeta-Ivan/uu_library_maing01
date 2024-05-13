//@@viewOn:imports
import { createVisualComponent, PropTypes } from "uu5g05";
import Config from "./config/config";
import BookProvider from "./provider";
import AuthorListProvider from "../author/list-provider";
import LocationListProvider from "../location/list-provider";
import DetailView from "./detail-view";
//@@viewOff:imports

export const Detail = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Detail",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bookId: PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <BookProvider bookId={props.bookId}>
        {({ bookDataObject }) => (
          <AuthorListProvider>
            {({ authorDataList }) => (
              <LocationListProvider>
                {({ locationDataList }) => (
                  <DetailView
                    bookDataObject={bookDataObject}
                    authorDataList={authorDataList}
                    locationDataList={locationDataList}
                  />
                )}
              </LocationListProvider>
            )}
          </AuthorListProvider>
        )}
      </BookProvider>
    );
    //@@viewOff:render
  },
});

export default Detail;
