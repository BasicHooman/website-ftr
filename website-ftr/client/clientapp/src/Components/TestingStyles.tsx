import React from 'react';
import { HeaderDropdown, OfficerBrick, TestBrick } from '../Stylesheets/mainStyles.tsx';

const TestingStyles = () => {
  const dropdownOptions = [
    { value: 'home', label: 'Home', path: '/' },
    { value: 'news', label: 'News and Features', path: '/category/news-and-features' },
    { value: 'opinion', label: 'Opinion and Editorial', path: '/category/opinion-and-editorial' },
  ];

  return (
    <div style={{ height: '100vh', overflowY: 'scroll' }}>
      <h1>Testing Header Dropdown</h1>

      <TestBrick
        className={""}
      />

   </div>
  );
};

export default TestingStyles;