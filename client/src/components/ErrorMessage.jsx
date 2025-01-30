import PropTypes from "prop-types";

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center h-64 text-red-600">
      <p className="text-xl">{message}</p>
    </div>
  );
};
ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
