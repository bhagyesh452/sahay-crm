import React, { useEffect } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import { useState } from "react";
import NewCard from "./NewCard";
import axios from "axios";
import NewGCard from "./NewGcard";

function ShowNotification() {
  const [RequestData, setRequestData] = useState([]);
  const [RequestGData, setRequestGData] = useState([]);
  const [dataType, setDataType] = useState("General");
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
      const response = await axios.get(
        `${secretKey}/requestgData`
      );
      setRequestGData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
    fetchRequestGDetails();
  }, []);

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
                    />
                  ))}

                {RequestData.length === 0 && dataType === "Manual" && (
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    No Data Available
                  </span>
                )}
                {RequestGData.length === 0 && dataType === "General" && (
                  <span style={{
                    textAlign: "center",
                    fontSize: "25px",
                    fontWeight: "bold",
                  }}>No Data Available</span>
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
