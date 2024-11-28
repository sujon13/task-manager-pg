import './style.css';
import { questionBankData } from './Data.js';
import { Link } from 'react-router-dom';

export const QuestionBank = () => {
    console.log(questionBankData[0].questions);
    return (
        <section id='questionBank' className='questionBank container'>
            <div>Question Bank </div>
            <div className='questioncard-grid'>
                {questionBankData.map((data, index) => (
                    <div className='menu-card' key={index}>
                        <div>{data.quesName} Job Solution</div>
                        {(data.jobPost != null) && <div>Post Name: {data.jobPost}</div>}
                        {(data.examDate != null) && <div>Date: {data.examDate}</div>}
                        {(data.jobGrade != null) && <div>Grade-{data.jobGrade}</div>}
                        {(data.examTaker != null) && <div>Exam Taker: {data.examTaker}</div>}

                        <div className='card-buttons'>
                            <button className='take-exam-btn'>Take Exam</button>
                            <Link to={`/questionbank/${data.id}`}><button className='read-ques-btn'> Rean Question</button></Link>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}