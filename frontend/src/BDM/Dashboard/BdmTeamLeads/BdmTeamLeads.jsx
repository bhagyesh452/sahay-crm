import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header.jsx";
import Navbar from '../../Components/Navbar/Navbar.jsx'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaWhatsapp } from "react-icons/fa";
import NoData from '../../Components/NoData/NoData.jsx';
import { Drawer, Icon, IconButton } from "@mui/material";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { GrStatusGood } from "react-icons/gr";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";







function BdmTeamLeads() {
  const { userId } = useParams();
  const [data, setData] = useState([])
  const [dataStatus, setdataStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
  const itemsPerPage = 500;
  const [currentData, setCurrentData] = useState([])
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [teamleadsData, setTeamLeadsData] = useState([]);
  const [teamData, setTeamData] = useState([])
  const [openRemarks, setOpenRemarks] = useState(false)
  const [remarksHistory, setRemarksHistory] = useState([]);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const [cid, setcid] = useState("");
  const [cstat, setCstat] = useState("");
  const [currentCompanyName, setCurrentCompanyName] = useState("");
  const [currentRemarks, setCurrentRemarks] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [bdmNewStatus, setBdmNewStatus] = useState("Untouched");


  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);
      //console.log(tempData);
      setData(userData);
      //setmoreFilteredData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchTeamLeadsData = async (status) => {
    const bdmName = data.ename
    try {
      const response = await axios.get(`${secretKey}/forwardedbybdedata/${bdmName}`)




      setTeamData(response.data)
      setTeamLeadsData(teamData.filter((obj) => obj.bdmStatus === "Untouched"))
      setBdmNewStatus("Untouched")
      console.log("response", response.data)
    } catch (error) {
      console.log(error)
    }
  }

  console.log("teamdata", teamleadsData)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchTeamLeadsData()

  }, [data.ename])

  //console.log("ename" , data.ename)


  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }


  const closePopUpRemarks = () => {
    setOpenRemarks(false)

  }

  const functionopenpopupremarks = (companyID, companyStatus, companyName) => {
    setOpenRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
    setcid(companyID);
    setCstat(companyStatus);
    setCurrentCompanyName(companyName);

  };

  console.log("currentcompanyname", currentCompanyName);

  const fetchRemarksHistory = async () => {
    try {
      const response = await axios.get(`${secretKey}/remarks-history`);
      setRemarksHistory(response.data);
      setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching remarks history:", error);
    }
  };


  useEffect(() => {
    fetchRemarksHistory();
  }, []);

  const handleAcceptClick = async (
    companyId,
    cName,
    cemail,
    cdate,
    cnumber,
    oldStatus,
    newBdmStatus
  ) => {
    try {
      const response = await axios.post(`${secretKey}/update-bdm-status/${companyId}`, {
        newBdmStatus,
        companyId,
        oldStatus,
        bdmAcceptStatus: "Accept",
      })

      if (response.status === 200) {
        Swal.fire("Accepted");
        fetchTeamLeadsData(oldStatus);
        //setBdmNewStatus(oldStatus)
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.log("Error updating status", error.message)
    }
  }

  console.log("bdmNewStatus", bdmNewStatus)

  

  const handleRejectData = async (companyId) => {

    try {
      const response = await axios.post(`${secretKey}/teamleads-rejectdata/${companyId}`, {
        bdmAcceptStatus: "NotForwarded",
      })
      console.log("response", response.data);
      fetchTeamLeadsData();
      Swal.fire("Data Rejected");
    } catch (error) {
      console.log("error reversing bdm forwarded data", error.message);
      Swal.fire("Error rekecting data")
    }
  }

  const handlebdmStatusChange =async(
    companyId,
    bdmnewstatus,
    cname,
    cemail,
    cindate,
    cnum,
    bdeStatus,
    bdmOldStatus
  )=>{
    const title = `${data.ename} changed ${cname} status from ${bdmOldStatus} to ${bdmnewstatus}`;
    const DT = new Date();
    const date = DT.toLocaleDateString();
    const time = DT.toLocaleTimeString();
    try {
      // Make an API call to update the employee status in the database
      const response = await axios.post(
        `${secretKey}/bdm-status-change/${companyId}`,
        {
          bdeStatus,
          bdmnewstatus,
          title,
          date,
          time,
        }
      );

      // Check if the API call was successful
      if (response.status === 200) {
        // Assuming fetchData is a function to fetch updated employee data

        fetchTeamLeadsData(bdmOldStatus);
      } else {
        // Handle the case where the API call was not successful
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }

  }

  return (
    <div>

      <Header bdmName={data.ename} />
      <Navbar userId={userId} />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
            
        </div>
        <div className="page-body" onCopy={(e) => {
          e.preventDefault();
        }}>
          <div className="container-xl">
            <div class="card-header my-tab">
              <ul class="nav nav-tabs card-header-tabs nav-fill p-0"
                data-bs-toggle="tabs">
                <li class="nav-item data-heading">
                  <a
                    href="#tabs-home-5"
                    onClick={() => {
                      setBdmNewStatus("Untouched");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Busy" ||
                            obj.bdmStatus === "Not Picked Up" ||
                            obj.bdmStatus === "Untouched"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "Untouched"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    General{" "}
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Busy" ||
                            obj.bdmStatus === "Not Picked Up" ||
                            obj.bdmStatus === "Untouched"
                        ).length
                      }
                    </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("Interested");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) => obj.bdmStatus === "Interested"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "Interested"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Interested
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) => obj.bdmStatus === "Interested"
                        ).length
                      }
                    </span>

                    {/* <span className="no_badge">
                      <li class="nav-item">
                        <a
                          href="#tabs-activity-5"
                          // onClick={() => {
                          //   setdataStatus("FollowUp");
                          //   setCurrentPage(0);
                          //   setEmployeeData(
                          //     moreEmpData.filter(
                          //       (obj) => obj.Status === "FollowUp"
                          //     )
                          //   );
                          // }}
                          className={
                            dataStatus === "FollowUp"
                              ? "nav-link active item-act"
                              : "nav-link"
                          }
                          data-bs-toggle="tab"
                        >
                           Follow Up{" "} 
                          <span className="no_badge">
                            {
                              teamData.filter(
                                (obj) => obj.Status === "FollowUp"
                              ).length
                            }
                          </span>
                        </a>
                      </li>
                    </span> */}
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("FollowUp");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) => obj.bdmStatus === "FollowUp"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "FollowUp"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Follow Up{" "}
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) => obj.bdmStatus === "FollowUp"
                        ).length
                      }
                    </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("Matured");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData
                          .filter((obj) => obj.bdmStatus === "Matured")
                          .sort(
                            (a, b) =>
                              new Date(b.lastActionDate) -
                              new Date(a.lastActionDate)
                          )
                      );
                    }}
                    className={
                      bdmNewStatus === "Matured"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Matured{" "}
                    <span className="no_badge">
                      {" "}
                      {
                        teamData.filter(
                          (obj) => obj.bdmStatus === "Matured"
                        ).length
                      }
                    </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("NotInterested");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Not Interested" ||
                            obj.bdmStatus === "Junk"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "NotInterested"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Not-Interested{" "}
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Not Interested" ||
                            obj.bdmStatus === "Junk"
                        ).length
                      }
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="card">
              <div className="card-body p-0" >
                <div style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "66vh",
                }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                  }}
                    className="table-vcenter table-nowrap">
                    <thead>
                      <tr className="tr-sticky">
                        <th className="th-sticky">Sr.No</th>
                        <th className="th-sticky1">Company Name</th>
                        <th>Company Number</th>
                        <th>Bde Status</th>
                        <th>Bde Remarks</th>
                        {(bdmNewStatus === "Interested" || bdmNewStatus === "FollowUp" || bdmNewStatus === "Matured" || bdmNewStatus === "Not Interested") && (
                          <>
                            <th>Bdm Status</th>
                            <th>Bdm Remarks</th>
                          </>
                        )}
                        <th>
                          Incorporation Date
                        </th>
                        <th>City</th>
                        <th>State</th>
                        <th>Company Email</th>
                        <th>
                          Assigned Date
                        </th>
                        {bdmNewStatus === "Untouched" && <th>Action</th>}

                      </tr>
                    </thead>
                    <tbody>
                      {teamleadsData.map((company, index) => (
                        <tr
                          key={index}
                          style={{ border: "1px solid #ddd" }}
                        >
                          <td className="td-sticky">
                            {startIndex + index + 1}
                          </td>
                          <td className="td-sticky1">
                            {company["Company Name"]}
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-between wApp">
                              <div>{company["Company Number"]}</div>
                              <a
                                target="_blank"
                                href={`https://wa.me/91${company["Company Number"]}`}
                              >
                                <FaWhatsapp />
                              </a>
                            </div>
                          </td>
                          <td>
                            {company.Status}
                            {/* {company["Status"] === "Matured" ? (
                              <span>{company["Status"]}</span>
                            ) : (
                              <select
                                style={{
                                  background: "none",
                                  padding: ".4375rem .75rem",
                                  border:
                                    "1px solid var(--tblr-border-color)",
                                  borderRadius:
                                    "var(--tblr-border-radius)",
                                }}
                                value={company["Status"]}
                              onChange={(e) =>
                                handleStatusChange(
                                  company._id,
                                  e.target.value,
                                  company["Company Name"],
                                  company["Company Email"],
                                  company[
                                  "Company Incorporation Date  "
                                  ],
                                  company["Company Number"],
                                  company["Status"]
                                )
                              }
                              >
                                <option value="Not Picked Up">
                                  Not Picked Up
                                </option>
                                <option value="Busy">Busy </option>
                                <option value="Junk">Junk</option>
                                <option value="Not Interested">
                                  Not Interested
                                </option>
                                {dataStatus === "All" && (
                                  <>
                                    <option value="Untouched">
                                      Untouched{" "}
                                    </option>
                                    <option value="Interested">
                                      Interested
                                    </option>
                                  </>
                                )}

                                {dataStatus === "Interested" && (
                                  <>
                                    <option value="Interested">
                                      Interested
                                    </option>
                                    <option value="FollowUp">
                                      Follow Up{" "}
                                    </option>
                                    <option value="Matured">
                                      Matured
                                    </option>
                                  </>
                                )}

                                {dataStatus === "FollowUp" && (
                                  <>
                                    <option value="FollowUp">
                                      Follow Up{" "}
                                    </option>
                                    <option value="Matured">
                                      Matured
                                    </option>
                                  </>
                                )}
                              </select>
                            )} */}
                          </td>
                          <td>
                            <div
                              key={company._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100px",
                              }}>
                              <p
                                className="rematkText text-wrap m-0"
                                title={company.Remarks}
                              >
                                {!company["Remarks"]
                                  ? "No Remarks"
                                  : company.Remarks}
                              </p>
                              <IconButton
                                onClick={() => {
                                  functionopenpopupremarks(
                                    company._id,
                                    company.Status,
                                    company["Company Name"]
                                  );
                                  setCurrentRemarks(company.Remarks);
                                  setCompanyId(company._id);
                                }}
                              >
                                <IconEye
                                  style={{
                                    width: "12px",
                                    height: "12px",
                                    color: "#fbb900"
                                  }}
                                />
                              </IconButton>
                            </div>
                          </td>
                          {(bdmNewStatus === "Interested" || bdmNewStatus === "FollowUp" || bdmNewStatus === "Matured" || bdmNewStatus === "Not Interested") && (
                            <>
                              <td>
                                  {company.bdmStatus === "Matured" ? (
                                    <span>{company.bdmStatus}</span>
                                  ) : (
                                    <select
                                      style={{
                                        background: "none",
                                        padding: ".4375rem .75rem",
                                        border:
                                          "1px solid var(--tblr-border-color)",
                                        borderRadius:
                                          "var(--tblr-border-radius)",
                                      }}
                                      value={company.bdmStatus}
                                      onChange={(e) =>
                                        handlebdmStatusChange(
                                          company._id,
                                          e.target.value,
                                          company["Company Name"],
                                          company["Company Email"],
                                          company[
                                          "Company Incorporation Date  "
                                          ],
                                          company["Company Number"],
                                          company["Status"],
                                          company.bdmStatus
                                        )
                                      }
                                    >
                                      <option value="Not Picked Up">
                                        Not Picked Up
                                      </option>
                                      <option value="Busy">Busy </option>
                                      <option value="Junk">Junk</option>
                                      <option value="Not Interested">
                                        Not Interested
                                      </option>
                                      {bdmNewStatus === "Interested" && (
                                        <>
                                          <option value="Interested">
                                            Interested
                                          </option>
                                          <option value="FollowUp">
                                            Follow Up{" "}
                                          </option>
                                          <option value="Matured">
                                            Matured
                                          </option>
                                        </>
                                      )}

                                      {bdmNewStatus === "FollowUp" && (
                                        <>
                                          <option value="FollowUp">
                                            Follow Up{" "}
                                          </option>
                                          <option value="Matured">
                                            Matured
                                          </option>
                                        </>
                                      )}
                                    </select>
                                  )}
                                </td>
                              <td>{company.bdmRemarks}</td>
                            </>
                          )}
                          <td>
                            {formatDate(
                              company["Company Incorporation Date  "]
                            )}
                          </td>
                          <td>{company["City"]}</td>
                          <td>{company["State"]}</td>
                          <td>{company["Company Email"]}</td>
                          <td>{formatDate(company["AssignDate"])}</td>
                          {
                            company.bdmStatus === "Untouched" && (
                              <td>
                                <IconButton style={{ color: "green", marginRight: "5px", height: "25px", width: "25px" }}
                                  onClick={(e) => handleAcceptClick(
                                    company._id,
                                    //e.target.value,
                                    company["Company Name"],
                                    company["Company Email"],
                                    company[
                                    "Company Incorporation Date  "
                                    ],
                                    company["Company Number"],
                                    company["Status"],
                                    company.bdmStatus
                                  )}>
                                  <GrStatusGood />
                                </IconButton>
                                <IconButton onClick={() => {
                                  handleRejectData(
                                    company._id
                                  )
                                }}> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red" style={{ width: "12px", height: "12px", color: "red" }}><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" /></svg></IconButton>
                              </td>

                            )
                          }

                          {/* {(dataStatus === "FollowUp" ||
                            dataStatus === "Interested") && (<>
                              <td>
                                {company &&
                                  projectionData &&
                                  projectionData.some(
                                    (item) =>
                                      item.companyName ===
                                      company["Company Name"]
                                  ) ? (
                                  <IconButton>
                                    <RiEditCircleFill
                                      onClick={() => {
                                        functionopenprojection(
                                          company["Company Name"]
                                        );
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        width: "17px",
                                        height: "17px",
                                      }}
                                      color="#fbb900"
                                    />
                                  </IconButton>
                                ) : (
                                  <IconButton>
                                    <RiEditCircleFill
                                      onClick={() => {
                                        functionopenprojection(
                                          company["Company Name"]
                                        );
                                        setIsEditProjection(true);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        width: "17px",
                                        height: "17px",
                                      }}
                                    />
                                  </IconButton>
                                )}
                              </td>
                              <td>
                                <div className="d-flex align-items-center justify-content-center" style={{ gap: "20px" }}>
                                  <TiArrowBack style={{
                                    cursor: "pointer",
                                    width: "17px",
                                    height: "17px",
                                  }}
                                    color="grey" />
                                  <TiArrowForward
                                    onClick={() => {
                                      handleConfirmAssign(
                                        company["Company Name"],
                                        company.Status,
                                        company.ename
                                      );
                                    }}
                                    style={{
                                      cursor: "pointer",
                                      width: "17px",
                                      height: "17px",
                                    }}
                                    color="grey" />
                                </div>
                              </td>
                            </>)} */}
                          {/* {dataStatus === "Matured" && (
                            <>
                              <td>
                                <div className="d-flex">
                                  <IconButton
                                    style={{ marginRight: "5px" }}
                                    onClick={() => {
                                      setMaturedID(company._id);

                                      functionopenAnchor();
                                    }}
                                  >
                                    <IconEye
                                      style={{
                                        width: "14px",
                                        height: "14px",
                                        color: "#d6a10c",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => {
                                      handleRequestDelete(
                                        company._id,
                                        company["Company Name"]
                                      );
                                    }}
                                    disabled={requestDeletes.some(
                                      (item) =>
                                        item.companyId === company._id &&
                                        item.request === undefined
                                    )}
                                  >
                                    <DeleteIcon
                                      style={{
                                        cursor: "pointer",
                                        color: "#f70000",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      handleEditClick(company._id)
                                    }}
                                  >
                                    <Edit
                                      style={{
                                        cursor: "pointer",
                                        color: "#109c0b",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setCompanyName(
                                        company["Company Name"]
                                      );
                                      setAddFormOpen(true);
                                    }}
                                  >
                                    <AddCircleIcon
                                      style={{
                                        cursor: "pointer",
                                        color: "#4f5b74",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              </td>
                            </>
                          )} */}
                        </tr>
                      ))}
                    </tbody>
                    {teamleadsData.length === 0 && (
                      <tbody>
                        <tr>
                          <td colSpan="11" className="p-2 particular">
                            <NoData />
                          </td>
                        </tr>
                      </tbody>
                    )}
                    {teamleadsData.length !== 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className="pagination"
                      >
                        <IconButton
                          onClick={() =>
                            setCurrentPage((prevPage) =>
                              Math.max(prevPage - 1, 0)
                            )
                          }
                          disabled={currentPage === 0}
                        >
                          <IconChevronLeft />
                        </IconButton>
                        {/* <span>
                          Page {currentPage + 1} of{" "}
                          {Math.ceil(filteredData.length / itemsPerPage)}
                        </span> */}

                        {/* <IconButton
                          onClick={() =>
                            setCurrentPage((prevPage) =>
                              Math.min(
                                prevPage + 1,
                                Math.ceil(filteredData.length / itemsPerPage) -
                                1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(filteredData.length / itemsPerPage) - 1
                          }
                        >
                          <IconChevronRight />
                        </IconButton> */}
                      </div>
                    )}

                  </table>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
      {/* // -------------------------------------------------------------------Dialog for bde Remarks--------------------------------------------------------- */}

      <Dialog
        open={openRemarks}
        onClose={closePopUpRemarks}
        fullWidth
        maxWidth="sm">
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>
            {currentCompanyName}'s Remarks
          </span>
          <IconButton onClick={closePopUpRemarks} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarks.length !== 0 ? (
              filteredRemarks.slice().map((historyItem) => (
                <div className="col-sm-12" key={historyItem._id}>
                  <div className="card RemarkCard position-relative">
                    <div className="d-flex justify-content-between">
                      <div className="reamrk-card-innerText">
                        <pre className="remark-text">{historyItem.remarks}</pre>
                      </div>
                      {/* <div className="dlticon">
                        <DeleteIcon
                          style={{
                            cursor: "pointer",
                            color: "#f70000",
                            width: "14px",
                          }}
                          onClick={() => {
                            handleDeleteRemarks(
                              historyItem._id,
                              historyItem.remarks
                            );
                          }}
                        />
                      </div> */}
                    </div>

                    <div className="d-flex card-dateTime justify-content-between">
                      <div className="date">{historyItem.date}</div>
                      <div className="time">{historyItem.time}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center overflow-hidden">
                No Remarks History
              </div>
            )}
          </div>

          {/* <div class="card-footer">
            <div class="mb-3 remarks-input">
              <textarea
                placeholder="Add Remarks Here...  "
                className="form-control"
                id="remarks-input"
                rows="3"
                onChange={(e) => {
                  debouncedSetChangeRemarks(e.target.value);
                }}
              ></textarea>
            </div>
            <button
              onClick={handleUpdate}
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div> */}
        </DialogContent>
      </Dialog>
    </div>

  );
}

export default BdmTeamLeads;
