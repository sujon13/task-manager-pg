import './style.css';
import { questionBankData } from './Data.js';
import { QuestionMenuCard } from './QuestionMenueCard.jsx';
export const QuestionBank = () => {
    return (
        <section id='questionBank' className='questionBank container'>
            <div>Question Bank </div>
            <div className='questioncard-grid'>
                {questionBankData.map((questionset, index) => (
                    // console.log(questionset)
                    <QuestionMenuCard data={questionset} key={index}/>
                ))}
            </div>

        </section>
    )
}