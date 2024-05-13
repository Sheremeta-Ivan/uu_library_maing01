//@@viewOn:imports
import { createVisualComponent, PropTypes, Lsi, useLsi, Utils } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormSelect, FormFile, SubmitButton, CancelButton, FormNumber } from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:helpers
//@@viewOff:helpers

const UpdateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "UpdateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bookDataObject: PropTypes.object.isRequired,
    authorDataList: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    onSaveDone: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    shown: false,
    onSaveDone: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const lsi = useLsi(importLsi, [UpdateModal.uu5Tag]);

    async function handleSubmit(event) {
      const values = { ...event.data.value };

      if (!values.coverImage) {
        delete values.coverImage;
        values.deleteCoverImage = true;
      }

      try {
        const book = await props.bookDataObject.handlerMap.update({ id: props.bookDataObject.data.id, ...values });
        props.onSaveDone(book);
      } catch (error) {
        UpdateModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
      }
    }

    function handleValidate(event) {
      const { yearOfPublication } = event.data.value;

      if (typeof yearOfPublication !== "number") {
        return {
          message: "Year of publication must be a number",
        };
      }
    }

    function getAuthorItemList() {
      return props.authorDataList.data.map(({ data: author }) => {
        return { value: author.id, children: author.name };
      });
    }

    function getLocationItemList() {
      return props.locationDataList.data.map(({ data: location }) => {
        return { value: location.id, children: location.name };
      });
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const book = props.bookDataObject.data;

    const formInputCss = Config.Css.css`margin-bottom:16px`;

    const formControls = (
      <div className={Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" })}>
        <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
        <SubmitButton>{lsi.submit}</SubmitButton>
      </div>
    );
    return (
      <Form.Provider onSubmit={handleSubmit} onValidate={handleValidate}>
        <Modal header={lsi.header} info={<Lsi lsi={lsi.info} />} open={props.shown} footer={formControls}>
          <Form.View>
            <FormText
              label={lsi.name}
              name="name"
              inputAttrs={{ maxLength: 255 }}
              className={formInputCss}
              initialValue={book.name}
              required
              autoFocus
              iconLeft="mdi-book"
            />
            <FormNumber
              label={lsi.yearOfPublication}
              name="yearOfPublication"
              type="number"
              inputAttrs={{ maxLength: 4 }}
              className={formInputCss}
              initialValue={book.yearOfPublication}
              iconLeft="mdi-calendar"
            />
            <FormSelect
              label={lsi.author}
              name="authorIdList"
              itemList={getAuthorItemList()}
              className={formInputCss}
              initialValue={book.authorIdList}
              multiple
              required
              iconLeft="mdi-account"
            />
            <FormSelect
              label={lsi.location}
              name="locationId"
              itemList={getLocationItemList()}
              className={formInputCss}
              initialValue={book.locationId}
              iconLeft="mdi-map-marker"
              required
            />

            <FormFile
              label={lsi.image}
              name="coverImage"
              accept="image/*"
              className={formInputCss}
              initialValue={book.imageFile}
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

//@@viewOn:exports
export { UpdateModal };
export default UpdateModal;
//@@viewOff:exports
