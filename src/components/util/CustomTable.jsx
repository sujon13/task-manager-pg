import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const CustomTable = ({ data, columns, anyActionColumn, handleEdit, handleDelete }) => {


    // Calculate the data to display on the current page
    const currentItems = data.content;

    const actionCol = (entry) => {
        return (
            <td>
                <Button 
                    variant="warning" 
                    size="sm" 
                    className="me-2" 
                    onClick={() => handleEdit(entry.id)}
                >
                    <FaEdit />
                </Button>
                <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => handleDelete(entry.id)}
                >
                    <FaTrash />
                </Button>
            </td>
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
                        { anyActionColumn && <th> Action </th> }
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            { columns.map((column, index) => (
                                <td key={index}>{item[column.dataField]}</td>
                            ))}
                            { anyActionColumn && actionCol(item) }
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

CustomTable.propTypes = {
  data: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  anyActionColumn: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default CustomTable;
