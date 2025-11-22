import { useState, useEffect } from "react";
import img from "../assets/big-ftr.png";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

interface User {
  username: string;
  // Add other user properties here as needed
}

const Headerandnav : React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    try {
      const res = await fetch('http://localhost:3001/api/auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Login successful:', data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      } else {
        console.error('Backend login failed');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <div className="battle">Search</div>
        <div className="d-flex battle">         
          <div className="mx-2">
            {user ? (
              <div className="d-flex align-items-center">
                <span className="mx-2">Welcome, {user.username.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn btn-primary">Logout</button>
              </div>
            ) : (
              <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
            )}
          </div>
               
          <div className="mx-2">
            <Link to="/donate" className="btn clear">
              Donate
            </Link>
          </div>
          <div className="mx-2">
            <Link to="/" className="btn clear">
              <HomeIcon />
            </Link>
            <Link to="/testing-styles" className="btn clear">
              Format Testing
            </Link>
          </div>     
          </div>
          
      </div>

      <div className="my-2 text-center" style={{ backgroundColor: "#f5f1e9" }}>
        <img src={img} width="460" height="100" />
      </div>

      <nav className="navbar navbar-expand-lg navbar-bottom-shadow">
        <div className="container-fluid ">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="navbar navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/category/news-and-features">
                  News and Feautures
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/opinion-and-editorial">
                  Opinion and Editorial
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/resources-and-education">
                  Resources and Education
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/action-and-advocacy">
                  Action and Advocacy
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/global-voices">
                  Global Voices
                </Link>
              </li>
              <li className="nav-item dropdown">
                <button className="nav-link dropdown-toggle" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                  About
                </button>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" to="/about-us">About Us</Link></li>
                  <li><Link className="dropdown-item" to="/officers">Officers</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/create">
                  Creative Corner
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Headerandnav;

