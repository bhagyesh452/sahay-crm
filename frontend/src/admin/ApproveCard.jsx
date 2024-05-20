import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import axios from "axios";
import SaveIcon from '@mui/icons-material/Save';
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

function ApproveCard({ name, date, time }) {
  const [requestData, setRequestData] = useState([]);
  const [editableCompany , setEditableCompany] = useState("");
  const [companyObject , setCompanyObject] = useState({
    "Company Name": "",
        "Company Number": 0,
        "Company Email": "",
        "Company Incorporation Date  ": "", 
        City: "",
        State: "",
  })
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [open, openchange] = useState(false);
  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };

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
        prevSelectedRows.length === requestData.length
          ? []
          : requestData.map((row) => row)
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
  const fetchApproveRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestCompanyData`);
      setRequestData(response.data.filter((obj) => obj.ename === name));
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchApproveRequests();
  }, []);
  const handleConfirmAssign = async () => {
    const updatedCsvdata = selectedRows;
    const ename = name;
    if (updatedCsvdata.length !== 0) {
      try {
        await axios.post(`${secretKey}/company-data/leads`, updatedCsvdata);
        console.log("Data sent successfully");
        Swal.fire({
          title: "Data Send!",
          text: "Data successfully sent to the Employee",
          icon: "success",
        });
        await axios.delete(`${secretKey}/requests/delete-data/${ename}`);
        fetchApproveRequests();
        closepopup();
      } catch (error) {
        if (error.response.status !== 500) {     
          Swal.fire("Some of the data are not unique");
        } else {
          Swal.fire("Please upload unique data");
        }
        console.log("Error:", error);
      }

    // Move setLoading outside of the loop

    
    } else {
      Swal.fire("Please upload data");
    }
  };
  const handleDeleteData = async () => {
    const ename = name;
    try {
      // Make a DELETE request to the backend endpoint
      const response = await axios.delete(`${secretKey}/requests/delete-data/${ename}`);
      fetchApproveRequests();
      closepopup();
      if(response.status===200){
        Swal.fire("Request Rejected!");
      }
  
      console.log(`Data objects with ename ${ename} deleted successfully`);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const formatDateDeserving = (date) =>{
    const formattedDate = new Date(date);
    const returnableDate = `${formattedDate.getFullYear()}-${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}-${formattedDate.getDate().toString().padStart(2, '0')}`;
    return returnableDate;
  }

  const handleSaveCompany = async () => {
 
    try {
        const response = await axios.post(`${secretKey}/requests/change-edit-request/${editableCompany}`, companyObject);
        fetchApproveRequests();
        setEditableCompany("");
        setCompanyObject({
          "Company Name": "",
              "Company Number": 0,
              "Company Email": "",
              "Company Incorporation Date  ": "", 
              City: "",
              State: "",
        })
       
        // Handle success response as needed
    } catch (error) {
        console.error("Error saving company:", error);
        // Handle error response
    }
};


  
  return (
    <div>
      <Box sx={{ minWidth: 275, width: "28vw" }}>
        <Card
          style={{ padding: "10px", margin: "10px 0px" }}
          variant="outlined"
        >
          <React.Fragment>
            <CardContent>
              <Typography
                style={{ fontSize: "18px" }}
                variant="h5"
                component="div"
              >
                {name} wants to upload some Data
              </Typography>
              <div className="d-flex justify-content-between">
              <Typography color="text.secondary">{date}</Typography>
                <Typography color="text.secondary">
                  {time.toUpperCase()}
                </Typography>
              
              </div>
            </CardContent>

            <div
              style={{ display: "flex", justifyContent: "space-around" }}
              className="footerbutton"
            >
              <button
                style={{
                  width: "100vw",
                  borderRadius: "0px",
                  backgroundColor: "#ceedce",
                  color: "#2e830b",
                  "&:hover": {
                    backgroundColor: "#aabbcc !important",
                    color: "#ffffff !important",
                  },
                }}
                className="btn btn-primary d-none d-sm-inline-block"
                onClick={functionopenpopup}
              >
                View
              </button>
            </div>
          </React.Fragment>
        </Card>
      </Box>

      <Dialog open={open} onClose={closepopup} fullWidth maxWidth="lg">
        <DialogTitle>
          No of results {requestData.length}
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
                      checked={selectedRows.length === requestData.length}
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
                  <th>Edit</th>
                </tr>
              </thead>
              {requestData.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="10" style={{ textAlign: "center" }}>
                      No data available
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {requestData.map((company, index) => (
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

                        {editableCompany !== company["Company Name"] ? company["Company Name"] : <input
                            type="text"
                            // value={company["Company Name"]}
                          value = {companyObject["Company Name"]}
                            placeholder="Search…"
                            aria-label="Search in website"
                            style={{border:'none'}}
                            onChange={(e)=>{
                              setCompanyObject({
                                ...companyObject,
                                "Company Name":e.target.value
                              })
                            }}
                          /> }
                        { }
                      </td>
                      <td>{editableCompany !== company["Company Name"] ? company["Company Number"] : <input
                            type="number"
                            // value={company["Company Name"]}
                          value = {companyObject["Company Number"]}
                            placeholder="Search…"
                            aria-label="Search in website"
                            style={{border:'none'}}
                            onChange={(e)=>{
                              setCompanyObject({
                                ...companyObject,
                                "Company Number":e.target.value
                              })
                            }}
                          /> }</td>
                      <td>{editableCompany !== company["Company Name"] ? company["Company Email"] : <input
                            type="text"
                            // value={company["Company Name"]}
                          value = {companyObject["Company Email"]}
                            placeholder="Search…"
                            aria-label="Search in website"
                            style={{border:'none'}}
                            onChange={(e)=>{
                              setCompanyObject({
                                ...companyObject,
                                "Company Email":e.target.value
                              })
                            }}
                          /> }</td>
                      <td>
                      {editableCompany !== company["Company Name"] ? formatDate(company["Company Incorporation Date  "]) : <input
                            type="date"
                            value={formatDateDeserving(companyObject["Company Incorporation Date  "])}                          
                            placeholder="Search…"
                            aria-label="Search in website"
                            style={{border:'none'}}
                            onChange={(e)=>{
                              setCompanyObject({
                                ...companyObject,
                                "Company Incorporation Date  ": new Date(e.target.value)
                              })
                            }}
                          /> }
                      </td>
                      <td> {editableCompany !== company["Company Name"] ? company["City"] : <input
                            type="text"
                            // value={company["Company Name"]}
                          value = {companyObject["City"]}
                            placeholder="Search…"
                            aria-label="Search in website"
                            style={{border:'none'}}
                            onChange={(e)=>{
                              setCompanyObject({
                                ...companyObject,
                                "City":e.target.value
                              })
                            }}
                          /> }</td>
                      <td>{editableCompany !== company["Company Name"] ? company["State"] : <input
                            type="text"
                            // value={company["Company Name"]}
                          value = {companyObject["State"]}
                            placeholder="Search…"
                            aria-label="Search in website"
                            style={{border:'none'}}
                            onChange={(e)=>{
                              setCompanyObject({
                                ...companyObject,
                                "State":e.target.value
                              })
                            }}
                          /> }</td>
                      <td>{company["Status"]}</td>
                      <td>{company["Remarks"]}</td>
                      <td>
                      <IconButton disabled={editableCompany === company["Company Name"]}>
              <ModeEditIcon style={{height:'14px' , width:'14px'}} color="grey" onClick={()=>{
                setEditableCompany(company["Company Name"])
                setCompanyObject({
                  "Company Name": company["Company Name"],
                      "Company Number": company["Company Number"],
                      "Company Email": company["Company Email"],
                      "Company Incorporation Date  ": company["Company Incorporation Date  "], 
                      City: company["City"],
                      State: company.State,
                })
              }}/>             
            </IconButton>
            <IconButton onClick={handleSaveCompany} disabled={editableCompany !== company["Company Name"]}>
              <SaveIcon style={{height:'14px' , width:'14px'}} color="yellow"/>
            </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div className="row">
            <div className="btn-list col">
              <button
                className="btn btn-primary ms-auto"
                style={{
                  width: "100vw",
                  borderRadius: "0px",
                  backgroundColor: "#ceedce",
                  color: "#2e830b",
                  "&:hover": {
                    backgroundColor: "#aabbcc !important",
                    color: "#ffffff !important",
                  },
                }}
                onClick={handleConfirmAssign}
              >
                Accept
              </button>
            </div>
            <div className="btn-list col">
              <button
                style={{
                  width: "100vw",
                  borderRadius: "0px",
                  backgroundColor: "#f4d0d0",
                  color: "#bc2929",
                }}
                className="btn btn-primary ms-auto"
                onClick={handleDeleteData}
              >
                Reject
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ApproveCard;
