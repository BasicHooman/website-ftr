import React from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderDropdown } from '../Stylesheets/mainStyles';

const Layout = () => {
  return (
    <>
      <HeaderDropdown />
      <Outlet />
    </>
  );
};

export default Layout;