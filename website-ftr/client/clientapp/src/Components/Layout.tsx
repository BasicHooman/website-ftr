import React, { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderDropdown } from '../Stylesheets/mainStyles';

const Layout = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
  }, []);

  return (
    <>
      <HeaderDropdown ref={headerRef} dropLabel="" options={[]} />
      <div style={{ marginTop: headerHeight }}>
        <Outlet />
      </div>
    </>
  );
};

export default Layout;