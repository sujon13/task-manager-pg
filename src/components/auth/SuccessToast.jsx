import PropTypes from 'prop-types';
import '../css/Signup.css';
import { Toast, ToastContainer } from "react-bootstrap";


const SuccessToast = ({onClose, autohideTimeInMillis, show, toastBody}) => {
    return (
        <ToastContainer position="middle-center" className="p-3">
            <Toast
                bg="primary"
                onClose={onClose}
                show={show}
                delay={autohideTimeInMillis}       
                autohide
            >
            <Toast.Body className="text-white text-center">{toastBody}</Toast.Body>
            </Toast>
        </ToastContainer>
    )  
}

SuccessToast.propTypes = {
    autohideTimeInMillis: PropTypes.number,
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    toastBody: PropTypes.string
}

export default SuccessToast;