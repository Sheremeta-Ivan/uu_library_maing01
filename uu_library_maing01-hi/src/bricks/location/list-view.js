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
    locationDataList: PropTypes.object,
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
      activeDataObject = getAuthorDataObject(props.locationDataList, activeDataObjectId);
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
          await props.locationDataList.handlerMap.load(event?.data);
        } catch (error) {
          showError(error);
        }
      },
      [props.locationDataList, showError],
    );

    const handleCreate = useCallback(() => {
      setCreateData({ shown: true });
    }, [setCreateData]);

    const handleCreateCancel = () => {
      setCreateData({ shown: false });
    };

    const handleCreateDone = (location) => {
      setCreateData({ shown: false });
      showCreateSuccess();

      try {
        props.locationDataList.handlerMap.reload();
      } catch (error) {
        ListView.logger.error("Error creating location", error);
        showError(error);
      }
    };

    function showCreateSuccess() {
      const message = "Location was created successfully.";
      addAlert({ message, priority: "success", durationMs: 5000 });
    }

    const handleUpdate = useCallback(
      (locationDataObject) => {
        setUpdateData({ shown: true, id: locationDataObject.data.id });
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
      (locationDataObject) => setDeleteData({ shown: true, id: locationDataObject.data.id }),
      [setDeleteData],
    );

    const handleDeleteDone = () => {
      setDeleteData({ shown: false });
    };

    const handleDeleteCancel = () => setDeleteData({ shown: false });

    const profileList = systemData.profileData.uuIdentityProfileList;
    const isAuthority = profileList.includes("Authorities");
    const isExecutive = profileList.includes("Executives");
    function isOwner(location) {
      return identity?.uuIdentity === location.uuIdentity;
    }

    const locationsPermissions = {
      location: {
        canCreate: () => isAuthority || isExecutive,
        canManage: (location) => isAuthority || (isExecutive && isOwner(location)),
      },
    };

    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const actionList = getActions(props, locationsPermissions, { handleCreate });

    return (
      <>
        {createData.shown && (
          <CreateModal
            locationDataList={props.locationDataList}
            shown={true}
            onSaveDone={handleCreateDone}
            onCancel={handleCreateCancel}
          />
        )}
        {updateData.shown && (
          <UpdateModal
            locationDataObject={activeDataObject}
            onSaveDone={handleUpdateDone}
            onCancel={handleUpdateCancel}
            shown
          />
        )}
        {deleteData.shown && activeDataObject && (
          <DeleteModal
            locationDataObject={activeDataObject}
            onDeleteDone={handleDeleteDone}
            onCancel={handleDeleteCancel}
            shown
          />
        )}
        <ControllerProvider data={props.locationDataList.data} onSorterChange={handleLoad}>
          <Uu5Elements.Block {...attrs} actionList={actionList} header={"Locations"} headerType="heading" card="none">
            <DataListStateResolver dataList={props.locationDataList}>
              <Content
                locationDataList={props.locationDataList}
                locationsPermissions={locationsPermissions}
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

function getAuthorDataObject(locationDataList, id) {
  return (
    locationDataList.newData?.find((item) => item?.data.id === id) ||
    locationDataList.data.find((item) => item?.data.id === id)
  );
}

function getActions(props, locationsPermissions, { handleCreate }) {
  const actionList = [];

  if (locationsPermissions.location.canCreate()) {
    actionList.push({
      icon: "mdi-plus",
      children: "Create new location",
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
