//@@viewOn:imports
import { createComponent, useDataObject, useEffect, useRef, PropTypes, useMemo } from "uu5g05";
import Config from "./config/config";
import Calls from "../../calls.js";
//@@viewOff:imports

export const BookProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Provider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bookId: PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const bookDataObject = useDataObject({
      handlerMap: {
        load: handleLoad,
        getImage: handleGetImage,
      },
    });

    const imageUrlListRef = useRef([]);

    function handleLoad() {
      return Calls.Book.get({ id: props.bookId });
    }

    async function handleGetImage(book) {
      const dtoIn = { code: book.coverImage };
      const imageFile = await Calls.Book.getImage(dtoIn);
      const imageUrl = generateAndRegisterImageUrl(imageFile);
      return { ...book, imageFile, imageUrl };
    }

    function generateAndRegisterImageUrl(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      imageUrlListRef.current.push(imageUrl);
      return imageUrl;
    }

    useEffect(() => {
      return () => imageUrlListRef.current.forEach((url) => URL.revokeObjectURL(url));
    }, []);
    //@@viewOff:private
    const value = useMemo(
      () => ({
        bookDataObject,
      }),
      [bookDataObject],
    );

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(value) : props.children;
    //@@viewOff:render
  },
});

export default BookProvider;
