import Button from 'react-bootstrap/Button';
import { Form, Row, Col } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import "react-datepicker/dist/react-datepicker.css";
import '../css/DatePicker.css';
import '../css/IncidentModal.css';
import useUser from "../../hooks/useUser";
import { IncidentStatus } from './IncidentStatus';
import { convertTo12HourDateTime, capitalizeFirst } from '../../services/util';


const IncidentView = ({ show, content, handleClose }) => {
    const { user, supervisor } = useUser();

    const isAssignee = () => {
        return user?.userName === content?.assignedTo;
    }

    const shouldRemarksByAssigneeBeVisible = () => {
        if (content?.status === IncidentStatus.REPORTED.key || content?.status === IncidentStatus.RETURNED.key)return false;

        if (content?.status === IncidentStatus.IN_PROGRESS.key) {
            return isAssignee();
        } else {
            return true;
        } 
    }

    const shouldRemarksByInitialAssigneeBeVisible = () => {
        if (content?.status === IncidentStatus.REPORTED.key)return false;

        return !!content.initialAssignee;
    }

    const shouldRemarksBySupervisorBeVisible = () => {
        if ([IncidentStatus.REPORTED.key , IncidentStatus.IN_PROGRESS.key, IncidentStatus.RETURNED.key].includes(content?.status))
            return false;

        if (content?.status === IncidentStatus.COMPLETED.key) {
            return supervisor;
        } else {
            return true;
        } 
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
                //contentClassName={ showConfirmation ? 'bottom-modal-dim' : 'bottom-modal-bg' }
            >
                <Modal.Header closeButton>
                    <Modal.Title>Incident</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-1">
                                    <Form.Label>Incident Summary</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        value={ content?.summary }
                                        maxLength={ 1024 }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Occurred At</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value={ convertTo12HourDateTime(content?.occurredAt) || "" }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Reported At</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value={ convertTo12HourDateTime(content?.reportedAt) || "" }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Reported By</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value={ content?.reportedBy?.name || "" }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12} style={{ display: content?.initialAssignee ? 'block' : 'none' }}>
                                <Form.Group className="">
                                    <Form.Label>Initial Assignee</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value={ content?.initialAssignee?.name || "" }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>{ content?.initialAssignee ? 'Current ': ''}Assignee</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value={ content?.assignedTo?.name || "" }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Priority</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value ={ capitalizeFirst(content?.priority) }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Station</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value={ content?.station }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4} sm={12}>
                                <Form.Group className="">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        className='modal-input'
                                        type="text"
                                        value={ content?.statusStr }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} style={{ display: shouldRemarksByInitialAssigneeBeVisible() ? 'block' : 'none' }}>
                                <Form.Group className="mb-1">
                                    <Form.Label>Initial Assignee Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        value={ content?.remarksByInitialAssignee }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} style={{ display: shouldRemarksByAssigneeBeVisible() ? 'block' : 'none' }}>
                                <Form.Group className="mb-1">
                                    <Form.Label>Assignee Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        value={ content?.remarksByAssignee }
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={12} style={{ display: shouldRemarksBySupervisorBeVisible() ? 'block' : 'none' }}>
                                <Form.Group className="mb-1">
                                    <Form.Label>Supervisor Remarks</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        cols={50}
                                        value={ content?.remarksBySupervisor }
                                        readOnly
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
                </Modal.Footer>
            </Modal>
        </>
    );
}

IncidentView.propTypes = {
    show: PropTypes.bool.isRequired,
    content: PropTypes.object,
    handleClose: PropTypes.func.isRequired,
};

export default IncidentView;