import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const QuestionList = ({ data, columns, anyActionColumn, handleEdit, handleDelete }) => {
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
                    {data.map((item, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td></td>
                            <td>{item.questionEn}</td>
                            <td>
                                {item.optionResponses.map((option, index) => (
                                    <div key={index} style={{ textAlign: 'left' }}>
                                        {option.serial}) {option.valueEn}
                                    </div>
                                ))}
                            </td>
                            <td>{item.mcqAns}</td>
                            { anyActionColumn && actionCol(item) }
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

QuestionList.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  anyActionColumn: PropTypes.bool,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
};

export default QuestionList;
