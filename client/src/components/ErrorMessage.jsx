// client/src/components/ErrorMessage.jsx
const ErrorMessage = ({ error }) => {
    return error ? <div className="form-error">{error}</div> : null;
  };
  export default ErrorMessage;