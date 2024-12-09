import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types'; 

const ExamTakerModal = ({ isCreating, show, content, handleClose, handleCreate }) => {
    //const [showModal, setShowModal] = useState(show);
    const [ engName, setEngName ] = useState('');
    const [ engNameError, setEngNameError ] = useState('');
    const [ bngName, setBngName ] = useState('');
    const [ description, setDescription ] = useState('');

    useEffect(() => {
        if (content) {
            setEngName(content.engName || '');
            setBngName(content.bngName || '');
            setDescription(content.description || '');
        } else {
            setEngName('');
            setBngName('');
            setDescription('');
        }
    }, [show, content]);

    const validate = () => {
        if (!engName) {
            setEngNameError('English title is required');
            return false;
        }
        return true;
    }

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        const examTaker = {
            id: content?.id || null,
            engName,
            bngName,
            description,
        };

        handleCreate(examTaker);
    }

    if (show === false) {
        return null;
    }

    return (
        <>
            <Modal show={ show } onHide={ handleClose }>
                <Modal.Header closeButton >
                    <Modal.Title>{ isCreating ? 'New Exam Taker' : 'Edit Exam Taker' }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="English Name"
                                value={ engName }
                                required
                                maxLength={ 256 }
                                autoFocus
                                onFocus={ () => setEngNameError('') }
                                onChange={ (e) => setEngName(e.target.value) }
                            />
                            { engNameError && <p className="text-danger">{ engNameError }</p> }
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                maxLength={ 128 }
                                placeholder="Bangla Name" 
                                value={ bngName }
                                onChange={ (e) => setBngName(e.target.value) }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                as="textarea"
                                rows={ 3 }
                                placeholder="Description"
                                value={ description }
                                onChange={ (e) => setDescription(e.target.value) }
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

ExamTakerModal.propTypes = {
    isCreating: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    content: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleCreate: PropTypes.func.isRequired,
};

export default ExamTakerModal;