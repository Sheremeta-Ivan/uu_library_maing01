//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, Lsi } from "uu5g05";
import { Block, Grid } from "uu5g05-elements";
import DataObjectStateResolver from "../data-object-state-resolver";
import DataListStateResolver from "../data-list-state-resolver";
import Content from "./detail-view/content.js";
import Config from "./config/config";
import importLsi from "../../lsi/import-lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DetailView",
  //@@viewOff:statics
};

const DetailView = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    bookDataObject: PropTypes.object.isRequired,
    authorDataList: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    return (
      <Grid>
        <Block
          {...attrs}
          info={<Lsi import={importLsi} path={[DetailView.uu5Tag, "info"]} />}
          header={props.bookDataObject?.data?.name}
          headerType="heading"
          level="2"
          card="full"
          headerSeparator={true}
          significance="distinct"
          borderRadius="expressive"
        >
          <DataObjectStateResolver dataObject={props.bookDataObject}>
            <DataListStateResolver dataList={props.authorDataList}>
              <DataListStateResolver dataList={props.locationDataList}>
                <Content
                  bookDataObject={props.bookDataObject}
                  authorDataList={props.authorDataList}
                  locationDataList={props.locationDataList}
                />
              </DataListStateResolver>
            </DataListStateResolver>
          </DataObjectStateResolver>
        </Block>
      </Grid>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

//@@viewOn:exports
export { DetailView };
export default DetailView;
//@@viewOff:exports
