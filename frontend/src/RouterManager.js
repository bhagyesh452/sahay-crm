import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function RouteManager() {
  const location = useLocation();

  const routeTitles = {
   '/admin/login-admin':"Admin-Login",
    '/admin/dashboard': 'Admin Dashboard',
    '/hr/login': 'HR Login',
    // ... and so on for all routes
  };

  useEffect(() => {
    const path = location.pathname;
    const title = Object.keys(routeTitles).find(route => path.match(new RegExp(`^${route.replace(/:\w+/, '\\w+')}$`)));
    document.title = title ? routeTitles[title] : 'Default Title'; // Default title
  }, [location]);

  return null; // No UI rendered
};


export default RouteManager;
