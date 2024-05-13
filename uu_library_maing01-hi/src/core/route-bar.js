//@@viewOn:imports
import { createVisualComponent, Lsi, useRoute } from "uu5g05";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import importLsi from "../lsi/import-lsi.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const RouteBar = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "RouteBar",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    ...Plus4U5App.PositionBar.propTypes,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [, setRoute] = useRoute();

    const actionList = [
      {
        children: <Lsi import={importLsi} path={["Menu", "books"]} />,
        onClick: () => setRoute("books"),
        icon: "uugdsstencil-education-book",
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "authors"]} />,
        onClick: () => setRoute("authors"),
        icon: "uugdsstencil-user-account-multi-solid",
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "locations"]} />,
        onClick: () => setRoute("locations"),
        collapsed: true,
        icon: "uugds-mapmarker",
      },
      {
        children: <Lsi import={importLsi} path={["Menu", "about"]} />,
        onClick: () => setRoute("about"),
        collapsed: true,
        icon: "uugds-info",
      },
    ];

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return <Plus4U5App.PositionBar actionList={actionList} {...props} />;
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { RouteBar };
export default RouteBar;
//@@viewOff:exports
