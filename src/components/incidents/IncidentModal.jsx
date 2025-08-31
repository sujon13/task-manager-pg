import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types'; 
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { get, task, auth } from '../../services/api';
import { JsDate, ApiDate } from '../../services/util';  
import '../css/DatePicker.css';


const IncidentModal = ({ isCreating, show, content, handleClose, handleCreate }) => {
    //const [showModal, setShowModal] = useState(show);
    const [ id, setId ] = useState('');
    const [ eventNo, setEventNo ] = useState('');
    const [ station, setStation ] = useState('');
    const [ occurredAt, setOccurredAt ] = useState(new Date());
    const [ reportedAt, setReportedAt ] = useState(new Date());
    const [ reportedBy, setReportedBy ] = useState('');
    const [ assignedTo, setAssignedTo ] = useState('');
    const [ resolvedAt, setResolvedAt ] = useState(null);
    const [ faultNature, setFaultNature ] = useState('SOFTWARE');
    const [ summary, setSummary ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ remarksByReporter, setRemarksByReporter ] = useState('');
    const [ remarksByAssignee, setRemarksByAssignee ] = useState('');
    const [ status, setStatus] = useState(null);
    const [ priority, setPriority ] = useState('HIGH');

    const [ summaryError, setSummaryError ] = useState('');

    const [ priorityOptions, setPriorityOptions ] = useState([]);
    const [ userOptions, setUserOptions ] = useState([]);


    const setContent = () => {
        setId(content.id);
        setEventNo(content.eventNo);
        setStation(content.station);
        setOccurredAt(JsDate(content.occurredAt));
        setReportedAt(JsDate(content.reportedAt));
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
        setOccurredAt(new Date());
        setReportedAt(new Date());
        setReportedBy('');
        setAssignedTo('');
        setResolvedAt(null);
        setFaultNature('SOFTWARE');
        setSummary('');
        setDescription('');
        setRemarksByReporter('');
        setRemarksByAssignee('');
        setStatus(null);
        setPriority('HIGH');
    }

    const loadPriorityOptions = async () => {
        const { status, data } = await get(task, '/incidents/priority/dropdown');
        if (status === 200) {
            setPriorityOptions(data.map(priority => ({ value: priority.name, label: priority.name })));
        }
    }

    const loadUserOptions = async () => {
        const { status, data } = await get(auth, '/users/dropdown');
        if (status === 200) {
            setUserOptions(data.map(user => ({ value: user.username, label: user.name })));
        }
    }

    useEffect(() => {
        loadPriorityOptions();
        loadUserOptions();
        if (content) {
            console.info('has content');
            setContent();
        } else {
            console.log('no content');
            clearContent();
        }
    }, [show, content]);

    const validate = () => {
        return true;
    }

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        const incident = {
            id: content?.id || null,
            station,
            occurredAt: ApiDate(occurredAt),
            reportedAt: ApiDate(reportedAt),
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
        console.log('incident to save', incident);

        handleCreate(incident);
    }

    const handleDateChange = (date, setter) => {
        console.log('date selected', date);
        setter(date);
    }

    if (show === false) {
        console.log('show is false');
        return null;
    }

    return (
        <>
            <Modal show={ show } onHide={ handleClose } size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{ isCreating ? 'New Incident' : 'Edit Incident' }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Station</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Station"
                                        value={ station }
                                        maxLength={ 64 }
                                        onChange={ (e) => setStation(e.target.value) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group className="">
                                    <div>
                                        <Form.Label>Occurred At</Form.Label>
                                    </div>
                                    <DatePicker
                                        selected={occurredAt ? new Date(occurredAt) : new Date()}
                                        onChange={(d) => handleDateChange(d, setOccurredAt)}
                                        showTimeSelect
                                        timeIntervals={1}
                                        dateFormat="dd MMM, yyyy hh:mm a"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Incident Summary</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        placeholder="Write incident summary here..."
                                        value={ summary }
                                        required
                                        maxLength={ 1024 }
                                        autoFocus
                                        onFocus={ () => setSummaryError('') }
                                        onChange={ (e) => setSummary(e.target.value) }
                                    />
                                    { summaryError && <p className="text-danger">{ summaryError }</p> }
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Priority</Form.Label>
                                    <Select
                                        options={ priorityOptions }
                                        onChange={ (option) => setPriority(option.value) }
                                        placeholder="Select Priority"
                                        value={ priorityOptions.find(option => option.value === priority) }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Assigned To</Form.Label>
                                    <Select
                                        options={ userOptions }
                                        onChange={ (option) => setAssignedTo(option.value) }
                                        placeholder="Select Assignee"
                                        value={ userOptions.find(option => option.value === assignedTo) }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
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