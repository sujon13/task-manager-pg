import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const EditConfirmation = ({ show, onConfirm, onCancel, message }) => {
    return (
        <Modal show={show} onHide={onCancel} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message || "Are you sure you want to proceed?"}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="warning" onClick={onConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

EditConfirmation.propTypes = {
    show: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    message: PropTypes.string,
};

export default EditConfirmation;
