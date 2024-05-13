//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useEffect } from "uu5g05";
import { Text, Grid, Accordion, Block } from "uu5g05-elements";

import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  image: () =>
    Config.Css.css({
      maxWidth: "40%",
      margin: "auto",
      borderRadius: "12px",
    }),
};
//@@viewOff:css

const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

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
    const { bookDataObject, locationDataList, authorDataList } = props;

    const authorName = authorDataList.data
      .filter((author) => bookDataObject.data.authorIdList.includes(author.data.id))
      .map((author) => author.data.name + " " + author.data.surname)
      .join(", ");

    const locationName = locationDataList.data
      .filter((location) => bookDataObject.data.locationId === location.data.id)
      .map((location) => location.data.name)
      .join(", ");

    useEffect(() => {
      if (
        bookDataObject.data.coverImage &&
        !bookDataObject.data.imageUrl &&
        bookDataObject.state === "ready" &&
        bookDataObject.handlerMap?.getImage
      ) {
        bookDataObject.handlerMap.getImage(book).catch((error) => console.error(error));
      }
    }, [bookDataObject]);
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const book = bookDataObject.data;

    return (
      <div {...attrs}>
        <Grid rowGap={6} templateColumns="repeat(2, 1fr)">
          {book.imageUrl && <img src={book.imageUrl} alt={book.name} className={Css.image()} />}
          <Block>
            <Text significance="subdued" colorScheme="building" segment="title" category="interface" type="major">
              Book detail
            </Text>
            <Accordion
              itemList={[
                {
                  header: "Author name",
                  children: authorName,
                  colorScheme: "primary",
                  significance: "highlighted",
                },
                { header: "Location name", children: locationName },
                { header: "Year of publication", children: book.yearOfPublication },
              ]}
              itemColorScheme="neutral"
              itemSignificance="distinct"
            />
          </Block>
        </Grid>
      </div>
    );
    //@@viewOff:render
  },
});

export default Content;
