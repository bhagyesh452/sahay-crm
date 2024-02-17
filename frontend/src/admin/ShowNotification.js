import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";
import NewCard from "./NewCard";
import axios from "axios";
import NewGCard from "./NewGcard";
import ApproveCard from "./ApproveCard";
import Nodata from "../components/Nodata";
import DeleteBookingsCard from "./DeleteBookingsCard";
import EditBookingsCard from "./EditBookingsCard";

function ShowNotification() {
  const [RequestData, setRequestData] = useState([]);
  const [RequestGData, setRequestGData] = useState([]);
  const [RequestApprovals, setRequestApprovals] = useState([]);
  const [editData, setEditData] = useState([]);

  const [mapArray, setMapArray] = useState([]);
  const [dataType, setDataType] = useState("General");
  const [deleteData, setDeleteData] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestData`);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchRequestGDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestgData`);
      setRequestGData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchDataDelete = async () => {
    try {
      const response = await axios.get(`${secretKey}/deleterequestbybde`);
      setDeleteData(response.data); // Assuming your data is returned as an array
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchEditRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/editRequestByBde`);
      const uniqueEnames = response.data.reduce((acc, curr) => {
        if (!acc.some((item) => item.bdeName === curr.bdeName)) {
          const newDate = new Date(curr.bookingDate).toLocaleDateString();
          acc.push({
            ename: curr.bdeName,
            date: curr.bookingDate,
            time: curr.bookingTime,
            companyName: curr.companyName,
          });
        }
        return acc;
      }, []);
      setEditData(uniqueEnames);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.log(editData);

  const fetchApproveRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestCompanyData`);
      setRequestApprovals(response.data);
      const uniqueEnames = response.data.reduce((acc, curr) => {
        if (!acc.some((item) => item.ename === curr.ename)) {
          const [dateString, timeString] = formatDateAndTime(
            curr.AssignDate
          ).split(", ");
          acc.push({ ename: curr.ename, date: dateString, time: timeString });
        }
        return acc;
      }, []);
      setMapArray(uniqueEnames);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const formatDateAndTime = (AssignDate) => {
    // Convert AssignDate to a Date object
    const date = new Date(AssignDate);

    // Convert UTC date to Indian time zone
    const options = { timeZone: "Asia/Kolkata" };
    const indianDate = date.toLocaleString("en-IN", options);
    return indianDate;
  };

  useEffect(() => {
    fetchRequestDetails();
    fetchRequestGDetails();
    fetchApproveRequests();
    fetchDataDelete();
    fetchEditRequests();
  }, []);

  // setEnameArray(uniqueEnames);

  return (
    <div>
      {" "}
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                {/* <!-- Page pre-title --> */}
                <h2 className="page-title">Notifications</h2>
              </div>
            </div>

            <div className="container-xl">
              <div class="card-header row mt-2">
                <ul
                  class="nav nav-tabs card-header-tabs nav-fill"
                  data-bs-toggle="tabs"
                >
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      className={
                        dataType === "General"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                      onClick={() => {
                        setDataType("General");
                      }}
                    >
                      General Data
                    </a>
                  </li>
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      className={
                        dataType === "Manual"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                      onClick={() => {
                        setDataType("Manual");
                      }}
                    >
                      Manual Data
                    </a>
                  </li>
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      className={
                        dataType === "AddRequest"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                      onClick={() => {
                        setDataType("AddRequest");
                      }}
                    >
                      Approve Requests
                    </a>
                  </li>
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      className={
                        dataType === "deleteBookingRequests"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                      onClick={() => {
                        setDataType("deleteBookingRequests");
                      }}
                    >
                      Delete Booking Requests
                    </a>
                  </li>
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      className={
                        dataType === "editBookingRequests"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                      onClick={() => {
                        setDataType("editBookingRequests");
                      }}
                    >
                      Bookings Edit Requests
                    </a>
                  </li>
                </ul>
              </div>
              <div
                style={{ backgroundColor: "#f2f2f2" }}
                className="maincontent row"
              >
                {dataType === "Manual" &&
                  RequestData.length !== 0 &&
                  RequestData.map((company) => (
                    <NewCard
                      name={company.ename}
                      year={company.year}
                      ctype={company.ctype}
                      damount={company.dAmount}
                      id={company._id}
                      assignStatus={company.assigned}
                      cTime={company.cTime}
                      cDate={company.cDate}
                    />
                  ))}

                {RequestGData.length !== 0 &&
                  dataType === "General" &&
                  RequestGData.map((company) => (
                    <NewGCard
                      name={company.ename}
                      damount={company.dAmount}
                      id={company._id}
                      assignStatus={company.assigned}
                      cTime={company.cTime}
                      cDate={company.cDate}
                    />
                  ))}
                {dataType === "deleteBookingRequests" &&
                  deleteData.length !== 0 &&
                  deleteData.map((company) => (
                    <DeleteBookingsCard
                      request={company.request}
                      companyId={company.companyId}
                      name={company.ename}
                      companyName={company.companyName}
                      date={company.date}
                      time={company.time}
                    />
                  ))}
                {dataType === "editBookingRequests" &&
                  editData !== undefined &&
                  editData.map((company) => (
                    <EditBookingsCard
                      date={company.date}
                      time={company.time}
                      name={company.ename}
                      companyName={company.companyName}
                    />
                  ))}
                {mapArray.length !== 0 &&
                  dataType === "AddRequest" &&
                  mapArray.map((company) => (
                    <ApproveCard
                      name={company.ename}
                      date={company.date}
                      time={company.time}
                    />
                  ))}

                {RequestData.length === 0 && dataType === "Manual" && (
                  <Nodata />
                )}
                {RequestGData.length === 0 && dataType === "General" && (
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    <Nodata />
                  </span>
                )}
                {mapArray.length === 0 && dataType === "AddRequest" && (
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    <Nodata />
                  </span>
                )}
                {deleteData.length === 0 &&
                  dataType === "deleteBookingRequests" && (
                    <span
                      style={{
                        textAlign: "center",
                        fontSize: "25px",
                        fontWeight: "bold",
                      }}
                    >
                      <Nodata />
                    </span>
                  )}
                {editData.length === 0 &&
                  dataType === "editBookingRequests" && (
                    <span
                      style={{
                        textAlign: "center",
                        fontSize: "25px",
                        fontWeight: "bold",
                      }}
                    >
                      <Nodata />
                    </span>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowNotification;
