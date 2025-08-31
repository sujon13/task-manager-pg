import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types'; 

const IncidentModal = ({ isCreating, show, content, handleClose, handleCreate }) => {
    //const [showModal, setShowModal] = useState(show);
    const [ id, setId ] = useState('');
    const [ eventNo, setEventNo ] = useState('');
    const [ station, setStation ] = useState('');
    const [ occurredAt, setOccurredAt ] = useState(null);
    const [ reportedAt, setReportedAt ] = useState(null);
    const [ reportedBy, setReportedBy ] = useState('');
    const [ assignedTo, setAssignedTo ] = useState('');
    const [ resolvedAt, setResolvedAt ] = useState('');
    const [ faultNature, setFaultNature ] = useState('');
    const [ summary, setSummary ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ remarksByReporter, setRemarksByReporter ] = useState('');
    const [ remarksByAssignee, setRemarksByAssignee ] = useState('');
    const [ status, setStatus] = useState('');
    const [ priority, setPriority ] = useState('');

    const [ stationError, setStationError ] = useState('');


    const setContent = () => {
        setId(content.id);
        setEventNo(content.eventNo);
        setStation(content.station);
        setOccurredAt(content.occurredAt);
        setReportedAt(content.reportedAt);
        setReportedBy(content.reportedBy);
        setAssignedTo(content.assignedTo);
        setResolvedAt(content.resolvedAt);
        setFaultNature(content.faultNature);
        setSummary(content.summary);
        setDescription(content.description);
        setRemarksByReporter(content.remarksByReporter);
        setRemarksByAssignee(content.remarksByAssignee);
        setStatus(content.status);
        setPriority(content.priority);
    }

    const clearContent = () => {
        setId(null);
        setEventNo('');
        setStation('');
        setOccurredAt(null);
        setReportedAt(null);
        setReportedBy('');
        setAssignedTo('');
        setResolvedAt(null);
        setFaultNature('');
        setSummary('');
        setDescription('');
        setRemarksByReporter('');
        setRemarksByAssignee('');
        setStatus('');
        setPriority('');
    }
    
    useEffect(() => {
        if (content) {
            setContent();
        } else {
            clearContent();
        }
    }, [show, content]);

    const validate = () => {
        if (!station) {
            setStationError('Station is required');
            return false;
        }
        return true;
    }

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        const incident = {
            id: content?.id || null,
            station,
            occurredAt,
            reportedAt,
            reportedBy,
            assignedTo,
            resolvedAt,
            faultNature,
            summary,
            description,
            remarksByReporter,
            remarksByAssignee,
            status,
            priority
        };

        handleCreate(incident);
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

IncidentModal.propTypes = {
    isCreating: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    content: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleCreate: PropTypes.func.isRequired,
};

export default IncidentModal;