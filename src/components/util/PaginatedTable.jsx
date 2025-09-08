import { useState } from 'react';
import { Table, Pagination, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Select from 'react-select';
import '../../components/css/pagination.css';
import { convertTo12HourDateTime, capitalizeFirst } from '../../services/util';
import useUser from "../../hooks/useUser";

const PaginatedTable = ({ data, columns, anyActionColumn, pageChange, pageSizeChange, handleEdit, handleDelete }) => {
  const { supervisor, admin } = useUser();

  const [ currentPage ] = useState(data.number);
  const totalPages = data.totalPages;
  const itemsPerPage = data.size;

  // Entries per page options
  const pageSizeOptionList = [5, 10, 20];
  const pageSizeOptions = pageSizeOptionList.map(pageSize => ({ value: pageSize, label: pageSize }));

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
      <td style={{ maxWidth: '50px' }}>
        <Button 
          style={{ display: entry.reporter || entry.assignee || supervisor ? '' : 'none' }}
          variant="warning" 
          size="sm" 
          className="me-2" 
          onClick={() => handleEdit(entry.id)}
        >
          <FaEdit />
        </Button>
        <Button 
          style = {{display:  admin ? '' : 'none'}}
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

  const buildBadgeForStatus = (statusStr) => {
    return (
      <>
        {statusStr.split(" ").map((word, idx) => (
          <div key={idx} className=""> 
            <Badge bg="warning" text="dark">
              {word}
            </Badge>
        </div>
        ))}
      </>
    );
  }

  const badgeForStatus = (status, statusStr) => {
    switch (status) {
      case "REPORTED":
        return <Badge bg="secondary">{statusStr}</Badge>;
      case "IN_PROGRESS":
        return <Badge bg="primary">{statusStr}</Badge>;
      case "COMPLETED":
        return <Badge bg="info" text="dark">{statusStr}</Badge>;
      case "RETURNED": 
        return <Badge bg="warning" text="dark">{statusStr}</Badge>;
      case "IN_REVIEW":
        //return <Badge bg="warning" text="dark">{statusStr}</Badge>;
        return buildBadgeForStatus(statusStr);
      case "RESOLVED":
        return <Badge bg="success">{statusStr}</Badge>;
      default:
        return null;
    }
  }

  const getMaxWidth = col => {
    switch(col.dataField) {
      case 'eventNo':
        return '50px';
      case 'station':
        return '60px';
      case 'reportedAt':
        return '90px';
      case 'resolvedAt':
        return '90px';
      case 'reportedBy':
        return '120px';
      case 'assignedTo':
        return '120px';
      case 'summary':
        return '250px';
      case 'priority':
        return '80px';
      case 'status':
        return '90px';
      default:
        return '';
    }
  }

  const userResponse = user => {
    const name = user?.name || user?.userName;
    const userOffice = user?.userOffices?.[0];
    const designation = userOffice?.designation;
    const office = userOffice?.office;
    const any = !!designation || !!office;
    const both = !!designation && !!office;

    return (
      <div>
        {name}<br/>
        {any ? '(' : ''}{designation}{both ? ', ' : ''}{office}{any ? ')' : ''}
      </div>
    );
  }

  const formattedDate = date => {
    const twelveHourFormat = convertTo12HourDateTime(date);
    if (!twelveHourFormat) {
      return null;
    }
    const datePart = twelveHourFormat.substring(0, 10);
    const timePart = twelveHourFormat.substring(11);
    return (
      <div>
        {datePart}
        <div className="text-muted" style={{ fontSize: "0.85em" }}>
          {timePart}
        </div>
      </div>
    );
  }
  
  const tableContent = (item, column) => {
    const data = item[column.dataField];
    switch (column.type) {
      case 'date':
        return formattedDate(data);
      case 'enum': 
        if (column.dataField === 'priority') {
          return badgeForPriority(capitalizeFirst(data));
        } else if (column.dataField === 'status') {
          return badgeForStatus(data, item[column.extraField]);
        } else {
          return data;
        }
      case 'user':
        return userResponse(data);
      default:
        return data;
    }
  }

  const tooltipContent = (item, column) => {
    const data = item[column.dataField];
    switch (column.type) {
      case 'date':
        return convertTo12HourDateTime(data);
      case 'enum': 
        if (column.dataField === 'priority') {
          return capitalizeFirst(data);
        } else if (column.dataField === 'status') {
          return item[column.extraField];
        } else {
          return data;
        }
      case 'user':
        return userResponse(data);
      default:
        return data;
    }
  }

  return (
    <>
      <div className="d-flex justify-content-start align-items-center mb-2">
        <div className="d-flex align-items-center">
          <Select
              options={ pageSizeOptions }
              onChange={ (option) => pageSizeChange(option.value) }
              value={ pageSizeOptions.find(option => option.value === itemsPerPage) } 
          />
        </div>
        <div style={{ marginLeft: '16px' }}>
          <span>Total Entries: {data.totalElements || 0}</span>
        </div>
      </div>
      <Table striped bordered hover style={{ textAlign: 'center' }}>
        <thead>
          <tr>
            {/* <th className='text-break' style={{ maxWidth: '50px'}}> Serial </th> */}
            { columns.map((column, index) => (
              <th key={index} className="text-break" style={{ maxWidth: getMaxWidth(column) }}>
                {column.text}
              </th>
            ))}
            { anyActionColumn && <th className='text-break' style={{ maxWidth: '50px'}}> Action </th> }
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, idx) => (
            <tr key={indexOfFirstItem + idx} style={{ height: '60px' }}>
              
              {/* <td style={{ maxWidth: '50px'}}>{indexOfFirstItem + idx + 1}</td> */}
              { columns.map((column, index) => ( 
                <td key={index} className="text-truncate" style={{ maxWidth: getMaxWidth(column) }}>
                  <OverlayTrigger
                    placement="auto"
                    overlay={<Tooltip>{ tooltipContent(item, column) }</Tooltip>}
                  >
                    <span>{ tableContent(item, column) }</span>
                  </OverlayTrigger>
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
  pageSizeChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default PaginatedTable;
