import Alert from "./Alert.jsx";

export function ErrorAlert({ title = "Error", children, ...props }) {
  return (
    <Alert tone="error" title={title} {...props}>
      {children}
    </Alert>
  );
}

export default ErrorAlert;
