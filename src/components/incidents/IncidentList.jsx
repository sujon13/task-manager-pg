import { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import Spinner from 'react-bootstrap/Spinner';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import PaginatedTable from '../util/PaginatedTable';
import { get, post, put, deleteEntry, task, auth } from '../../services/api';
import { ApiDate } from '../../services/util'; 
import IncidentModal from './IncidentModal';
import IncidentView from './IncidentView';
import DeleteConfirmation from '../util/DeleteConfirmation';
import useUser from "../../hooks/useUser";
import '../css/IncidentList.css';


const IncidentList = () => {
    const { logout } = useUser();

    // State
    const [ data, setData ] = useState({});
    const [ currentPage, setCurrentPage ] = useState(0);
    const [ size, setSize ] = useState(5);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showModal, setShowModal ] = useState(false);
    const [ showViewModal, setShowViewModal ] = useState(false);
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

    // Date filters
    const [reportedAtFrom, setReportedAtFrom] = useState(null);
    const [reportedAtTo, setReportedAtTo] = useState(null);
    const [reportedAtTimeframe, setReportedAtTimeframe] = useState(null);
    const [resolvedAtFrom, setResolvedAtFrom] = useState(null);
    const [resolvedAtTo, setResolvedAtTo] = useState(null);
    const [resolvedATimeframe, setResolvedATimeframe] = useState(null);


    const [ priorityOptions, setPriorityOptions ] = useState([]);
    const [ statusOptions, setStatusOptions ] = useState([]);
    const [ reporterOptions, setReporterOptions ] = useState([]);
    const [ assigneeOptions, setAssigneeOptions ] = useState([]);

    const timeframeOptions = [
        { value: '', label: '--Select Timeframe--' },
        { value: 'today', label: 'Today' },
        { value: 'this_week', label: 'This Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_month', label: 'Last Month' }
    ];

    const calculateFromAndToFromTimeFrame = optionValue => {
        const today = new Date();
        let from = null, to = null;

        switch (optionValue) {
            case 'today':
                from = new Date(today.setHours(0, 0, 0, 0));
                to = new Date();
                break;
            case 'this_week': {
                const firstDay = new Date(today);
                firstDay.setDate(today.getDate() - today.getDay()); // Sunday start
                firstDay.setHours(0, 0, 0, 0);
                from = firstDay;
                to = new Date();
                break;
            }
            case 'this_month': {
                from = new Date(today.getFullYear(), today.getMonth(), 1);
                to = new Date();
                break;
            }
            case 'last_month': {
                from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                to = new Date(today.getFullYear(), today.getMonth(), 0); // last day prev month
                from.setHours(0, 0, 0, 0);       // start of first day
                to.setHours(23, 59, 59, 999);   // end of last day
                break;
            }
            default:
                from = null;
                to = null;
        }
        return {
            from,
            to
        }
    }

    const handleReportedAtTimeframeChange = option => {
        setReportedAtTimeframe(option.value);

        const { from, to } = calculateFromAndToFromTimeFrame(option.value);
        setReportedAtFrom(from);
        setReportedAtTo(to);
    };

    const handleResolvedAtTimeframeChange = option => {
        setResolvedATimeframe(option.value);

        const { from, to } = calculateFromAndToFromTimeFrame(option.value);
        setResolvedAtFrom(from);
        setResolvedAtTo(to);
    };

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
            reportedAtFrom: ApiDate(reportedAtFrom),
            reportedAtTo: ApiDate(reportedAtTo),
            resolvedAtFrom: ApiDate(resolvedAtFrom),
            resolvedAtTo: ApiDate(resolvedAtTo)
        };

        const response = await get(task, '/incidents', params);
        if (response.status === 200) {
            const { data } = response;
            setData(data);
            setCurrentPage(data.number);
            setSize(data.size);
        } else if (response.status === 401 || response.errorStatus === 'ERR_NETWORK') {
            logout();
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

    const generateLabel = user => {
        return `${user.name}, ${user.designation}, ${user.office}`;
    }

    const buildUserOptions = (data, label) => {
        const emptyOption = { value: '', label: label };
        const options = data.map(user => ({ value: user.username, label: generateLabel(user) }));
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
        { text: 'Resolved At', dataField: 'resolvedAt', type: 'date' },
        { text: 'Reported By', dataField: 'reportedBy', type: 'user' },
        { text: 'Assigned To', dataField: 'assignedTo', type: 'user' },
        { text: 'Pending To', dataField: 'pendingTo', type: 'user' },
        { text: 'Incident', dataField: 'summary', type: 'string' },
        { text: 'Priority', dataField: 'priority', type: 'enum' },
        { text: 'Status', dataField: 'status', type: 'enum', extraField: 'statusStr' },
    ];
  
  // Handlers
    const handlePageChange = page => setCurrentPage(page);

    const handlePageSizeChange = pageSize => setSize(pageSize);

    const findIncidentById = (id) => {
        return data?.content?.find(p => p.id === id);
    }

    const handleEdit = (id) => {
        console.log('clicked incident id: ', id);
        setId(id);
        setIsCreating(false);
        setShowModal(true);
    }

    const handleView = (id) => {
        console.log('clicked incident id: ', id);
        setId(id);
        setShowViewModal(true);
    }

    const handleDelete = (id) => {
        setId(id);
        setShowDeleteConfirmation(true);
    }

    const handleOk = () => {
        fetchIncidents(isCreating ? 0 : currentPage, size, false);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    const handleError = (error, callback) => {
        setTimeout(() => {
            setIsLoading(false);
            callback?.();
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
    }

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
        setShowViewModal(false);
    }

    const handleSave = async (newIncident) => {
        setIsLoading(true);
        const { status, data, errorStatus } = await (isCreating ? post : put)(task, '/incidents', newIncident);
        if (status >= 200 && status < 300) {
            handleClose();
            handleOk();
        } else if (status === 401 || errorStatus === 'ERR_NETWORK') {
            handleError(data, () => logout());
        } else {
            handleError(data);
        }
    }

    const handleUpdate = async (path, updateRequest) => {
        setIsLoading(true);
        const { status, data, errorStatus } = await put(task, `/incidents/${path}`, updateRequest);
        if (status >= 200 && status < 300) {
            handleClose();
            handleOk();
        } else if (status === 401 || errorStatus === 'ERR_NETWORK') {
            handleError(data, () => logout());
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
        <div className="container mt-2">
            <IncidentModal 
                isCreating={isCreating}
                show={ showModal } 
                content={ isCreating ? null : findIncidentById(id) }
                handleClose={handleClose} 
                handleCreate={handleSave} 
                handleUpdate={handleUpdate}
            />
            <IncidentView 
                show={ showViewModal } 
                content={ findIncidentById(id) }
                handleClose={handleClose} 
            />
            <DeleteConfirmation
                show={showDeleteConfirmation}
                onConfirm={ handleDeleteConfirmation }
                onCancel={() => setShowDeleteConfirmation(false)}
                message="Are you sure you want to delete this item?"
            />

            <h2 className="mb-2">Incident List</h2>
            <div>
                <Row>
                    <Col md={3} className='search-field'>
                        <Form.Group className=''>
                            <Form.Label>Reported By</Form.Label>
                            <Select
                                options={ reporterOptions }
                                onChange={ (option) => setReportedBy(option.value) }
                                placeholder=""
                                value={ reporterOptions.find(option => option.value === reportedBy) }
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className='search-field'>
                        <Form.Group className=''>
                            <Form.Label>Assigned To</Form.Label>
                            <Select
                                options={ assigneeOptions }
                                onChange={ (option) => setAssignedTo(option.value) }
                                placeholder=""
                                value={ assigneeOptions.find(option => option.value === assignedTo) }
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className='search-field'>
                        <Form.Group className=''>
                            <Form.Label>Priority</Form.Label>
                            <Select
                                options={ priorityOptions }
                                onChange={ (option) => setPriority(option.value) }
                                placeholder=""
                                value={ priorityOptions.find(option => option.value === priority) }
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className='search-field'>
                        <Form.Group className=''>
                            <Form.Label>Status</Form.Label>
                            <Select
                                options={ statusOptions }
                                onChange={ (option) => setStatus(option.value) }
                                placeholder=""
                                value={ statusOptions.find(option => option.value === status) }
                            /> 
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="">
                            <Form.Label>Reported At (From)</Form.Label>
                            <DatePicker
                                className='date-picker'
                                selected={reportedAtFrom}
                                onChange={(d) => setReportedAtFrom(d)}
                                showTimeSelect
                                timeIntervals={1}
                                dateFormat="dd MMM, yyyy hh:mm a"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group className="">
                            <Form.Label>Reported At (To)</Form.Label>
                            <DatePicker
                                className='date-picker'
                                selected={reportedAtTo}
                                onChange={(d) => setReportedAtTo(d)}
                                showTimeSelect
                                timeIntervals={1}
                                dateFormat="dd MMM, yyyy hh:mm a"
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className=''>
                        <Form.Group className="">
                            <Form.Label>Reported At</Form.Label>
                            <Select
                                options={timeframeOptions}
                                onChange={handleReportedAtTimeframeChange}
                                placeholder="Reported At"
                                value={timeframeOptions.find(option => option.value === reportedAtTimeframe)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className=''>
                        <Form.Group className="">
                            <Form.Label>Resolved At</Form.Label>
                            <Select
                                options={timeframeOptions}
                                onChange={handleResolvedAtTimeframeChange}
                                placeholder="Resolved At"
                                value={timeframeOptions.find(option => option.value === resolvedATimeframe)}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="justify-content-end mt-1">
                    <Col md={3} className=''>
                        <Button 
                            variant="primary" 
                            className="w-100"
                            onClick={ handleSearch }
                        >
                            Search
                        </Button>   
                    </Col>
                </Row>
                <Row className='justify-content-end mb-2 mb-md-0 mt-2'>
                    <Col md={3} className="">
                        <Button 
                            variant="success" 
                            onClick={handleAddNew}
                            className="w-100"
                        >
                            <FaPlus className="me-1" /> Add New Entry
                        </Button>
                    </Col>
                </Row>
            </div>
            {isLoading 
                ? <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div> 
                : <PaginatedTable 
                    data={data} 
                    columns={columns} 
                    anyActionColumn={true}
                    pageChange={handlePageChange} 
                    pageSizeChange={handlePageSizeChange}
                    handleEdit={handleEdit} 
                    handleDelete={handleDelete} 
                    handleView={handleView}
                />
            }
        </div>
    );
};

export default IncidentList;
