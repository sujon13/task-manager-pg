import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types'; 

const QuestionModal = ({ isCreating, show, content, handleClose, handleCreate }) => {
    //const [showModal, setShowModal] = useState(show);
    const [ engName, setEngName ] = useState('');
    const [ engNameError, setEngNameError ] = useState('');
    const [ bngName, setBngName ] = useState('');
    const [ grade, setGrade ] = useState(null);

    useEffect(() => {
        if (content) {
            setEngName(content.engName);
            setBngName(content.bngName);
            setGrade(content.grade);
        } else {
            setEngName('');
            setBngName('');
            setGrade(9);
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

        const post = {
            id: content?.id || null,
            engName,
            bngName,
            grade,
        };

        handleCreate(post);
    }

    if (show === false) {
        console.log('show is false');
        return null;
    }

    return (
        <>
            <Modal show={ show } onHide={ handleClose }>
                <Modal.Header closeButton >
                    <Modal.Title>{ isCreating ? 'New Post' : 'Edit Post' }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                placeholder="English Title"
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
                                placeholder="Bangla Title" 
                                value={ bngName }
                                onChange={ (e) => setBngName(e.target.value) }
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="number"
                                placeholder="Grade"
                                value={ grade }
                                min="1"
                                max="20"    
                                onChange={ (e) => setGrade(e.target.value) }
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

QuestionModal.propTypes = {
    isCreating: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    content: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleCreate: PropTypes.func.isRequired,
};

export default QuestionModal;