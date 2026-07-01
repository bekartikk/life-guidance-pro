import EmptyState from "./EmptyState.jsx";
import { HiOutlineWifi } from "react-icons/hi2";

export function OfflineState({ title = "You are offline", description = "Please check your internet connection and try again.", actions, ...props }) {
  return (
    <EmptyState
      icon={HiOutlineWifi}
      title={title}
      description={description}
      actions={actions}
      {...props}
    />
  );
}

export default OfflineState;
