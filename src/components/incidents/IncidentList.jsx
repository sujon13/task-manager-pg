import { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import PaginatedTable from '../util/PaginatedTable';
import { get, post, put, deleteEntry, task } from '../../services/api';
import IncidentModal from './IncidentModal';
import DeleteConfirmation from '../util/DeleteConfirmation';
import Spinner from 'react-bootstrap/Spinner';

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
    const [ reportedBy, setReportedBy ] = useState('');
    const [ assignedTo, setAssignedTo ] = useState('');
    const [ status, setStatus ] = useState('');
    const [ grade, setGrade ] = useState('');

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
            size
        }
        const { status, data } = await get(task, '/incidents', params);
        if (status === 200) {
            setData(data);
            setCurrentPage(data.number);
            setSize(data.size);
        }
        if (showLoading) {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchIncidents(currentPage, size);
    }, [currentPage, size]);


    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'Event No', dataField: 'eventNo', type: 'int' },
        { text: 'Station', dataField: 'station', type: 'string' },
        { text: 'Reported At', dataField: 'reportedAt', type: 'date' },
        { text: 'Reported By', dataField: 'reportedBy', type: 'string' },
        { text: 'Assigned To', dataField: 'assignedTo', type: 'string' },
        { text: 'Incident', dataField: 'summary', type: 'string' },
        { text: 'Priority', dataField: 'priority', type: 'enum' },
        { text: 'Status', dataField: 'status', type: 'enum' },
    ];

    const sampleIncidents = {
        content: content,
        number: currentPage,
        size: size,
        totalElements: content.length,
        totalPages: Math.ceil(content.length / size),
    };

    const newSampleIncidents = {
        content: content,
        page: {
            number: currentPage,
            size: size,
            totalElements: content.length,
            totalPages: Math.ceil(content.length / size),
        }
    };

  
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
                        <Form.Control
                            type="text"
                            maxLength={ 256 }
                            placeholder="Reported By" 
                            onChange={ (e) => setReportedBy(e.target.value) }
                        />  
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            maxLength={ 128 }
                            placeholder="Assigned To"
                            onChange={ (e) => setAssignedTo(e.target.value) }
                        />  
                    </Col>
                    <Col md={3}>
                        <Form.Control
                            type="number"
                            placeholder="Status"
                            onChange={ (e) => setStatus(e.target.value) }
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
