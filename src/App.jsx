import { useState, useEffect } from 'react';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Login } from './components/Login'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './components/Home';
import { QuestionBank } from './components/QuestionBank/QuestionBank';
import { LiveExam } from './components/LiveExam';
import { EnglishTutor } from './components/EnglishTutor';
import { NavBar } from './components/NavBar';
import { QuestionCard } from './components/QuestionBank/QuestionCard';
import {CreateExamQuestions} from './components/QuestionBank/CreateExamQuestions';
import { Signup } from './components/Signup';
import { CreateUserName } from './components/CreateUserName';
import { post } from './services/api';


export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log("User Info: ", userInfo);
    if (userInfo) {
        setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  const handleLogout = async () => {
    const { status } = await post("/logout");
    if (status === 200) {
      setIsLoggedIn(false);
      localStorage.removeItem("userInfo");
    }
  }

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} logout={handleLogout} />
      <Routes>
        <Route path='/' element={<Home login={handleLogin}/>} />
        <Route path='/questionbank' element={<QuestionBank/>} />
        <Route path='/questionbank/:questionId' element={<QuestionCard />} />
        <Route path='/questionbank/createquestion' element ={<CreateExamQuestions/>} />
        <Route path='/liveexam' element={<LiveExam />} />
        <Route path='/englishtutor' element={<EnglishTutor />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/createusername' element={<CreateUserName />} />
      </Routes>
    </Router>
  )
}