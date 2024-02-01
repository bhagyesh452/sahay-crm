import React, { useEffect } from "react";
import Navbar from './Navbar'
import Header from "./Header";
import { useState} from "react";
// import LoginAdmin from "./LoginAdmin";

function Dashboard() {
  
  return (
    <div>
      <Header/>
      <Navbar/>
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Dashboard</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Dashboard;
