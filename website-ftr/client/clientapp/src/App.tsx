import './App.css';
import { Routes, Route } from 'react-router-dom';
import Article from './pages/Article';
import AboutUs from './pages/AboutUs';
import HomePage from './pages/HomePage';
import Layout from './Components/Layout';
import CategoryDisplay from './Components/CategoryDisplay';
import OfficerPage from './pages/OfficerPage';
import CreateArticle  from './pages/CreateArticle.tsx';
import EditorDashboard from './pages/EditorDashbord.tsx';

import RequireRole from "./Components/RequireRole.tsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="articles/:id" element={<Article/>} />
        <Route path="login" element={<Article/>} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="officers" element={<OfficerPage />} />
        <Route path="category/:categoryName" element={<CategoryDisplay />} />
        <Route path="create-article" element={<CreateArticle />} />
        
        {/*gaslight gatekeep girlboss */}
        
        <Route 
          path="editor-dashboard" 
          element={
            <RequireRole allowedRoles={['editor', 'admin']}>
              <EditorDashboard />
            </RequireRole>
            }
          />
      </Route>
    </Routes>
  );
}

export default App;