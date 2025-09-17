import React from 'react';
import { HeaderDropdown } from '../Stylesheets/mainStyles.tsx';

const TestingStyles = () => {
  const dropdownOptions = [
    { value: 'home', label: 'Home', path: '/' },
    { value: 'news', label: 'News and Features', path: '/category/news-and-features' },
    { value: 'opinion', label: 'Opinion and Editorial', path: '/category/opinion-and-editorial' },
  ];

  return (
    <div>
      <h1>Testing Header Dropdown</h1>
      <HeaderDropdown
        dropLabel="Test Dropdown"
        options={dropdownOptions}
      />
    </div>
  );
};

export default TestingStyles;