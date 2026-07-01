import EmptyState from "./EmptyState.jsx";
import { HiOutlineSparkles } from "react-icons/hi2";

export function ComingSoon({ title = "Coming Soon", description = "We are working hard to bring you this feature. Stay tuned!", actions, ...props }) {
  return (
    <EmptyState
      icon={HiOutlineSparkles}
      title={title}
      description={description}
      actions={actions}
      {...props}
    />
  );
}

export default ComingSoon;
