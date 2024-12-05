import { useState, useEffect } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import PaginatedTable from '../util/PaginatedTable';
import { get, qa } from '../../services/api';

const PostList = () => {
    // State
    const [ data, setData ] = useState({});
    const [ currentPage, setCurrentPage ] = useState(0);
    const [ size, setSize ] = useState(5);
    const [ isLoading, setIsLoading ] = useState(true);


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
    const handleEdit = (id) => alert(`Edit entry with ID: ${id}`);
    const handleDelete = (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this entry?');
        if (confirmed) {
            setEntries(entries.filter((entry) => entry.id !== id));
        }
    };

    return (
        <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <InputGroup style={{ maxWidth: '300px' }}>
                <Form.Control placeholder="Search..." />
                <Button variant="primary">Filter</Button>
            </InputGroup>
            <Button variant="success">
                <FaPlus className="me-1" /> Add New Entry
            </Button>
        </div>
        {isLoading ? <div>Loading...</div> : <PaginatedTable data={data} columns={columns} pageChange={handlePageChange} />}
        </div>
    );
};

export default PostList;
