import { useState } from 'react';
import { Table, Pagination, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Select from 'react-select';
import '../../components/css/pagination.css';
import { convertTo12HourDateTime, isSupervisor } from '../../services/util';
import useUser from "../../hooks/useUser";
import { IncidentStatus, IncidentPriority, Division } from '../incidents/IncidentConstant';

const PaginatedTable = ({ data, columns, anyActionColumn, pageChange, pageSizeChange, handleEdit, handleDelete, handleView }) => {
  const { admin, user, seScada, smdXen, cnstXen } = useUser();

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

  const isEditable = entry => {
    if (admin)return true;
    if (IncidentStatus.RESOLVED.key === entry.status)return false;
    if (seScada)return true;
    if (smdXen && entry.division === Division.SCADA.key)return true;
    if (cnstXen && entry.division === Division.CNSTD.key)return true;
    if (entry.reporter && IncidentStatus.REPORTED.key === entry.status)return true;
    if (entry.assignee && IncidentStatus.IN_PROGRESS.key === entry.status)return true;
  }

  const actionCol = (entry) => {
    return (
      <td style={{ maxWidth: '90px', verticalAlign: 'middle' }} >
        <div className="d-flex flex-column flex-md-row">
          <Button 
            style={{ display: isEditable(entry) ? '' : 'none' }}
            variant="warning" 
            size="sm" 
            className="mb-1 mb-md-0 me-md-2" 
            onClick={() => handleEdit(entry.id)}
          >
            <FaEdit />
          </Button>
          <Button 
            variant="info" 
            size="sm" 
            onClick={() => handleView(entry.id)}
          >
            <FaEye />
          </Button>
          <Button 
            style = {{display:  admin ? '' : 'none'}}
            variant="danger" 
            size="sm" 
            className="mt-1 mt-md-0" 
            onClick={() => handleDelete(entry.id)}
          >
            <FaTrash />
          </Button>
        </div>
      </td>
    );
  }

  const badgeForPriority = (priority, priorityStr) => {
    switch (priority) {
      case IncidentPriority.CRITICAL.key:
        return <Badge bg="danger">{priorityStr}</Badge>;
      case IncidentPriority.HIGH.key:
        return <Badge bg="warning">{priorityStr}</Badge>;
      case IncidentPriority.MEDIUM.key:
        return <Badge bg="info">{priorityStr}</Badge>;
      case IncidentPriority.LOW.key:
        return <Badge bg="secondary">{priorityStr}</Badge>;
      default:
        return null;
    }
  }

  const badgeForStatus = (status, statusStr) => {
    switch (status) {
      case IncidentStatus.REPORTED.key:
        return <Badge bg="secondary">{statusStr}</Badge>;
      case IncidentStatus.IN_PROGRESS.key:
        return <Badge bg="primary">{statusStr}</Badge>;
      case IncidentStatus.COMPLETED.key:
        return <Badge bg="info" text="dark">{statusStr}</Badge>;
      case IncidentStatus.RETURNED.key: 
        return <Badge bg="warning" text="dark">{statusStr}</Badge>;
      case IncidentStatus.RESOLVED.key:
        return <Badge bg="success">{statusStr}</Badge>;
      default:
        return null;
    }
  }

  const getMaxWidth = col => {
    switch(col.dataField) {
      case 'eventNo':
        return '55px';
      case 'reportedAt':
        return '80px';
      case 'resolvedAt':
        return '80px';
      case 'reportedBy':
        return '100px';
      case 'assignedTo':
        return '100px';
      case 'pendingTo':
        return '100px';
      case 'category':
        return '120px';
      case 'station':
        return '120px';
      case 'summary':
        return '250px';
      case 'priority':
        return '80px';
      case 'status':
        return '100px';
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
        <div className='text-wrap'>
          {name}
        </div>
        <div className='text-wrap'>
          {/* {any ? '(' : ''}{designation}{both ? ', ' : ''}{office}{any ? ')' : ''} */}
          {designation}{both ? ', ' : ''}{office}
        </div>
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
          return badgeForPriority(data, item[column.extraField]);
        } else if (column.dataField === 'status') {
          return badgeForStatus(data, item[column.extraField]);
        } else if (column.dataField === 'category') {
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

  const tooltipContent = (item, column) => {
    const data = item[column.dataField];
    switch (column.type) {
      case 'date':
        return convertTo12HourDateTime(data);
      case 'enum': 
        return item[column.extraField];
      case 'user':
        return userResponse(data);
      default:
        return data;
    }
  }

  const isPendingToMe = (item) => {
    if (seScada && isSupervisor(item['pendingTo']))return true;
    return item['pendingTo']?.userName === user?.userName;
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
      <Table striped bordered hover responsive style={{ textAlign: 'center' }}>
        <thead style={{ fontSize: '15px' }}>
          <tr>
            {/* <th className='text-break' style={{ maxWidth: '50px'}}> Serial </th> */}
            { columns.map((column, index) => (
              <th key={index} className="" style={{ maxWidth: getMaxWidth(column) }}>
                {column.text}
              </th>
            ))}
            { anyActionColumn && <th className='' style={{ maxWidth: '60px'}}> Action </th> }
          </tr>
        </thead>
        <tbody style={{ fontSize: '14px' }}>
          {currentItems.map((item, idx) => (
            <tr 
              key={indexOfFirstItem + idx} 
              style={{ height: '60px' }} 
              className={ isPendingToMe(item) ? 'pending-row' : ''}
            >
              
              {/* <td style={{ maxWidth: '50px'}}>{indexOfFirstItem + idx + 1}</td> */}
              { columns.map((column, index) => ( 
                <td key={index} className="text-truncate" style={{ maxWidth: getMaxWidth(column), verticalAlign: 'middle' }}>
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
  handleView: PropTypes.func,
};

export default PaginatedTable;
