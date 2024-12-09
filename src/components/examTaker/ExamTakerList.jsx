import { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import PaginatedTable from '../util/PaginatedTable';
import { get, post, put, deleteEntry, qa } from '../../services/api';
import ExamTakerModal from './ExamTakerModal';
import DeleteConfirmation from '../util/DeleteConfirmation';
import Spinner from 'react-bootstrap/Spinner';

const ExamTakerList = () => {
    // State
    const [ data, setData ] = useState({});
    const [ currentPage, setCurrentPage ] = useState(0);
    const [ size, setSize ] = useState(5);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ showModal, setShowModal ] = useState(false);
    const [ showDeleteConfirmation, setShowDeleteConfirmation ] = useState(false);
    const [ isCreating, setIsCreating ] = useState(true);
    const [ id, setId ] = useState(null);
    const [ engName, setEngName ] = useState('');
    const [ bngName, setBngName ] = useState('');

    const fetchExamTakers = async (page, size, showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }
        const params = {
            page,
            size,
            engName,
            bngName
        }
        const { status, data } = await get(qa, '/exam-takers', params);
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
        fetchExamTakers(currentPage, size);
    }, [currentPage, size]);


    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'English Name', dataField: 'engName' },
        { text: 'Bangla Name', dataField: 'bngName' },
        //{ text: 'Description', dataField: 'description' },
    ];

    // Handlers
    const handlePageChange = page => setCurrentPage(page);

    const findExamTakerById = (id) => {
        return data.content.find(p => p.id === id);
    }

    const handleEdit = (id) => {
        console.log('clicked exam taker id', id);
        setId(id);
        setIsCreating(false);
        setShowModal(true);
    }

    const handleDelete = (id) => {
        setId(id);
        setShowDeleteConfirmation(true);
    };

    const handleOk = () => {
        fetchExamTakers(currentPage, size, false);
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

    const deleteExamTaker = async (id) => {
        setIsLoading(true);
        const { status, data } = await deleteEntry(qa, '/exam-takers', id);
        if (status === 204) {
            handleOk();
        } else {
            handleError(data);
        }
    };

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        deleteExamTaker(id);
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

    const handleSave = async (newExamTaker) => {
        setIsLoading(true);
        const { status, data } = await (isCreating ? post : put)(qa, '/exam-takers', newExamTaker);
        if (status >= 200 && status < 300) {
            handleClose();
            handleOk();
        } else {
            handleError(data);
        }
    }

    const handleSearch = () => {
        setIsLoading(true);
        fetchExamTakers(0, size, false);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    return (
        <div className="container mt-4">
            <ExamTakerModal 
                isCreating={isCreating}
                show={ showModal } 
                content={ isCreating ? null : findExamTakerById(id) }
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
                            placeholder="English Name" 
                            onChange={ (e) => setEngName(e.target.value) }
                        />  
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            maxLength={ 128 }
                            placeholder="Bangla Name"
                            onChange={ (e) => setBngName(e.target.value) }
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

export default ExamTakerList;
