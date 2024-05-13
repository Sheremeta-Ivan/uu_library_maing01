//@@viewOn:imports
import { createVisualComponent, useRoute } from "uu5g05";
import { RouteController } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import BookDetail from "../bricks/book/detail";
import Config from "./config/config";
//@@viewOff:imports

const Book = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Book",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render() {
    //@@viewOn:private
    const [route] = useRoute();
    //@@viewOff:private

    //@@viewOn:render
    return (
      <RouteController>
        <RouteContainer>
          <BookDetail bookId={route.params.id} />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

export default Book;
