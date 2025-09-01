import { useState } from 'react';
import { Table, Pagination, Button, Badge } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import '../../components/css/pagination.css';
import { convertTo12HourDateTime, capitalizeFirst } from '../../services/util';

const PaginatedTable = ({ data, columns, anyActionColumn, pageChange, handleEdit, handleDelete }) => {
  const [ currentPage ] = useState(data.number);
  const totalPages = data.totalPages;
  const itemsPerPage = data.size;

  // Calculate the data to display on the current page
  //const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = currentPage * itemsPerPage;
  const currentItems = data.content;

  // Generate pagination items
  const paginationItems = [];
  const start = Math.max(0, currentPage - 1);
  const end = Math.min(totalPages, currentPage + 2);
  for (let number = start; number < end; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => pageChange(number)}
      >
        {number + 1}
      </Pagination.Item>,
    );
  }

  const actionCol = (entry) => {
    return (
      <td>
        <Button 
        style={{ display: entry.reporter || entry.assignee ? '' : 'none' }}
          variant="warning" 
          size="sm" 
          className="me-2" 
          onClick={() => handleEdit(entry.id)}
        >
          <FaEdit />
        </Button>
        <Button 
          style = {{display: ''}}
          variant="danger" 
          size="sm" 
          onClick={() => handleDelete(entry.id)}
        >
          <FaTrash />
        </Button>
      </td>
    );
  }

  const badgeForPriority = priority => {
    switch (priority) {
      case "Critical":
        return <Badge bg="danger">{priority}</Badge>;
      case "High":
        return <Badge bg="warning">{priority}</Badge>;
      case "Medium":
        return <Badge bg="info">{priority}</Badge>;
      case "Low":
        return <Badge bg="secondary">{priority}</Badge>;
      default:
        return null;
    }
  }
  
  const tableContent = (item, column) => {
    const data = item[column.dataField];
    switch (column.type) {
      case 'date':
        return convertTo12HourDateTime(data);
      case 'enum': 
        if (column.dataField === 'priority') {
          return badgeForPriority(capitalizeFirst(data));
        } else {
          return capitalizeFirst(data);
        }
      default:
        return data;
    }
  }

  return (
    <>
      <Table striped bordered hover style={{ textAlign: 'center' }}>
        <thead>
          <tr>
            <th> Serial </th>
            { columns.map((column, index) => (
              <th key={index}>{column.text}</th>
            ))}
            { anyActionColumn && <th> Action </th> }
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, idx) => (
            <tr key={indexOfFirstItem + idx}>
              
              <td>{indexOfFirstItem + idx + 1}</td>
              { columns.map((column, index) => ( 
                <td key={index}>{ tableContent(item, column) }
                </td>
              ))}
              { anyActionColumn && actionCol(item) }
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className='custom-pagination' style={{ width: '30%'}}>
        <Pagination.First onClick={() => pageChange(0)} />
        <Pagination.Prev onClick={() => {
            if (currentPage > 1) {
              pageChange(currentPage - 2);
            }
          }} /> 
        {paginationItems}
        <Pagination.Next onClick={() => {
            if (currentPage < totalPages - 2) {
              pageChange(currentPage + 2);
            }
          }} />
        <Pagination.Last onClick={() => pageChange(totalPages - 1)} />
      </Pagination>
    </>
  );
};

PaginatedTable.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  anyActionColumn: PropTypes.bool,
  pageChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default PaginatedTable;
