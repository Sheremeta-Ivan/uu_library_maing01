//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import { RouteController, withRoute } from "uu_plus4u5g02-app";
import RouteContainer from "../core/route-container";
import List from "../bricks/author/list";
import Config from "./config/config";
//@@viewOff:imports

let Authors = createVisualComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Books",
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
      <RouteController>
        <RouteContainer>
          <List />
        </RouteContainer>
      </RouteController>
    );
    //@@viewOff:render
  },
});

Authors = withRoute(Authors, { authenticated: true });

export { Authors };

export default Authors;
