//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, Utils, useEffect, PropTypes, useLsi } from "uu5g05";
import Uu5Elements, { Block, Box, Grid, Icon, Line, Pending, Text } from "uu5g05-elements";
import Config from "./config/config";
import Uu5TilesElements from "uu5tilesg02-elements";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  content: () =>
    Config.Css.css({
      display: "flex",
      padding: "8px",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      height: "100%",
    }),

  image: () => Config.Css.css({ display: "block", width: "auto", height: "100%", borderRadius: "12px" }),
};
//@@viewOff:css

const titleStyles = { category: "interface", segment: "title", type: "major" };
const textStyles = (segment) => ({ category: "interface", segment, type: "medium" });
const lineStyles = { significance: "subdued", colorScheme: "dim" };

export const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    onDetail: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    bookPermissions: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: bookDataObject, authorDataList, locationDataList } = props;
    const actionsDisabled = bookDataObject.state === "pending";

    useEffect(() => {
      if (
        bookDataObject.data.coverImage &&
        !bookDataObject.data.imageUrl &&
        bookDataObject.state === "ready" &&
        bookDataObject.handlerMap?.getImage
      ) {
        bookDataObject.handlerMap
          .getImage(bookDataObject.data)
          .catch((error) => Tile.logger.error("Error loading image", error));
      }
    }, [bookDataObject]);

    const handleDetail = () => {
      props.onDetail(bookDataObject.data);
    };

    function handleUpdate(event) {
      event.stopPropagation();
      props.onUpdate(bookDataObject);
    }

    function handleDelete(event) {
      event.stopPropagation();
      props.onDelete(bookDataObject);
    }

    function getItemActions() {
      const actionList = [];

      if (props.bookPermissions.book.canManage) {
        actionList.push({
          icon: "mdi-pencil",
          children: "Update",
          onClick: handleUpdate,
          disabled: actionsDisabled,
        });

        actionList.push({
          icon: "mdi-delete",
          children: "Delete",
          onClick: handleDelete,
          disabled: actionsDisabled,
        });
      }

      return actionList;
    }

    const authorName = authorDataList.data
      .filter((author) => bookDataObject.data.authorIdList.includes(author.data.id))
      .map((author) => author.data.name + " " + author.data.surname)
      .join(", ");

    const locationName = locationDataList.data
      .filter((location) => bookDataObject.data.locationId === location.data.id)
      .map((location) => location.data.name)
      .join(", ");

    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);
    const book = bookDataObject.data;

    return (
      <Uu5TilesElements.Tile
        {...elementProps}
        header={<Header book={book} />}
        footer={<Footer book={book} authorName={authorName} locationName={locationName} />}
        onClick={handleDetail}
        borderRadius="none"
        footerSeparator={true}
        headerSeparator={true}
        actionList={getItemActions()}
      >
        {(tile) => (
          <div className={Css.content()}>
            {book.name && !book.coverImage && (
              <Text category="interface" segment="content" type="medium" colorScheme="building">
                {book.name}
              </Text>
            )}

            {book.imageUrl && <img src={book.imageUrl} alt={book.name} className={Css.image()} />}
            {book.coverImage && !book.imageUrl && <Pending size="xl" />}
          </div>
        )}
      </Uu5TilesElements.Tile>
    );
    //@@viewOff:render
  },
});

function Header({ book }) {
  return (
    <Box maxWidth="410px" height="30px" colorScheme="building" shape="background">
      <Text {...titleStyles} autoFit={true}>
        {book.name}
      </Text>
    </Box>
  );
}

function Footer({ book, authorName, locationName }) {
  const lsi = useLsi(importLsi, [Tile.uu5Tag]);
  return (
    <Grid rowGap={8}>
      {authorName && (
        <Block>
          <Icon icon="mdi-account" margin="0 8px 0 0" />
          <Text {...textStyles("interactive")}>{lsi.author}</Text>
          <Line {...lineStyles} />
          <Text {...textStyles("content")}>{authorName}</Text>
        </Block>
      )}

      {locationName && (
        <Block>
          <Icon icon="mdi-map-marker" margin="0 8px 0 0" />
          <Text {...textStyles("interactive")}>{lsi.location}</Text>
          <Line {...lineStyles} />
          <Text {...textStyles("content")}>{locationName}</Text>
        </Block>
      )}

      {book.yearOfPublication && (
        <Block>
          <Icon icon="mdi-calendar" margin="0 8px 0 0" />
          <Text {...textStyles("interactive")}>{lsi.yearOfPublication}</Text>
          <Line {...lineStyles} />
          <Text {...textStyles("content")}>{book.yearOfPublication}</Text>
        </Block>
      )}
    </Grid>
  );
}

export default Tile;
