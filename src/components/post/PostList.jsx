import { useState, useEffect } from 'react';
import { Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import PaginatedTable from '../util/PaginatedTable';
import { get, post, put, deleteEntry, qa } from '../../services/api';
import PostModal from './PostModal';
import DeleteConfirmation from '../util/DeleteConfirmation';
import Spinner from 'react-bootstrap/Spinner';

const PostList = () => {
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
    const [ grade, setGrade ] = useState('');

  // Mock data
    const content = [
        { id: 1, engName: 'John Doe', bngName: 'জন ডো', grade: 9 },
        { id: 2, engName: 'Jane Smith', bngName: 'জেন স্মিথ', grade: 10 },
        { id: 3, engName: 'Michael Lee', bngName: 'মাইকেল লি', grade: 9 },
    ];

    const fetchPosts = async (page, size, showLoading = true) => {
        if (showLoading) {
            setIsLoading(true);
        }
        const params = {
            page,
            size,
            engName,
            bngName,
            grade,
        }
        const { status, data } = await get(qa, '/posts', params);
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
        fetchPosts(currentPage, size);
    }, [currentPage, size]);


    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'English Name', dataField: 'engName' },
        { text: 'Bangla Name', dataField: 'bngName' },
        { text: 'Grade', dataField: 'grade' },
    ];

    const sampleData = {
        content: content,
        number: currentPage,
        size: size,
        totalElements: content.length,
        totalPages: Math.ceil(content.length / size),
    };

    const newSampleData = {
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

    const findPostById = (id) => {
        return data.content.find(p => p.id === id);
    }

    const handleEdit = (id) => {
        console.log('clicked post id', id);
        setId(id);
        setIsCreating(false);
        setShowModal(true);
    }

    const handleDelete = (id) => {
        setId(id);
        setShowDeleteConfirmation(true);
    };

    const handleOk = () => {
        fetchPosts(currentPage, size, false);
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

    const deletePost = async (id) => {
        setIsLoading(true);
        const { status, data } = await deleteEntry(qa, '/posts', id);
        if (status === 204) {
            handleOk();
        } else {
            handleError(data);
        }
    };

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
        deletePost(id);
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

    const handleSave = async (newPost) => {
        setIsLoading(true);
        const { status, data } = await (isCreating ? post : put)(qa, '/posts', newPost);
        if (status >= 200 && status < 300) {
            handleClose();
            handleOk();
        } else {
            handleError(data);
        }
    }

    const handleSearch = () => {
        setIsLoading(true);
        fetchPosts(0, size, false);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }

    return (
        <div className="container mt-4">
            <PostModal 
                isCreating={isCreating}
                show={ showModal } 
                content={ isCreating ? null : findPostById(id) }
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
                            placeholder="English Title" 
                            onChange={ (e) => setEngName(e.target.value) }
                        />  
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            maxLength={ 128 }
                            placeholder="Bangla Title"
                            onChange={ (e) => setBngName(e.target.value) }
                        />  
                    </Col>
                    <Col md={3}>
                        <Form.Control
                            type="number"
                            placeholder="Grade"
                            onChange={ (e) => setGrade(e.target.value) }
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

export default PostList;
