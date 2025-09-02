// ToastNotification.js
import { Toast, ToastContainer } from 'react-bootstrap';
import PropTypes from 'prop-types';

function ToastNotification({ show, onClose, message, title, isSuccess = true }) {
  return (
    <ToastContainer position="top-center" className="p-3">
      <Toast 
        show={show} 
        onClose={onClose} 
        delay={3000} 
        autohide 
        style={{ backgroundColor: isSuccess ? 'green' : '', color: isSuccess ? 'white' : '' }}
      >
        <Toast.Header>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

ToastNotification.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isSuccess: PropTypes.bool,
};

export default ToastNotification;
