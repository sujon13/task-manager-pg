import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import PropTypes from "prop-types";
import Question from "./Question";

const ExamQuestion = ( { examId, topics }) => {
    const [activeTopicIds, setActiveTopicIds] = useState([]);

    const handleToggle = (topicId) => {
        setActiveTopicIds((prev) =>
            prev.includes(topicId)
                ? prev.filter((id) => id !== topicId) // Remove id if it's already active
                : [...prev, topicId] // Add id if it's not active
        );
    };


    return (
        <Accordion>
            {topics.map((topic) => (
                <Accordion.Item 
                    eventKey={topic.id.toString()} 
                    key={topic.id}
                    onClick={() => handleToggle(topic.id)}
                >
                    <Accordion.Header>{topic.engName}</Accordion.Header>
                    <Accordion.Body>
                        { activeTopicIds.includes(topic.id) && <Question examId={ examId } topic={ topic } /> }   
                    </Accordion.Body>
                </Accordion.Item>
        ))}
        </Accordion>
    )
}

ExamQuestion.propTypes = {
    topics: PropTypes.array.isRequired,
    examId: PropTypes.number.isRequired,
}

export default ExamQuestion;

