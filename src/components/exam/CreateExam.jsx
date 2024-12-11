import { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import { get, post, put, deleteEntry, qa } from '../../services/api';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';
import EditConfirmation from '../util/EditConfirmation';

const CreateExam = () => {
    // State
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');
    const [post, setPost] = useState('');
    const [examTaker, setExamTaker] = useState('');
    const [totalQuestion, setTotalQuestion] = useState('');
    const [totalMark, setTotalMark] = useState('');
    const [allocatedTimeInMin, setAllocatedTimeInMin] = useState('');

    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
      ];

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

    const columns = [
        // { text: '#', dataField: 'id' },
        { text: 'English Name', dataField: 'engName' },
        { text: 'Bangla Name', dataField: 'bngName' },
        { text: 'Grade', dataField: 'grade' },
    ];

    
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

    const handleCreateExam = () => {
        
    }

    return (
        <div className="container mt-4">
            <div>
                <Row>
                    <Col md={4}>
                        <Form.Control
                            type="text"
                            maxLength={ 127 }
                            placeholder="Exam Name" 
                            required
                            onChange={ (e) => setName(e.target.value) }
                        />  
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="date"
                            placeholder="Date"
                            onChange={ (e) => setDate(e.target.value) }
                        />  
                    </Col>
                    <Col md={4}>
                        <Select
                            options={options}
                            onChange={(e) => setPost(e.target.value)}
                            placeholder="Select Post"
                        />
                    </Col>
                    <Col md={4}>
                        <Select
                            options={options}
                            onChange={(e) => setExamTaker(e.target.value)}
                            placeholder="Select Exam Taker"
                        />
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="number"
                            placeholder="Total Question" 
                            required
                            onChange={ (e) => setTotalQuestion(e.target.value) }
                        />  
                    </Col>
                    <Col md={4}>
                        <Form.Control
                            type="number"
                            placeholder="Total Mark" 
                            required
                            onChange={ (e) => setTotalMark(e.target.value) }
                        />  
                    </Col>
                    <Col md={4} >
                        <Button 
                            type="submit"
                            variant="primary" 
                            onClick={ handleCreateExam }
                        >
                            Create Exam
                        </Button>    
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CreateExam;
