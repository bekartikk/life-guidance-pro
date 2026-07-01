import Alert from "./Alert.jsx";

export function WarningAlert({ title = "Warning", children, ...props }) {
  return (
    <Alert tone="warning" title={title} {...props}>
      {children}
    </Alert>
  );
}

export default WarningAlert;
