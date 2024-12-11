import { useState, useEffect } from 'react';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Login } from './components/auth/Login'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { QuestionBank } from './components/QuestionBank/QuestionBank';
import { LiveExam } from './components/LiveExam';
import { EnglishTutor } from './components/EnglishTutor';
import { NavBar } from './components/NavBar';
import { QuestionCard } from './components/QuestionBank/QuestionCard';
import {CreateExamQuestions} from './components/QuestionBank/CreateExamQuestions';
import { Signup } from './components/auth/Signup';
import { CreateUserName } from './components/auth/CreateUserName';
import { get, post, auth } from './services/api';
import PublicRoute from './components/PublicRoute';
import OtpVerification from './components/auth/Otp';
import PostList from './components/post/PostList';
import ExamTakerList from './components/examTaker/ExamTakerList';
import CreateExam from './components/exam/CreateExam';

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // const userInfo = localStorage.getItem("userInfo");  
    // if (userInfo) {
    //   setIsLoggedIn(true);
    // } else {
    //   fetchUserInfo();
    // }
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    //setIsLoading(true);
    const { status, data } = await get(auth, "/users/me");
    if (status === 200 && data) {
        localStorage.setItem("userInfo", JSON.stringify(data));
        setIsLoggedIn(true);
    } else {
        logout();
    }
    //setIsLoading(false);
  }

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userInfo");
  }

  const handleLogout = async () => {
    const { status } = await post(auth, "/logout");
    if (status === 200) {
      logout();
    }
  }

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} logout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home isLoggedIn={isLoggedIn} />} />
        <Route path='/questionbank' element={<QuestionBank/>} />
        <Route path='/questionbank/:questionId' element={<QuestionCard />} />
        <Route path='/questionbank/createquestion' element ={<CreateExamQuestions/>} />
        <Route path='/liveexam' element={<LiveExam />} />
        <Route path='/post' element={<PostList />} />
        <Route path='/examtaker' element={<ExamTakerList />} />
        <Route path='/exam/create' element={<CreateExam />} />
        <Route path='/englishtutor' element={<EnglishTutor />} />
        <Route
            path="/signup"
            element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                    <Signup />
                </PublicRoute>
            }
        />
        <Route
            path="/verify-otp"
            element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                    <OtpVerification />
                </PublicRoute>
            }
        />
        <Route
            path="/login"
            element={
                <PublicRoute isLoggedIn={isLoggedIn}>
                    <Login login={handleLogin}/>
                </PublicRoute>
            }
        />
        <Route path='/createusername' element={<CreateUserName />} />
      </Routes>
    </Router>
  )
}