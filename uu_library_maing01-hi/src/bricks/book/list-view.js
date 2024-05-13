//@@viewOn:imports
import {
  createVisualComponent,
  Lsi,
  PropTypes,
  useCallback,
  useLsi,
  useRoute,
  useSession,
  useState,
  Utils,
} from "uu5g05";
import Uu5Elements, { Link, useAlertBus } from "uu5g05-elements";
import { ControllerProvider } from "uu5tilesg02";
import { FilterButton, SorterButton } from "uu5tilesg02-controls";
import { useSystemData } from "uu_plus4u5g02";
import importLsi from "../../lsi/import-lsi";
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
    bookDataList: PropTypes.object.isRequired,
    authorDataList: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
    filterList: PropTypes.array.isRequired,
    sorterList: PropTypes.array.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { identity } = useSession();
    const lsi = useLsi(importLsi, [ListView.uu5Tag]);
    const { data: systemData } = useSystemData();
    const { addAlert } = useAlertBus();
    const [createData, setCreateData] = useState({ shown: false });
    const [updateData, setUpdateData] = useState({ shown: false, id: undefined });
    const [deleteData, setDeleteData] = useState({ shown: false, id: undefined });
    const [, setRoute] = useRoute();

    const activeDataObjectId = updateData.id || deleteData.id;
    let activeDataObject;

    if (activeDataObjectId) {
      activeDataObject = getBookDataObject(props.bookDataList, activeDataObjectId);
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
          await props.bookDataList.handlerMap.load(event?.data);
        } catch (error) {
          showError(error);
        }
      },
      [props.bookDataList, showError],
    );

    const handleLoadNext = useCallback(
      async (pageInfo) => {
        try {
          await props.bookDataList.handlerMap.loadNext(pageInfo);
        } catch (error) {
          showError(error);
        }
      },
      [props.bookDataList, showError],
    );

    const handleCreate = useCallback(() => {
      setCreateData({ shown: true });
    }, [setCreateData]);

    const handleCreateDone = (book) => {
      setCreateData({ shown: false });
      showCreateSuccess(book);

      try {
        props.bookDataList.handlerMap.reload();
      } catch (error) {
        ListView.logger.error("Error creating book", error);
        showError(error);
      }
    };

    const handleCreateCancel = () => {
      setCreateData({ shown: false });
    };

    function showCreateSuccess(book) {
      const message = (
        <>
          <Lsi import={importLsi} path={[ListView.uu5Tag, "createSuccessPrefix"]} /> 
          <Link colorSchema="primary" onClick={() => handleDetail({ id: book.id })}>
            {book.name}
          </Link>
           
          <Lsi import={importLsi} path={[ListView.uu5Tag, "createSuccessSuffix"]} />
        </>
      );

      addAlert({ message, priority: "success", durationMs: 5000 });
    }

    const handleDetail = (book) => {
      setRoute("bookDetail", { id: book.id });
    };

    const handleUpdate = useCallback(
      (bookDataObject) => {
        setUpdateData({ shown: true, id: bookDataObject.data.id });
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
      (bookDataObject) => setDeleteData({ shown: true, id: bookDataObject.data.id }),
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
    function isOwner(book) {
      return identity?.uuIdentity === book.uuIdentity;
    }

    const bookPermissions = {
      book: {
        canCreate: () => isAuthority || isExecutive,
        canManage: (book) => isAuthority || (isExecutive && isOwner(book)),
      },
    };
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const actionList = getActions(props, bookPermissions, { handleCreate });

    return (
      <>
        {createData.shown && (
          <CreateModal
            bookDataList={props.bookDataList}
            authorDataList={props.authorDataList}
            locationDataList={props.locationDataList}
            shown={true}
            onSaveDone={handleCreateDone}
            onCancel={handleCreateCancel}
          />
        )}
        {updateData.shown && (
          <UpdateModal
            bookDataObject={activeDataObject}
            authorDataList={props.authorDataList}
            locationDataList={props.locationDataList}
            onSaveDone={handleUpdateDone}
            onCancel={handleUpdateCancel}
            shown
          />
        )}
        {deleteData.shown && activeDataObject && (
          <DeleteModal
            bookDataObject={activeDataObject}
            shown
            onDeleteDone={handleDeleteDone}
            onCancel={handleDeleteCancel}
          />
        )}
        <ControllerProvider
          data={props.bookDataList.data}
          filterDefinitionList={getFilters(props.authorDataList, props.locationDataList, lsi)}
          sorterDefinitionList={getSorters(lsi)}
          filterList={props.filterList}
          sorterList={props.sorterList}
          onFilterChange={handleLoad}
          onSorterChange={handleLoad}
        >
          <Uu5Elements.Block
            {...attrs}
            actionList={actionList}
            info={<Lsi import={importLsi} path={[ListView.uu5Tag, "info"]} />}
            header={<Lsi import={importLsi} path={[ListView.uu5Tag, "header"]} />}
            headerType="heading"
            card="none"
          >
            <DataListStateResolver dataList={props.bookDataList}>
              <DataListStateResolver dataList={props.authorDataList}>
                <DataListStateResolver dataList={props.locationDataList}>
                  <Content
                    bookDataList={props.bookDataList}
                    authorDataList={props.authorDataList}
                    locationDataList={props.locationDataList}
                    bookPermissions={bookPermissions}
                    onLoadNext={handleLoadNext}
                    onDetail={handleDetail}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                </DataListStateResolver>
              </DataListStateResolver>
            </DataListStateResolver>
          </Uu5Elements.Block>
        </ControllerProvider>
      </>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getFilters(authorDataList, locationDataList, lsi) {
  let filterList = [];
  if (authorDataList.state === "ready") {
    filterList.push({
      key: "authorIdList",
      label: lsi.author,
      inputType: "select",
      inputProps: {
        multiple: true,
        itemList: authorDataList.data.map((authorDto) => ({
          value: authorDto.data.id,
          children: authorDto.data.name,
        })),
      },
    });
    if (locationDataList.state === "ready") {
      filterList.push({
        key: "locationId",
        label: lsi.location,
        inputType: "select",
        inputProps: {
          multiple: false,
          itemList: locationDataList.data.map((locationDto) => ({
            value: locationDto.data.id,
            children: locationDto.data.name,
          })),
        },
      });
    }
  }

  return filterList;
}

function getSorters(lsi) {
  return [
    {
      key: "name",
      label: lsi.name,
    },
  ];
}

function getBookDataObject(bookDataList, id) {
  return (
    bookDataList.newData?.find((item) => item?.data.id === id) || bookDataList.data.find((item) => item?.data.id === id)
  );
}

function getActions(props, bookPermissions, { handleCreate }) {
  const actionList = [];

  if (props.bookDataList.data) {
    actionList.push({
      component: FilterButton,
    });

    actionList.push({
      component: SorterButton,
    });
  }

  if (bookPermissions.book.canCreate()) {
    actionList.push({
      icon: "mdi-plus",
      children: <Lsi import={importLsi} path={[ListView.uu5Tag, "createBook"]} />,
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
