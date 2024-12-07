import { useState, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import PaginatedTable from '../util/PaginatedTable';
import { get, post, deleteEntry, qa } from '../../services/api';
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

  // Mock data
    const content = [
        { id: 1, engName: 'John Doe', bngName: 'জন ডো', grade: 9 },
        { id: 2, engName: 'Jane Smith', bngName: 'জেন স্মিথ', grade: 10 },
        { id: 3, engName: 'Michael Lee', bngName: 'মাইকেল লি', grade: 9 },
    ];

    const fetchPosts = async (page, size) => {
        setIsLoading(true);
        const params = {
            page,
            size,
        }
        const { status, data } = await get(qa, '/posts', params);
        if (status === 200) {
            setData(data);
            setCurrentPage(data.number);
            setSize(data.size);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        fetchPosts(currentPage, size);
    }, [currentPage, size]);


    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'English Name', dataField: 'engName' },
        { text: 'Bangla Name', dataField: 'bngName' },
        { text: 'Grade', dataField: 'grade' },
        { text: 'Action', dataField: 'action' },
    ];

    const sampleData = {
        content: content,
        number: currentPage,
        size: size,
        totalElements: content.length,
        totalPages: Math.ceil(content.length / size),
    };

  
  // Handlers
    const handlePageChange = page => setCurrentPage(page);

    const findPostById = (id) => {
        const post = data.content.find(p => p.id === id);
        console.log('post', post);
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
        setTimeout(() => {
            setIsLoading(false);
            reloadPage();
        }, 1000);
    }

    const handleError = (error) => {
        setTimeout(() => {
            setIsLoading(false);
            console.error(error);
        }, 1000);
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
    
    const reloadPage = () => {
        window.location.reload();
    };
      
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
        const { status, data } = await post(qa, '/posts', newPost);
        if (status === 201) {
            handleClose();
            handleOk();
            //reloadPage();
        } else {
            handleError(data);
        }
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
             
            <div className="d-flex justify-content-between align-items-center mb-3">
                <InputGroup style={{ maxWidth: '300px' }}>
                    <Form.Control placeholder="Search..." />
                    <Button variant="primary">Filter</Button>
                </InputGroup>
                <Button variant="success" onClick={handleAddNew}>
                    <FaPlus className="me-1" /> Add New Entry
                </Button>
            </div>
            {isLoading 
                ? <div className="d-flex justify-content-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div> 
                : <PaginatedTable 
                    data={data} 
                    columns={columns} 
                    pageChange={handlePageChange} 
                    handleEdit={handleEdit} 
                    handleDelete={handleDelete} 
                />
            }
        </div>
    );
};

export default PostList;
