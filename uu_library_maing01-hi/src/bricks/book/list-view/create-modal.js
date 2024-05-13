//@@viewOn:imports
import { createVisualComponent, PropTypes, Lsi, useLsi, Utils, useState } from "uu5g05";
import { Link, Modal, useAlertBus } from "uu5g05-elements";
import { Form, FormText, FormSelect, FormFile, SubmitButton, CancelButton, FormNumber } from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../../lsi/import-lsi";
import AuthorCreateModal from "../../author/list-view/create-modal";
import LocationCreateModal from "../../location/list-view/create-modal";

//@@viewOff:imports

export const CreateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    bookDataList: PropTypes.object.isRequired,
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
    const lsi = useLsi(importLsi, [CreateModal.uu5Tag]);
    const [showAuthorModal, setShowAuthorModal] = useState(false);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const { addAlert } = useAlertBus();

    const handleCreateDone = () => {
      setShowAuthorModal(false);
      const message = "Author was created successfully.";
      addAlert({ message, priority: "success", durationMs: 5000 });
    };

    const handleCreateLocationDone = () => {
      setShowLocationModal(false);
      const message = "Location was created successfully.";
      addAlert({ message, priority: "success", durationMs: 5000 });
    };

    async function handleSubmit(event) {
      try {
        const values = { ...event.data.value };

        const book = await props.bookDataList.handlerMap.create(values);
        props.onSaveDone(book);
      } catch (error) {
        CreateModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
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

    //@@viewOn:render
    const formInputCss = Config.Css.css`margin-bottom:16px`;

    const formControls = (
      <div className={Config.Css.css({ display: "flex", gap: 8, justifyContent: "flex-end" })}>
        <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
        <SubmitButton>{lsi.submit}</SubmitButton>
      </div>
    );

    return (
      <Form.Provider onSubmit={handleSubmit}>
        <Modal header={lsi.header} info={<Lsi lsi={lsi.info} />} open={props.shown} footer={formControls}>
          <Form.View>
            <FormText
              label={lsi.name}
              name="name"
              inputAttrs={{ maxLength: 255 }}
              className={formInputCss}
              placeholder="Name of the book"
              required
              autoFocus
              iconLeft="mdi-book"
            />
            <FormNumber
              label={lsi.yearOfPublication}
              name="yearOfPublication"
              inputAttrs={{ maxLength: 4 }}
              className={formInputCss}
              placeholder="Year of publication book"
              iconLeft="mdi-calendar"
            />
            <FormSelect
              label={lsi.author}
              name="authorIdList"
              itemList={getAuthorItemList()}
              placeholder="Select authors of the book"
              multiple
              required
              iconLeft="mdi-account"
            />
            <Link size="m" onClick={() => setShowAuthorModal(true)}>
              {"Don't have the right author? Create one here"}{" "}
            </Link>
            <FormSelect
              label={lsi.location}
              name="locationId"
              itemList={getLocationItemList()}
              placeholder="Select location of the book"
              iconLeft="mdi-map-marker"
              required
            />
            <Link size="m" onClick={() => setShowLocationModal(true)}>
              {"Don't have the right location? Create one here"}
            </Link>

            <FormFile label={lsi.image} name="coverImage" accept="image/*" className={formInputCss} />
          </Form.View>

          <AuthorCreateModal
            shown={showAuthorModal}
            onCancel={() => setShowAuthorModal(false)}
            onSaveDone={handleCreateDone}
            authorDataList={props.authorDataList}
          />

          <LocationCreateModal
            shown={showLocationModal}
            onCancel={() => setShowLocationModal(false)}
            onSaveDone={handleCreateLocationDone}
            locationDataList={props.locationDataList}
          />
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

export default CreateModal;
