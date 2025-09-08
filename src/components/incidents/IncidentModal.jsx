import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Form, Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types'; 
import DatePicker from "react-datepicker";
import Select from 'react-select';
import "react-datepicker/dist/react-datepicker.css";
import { get, auth, task } from '../../services/api';
import { JsDate, ApiDate } from '../../services/util';  
import '../css/DatePicker.css';
import '../css/IncidentModal.css';
import useUser from "../../hooks/useUser";
import Confirmation from '../util/Confirmation';
import { IncidentStatus } from './IncidentStatus';


const IncidentModal = ({ isCreating, show, content, handleClose, handleCreate, handleUpdate }) => {
    const { user, supervisor } = useUser();

    //const [showModal, setShowModal] = useState(show);
    const [ id, setId ] = useState('');
    const [ eventNo, setEventNo ] = useState('');
    const [ station, setStation ] = useState('');
    const [ occurredAt, setOccurredAt ] = useState(new Date());
    const [ reportedAt, setReportedAt ] = useState(new Date());
    const [ reportedBy, setReportedBy ] = useState(null);
    const [ assignedTo, setAssignedTo ] = useState(null);
    const [ initialAssignee, setInitialAssignee ] = useState(null);
    const [ resolvedAt, setResolvedAt ] = useState(null);
    const [ faultNature, setFaultNature ] = useState('SOFTWARE');
    const [ summary, setSummary ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ remarksBySupervisor, setRemarksBySupervisor ] = useState('');
    const [ remarksByAssignee, setRemarksByAssignee ] = useState('');
    const [ remarksByInitialAssignee, setRemarksByInitialAssignee ] = useState('');
    const [ status, setStatus] = useState(null);
    const [ priority, setPriority ] = useState('HIGH');

    const [ summaryError, setSummaryError ] = useState('');

    const [ priorityOptions, setPriorityOptions ] = useState([]);
    const [ userOptions, setUserOptions ] = useState([]);

    const [ showConfirmation, setShowConfirmation ] = useState(false);
    const [ savedTask, setSavedTask ] = useState(null);


    const isAssignee = () => {
        return user?.userName === assignedTo;
    }

    const isAssigneeAndStatusInProgress = () => {
        if (isCreating) return false;

        return isAssignee() && (status === IncidentStatus.IN_PROGRESS.key);
    }

    const isFirstAssigneeAndStatusInProgress = () => {
        if (isCreating) return false;

        return isAssignee() && (status === IncidentStatus.IN_PROGRESS.key) && !initialAssignee;
    }

    const isSupervisorAndStatusOpen = () => {
        if (isCreating)return true;
        if (!supervisor)return false;

        return [IncidentStatus.REPORTED.key, IncidentStatus.IN_PROGRESS.key, IncidentStatus.RETURNED.key].includes(status);
    }

    const isSupervisorAndStatusCompleted = () => {
        return supervisor && (status === IncidentStatus.COMPLETED.key);
    }

    const shouldRemarksByAssigneeBeVisible = () => {
        if (isCreating || status === IncidentStatus.REPORTED.key || status === IncidentStatus.RETURNED.key)return false;

        if (status === IncidentStatus.IN_PROGRESS.key) {
            return isAssignee();
        } else {
            return true;
        } 
    }

    const shouldRemarksByInitialAssigneeBeVisible = () => {
        if (isCreating || status === IncidentStatus.REPORTED.key)return false;

        return !!content.initialAssignee;
    }

    const shouldRemarksBySupervisorBeVisible = () => {
        if (isCreating || [IncidentStatus.REPORTED.key , IncidentStatus.IN_PROGRESS.key, IncidentStatus.RETURNED.key].includes(status))
            return false;

        if (status === IncidentStatus.COMPLETED.key) {
            return supervisor;
        } else {
            return true;
        } 
    }

    const setContent = () => {
        setId(content.id);
        setEventNo(content.eventNo);
        setStation(content.station);
        setOccurredAt(JsDate(content.occurredAt));
        setReportedAt(JsDate(content.reportedAt));
        setReportedBy(content.reportedBy?.userName);
        setAssignedTo(content.assignedTo?.userName);
        setInitialAssignee(content.initialAssignee?.userName);
        setResolvedAt(content.resolvedAt);
        setFaultNature(content.faultNature);
        setSummary(content.summary);
        setDescription(content.description);
        setRemarksBySupervisor(content.remarksBySupervisor || '');
        setRemarksByAssignee(content.remarksByAssignee || '');
        setRemarksByInitialAssignee(content.remarksByInitialAssignee || '');
        setStatus(content.status);
        setPriority(content.priority);
    }

    const clearContent = () => {
        setId(null);
        setEventNo('');
        setStation('');
        setOccurredAt(new Date());
        setReportedAt(new Date());
        setReportedBy(null);
        setAssignedTo('');
        setInitialAssignee(null);
        setResolvedAt(null);
        setFaultNature('SOFTWARE');
        setSummary('');
        setDescription('');
        setRemarksBySupervisor('');
        setRemarksByAssignee('');
        setRemarksByInitialAssignee('');
        setStatus(null);
        setPriority('HIGH');
    }

    const loadPriorityOptions = async () => {
        const { status, data } = await get(task, '/incidents/priority/dropdown');
        if (status === 200) {
            setPriorityOptions(data.map(priority => ({ value: priority.id, label: priority.name })));
        }
    }

    const generateLabel = user => {
        return `${user.name}, ${user.designation}, ${user.office}`;
    }

    const loadUserOptions = async () => {
        const { status, data } = await get(auth, '/users/dropdown');
        if (status === 200) {
            const emptyOption = { value: '', label: 'Choose an assignee' };
            const options = data.map(user => ({ value: user.username, label: generateLabel(user) }));
            setUserOptions([emptyOption, ...options]);
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
        if (!summary || summary.trim() === '') {
            setSummaryError('Incident summary is required');
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
            occurredAt: ApiDate(occurredAt),
            reportedAt: ApiDate(reportedAt),
            reportedBy,
            assignedTo,
            resolvedAt,
            faultNature,
            summary,
            description,
            status: isCreating ? null: status,
            priority
        };
        console.log('incident to save', incident);

        handleCreate(incident);
    }
 
    const handleTaskCompletetion = (completed = true) => {
        const updateRequestByAssignee = {
            id: content?.id || null,
            remarksByAssignee,
            completed
        };
        console.log('incident to complete by assignee', updateRequestByAssignee);

        handleUpdate('update-by-assignee', updateRequestByAssignee);
    }

    const handleTaskReview = () => {
        const updateRequestBySupervisor = {
            id: content?.id || null,
            remarksBySupervisor
        };
        console.log('Supervisor Update Request: ', updateRequestBySupervisor);

        handleUpdate('update-by-supervisor', updateRequestBySupervisor);
    }

    const closeConfirmationModal = () => {
        setShowConfirmation(false);
    }

    const showConfirmationModal = () => {
        setShowConfirmation(true);
    }

    const handleTask = (callback) => {
        showConfirmationModal();
        setSavedTask(() => callback);
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
            <Modal 
                show={ show } 
                onHide={ handleClose } 
                size='lg' 
                contentClassName={ showConfirmation ? 'bottom-modal-dim' : 'bottom-modal-bg' }
            >
                <Modal.Header closeButton>
                    <Modal.Title>{ isCreating ? 'New Incident' : 'Edit Incident' }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Incident Summary</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        placeholder="*Write incident summary here..."
                                        value={ summary }
                                        required
                                        maxLength={ 1024 }
                                        autoFocus
                                        onFocus={ () => setSummaryError('') }
                                        onChange={ (e) => setSummary(e.target.value) }
                                        disabled={ !isSupervisorAndStatusOpen() }
                                    />
                                    { summaryError && <p className="text-danger">{ summaryError }</p> }
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Priority</Form.Label>
                                    <Select
                                        options={ priorityOptions }
                                        onChange={ (option) => setPriority(option.value) }
                                        placeholder="Select Priority"
                                        value={ priorityOptions.find(option => option.value === priority) }
                                        isDisabled={ !isSupervisorAndStatusOpen() } 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assigned To</Form.Label>
                                    <Select
                                        options={ userOptions }
                                        onChange={ (option) => setAssignedTo(option.value) }
                                        placeholder="Select Assignee"
                                        value={ userOptions.find(option => option.value === assignedTo) }
                                        isDisabled={ !supervisor } 
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Station</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        placeholder="Station"
                                        value={ station }
                                        maxLength={ 64 }
                                        onChange={ (e) => setStation(e.target.value) }
                                        disabled={ !isSupervisorAndStatusOpen() }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6} sm={12} style={{ display: isCreating ? 'none' : 'block' }}>
                                <Form.Group className="">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        placeholder="Status"
                                        value={ content?.statusStr }
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} style={{ display: shouldRemarksByInitialAssigneeBeVisible() ? 'block' : 'none' }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Initial Assignee Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        placeholder=""
                                        value={ remarksByInitialAssignee }
                                        maxLength={ 1024 }
                                        disabled
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} style={{ display: shouldRemarksByAssigneeBeVisible() ? 'block' : 'none' }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Assignee Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        placeholder=""
                                        value={ remarksByAssignee }
                                        maxLength={ 1024 }
                                        autoFocus
                                        onChange={ (e) => setRemarksByAssignee(e.target.value) }
                                        disabled={ !isAssigneeAndStatusInProgress() }
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} style={{ display: shouldRemarksBySupervisorBeVisible() ? 'block' : 'none' }}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Supervisor Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        placeholder=""
                                        value={ remarksBySupervisor }
                                        maxLength={ 1024 }
                                        autoFocus
                                        onChange={ (e) => setRemarksBySupervisor(e.target.value) }
                                        disabled={ !isSupervisorAndStatusCompleted() }
                                    />
                                </Form.Group>
                            </Col>
                            
                            {/* <Col md={6} sm={12}>
                                <Form.Group className="">
                                    <div>
                                        <Form.Label>Occurred At</Form.Label>
                                    </div>
                                    <DatePicker
                                        className='modal-input'
                                        selected={occurredAt ? new Date(occurredAt) : new Date()}
                                        onChange={(d) => handleDateChange(d, setOccurredAt)}
                                        showTimeSelect
                                        timeIntervals={1}
                                        dateFormat="dd MMM, yyyy hh:mm a"
                                    />
                                </Form.Group>
                            </Col> */}
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button 
                        variant="warning" 
                        onClick={ () => handleTask(() => handleTaskCompletetion(false)) } 
                        style={{ display: isFirstAssigneeAndStatusInProgress() ? '' : 'none' }}
                    >
                        Return To Supervisor
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={ () => handleTask(handleTaskCompletetion)} 
                        style={{ display: isAssigneeAndStatusInProgress() ? '' : 'none' }}
                    >
                        Task Done?
                    </Button>
                    {/* <Button variant="warning" onClick={handleTaskReview} style={{ display: isReporterAndStatusCompleted() ? '' : 'none' }}>
                        Under observation
                    </Button> */}
                    <Button 
                        variant="success" 
                        onClick={() => handleTask(handleTaskReview)} 
                        style={{ display: isSupervisorAndStatusCompleted() ? '' : 'none' }}
                    >
                        Resolved
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => handleTask(handleSave)} 
                        style={{ display: isSupervisorAndStatusOpen() ? '' : 'none' }}
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Confirmation
                show={ showConfirmation }
                onConfirm={ () => {
                    closeConfirmationModal();
                    savedTask?.();
                    setSavedTask(null);
                } }
                onCancel={ closeConfirmationModal }  
            />
        </>
    );
}

IncidentModal.propTypes = {
    isCreating: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    content: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
    handleCreate: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired,
};

export default IncidentModal;