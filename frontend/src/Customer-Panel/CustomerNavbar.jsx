import React from "react";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import { Link, useLocation } from "react-router-dom";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { BiBookContent } from "react-icons/bi";


function CustomerNavbar() {
  // const active = number;
  const location = useLocation();
  const adminName = localStorage.getItem("adminName")
  return (
    <div>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li
                  className={
                    location.pathname === "/customer/dashboard/karan@gmail.com" ? "nav-item active" : "nav-item"
                  }
                >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/customer/dashboard/karan@gmail.com"
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-title">Basic Form</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname.startsWith("/admin/admin-user")
                      ? "nav-item active"
                      : "nav-item"
                  }>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/admin/admin-user"
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <BsFillPersonVcardFill style={{ width: "19px", height: "23px" }} />
                      </span>

                      <span className="nav-link-title active"> Employees </span>
                    </a>
                  </Link>
                </li>
                <li
                  className={
                    location.pathname === "/admin/bookings"
                      ? "nav-item active"
                      : "nav-item"
                  }
                 >
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to="/admin/bookings"
                  >
                    <a className="nav-link" href="./">
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                      <BiBookContent style={{ height: "24px", width: "19px" }} />
                      </span>
                      <span className="nav-link-title">Bookings</span>
                    </a>
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