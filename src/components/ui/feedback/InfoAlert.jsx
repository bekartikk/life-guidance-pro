import Alert from "./Alert.jsx";

export function InfoAlert({ title = "Info", children, ...props }) {
  return (
    <Alert tone="info" title={title} {...props}>
      {children}
    </Alert>
  );
}

export default InfoAlert;
