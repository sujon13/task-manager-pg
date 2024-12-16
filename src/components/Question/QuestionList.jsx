import { Table, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import PropTypes from 'prop-types';

const QuestionList = ({ data, handleEdit, handleDelete }) => {
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
                        <th width="1%"> Sl </th>
                        <th width="7%"> Topic </th>
                        <th width="50%"> Question </th>
                        <th width="30%"> Options </th>
                        <th width="2%"> Ans </th>
                        <th width="10%"> Action </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{item.question.topic?.engName}</td>
                            <td>{item.question.questionEn}</td>
                            <td>
                                {item.question.options.map((option, index) => (
                                    <div key={index} style={{ textAlign: 'left' }}>
                                        {option.serial}) {option.valueEn}
                                    </div>
                                ))}
                            </td>
                            <td>{item.question.mcqAns}</td>
                            { actionCol(item) }
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

QuestionList.propTypes = {
    data: PropTypes.array.isRequired,
    handleEdit: PropTypes.func,
    handleDelete: PropTypes.func,
};

export default QuestionList;
