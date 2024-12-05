import { useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../../components/css/pagination.css';

const PaginatedTable = ({ data, columns, pageChange }) => {
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

  return (
    <>
      <Table striped bordered hover style={{ textAlign: 'center' }}>
        <thead>
          <tr>
            <th> Serial </th>
            { columns.map((column, index) => (
              <th key={index}>{column.text}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, idx) => (
            <tr key={indexOfFirstItem + idx}>
              
              <td>{indexOfFirstItem + idx + 1}</td>
              { columns.map((column, index) => (
                <td key={index}>{item[column.dataField]}</td>
              ))}
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
  pageChange: PropTypes.func.isRequired,
};

export default PaginatedTable;
