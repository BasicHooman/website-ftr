import './App.css';
import { Routes, Route } from 'react-router-dom';
import Createart from './Components/Createart';
import Article from './Components/Article';
import DebugPage from './Components/DebugPage';
import AboutUs from './Components/AboutUs';
import HomePage from './Components/HomePage';
import Layout from './Components/Layout';
import { CategoryDisplay } from './Components/CategoryDisplay';
import TestingStyles from './Components/TestingStyles';
import { OfficerPage } from './Components/OfficerPage';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="create" element={<Createart />} />
        <Route path="articles/:id" element={<Article />} />
        <Route path="login" element={<Article />} />
        <Route path="donate" element={<Article />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="officers" element={<OfficerPage />} />
        <Route path="debug" element={<DebugPage />} />
        <Route path="category/:categoryName" element={<CategoryDisplay />} />
        <Route path="testing-styles" element={<TestingStyles />} />
      </Route>
    </Routes>
  );
}

export default App;