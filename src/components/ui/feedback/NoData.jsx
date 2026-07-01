import EmptyState from "./EmptyState.jsx";
import { HiOutlineFolderOpen } from "react-icons/hi2";

export function NoData({ title = "No data found", description = "There is nothing to display here right now.", actions, ...props }) {
  return (
    <EmptyState
      icon={HiOutlineFolderOpen}
      title={title}
      description={description}
      actions={actions}
      {...props}
    />
  );
}

export default NoData;
