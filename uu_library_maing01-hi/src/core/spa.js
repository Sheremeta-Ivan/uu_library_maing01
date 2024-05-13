//@@viewOn:imports
import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements, { Line } from "uu5g05-elements";
import Plus4U5 from "uu_plus4u5g02";
import Plus4U5App from "uu_plus4u5g02-app";

import Config from "./config/config.js";
import RouteBar from "./route-bar";

//@@viewOff:imports

//@@viewOn:constants
const About = Utils.Component.lazy(() => import("../routes/about.js"));
const InitAppWorkspace = Utils.Component.lazy(() => import("../routes/init-app-workspace.js"));
const ControlPanel = Utils.Component.lazy(() => import("../routes/control-panel.js"));
const Books = Utils.Component.lazy(() => import("../routes/books.js"));
const BookDetail = Utils.Component.lazy(() => import("../routes/book-detail.js"));
const Authors = Utils.Component.lazy(() => import("../routes/authors.js"));
const Locations = Utils.Component.lazy(() => import("../routes/locations.js"));

const ROUTE_MAP = {
  "": { redirect: "books" },

  books: (props) => <Books {...props} />,
  bookDetail: (props) => <BookDetail {...props} />,
  authors: (props) => <Authors {...props} />,
  locations: (props) => <Locations {...props} />,
  about: (props) => <About {...props} />,
  "sys/uuAppWorkspace/initUve": (props) => <InitAppWorkspace {...props} />,
  controlPanel: (props) => <ControlPanel {...props} />,
  "*": () => (
    <Uu5Elements.Text category="story" segment="heading" type="h1">
      Not Found
    </Uu5Elements.Text>
  ),
};
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

const Spa = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Spa",
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

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    return (
      <Plus4U5.SpaProvider initialLanguageList={["en", "cs"]}>
        <Uu5Elements.ModalBus>
          <Plus4U5App.Spa>
            <RouteBar />
            <Line significance="subdued" colorScheme="dim" />
            <Plus4U5App.Router routeMap={ROUTE_MAP} />
          </Plus4U5App.Spa>
        </Uu5Elements.ModalBus>
      </Plus4U5.SpaProvider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { Spa };
export default Spa;
//@@viewOff:exports
