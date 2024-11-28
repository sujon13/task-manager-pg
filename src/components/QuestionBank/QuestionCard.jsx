import { useParams } from 'react-router-dom';
import { questionBankData } from './Data.js';
import './style.css';

export const QuestionCard = () => {
    const questionSet = 
    console.log(questionSet);
    return (
        <section id='questionBank' className='questionBank container'>
            <div className='questioncard-grid'>
                {questionSet.map((eachQues, index) => (
                    <div key={index}>
                        <h2>{eachQues.question}</h2>
                        <ul>
                            {eachQues.options.map((option, index) => (
                                <li key={index}>
                                    <label>
                                        <input
                                            type="radio"
                                            value={option}
                                        />
                                        {option}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>

                ))}
            </div>

        </section>
    )
}