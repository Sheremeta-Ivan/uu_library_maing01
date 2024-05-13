//@@viewOn:imports
import { createVisualComponent } from "uu5g05";
import AuthorListProvider from "./list-provider";
import ListView from "./list-view";

//@@viewOff:imports

export const List = createVisualComponent({
  render() {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return (
      <AuthorListProvider>
        {({ authorDataList }) => {
          return <ListView authorDataList={authorDataList} />;
        }}
      </AuthorListProvider>
    );

    //@@viewOff:render
  },
});

export default List;
