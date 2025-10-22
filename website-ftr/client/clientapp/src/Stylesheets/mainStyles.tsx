import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef, type ChangeEvent } from "react";
import img from "../assets/big-ftr.png";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import ftrLogo from '../assets/ftr_logo_black.png';
import defaultImage from '../assets/ftr_logo_black.png';


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

interface PageHeaderProps {
  className?: string;
  headerText: any;
}

export const PageHeader = ({ className, headerText }: PageHeaderProps) => {
  return (
    <>
      <div className={`bg-[#d6c7a0] text-gray-800 w-full mb-4 shadow-sm text-center  ${className}`}>
        <h1 className={"items-center justify-center"}>{headerText}</h1>
      </div>
    </>
  );
};

interface NameBoxBrickProps {
  className?: string;
  officerName: string;
}

export const NameBoxBrick = ({ className, officerName }: NameBoxBrickProps) => {
  return (
    <div className={`text-center mb-4`}>
      <p className="font-bold bg-[#d6c7a0] p-2 rounded-md">{officerName}</p>
    </div>
  );
};

interface OfficerBrickProps {
  className?: string;
  pictureLink?: string;
  officerName?: string;
  officerTitle?: string;
  officerDescription?: string;
  officerEmail?: string;
  officerPhoneNumber?: string;
  officerLocation?: string;
  officerYoutube?: string;
  officerLinkedIn?: string;
  officerInstagram?: string;
  officerTwitter?: string;
  officerFacebook?: string;
}

export const OfficerBrick = ({ className, pictureLink, officerName, officerTitle, officerDescription, officerEmail }: OfficerBrickProps) => {
  return (
    <>
      <div className={`bg-[#f5f1e9] p-8 h-1/3 w-1/6 rounded-md shadow-md justify-center ${className}`}>
        <div className={`bg-[#d6c7a0]  h-1/8 justify-center`}>
          <p>{officerName}</p>
        </div>
        <div className={`bg-[#d6c7a0]  h-1/8 justify-center`}>
          <p>{officerTitle}</p>
        </div>
        <div className={`bg-[#d6c7a0]  h-1/8 justify-center`}>
          <p>{officerDescription}</p>
        </div>
        <div className={`bg-[#d6c7a0]  h-1/2 justify-center`}>
          <p>Officer Email: {officerEmail}</p>
        </div>
        <p>Lets go warriors</p>
      </div>
    </>
  );
};

interface TestBrickProps {
  className?: string;
}

export const TestBrick = ({ className }: TestBrickProps) => {
  return (
    <div className={`bg-blue-500 w-1/3 rounded-md shadow-md mx-auto flex justify-center items-center ${className}`}>
      <div className={`bg-red-500 w-1/3 h-1/4 text-white`}>
        <p>hi chat</p>
      </div>
    </div>
  );
};

interface CoolDropdownProps {
  textFormat?: any;
  labelText?: any;
  options: any;
  className?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectedValue?: any;
  dropdownLabelTitle: any;
}

export const CoolDropdown = ({ textFormat, labelText, options, className, onChange, selectedValue, dropdownLabelTitle }: CoolDropdownProps) => {
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
        <option value="" disabled hidden>{dropdownLabelTitle}</option>
        {options.map((option: any, index: number) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export const HeaderDropdown = React.forwardRef<HTMLDivElement, HeaderDropdownProps>(({ dropLabel, options, className, selectedValue }, ref) => {
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
    { value: 'about', label: 'About Us', path: '/about-us' },
    { value: 'officers', label: 'Our Officers', path: '/officers' },
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

  return (
    <div ref={ref} className="fixed top-0 w-full z-50 bg-white">
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

interface CopyComponentProps {
  pictureLink?: any;
  officerDescription?: any;
  officerName?: any;
  officerTitle?: any;
  officerEmail?: any;
  officerPhone?: any;
  officerLocation?: any;
  officerYoutube?: any;
  officerLinkedIn?: any;
  officerInstagram?: any;
  officerTwitter?: any;
  officerFacebook?: any;
}

export const CopyComponent = ({ pictureLink, officerDescription, officerName, officerTitle, officerEmail, officerPhone, officerLocation, officerYoutube, officerLinkedIn, officerInstagram, officerTwitter, officerFacebook }: CopyComponentProps) => {
  const nameRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const [nameFontSize, setNameFontSize] = useState('1.5rem');
  const [titleFontSize, setTitleFontSize] = useState('1.rem');

  useEffect(() => {
    const adjustFontSize = (ref: React.RefObject<HTMLParagraphElement | null>, initialSize: string, setFontSize: React.Dispatch<React.SetStateAction<string>>) => {
      if (ref.current) {
        ref.current.style.fontSize = initialSize; // Reset to initial size
        let currentSize = parseFloat(initialSize);
        const containerWidth = ref.current.clientWidth;
        let textWidth = ref.current.scrollWidth;

        while (textWidth > containerWidth && currentSize > 0.5) { // Shrink down to 0.5rem
          currentSize -= 0.1; // Decrease by 0.1rem
          ref.current.style.fontSize = `${currentSize}rem`;
          textWidth = ref.current.scrollWidth;
        }
        setFontSize(`${currentSize}rem`);
      }
    };

    const handleResize = () => {
      adjustFontSize(nameRef, '1.5rem', setNameFontSize);
      adjustFontSize(titleRef, '1rem', setTitleFontSize);
    };

    handleResize(); // Adjust on initial render

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [officerName, officerTitle]);

  return (
    <div className={`bg-[#f5f1e9] p-8 w-1/6 h-[32rem] rounded-md shadow-md justify-center outline outline-4 outline-round-md outline-offset-2 outline-[#d6c7a0]`} style={{ transform: 'scale(0.9)' }}>
      <div className="text-center mb-4">
        <p ref={nameRef} className="font-bold bg-[#d6c7a0] p-2 rounded-md" style={{ fontSize: nameFontSize }}>{officerName}</p>
      </div>
      <div className={`text-center mb-4`}>
        <p ref={titleRef} className="bg-[#d6c7a0] p-2 rounded-md" style={{ fontSize: titleFontSize }}>{officerTitle}</p>
      </div>
      <div className="bg-[#d6c7a0] rounded-md mb-4 flex justify-center items-center">
        <img src={pictureLink ? pictureLink : defaultImage} alt="officerImage" className="w-7/8 p-4" />
      </div>
      {(officerEmail || officerYoutube || officerLinkedIn || officerInstagram || officerTwitter || officerFacebook) && (
        <div className="socials-box text-center bg-[#d6c7a0] p-2 rounded-md mb-4">
          <p className="p-2 rounded-md mb-2" style={{ fontSize: '1rem' }}>Contacts</p>
          <div className="flex flex-wrap">
            {officerEmail && <p className="w-full" style={{ fontSize: '0.5rem' }}>Email: <a target="_blank" rel="noopener noreferrer">{officerEmail}</a></p>}
            {officerYoutube && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerYoutube} target="_blank" rel="noopener noreferrer">YouTube</a></p>}
            {officerLinkedIn && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerLinkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a></p>}
            {officerInstagram && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerInstagram} target="_blank" rel="noopener noreferrer">Instagram</a></p>}
            {officerTwitter && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerTwitter} target="_blank" rel="noopener noreferrer">X (Twitter)</a></p>}
            {officerFacebook && <p className="w-1/2" style={{ fontSize: '0.5rem' }}><a href={officerFacebook} target="_blank" rel="noopener noreferrer">Facebook</a></p>}
          </div>
        </div>
      )}
    </div>
  );
};