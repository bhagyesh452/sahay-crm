import React from "react";
import "../../../dist/css/tabler.min.css?1684106062";
import "../../../dist/css/tabler-flags.min.css?1684106062";
import "../../../dist/css/tabler-payments.min.css?1684106062";
import "../../../dist/css/tabler-vendors.min.css?1684106062";
import "../../../dist/css/demo.min.css?1684106062";
import { Link, useLocation } from "react-router-dom";
import { GrDocumentStore } from "react-icons/gr";
import { BsFillPersonVcardFill } from "react-icons/bs";
import dashboardicon from '../../../dist/img/dashboardicon/dashboardico0n.jpg'
import { BiBookContent } from "react-icons/bi";
import { AiOutlineTeam } from "react-icons/ai";




function Navbar({ userId, isVicePresident }) {
    console.log("isVicePresident", isVicePresident)
    const location = useLocation();

    return (
        <div>
            <header className="navbar-expand-md">
                <div className="collapse navbar-collapse" id="navbar-menu">
                    <div className="navbar">
                        <div className="container-xl">
                            <ul className="navbar-nav">
                                <li
                                    className={`nav-item ${(isVicePresident && location.pathname === `/vicePresident/dashboard/${userId}`) ||
                                            (!isVicePresident && location.pathname === `/floormanager/dashboard/${userId}`)
                                            ? "active"
                                            : ""
                                        }`}
                                >
                                    <Link
                                        to={isVicePresident ? `/vicePresident/dashboard/${userId}` : `/floormanager/dashboard/${userId}`}
                                        style={{ textDecoration: "none", color: "black" }}
                                        className="nav-link"
                                    >
                                        <span className="nav-link-icon d-md-none d-lg-inline-block">
                                            {/* SVG icon */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="icon"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                                                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                                            </svg>
                                        </span>
                                        <span className="nav-link-title">Dashboard</span>
                                    </Link>
                                </li>

                                <li className={`nav-item ${(isVicePresident && location.pathname === `/vicePresident/leads/${userId}`) ||
                                            (!isVicePresident && location.pathname === `/floormanager/leads/${userId}`)
                                            ? "active"
                                            : ""
                                        }`}
                                        >
                                    <Link
                                        to={isVicePresident ? `/vicePresident/leads/${userId}` : `/floormanager/leads/${userId}`}
                                        style={{ textDecoration: "none", color: "black" }}
                                        className="nav-link"
                                    >
                                        <a className="nav-link" href="./">
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <GrDocumentStore style={{ height: "22px", width: "15px" }} />
                                            </span>
                                            <span className="nav-link-title">My Leads</span>
                                        </a>
                                    </Link>
                                </li>
                                <li
                                    className={`nav-item ${(isVicePresident && location.pathname === `/vicePresident/teamleads/${userId}`) ||
                                        (!isVicePresident && location.pathname === `/floormanager/teamleads/${userId}`)
                                        ? "active"
                                        : ""
                                    }`}
                                    >
                                    <Link
                                        style={{ textDecoration: "none", color: "black" }}
                                        to={isVicePresident ? `/vicePresident/teamleads/${userId}` : `/floormanager/teamleads/${userId}`}

                                    >
                                        <a className="nav-link" href="./">
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">

                                                <AiOutlineTeam style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                                            </span>
                                            <span className="nav-link-title active">Team Leads</span>
                                        </a>
                                    </Link>
                                </li>
                                <li
                                    className={`nav-item ${(isVicePresident && location.pathname === `/vicePresident/bookings/${userId}`) ||
                                        (!isVicePresident && location.pathname === `/floormanager/bookings/${userId}`)
                                        ? "active"
                                        : ""
                                    }`}
                                    >
                                    <Link
                                        style={{ textDecoration: "none", color: "black" }}
                                        to={isVicePresident ? `/vicePresident/bookings/${userId}` : `/floormanager/bookings/${userId}`}

                                    >
                                        <a className="nav-link" href="./">
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <BiBookContent style={{ height: "24px", width: "19px" }} />
                                            </span>
                                            <span className="nav-link-title active">My Bookings</span>
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </div>

    )

}

export default Navbar;