//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Login } from './components/auth/Login'
import { Routes, Route } from 'react-router-dom';
// import { Home } from './components/Home';
// import { QuestionBank } from './components/QuestionBank/QuestionBank';
// import { LiveExam } from './components/LiveExam';
// import { EnglishTutor } from './components/EnglishTutor';
// import { QuestionCard } from './components/QuestionBank/QuestionCard';
// import {CreateExamQuestions} from './components/QuestionBank/CreateExamQuestions';
// import { CreateUserName } from './components/auth/CreateUserName';
import { Signup } from './components/auth/Signup';
import PublicRoute from './components/route/PublicRoute';
import PrivateRoute from './components/route/PrivateRoute';
import OtpVerification from './components/auth/Otp';
// import PostList from './components/post/PostList';
// import ExamTakerList from './components/examTaker/ExamTakerList';
// import RealExam from './components/exam/RealExam';
import IncidentList from './components/incidents/IncidentList';
import { NavBar } from './components/NavBar';
import { Home } from './components/Home';
import { ROUTES } from './routes.js';

export const App = () => {
    //const [isLoading, setIsLoading] = useState(false);


    return (
        <>
            <NavBar />
            <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />

                {/* <Route path='/questionbank' element={<QuestionBank/>} />
                <Route path='/questionbank/:questionId' element={<QuestionCard />} />
                <Route path='/questionbank/createquestion' element ={<CreateExamQuestions/>} />
                <Route path='/liveexam' element={<LiveExam />} />
                <Route path='/post' element={<PostList />} />
                <Route path='/examtaker' element={<ExamTakerList />} />
                <Route path='/exam' element={<RealExam />} />
                <Route path='/exam/:examId' element={<RealExam />} />
                <Route path='/englishtutor' element={<EnglishTutor />} /> 
                <Route path='/createusername' element={<CreateUserName />} /> */}
                
                <Route 
                    path={ROUTES.INCIDENTS}
                    element={
                        <PrivateRoute>
                            <IncidentList />
                        </PrivateRoute>
                    } 
                />
                <Route
                    path={ROUTES.SIGNUP}
                    element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    }
                />
                <Route
                    path={ROUTES.VERIFY_OTP}
                    element={
                        <PublicRoute>
                            <OtpVerification />
                        </PublicRoute>
                    }
                />
                <Route
                    path={ROUTES.LOGIN}
                    element={
                        <PublicRoute>
                            <Login/>
                        </PublicRoute>
                    }
                />
            </Routes>
        </>
    )
}