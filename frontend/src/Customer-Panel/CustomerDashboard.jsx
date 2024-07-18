import React from 'react';
import { useParams } from 'react-router-dom';

function CustomerDashboard() {
    const {email} = useParams();
  return (
    <div>
      <h1>Welcome : {email}</h1>
    </div>
  )
}

export default CustomerDashboard
