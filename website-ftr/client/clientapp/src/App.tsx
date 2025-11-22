import './App.css';
import { Routes, Route } from 'react-router-dom';
import Createart from './pages/Createart';
import Article from './pages/Article';
import DebugPage from './pages/DebugPage';
import AboutUs from './pages/AboutUs';
import HomePage from './pages/HomePage';
import Layout from './Components/Layout';
import CategoryDisplay from './Components/CategoryDisplay';
import { TestingStyles } from './pages/TestingStyles';
import OfficerPage from './pages/OfficerPage';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="create" element={<Createart />} />
        {/* Oh I'm sure these temporary attributes are a problem */}
        <Route path="articles/:id" element={<Article id={0} title={''} author={''} displayimg={''} />} />
        <Route path="login" element={<Article id={0} title={''} author={''} displayimg={''} />} />
        <Route path="donate" element={<Article id={0} title={''} author={''} displayimg={''} />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="officers" element={<OfficerPage />} />
        <Route path="debug" element={<DebugPage />} /> 
        <Route path="category/:categoryName" element={<CategoryDisplay />} />
        <Route path="testing-styles" element={<TestingStyles fun={''} />} />
      </Route>
    </Routes>
  );
}

export default App;