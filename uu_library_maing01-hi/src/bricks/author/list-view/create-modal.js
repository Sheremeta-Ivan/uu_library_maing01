//@@viewOn:imports
import { createVisualComponent, PropTypes, Lsi, useLsi, Utils } from "uu5g05";
import { Modal } from "uu5g05-elements";
import { Form, FormText, FormSelect, SubmitButton, CancelButton, FormNumber } from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../../lsi/import-lsi";
//@@viewOff:imports

export const CreateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    authorDataList: PropTypes.object.isRequired,
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

    async function handleSubmit(event) {
      try {
        const values = { ...event.data.value };

        const author = await props.authorDataList.handlerMap.create(values);
        props.onSaveDone(author);
      } catch (error) {
        CreateModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
      }
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
              iconLeft="mdi-account"
              required
              autoFocus
            />
            <FormText
              label={lsi.surname}
              name="surname"
              inputAttrs={{ maxLength: 255 }}
              className={formInputCss}
              iconLeft="mdi-account"
              required
            />
            <FormNumber
              name="birthDate"
              label={lsi.birthDate}
              className={formInputCss}
              iconLeft="mdi-calendar"
              inputAttrs={{ maxLength: 4 }}
            />
            <FormSelect
              name="originCountry"
              label={lsi.originCountry}
              itemList={[
                { value: "Ukraine", children: "Ukraine" },
                { value: "Czech Republic", children: "Czech Republic" },
                { value: "United States of America", children: "United States of America" },
                { value: "Poland", children: "Poland" },
                { value: "Germany", children: "Germany" },
                { value: "France", children: "France" },
                { value: "Spain", children: "Spain" },
                { value: "Italy", children: "Italy" },
                { value: "United Kingdom", children: "United Kingdom" },
              ]}
              className={formInputCss}
              iconLeft="mdi-earth"
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

export default CreateModal;
