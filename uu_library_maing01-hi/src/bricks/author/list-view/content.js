//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import { UuGds } from "uu5g05-elements";
import { Grid } from "uu5tilesg02-elements";
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
    authorDataList: PropTypes.object.isRequired,
    authorsPermissions: PropTypes.object,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { authorDataList, ...tileProps } = props;

    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(tileProps);

    return (
      <div {...attrs}>
        <Grid
          tileMinWidth={100}
          tileMaxWidth={600}
          horizontalGap={UuGds.SpacingPalette.getValue(["fixed", "c"])}
          className={Css.grid()}
        >
          <Tile
            {...tileProps}
            onUpdate={props.onUpdate}
            authorsPermissions={props.authorsPermissions}
            onDelete={props.onDelete}
          />
        </Grid>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default Content;
