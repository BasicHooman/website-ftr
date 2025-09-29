import React from 'react';
import { HeaderDropdown, OfficerBrick, TestBrick, CopyComponent } from '../Stylesheets/mainStyles.tsx';
import reagan_picture from "../assets/officer-pictures/rms.jpeg";

const TestingStyles = () => {
  const dropdownOptions = [
    { value: 'home', label: 'Home', path: '/' },
    { value: 'news', label: 'News and Features', path: '/category/news-and-features' },
    { value: 'opinion', label: 'Opinion and Editorial', path: '/category/opinion-and-editorial' },
  ];

  return (
    <div className="flex flex-col items-center justify-center">

      <CopyComponent 
        officerTitle={"Website Developer"} 
        officerName={"Reagan Spurlock"} 
        pictureLink={reagan_picture}
        officerLinkedIn = {"https://www.linkedin.com/in/reagan-spurlock/"}
        officerEmail = {"07spree@gmail.com"}
      />

            <CopyComponent 
        officerTitle={"Website Developer"} 
        officerName={"Reagan Spurlock"} 
        pictureLink={reagan_picture}
        officerLinkedIn = {"https://www.linkedin.com/in/reagan-spurlock/"}
        officerEmail = {"07spree@gmail.com"}
      />

            <CopyComponent 
        officerTitle={"Website Developer"} 
        officerName={"Reagan Spurlock"} 
        pictureLink={reagan_picture}
        officerLinkedIn = {"https://www.linkedin.com/in/reagan-spurlock/"}
        officerEmail = {"07spree@gmail.com"}
      />
   </div>
  );
};

export default TestingStyles;