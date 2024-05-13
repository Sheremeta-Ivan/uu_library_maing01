//@@viewOn:imports
import { createVisualComponent, PropTypes, useCallback, useSession, useState, Utils } from "uu5g05";
import Uu5Elements, { useAlertBus } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { useSystemData } from "uu_plus4u5g02";
import DataListStateResolver from "../data-list-state-resolver";
import Config from "./config/config";
import Content from "./list-view/content";
import CreateModal from "./list-view/create-modal";
import UpdateModal from "./list-view/update-modal";
import DeleteModal from "./list-view/delete-modal";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListView",
  //@@viewOff:statics
};

const ListView = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    authorDataList: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { identity } = useSession();
    const { data: systemData } = useSystemData();
    const { addAlert } = useAlertBus();
    const [createData, setCreateData] = useState({ shown: false });
    const [updateData, setUpdateData] = useState({ shown: false, id: undefined });
    const [deleteData, setDeleteData] = useState({ shown: false, id: undefined });

    const activeDataObjectId = updateData.id || deleteData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = getAuthorDataObject(props.authorDataList, activeDataObjectId);
    }

    const showError = useCallback(
      (error) =>
        addAlert({
          message: error.message,
          priority: "error",
        }),
      [addAlert],
    );

    const handleLoad = useCallback(
      async (event) => {
        try {
          await props.authorDataList.handlerMap.load(event?.data);
        } catch (error) {
          showError(error);
        }
      },
      [props.authorDataList, showError],
    );

    const handleCreate = useCallback(() => {
      setCreateData({ shown: true });
    }, [setCreateData]);

    const handleCreateCancel = () => {
      setCreateData({ shown: false });
    };

    const handleCreateDone = (author) => {
      setCreateData({ shown: false });
      showCreateSuccess();

      try {
        props.authorDataList.handlerMap.reload();
      } catch (error) {
        ListView.logger.error("Error creating author", error);
        showError(error);
      }
    };

    function showCreateSuccess() {
      const message = "Author was created successfully.";
      addAlert({ message, priority: "success", durationMs: 5000 });
    }

    const handleUpdate = useCallback(
      (authorDataObject) => {
        setUpdateData({ shown: true, id: authorDataObject.data.id });
      },
      [setUpdateData],
    );

    const handleUpdateDone = () => {
      setUpdateData({ shown: false });
    };

    const handleUpdateCancel = () => {
      setUpdateData({ shown: false });
    };

    const handleDelete = useCallback(
      (authorDataObject) => setDeleteData({ shown: true, id: authorDataObject.data.id }),
      [setDeleteData],
    );

    const handleDeleteDone = () => {
      setDeleteData({ shown: false });
    };

    const handleDeleteCancel = () => setDeleteData({ shown: false });

    // Defining permissions
    const profileList = systemData.profileData.uuIdentityProfileList;
    const isAuthority = profileList.includes("Authorities");
    const isExecutive = profileList.includes("Executives");
    function isOwner(author) {
      return identity?.uuIdentity === author.uuIdentity;
    }

    const authorsPermissions = {
      author: {
        canCreate: () => isAuthority || isExecutive,
        canManage: (author) => isAuthority || (isExecutive && isOwner(author)),
      },
    };

    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const actionList = getActions(props, authorsPermissions, { handleCreate });

    return (
      <>
        {createData.shown && (
          <CreateModal
            authorDataList={props.authorDataList}
            shown={true}
            onSaveDone={handleCreateDone}
            onCancel={handleCreateCancel}
          />
        )}
        {updateData.shown && (
          <UpdateModal
            authorDataObject={activeDataObject}
            onSaveDone={handleUpdateDone}
            onCancel={handleUpdateCancel}
            shown
          />
        )}
        {deleteData.shown && activeDataObject && (
          <DeleteModal
            authorDataObject={activeDataObject}
            onDeleteDone={handleDeleteDone}
            onCancel={handleDeleteCancel}
            shown
          />
        )}
        <ControllerProvider data={props.authorDataList.data} onSorterChange={handleLoad}>
          <Uu5Elements.Block {...attrs} actionList={actionList} header={"Authors"} headerType="heading" card="none">
            <DataListStateResolver dataList={props.authorDataList}>
              <Content
                authorDataList={props.authorDataList}
                authorsPermissions={authorsPermissions}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </DataListStateResolver>
          </Uu5Elements.Block>
        </ControllerProvider>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers

function getAuthorDataObject(authorDataList, id) {
  return (
    authorDataList.newData?.find((item) => item?.data.id === id) ||
    authorDataList.data.find((item) => item?.data.id === id)
  );
}

function getActions(props, authorsPermissions, { handleCreate }) {
  const actionList = [];

  if (authorsPermissions.author.canCreate()) {
    actionList.push({
      icon: "mdi-plus",
      children: "Create new author",
      primary: true,
      onClick: handleCreate,
      disabled: props.disabled,
    });
  }

  return actionList;
}

//@@viewOff:helpers

//@@viewOn:exports
export { ListView };
export default ListView;
//@@viewOff:exports
