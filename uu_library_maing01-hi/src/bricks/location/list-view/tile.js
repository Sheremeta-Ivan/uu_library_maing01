//@@viewOn:imports
import "uu5g04-bricks";
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import Uu5Elements, { Grid, RichIcon, Text } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css

//@@viewOff:css

export const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    locationsPermissions: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: locationDataObject } = props;
    const actionsDisabled = locationDataObject.state === "pending";

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(locationDataObject);
    }

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(locationDataObject);
    }

    function getItemActions() {
      const actionList = [];

      if (props.locationsPermissions.location.canManage) {
        actionList.push({
          icon: "mdi-pencil",
          onClick: handleUpdate,
          disabled: actionsDisabled,
        });
        actionList.push({
          icon: "mdi-delete",
          onClick: handleDelete,
          disabled: actionsDisabled,
        });
      }

      return actionList;
    }

    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);
    const location = locationDataObject.data;

    return (
      <Uu5Elements.Tile
        {...elementProps}
        header={<Header location={location} />}
        footerSignificance="distinct"
        significance="subdued"
        borderRadius="elementary"
        actionList={getItemActions()}
      >
        <Grid rowGap={0}>
          <RichIcon
            imageSrc="https://www.svgrepo.com/show/421716/location-new-place-3.svg"
            height={120}
            className={Config.Css.css({ margin: "16px auto" })}
          />
          <Text category="interface" segment="content" type="medium" colorScheme="building" significance="subdued">
            <Uu5Elements.Icon icon="uugdsstencil-chart-bar-chart-square" />
            Capacity:
            {location.capacity ? location.capacity : 0}
          </Text>
        </Grid>
      </Uu5Elements.Tile>
    );
    //@@viewOff:render
  },
});

function Header({ location }) {
  return (
    <Text category="interface" segment="title" type="major" colorScheme="building">
      {location.name}
    </Text>
  );
}

export default Tile;
