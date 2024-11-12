import './style.css';
export const QuestionMenuCard = ({ data }) => {
    console.log(data);
    return (
        <div className='menu-card'>
            <div>{data.quesName} Job Solution</div>
            {(data.jobPost != null) && <div>Post Name: {data.jobPost}</div>}
            {(data.examDate != null) && <div>Date: {data.examDate}</div>}
            {(data.jobGrade != null) && <div>Grade-{data.jobGrade}</div>}
            {(data.examTaker != null) && <div>Exam Taker: {data.examTaker}</div>}

            <div className='card-buttons'>
                <button className='take-exam-btn'>Take Exam</button>
                <button className='read-ques-btn'>Read Question</button>
            </div>
        </div>
    )
}