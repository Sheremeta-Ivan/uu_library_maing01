//@@viewOn:imports
import UU5 from "uu5g04";
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
    authorsPermissions: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: authorDataObject } = props;
    const actionsDisabled = authorDataObject.state === "pending";

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(authorDataObject);
    }

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(authorDataObject);
    }

    function getItemActions() {
      const actionList = [];

      if (props.authorsPermissions.author.canManage) {
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
    const author = authorDataObject.data;

    return (
      <Uu5Elements.Tile
        {...elementProps}
        header={<Header author={author} />}
        footerSignificance="distinct"
        significance="subdued"
        borderRadius="elementary"
        actionList={getItemActions()}
      >
        <Grid rowGap={0}>
          <RichIcon
            imageSrc="https://cdn.plus4u.net/uu-plus4u5g02/1.0.0/assets/anonymous.png"
            height={120}
            className={Config.Css.css({ margin: "16px auto" })}
          />
          <Text category="interface" segment="content" type="medium" colorScheme="building" significance="subdued">
            <Uu5Elements.Icon icon="uugds-calendar" />
            Birth date:
            {author.birthDate ? author.birthDate : "Secret"}
          </Text>
          <Text category="interface" segment="content" type="medium" colorScheme="building" significance="subdued">
            <Uu5Elements.Icon icon="uugdsstencil-navigation-mapmarker-solid" />
            Country:
            {author.originCountry ? author.originCountry : "Secret"}
          </Text>
        </Grid>
      </Uu5Elements.Tile>
    );
    //@@viewOff:render
  },
});

function Header({ author }) {
  return (
    <Text category="interface" segment="title" type="major" colorScheme="building">
      {author.name} {author.surname}
    </Text>
  );
}

export default Tile;
