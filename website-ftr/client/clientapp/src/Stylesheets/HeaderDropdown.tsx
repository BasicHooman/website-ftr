import HomeIcon from "@mui/icons-material/Home";
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CoolDropdown from "./CoolDropdown";
import img from '../assets/big-ftr-logo.png';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

interface User {
  username: string;
}

interface HeaderDropdownProps {
  dropLabel: string,
  options: Option[],
  className?: string,
  selectedValue?: string,
}

interface Option {
  value: string;
  label: string;
  path: string;
}

const HeaderDropdown = React.forwardRef<HTMLDivElement, HeaderDropdownProps>(({ selectedValue }, ref) => {
  const navigate = useNavigate();

  const handleCategoryDropChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = categoryDropdownOptions.find(option => option.value === event.target.value);
    if (selectedOption && selectedOption.path) {
      navigate(selectedOption.path);
    }
  }

  const handleAboutUsDropChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = aboutUsDowndownOptions.find(option => option.value === event.target.value);
    if (selectedOption && selectedOption.path) {
      navigate(selectedOption.path);
    }};


  const categoryDropdownOptions = [
    { value: 'news', label: 'News and Features', path: '/category/news-and-features' },
    { value: 'opinion', label: 'Opinion and Editorial', path: '/category/opinion-and-editorial' },
    { value: 'resources', label: 'Resources and Education', path: '/category/resources-and-education' },
    { value: 'action', label: 'Action and Advocacy', path: '/category/action-and-advocacy' },
    { value: 'global', label: 'Global Voices', path: '/category/global-voices' },
  ];

  const aboutUsDowndownOptions = [
    { value: 'about', label: 'About Us', path: '/about-us' },
    { value: 'officers', label: 'Our Officers', path: '/officers' },
  ];

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
    <div ref={ref} className={"fixed top-0 w-full z-50 bg-white"}>
      <div className="d-flex justify-content-center">
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

          <div className="navbar navbar-collapse justify-center items-center" id="navbarNav">
            <ul className="navbar-nav mx-auto justify-center ">
              <CoolDropdown className="" dropdownLabelTitle="Categories" options={categoryDropdownOptions} selectedValue={selectedValue} onChange={handleCategoryDropChange} />
              <CoolDropdown className="" dropdownLabelTitle="About Us" options={aboutUsDowndownOptions} selectedValue={selectedValue} onChange={handleAboutUsDropChange} />
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
});

export default HeaderDropdown;