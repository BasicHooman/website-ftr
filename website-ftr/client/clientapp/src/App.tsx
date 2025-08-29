import './App.css';
import { Routes, Route } from 'react-router-dom';
import Createart from './Components/Createart';
import Article from './Components/Article';
import DebugPage from './Components/DebugPage';
import AboutUs from './Components/AboutUs';
import HomePage from './Components/HomePage';
import Layout from './Components/Layout';
import { CategoryDisplay } from './Components/CategoryDisplay';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="create" element={<Createart />} />
        <Route path="articles/:id" element={<Article />} />
        <Route path="login" element={<Article />} />
        <Route path="donate" element={<Article />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="debug" element={<DebugPage />} />
        <Route path="category/:categoryName" element={<CategoryDisplay />} />
      </Route>
    </Routes>
  );
}

export default App;