import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerHeader from './Components/Header/CustomerHeader';
import CustomerNavbar from './Components/Navbar/CustomerNavbar';
import CustomerForm from './Components/Form/CustomerForm';

function CustomerDashboard() {

  const navigate = useNavigate();

  useEffect(() => {
    const companyToken = localStorage.getItem("companyToken");

    if (!companyToken) {
      navigate("/customerLogin");
    }
  }, [navigate]);

  return (
    <>
      <CustomerHeader />
      <CustomerNavbar />
      <CustomerForm />
    </>
  )
}

export default CustomerDashboard
