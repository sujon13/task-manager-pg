import { useState } from 'react'
import './App.css'
import { Signup } from './components/signup'
import { Login } from './components/Login'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './components/Home';
import { QuestionBank } from './components/QuestionBank/QuestionBank';
import { LiveExam } from './components/LiveExam';
import { EnglishTutor } from './components/EnglishTutor';
import { NavBar } from './components/NavBar';
import { QuestionCard } from './components/QuestionBank/QuestionCard';

export const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/questionbank' element={<QuestionBank/>} />
        <Route path='/questionbank/:questionId' element={<QuestionCard />} />
        <Route path='/liveexam' element={<LiveExam />} />
        <Route path='/englishtutor' element={<EnglishTutor />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  )
}