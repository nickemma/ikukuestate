import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => (
  <ToastContainer position="top-right" autoClose={3000} />
);

export default Notification;
