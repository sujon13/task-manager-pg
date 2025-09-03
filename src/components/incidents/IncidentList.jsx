import { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import Spinner from 'react-bootstrap/Spinner';

import PaginatedTable from '../util/PaginatedTable';
import { get, post, put, deleteEntry, task, auth } from '../../services/api';
import IncidentModal from './IncidentModal';
import DeleteConfirmation from '../util/DeleteConfirmation';


const IncidentList = () => {
    // State
    const [ data, setData ] = useState({});
    const [ currentPage, setCurrentPage ] = useState(0);
    const [ size, setSize ] = useState(5);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showModal, setShowModal ] = useState(false);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(true);

    const [ id, setId ] = useState(null);
    //const [ eventNo, setEventNo ] = useState('');
    //const [ station, setStation ] = useState('');
    //const [ occurredAt, setOccurredAt] = useState('');
    const [ reportedBy, setReportedBy ] = useState(null);
    const [ assignedTo, setAssignedTo ] = useState(null);
    const [ status, setStatus ] = useState(null);
    const [ priority, setPriority ] = useState(null);

    const [ priorityOptions, setPriorityOptions ] = useState([]);
    const [ statusOptions, setStatusOptions ] = useState([]);
    const [ reporterOptions, setReporterOptions ] = useState([]);
    const [ assigneeOptions, setAssigneeOptions ] = useState([]);

  // Mock data
    const content = [
        { id: 1, engName: 'John Doe', bngName: 'জন ডো', grade: 9 },
        { id: 2, engName: 'Jane Smith', bngName: 'জেন স্মিথ', grade: 10 },
        { id: 3, engName: 'Michael Lee', bngName: 'মাইকেল লি', grade: 9 },
    ];

    const fetchIncidents = async (page, size, showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }

        const params = {
            page,
            size,
            reportedBy,
            assignedTo,
            status,
            priority,
        };

        const response = await get(task, '/incidents', params);
        if (response.status === 200) {
            const { data } = response;
            setData(data);
            setCurrentPage(data.number);
            setSize(data.size);
        }
        if (showLoading) {
            setIsLoading(false);
        }
    }

    const loadPriorityOptions = async () => {
        const { status, data } = await get(task, '/incidents/priority/dropdown');
        if (status === 200) {
            const emptyOption = { value: '', label: '--Select Priority--' };
            const options = data.map(priority => ({ value: priority.id, label: priority.name }))
            setPriorityOptions([emptyOption, ...options]);
        }
    }

    const loadStatusOptions = async () => {
        const { status, data } = await get(task, '/incidents/status/dropdown');
        if (status === 200) {
            const emptyOption = { value: '', label: '--Select Status--' };
            const options = data.map(status => ({ value: status.id, label: status.name }));
            setStatusOptions([emptyOption, ...options]);
        }
    }

    const buildUserOptions = (data, label) => {
        const emptyOption = { value: '', label: label };
        const options = data.map(user => ({ value: user.username, label: user.name }));
        return [emptyOption, ...options];
    }

    const loadUserOptions = async () => {
        const { status, data } = await get(auth, '/users/dropdown');
        if (status === 200) {
            setReporterOptions(buildUserOptions(data, '--Select Reporter--'));
            setAssigneeOptions(buildUserOptions(data, '--Select Assignee--'));
        }
    }

    useEffect(() => {
        fetchIncidents(currentPage, size);
        loadPriorityOptions();
        loadStatusOptions();
        loadUserOptions();
    }, [currentPage, size]);


    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'Event', dataField: 'eventNo', type: 'int' },
        { text: 'Station', dataField: 'station', type: 'string' },
        { text: 'Reported At', dataField: 'reportedAt', type: 'date' },
        { text: 'Reported By', dataField: 'reportedBy', type: 'user' },
        { text: 'Assigned To', dataField: 'assignedTo', type: 'user' },
        { text: 'Incident', dataField: 'summary', type: 'string' },
        { text: 'Priority', dataField: 'priority', type: 'enum' },
        { text: 'Status', dataField: 'status', type: 'enum', extraField: 'statusStr' },
    ];
  
  // Handlers
    const handlePageChange = page => setCurrentPage(page);

    const findIncidentById = (id) => {
        return data.content.find(p => p.id === id);
    }

    const handleEdit = (id) => {
        console.log('clicked incident id', id);
        setId(id);
        setIsCreating(false);
        setShowModal(true);
    }

    const handleDelete = (id) => {
        setId(id);
        setShowDeleteConfirmation(true);
    };

    const handleOk = () => {
        fetchIncidents(currentPage, size, false);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    const handleError = (error) => {
        setTimeout(() => {
            setIsLoading(false);
            console.error(error);
        }, 500);
    }

    const deleteIncident = async (id) => {
        setIsLoading(true);
        const { status, data } = await deleteEntry(task, '/incidents', id);
        if (status === 204) {
            handleOk();
        } else {
            handleError(data);
        }
    };

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        deleteIncident(id);
    }
      
    const handleAddNew = () => {
        setId(null);
        setIsCreating(true);
        setShowModal(true);
        console.log(showModal);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const handleSave = async (newIncident) => {
        setIsLoading(true);
        const { status, data } = await (isCreating ? post : put)(task, '/incidents', newIncident);
        if (status >= 200 && status < 300) {
            handleClose();
            handleOk();
        } else {
            handleError(data);
        }
    }

    const handleUpdate = async (path, updateRequest) => {
        setIsLoading(true);
        const { status, data } = await put(task, `/incidents/${path}`, updateRequest);
        if (status >= 200 && status < 300) {
            handleClose();
            handleOk();
        } else {
            handleError(data);
        }
    }

    const handleSearch = () => {
        setIsLoading(true);
        fetchIncidents(0, size, false);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    return (
        <div className="container mt-4">
            <IncidentModal 
                isCreating={isCreating}
                show={ showModal } 
                content={ isCreating ? null : findIncidentById(id) }
                handleClose={handleClose} 
                handleCreate={handleSave} 
                handleUpdate={handleUpdate}
            />
            <DeleteConfirmation
                show={showDeleteConfirmation}
                onConfirm={ handleDeleteConfirmation }
                onCancel={() => setShowDeleteConfirmation(false)}
                message="Are you sure you want to delete this item?"
            />

            <div>
                <Row>
                    <Col md={4}>
                        <Select
                            options={ reporterOptions }
                            onChange={ (option) => setReportedBy(option.value) }
                            placeholder="Reported By"
                            value={ reporterOptions.find(option => option.value === reportedBy) }
                        />
                    </Col>
                    <Col md={4}>
                        <Select
                            options={ assigneeOptions }
                            onChange={ (option) => setAssignedTo(option.value) }
                            placeholder="Assigned To"
                            value={ assigneeOptions.find(option => option.value === assignedTo) }
                        />
                    </Col>
                    <Col md={4}>
                       <Select
                            options={ priorityOptions }
                            onChange={ (option) => setPriority(option.value) }
                            placeholder="Select Priority"
                            value={ priorityOptions.find(option => option.value === priority) }
                        />
                    </Col>
                    <Col md={3}>
                        <Select
                            options={ statusOptions }
                            onChange={ (option) => setStatus(option.value) }
                            placeholder="Select Status"
                            value={ statusOptions.find(option => option.value === status) }
                        /> 
                    </Col>
                    <Col md={1} >
                        <Button 
                            variant="primary" 
                            className="search-button"
                            onClick={ handleSearch }
                        >
                            Search
                        </Button>    
                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="d-flex justify-content-end mb-3">
                        <Button variant="success" onClick={handleAddNew}>
                            <FaPlus className="me-1" /> Add New Entry
                        </Button>
                    </Col>
                </Row>
            </div>
            {/* <div className="d-flex justify-content-between align-items-center mb-3">
                <InputGroup style={{ maxWidth: '300px' }}>
                    <Form.Control placeholder="Search..." />
                    <Button variant="primary">Filter</Button>
                </InputGroup>
                <Button variant="success" onClick={handleAddNew}>
                    <FaPlus className="me-1" /> Add New Entry
                </Button>
            </div> */}
            {isLoading 
                ? <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div> 
                : <PaginatedTable 
                    data={data} 
                    columns={columns} 
                    anyActionColumn={true}
                    pageChange={handlePageChange} 
                    handleEdit={handleEdit} 
                    handleDelete={handleDelete} 
                />
            }
        </div>
    );
};

export default IncidentList;
