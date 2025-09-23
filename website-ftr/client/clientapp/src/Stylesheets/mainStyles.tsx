import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import img from "../assets/big-ftr.png";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';


interface Option {
  value: string;
  label: string;
  path: string;
}

interface HeaderDropdownProps {
  dropLabel: string;
  options: Option[];
  className?: string;
  selectedValue?: string;
}

export const OfficerBrick = ({ className, pictureLink, offcierName, officerTitle, officerDescription, officerEmail, officerPhoneNumber, officerLocation, officerYoutube, officerLinkedIn, officerInstagram, officerTwitter, officerFacebook}) => {

  return (
    <div>
      <div className={`bg-[#000000] p-8 h-1/3 w-1/3 rounded-md shadow-md justify-center ${className}`}>
        <p>Lets go warriors</p>
      </div>
    </div>
  );
};

export const TestBrick = ({ className }) => {

  return (
    <div className={`bg-blue-500 w-1/3 rounded-md shadow-md mx-auto flex justify-center items-center ${className}`}>
      <div className={`bg-red-500 w-1/3 h-1/4 text-white`}>
        <p>hi chat</p>
      </div>
    </div>
  );
};


export const CoolDropdown = ({ textFormat, labelText, options, className, onChange, selectedValue, dropdownLabelTitle }) => {
  const navigate = useNavigate();

  return (
    <div className={`
      inline-flex
      items-center
      border-[#d6c7a0]
      rounded-xl
      bg-[#f5f1e9]
      ${className}
    `}>
      <select
        value={selectedValue}
        onChange={onChange}
        className={`
          p-1 pr-8
          justify-center
          bg-transparent
          ${className}
        `}
        style={{
          // Add this to explicitly remove the native border
          border: '0px', 
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
        }}
      >
        <option value="" disabled selected hidden>{dropdownLabelTitle}</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ dropLabel, options, className, selectedValue }) => {
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
    }
  } 

  const categoryDropdownOptions = [
    { value: 'news', label: 'News and Features', path: '/category/news-and-features' },
    { value: 'opinion', label: 'Opinion and Editorial', path: '/category/opinion-and-editorial' },
    { value: 'resources', label: 'Resources and Education', path: '/category/resources-and-education' },
    { value: 'action', label: 'Action and Advocacy', path: '/category/action-and-advocacy' },
    { value: 'global', label: 'Global Voices', path: '/category/global-voices' },
  ];

  const aboutUsDowndownOptions = [
    { value: 'about', label: 'About Us', path: '/about-us'},
    { value: 'officers', label: 'Our Officers', path: '/officers'},

  ];

  const [user, setUser] = useState<any>(null);

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
  

  return(
    <>
      <div className="d-flex justify-content-center">
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

          <div className="navbar navbar-collapse justify-center items-center" id="navbarNav">
            <ul className="navbar-nav mx-auto justify-center ">
              <CoolDropdown className="" dropdownLabelTitle="Categories" options={categoryDropdownOptions} selectedValue={selectedValue} onChange={handleCategoryDropChange} />
              <CoolDropdown className="" dropdownLabelTitle="About Us" options={aboutUsDowndownOptions} selectedValue={selectedValue} onChange={handleAboutUsDropChange} />
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
