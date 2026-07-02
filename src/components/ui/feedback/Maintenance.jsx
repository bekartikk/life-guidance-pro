import EmptyState from "./EmptyState.jsx";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";

export function Maintenance({ title = "Under Maintenance", description = "We are currently performing scheduled maintenance. Please check back later.", actions, ...props }) {
  return (
    <EmptyState
      icon={HiOutlineWrenchScrewdriver}
      title={title}
      description={description}
      actions={actions}
      {...props}
    />
  );
}

export default Maintenance;
