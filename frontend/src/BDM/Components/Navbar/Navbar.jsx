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





function Navbar({userId}) {

    const location = useLocation();

    // const bdmName = localStorage.getItem("bdmName")

    // console.log(bdmName)

    // const handleDashboardClick = ()=>{
    //     window.location.replace(`/bdmdashboard/${bdmName}`)
    //   }

    //   const handleConvertedLeadsClicksame = () => {
    //     // Navigate to the /employee-data/:userId/converted-leads route
    //     window.location.replace(`/bdm/bdmleads/${bdmName}/`);
    //   };




    return (
        <div>
            <header className="navbar-expand-md">
                <div className="collapse navbar-collapse" id="navbar-menu">
                    <div className="navbar">
                        <div className="container-xl p-0">
                            <ul className="navbar-nav">
                                <li className="nav-item" 
                                    class={
                                        location.pathname === `/bdmdashboard/${userId}` ? "nav-item active" : "nav-item"
                                    }>
                                    <Link
                                        style={{ textDecoration: "none", color: "black" }}
                                        to={{
                                            pathname: `/bdmdashboard/${userId}`
                                        }}

                                    >
                                        <a className="nav-link" href="./">
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <img src={dashboardicon} style={{ opacity: "0.5" }} />
                                            </span>
                                            <span className="nav-link-title">Dashboard</span>
                                        </a>
                                    </Link>
                                </li>
                                <li className="nav-item"
                                    class={
                                        location.pathname === `/bdm/bdmleads/${userId}` ? "nav-item active" : "nav-item"
                                    }>
                                    <Link
                                        style={{ textDecoration: "none", color: "black" }}
                                        to={{
                                            pathname: `/bdm/bdmleads/${userId}`,
                                        }}
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
                                    className={
                                        location.pathname === `/bdm/bdmteamleads/${userId}`
                                            ? "nav-item active"
                                            : "nav-item"
                                    }>
                                    <Link
                                        style={{ textDecoration: "none", color: "black" }}
                                        to={{
                                            pathname:`/bdm/bdmteamleads/${userId}`
                                        }}
                                    >
                                        <a className="nav-link" href="./">
                                            <span className="nav-link-icon d-md-none d-lg-inline-block">
                                                <BsFillPersonVcardFill style={{ width: "19px", height: "23px" }} />
                                            </span>
                                            <span className="nav-link-title active">Team Leads</span>
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