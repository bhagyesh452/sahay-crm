import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EnhancedTable from "./EnhancedTableHead";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function NewCard({id, name, year, ctype, damount,assignStatus , cTime, cDate }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [data, setData] = useState([]);
  const [open, openchange] = useState(false);
  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/card-leads` , damount);

      // Set the retrieved data in the state
    

      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    // Fetch data from the Node.js server
    // Call the fetchData function
    fetchData();
  }, []);

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const handleCheckboxChange = (row) => {
    // If the row is 'all', toggle all checkboxes
    if (row === "all") {
      // If all checkboxes are already selected, clear the selection; otherwise, select all
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.length === filteredData.length
          ? []
          : filteredData.map((row) => row)
      );
    } else {
      // Toggle the selection status of the row
      setSelectedRows((prevSelectedRows) => {
        const isRowSelected = prevSelectedRows.some(
          (selectedRow) => selectedRow._id === row._id
        );

        if (isRowSelected) {
          return prevSelectedRows.filter(
            (selectedRow) => selectedRow._id !== row._id
          );
        } else {
          return [...prevSelectedRows, row];
        }
      });
    }
  };



  const handleConfirmAssign = async () => {
    const employeeSelection = name;
    const selectedObjects = selectedRows;
    if (selectedObjects.length !== 0) {
      for (const obj of selectedObjects) {
        try {
          const response = await axios.post(
            `${secretKey}/postData`,
            {
              employeeSelection,
              selectedObjects,
            }
          );
          fetchData();
          await axios.put(`${secretKey}/requestData/${id}`, {
          read: true,
          assigned:true
        })
          
      

          console.log("Data posted successfully");
        } catch (err) {
          console.log("Internal server Error", err);
        }
      }
      closepopup();
      Swal.fire({
        title: "Data Send!",
        text: "Data successfully sent to the Employee",
        icon: "success",
      });
    } else {
      Swal.fire("Please Select a file");
    }
  };

  console.log(selectedRows)

  const [filteredData, setfilteredData] = useState([]);

  const handleManualAssign = () => {
   
    setfilteredData(data);
    functionopenpopup();
  };

  const handleDirectAssign = () => {
    if (ctype === "PVT LTD" && data.length!==0) {
      
      const filteredNewData = data.filter((item) =>
        item["Company Name"].toLowerCase().includes("private limited")
      );
      const extrafilter = filteredNewData.filter((item) => {
        const incorporationDate = item["Company Incorporation Date  "];
        const nyear = new Date(incorporationDate).getFullYear();
        return nyear === year; // Replace selectedYear with your desired year
      });
      const filteredextraData = extrafilter.slice(0, damount);
      setfilteredData(filteredextraData);
      functionopenpopup();
    } else {
      const filteredNewData = data.filter((item) =>
        item["Company Name"].toLowerCase().includes("llt")
      );
      const extrafilter = filteredNewData.filter((item) => {
        const incorporationDate = item["Company Incorporation Date  "];
        const nyear = new Date(incorporationDate).getFullYear();
        console.log(nyear);
        return nyear === year; // Replace selectedYear with your desired year
      });

      const filteredextraData = extrafilter.slice(0, damount);
      setfilteredData(filteredextraData);
      functionopenpopup();
    }
  };
  const isToday = (dateString) => {
    const today = new Date().toLocaleDateString();
    const date = new Date(dateString).toLocaleDateString();
    

    return (
      date === today 
    );
  };

  return (
    <Box sx={{ minWidth: 200, width: "28vw" }}>
  <Card
    className="g-card"
    style={{
      padding: "8px",
      backgroundColor: assignStatus ? "#d3d2d2de" : "inherit",
      margin: "10px 0px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s",
      "&:hover": {
        transform: "scale(1.02)",
      },
    }}
    variant="outlined"
  >
    <React.Fragment>
      <CardContent>
        <div className="main-content-card d-flex justify-content-between">

        <div
          style={{
            fontSize: "16px",
           
            marginBottom: "8px",
            color: "#333",
          }}
          variant="h5"
          component="div"
        >
         <strong>{name}</strong>  is requesting for {damount} Data
         <div className="data-type d-flex justify-content-between"  style={{fontSize:'12px'}}>
          <div style={{color:'#797878'}} className="c-type">
          COMPANY TYPE: <strong>{ctype}</strong>
          </div>
          <div style={{color:'#797878'}} className="c-year">
          YEAR: <strong>{year}</strong> 
          </div>
         </div>
        
        </div>
        

        <div className="show-time-card">
          {isToday(cDate) ? cTime : cDate}
        </div>
        </div>
      </CardContent>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "auto",
        }}
        className="footerbutton"
      >
        <button
          style={{
            width: "45%",
            borderRadius: "4px",
            backgroundColor: assignStatus ? "#ceedce" : "#2e830b",
            color: assignStatus ? "#2e830b" : "#ffffff",
            border: "none",
            padding: "6px",
            cursor: assignStatus ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
            fontSize: "14px",
          }}
          className="btn btn-primary d-none d-sm-inline-block"
          onClick={handleDirectAssign}
          disabled={assignStatus}
        >
          Accept
        </button>
        <button
          style={{
            width: "45%",
            borderRadius: "4px",
            backgroundColor: assignStatus ? "#f4d0d0" : "#bc2929",
            color: assignStatus ? "#bc2929" : "#ffffff",
            border: "none",
            padding: "6px",
            cursor: assignStatus ? "not-allowed" : "pointer",
            transition: "background-color 0.3s",
            fontSize: "14px",
          }}
          className="btn btn-primary d-none d-sm-inline-block"
          onClick={handleManualAssign}
          disabled={assignStatus}
        >
          Assign Manually
        </button>
      </div>
    </React.Fragment>
  </Card>
      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="lg">
        <DialogTitle>
          No of results {filteredData.length}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          {/* Table content */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #ddd",
              }}
              className="table-vcenter table-nowrap"
            >
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
                  <th
                    style={{
                      position: "sticky",
                      left: "0px",
                      zIndex: 1,
                      backgroundColor: "rgb(242, 242, 242)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredData.length}
                      onChange={() => handleCheckboxChange("all")}
                    />
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      left: "30px",
                      zIndex: 1,
                      backgroundColor: "rgb(242, 242, 242)",
                    }}
                  >
                    Sr.No
                  </th>
                  <th
                    style={{
                      position: "sticky",
                      left: "80px",
                      zIndex: 1,
                      backgroundColor: "rgb(242, 242, 242)",
                    }}
                  >
                    Company Name
                  </th>
                  <th>Company Number</th>
                  <th>Company Email</th>
                  <th>Incorporation Date</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              {filteredData.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {filteredData.map((company, index) => (
                    <tr key={index} style={{ border: "1px solid #ddd" }}>
                      <td
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          backgroundColor: "rgb(242, 242, 242)",
                        }}
                      >
                        <input
                          checked={selectedRows.includes(company)}
                          onChange={() => handleCheckboxChange(company)}
                          type="checkbox"
                        />
                      </td>
                      <td
                        style={{
                          position: "sticky",
                          left: "30px",
                          zIndex: 1,
                          backgroundColor: "rgb(242, 242, 242)",
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          position: "sticky",
                          left: "80px",

                          background: "white",
                        }}
                      >
                        {company["Company Name"]}
                      </td>
                      <td>{company["Company Number"]}</td>
                      <td>{company["Company Email"]}</td>
                      <td>
                        {formatDate(company["Company Incorporation Date  "])}
                      </td>
                      <td>{company["City"]}</td>
                      <td>{company["State"]}</td>
                      <td>{company["Status"]}</td>
                      <td>{company["Remarks"]}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div className="btn-list">
            <button
              style={{ width: "100vw", borderRadius: "0px" }}
              onClick={handleConfirmAssign}
              className="btn btn-primary ms-auto"
            >
              Assign Data
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
