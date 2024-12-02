import { useState } from 'react';
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

export const App = () => {
  // const getPostsData = async () => {
  //   const res = await getPosts();
  //   console.log(res);
  // }

  // useEffect(
  //   () => {
  //     getPostsData();
  //   }
  //   , [])

  // console.log(getPosts());
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/questionbank' element={<QuestionBank/>} />
        <Route path='/questionbank/:questionId' element={<QuestionCard />} />
        <Route path='/questionbank/createquestion' element ={<CreateExamQuestions/>} />
        <Route path='/liveexam' element={<LiveExam />} />
        <Route path='/englishtutor' element={<EnglishTutor />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/createusername' element={<CreateUserName />} />
      </Routes>
    </Router>
  )
}