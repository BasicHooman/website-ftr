import React from 'react';
import { Outlet } from 'react-router-dom';
import Headerandnav from './Headerandnav';

const Layout = () => {
  return (
    <>
      <Headerandnav />
      <Outlet />
    </>
  );
};

export default Layout;