import './App.css';
import {BrowserRouter as Router, Route, Routes,Link} from "react-router-dom"
import { useState,useEffect } from 'react';
import Createart from './Components/Createart';
import axios from 'axios';
import Article from './Components/Article';
import DebugPage from './Components/DebugPage';
import AboutUs from './Components/AboutUs';
import HomePage from './Components/HomePage';

function App() {
  return (
    <div className="">
    <Router>
      <Routes>
         <Route path="/" element={<HomePage />}/>
        <Route path="/create" element={<Createart />}/>
        <Route path="/articles/:id" element={<Article />}/>
        <Route path="/login" element={<Article />}/>
        <Route path="/donate" element={<Article />}/>
        <Route path="/about" element={<AboutUs />}/>
        <Route path="/debug" element={<DebugPage />}/>
      </Routes>
    </Router>
    </div>
  );
}

export default App;
