import Alert from "./Alert.jsx";

export function SuccessAlert({ title = "Success", children, ...props }) {
  return (
    <Alert tone="success" title={title} {...props}>
      {children}
    </Alert>
  );
}

export default SuccessAlert;
