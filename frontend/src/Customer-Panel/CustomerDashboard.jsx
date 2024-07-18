import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import CustomerNavbar from './CustomerNavbar';
import BasicForm from '../Client-Basic-Info/BasicForm';

function CustomerDashboard() {
  const { email } = useParams();
  return (
    // <div className="admin-dashboard">
    <>
      <Header />
      <CustomerNavbar />
      <h1>Welcome : {email}</h1>
    </>
    // </div>
  )
}

export default CustomerDashboard
