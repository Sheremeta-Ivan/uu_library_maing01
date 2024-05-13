//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import { UuGds } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
import { FilterBar, FilterManagerModal, SorterBar, SorterManagerModal } from "uu5tilesg02-controls";
import Tile from "./tile";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  grid: () => Config.Css.css({ marginTop: UuGds.SpacingPalette.getValue(["fixed", "c"]) }),
};
//@@viewOff:css

export const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bookDataList: PropTypes.object.isRequired,
    authorDataList: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
    bookPermissions: PropTypes.object,
    onLoadNext: PropTypes.func,
    onDetail: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { bookDataList, authorDataList, locationDataList, ...tileProps } = props;
    const pageSize = bookDataList.pageSize;

    function handleLoadNext({ indexFrom }) {
      props.onLoadNext({ pageSize: pageSize, pageIndex: Math.floor(indexFrom / pageSize) });
    }
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(tileProps);
    return (
      <div {...attrs}>
        <FilterBar disabled={bookDataList.state !== "ready"} />
        <SorterBar disabled={bookDataList.state !== "ready"} />
        <Grid
          onLoad={handleLoadNext}
          tileMinWidth={210}
          tileMaxWidth={410}
          tileHeight={510}
          className={Css.grid()}
          horizontalGap={24}
          verticalGap={24}
        >
          <Tile
            {...tileProps}
            bookDataList={props.bookDataList}
            authorDataList={props.authorDataList}
            locationDataList={props.locationDataList}
            onDetail={props.onDetail}
            onUpdate={props.onUpdate}
            onDelete={props.onDelete}
            bookPermissions={props.bookPermissions}
          />
        </Grid>
        <FilterManagerModal />
        <SorterManagerModal />
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default Content;
