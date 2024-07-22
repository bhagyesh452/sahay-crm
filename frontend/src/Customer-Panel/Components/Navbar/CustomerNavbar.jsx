import React from "react";
import "../../../dist/css/tabler.min.css?1684106062";
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import { Link, useLocation } from "react-router-dom";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { BiBookContent } from "react-icons/bi";


function CustomerNavbar() {
  // const active = number;
  const location = useLocation();
  const adminName = localStorage.getItem("adminName");

  const companyName = localStorage.getItem("companyName");
  const companyEmail = localStorage.getItem("companyEmail");
  const encodedCompanyName = encodeURIComponent(companyName);

  return (
    <div>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">

              <ul className="navbar-nav">
                <li
                  className={
                    location.pathname === `/customer/dashboard/${encodedCompanyName}` ? "nav-item active" : "nav-item"
                  }
                >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/customer/dashboard/${encodedCompanyName}`}
                  >
                    <span className="nav-link">
                      <span className="nav-link-title">Basic Form</span>
                    </span>
                  </Link>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default CustomerNavbar;