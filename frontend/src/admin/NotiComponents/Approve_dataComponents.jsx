import React, { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import Swal from "sweetalert2";
import axios from "axios";
import io from "socket.io-client";
import { FcDatabase } from "react-icons/fc";
import Nodata from "../../components/Nodata";
import SaveIcon from '@mui/icons-material/Save';
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditIcon from "@mui/icons-material/ModeEdit";


function Approve_dataComponents() {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [requestData, setRequestData] = useState([]);
  const [name, setName] = useState("")
  const [editableCompany , setEditableCompany] = useState("");
  const [companyObject , setCompanyObject] = useState({
    "Company Name": "",
        "Company Number": 0,
        "Company Email": "",
        "Company Incorporation Date  ": "", 
        City: "",
        State: "",
  })

  const [selectedRows, setSelectedRows] = useState([]);
  const [filterBy, setFilterBy] = useState("Pending");
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [mapArray, setMapArray] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [RequestApprovals, setRequestApprovals] = useState([]);
  const [open, openchange] = useState(false);
  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };


  // -------------------------------------------- Format Date Functions --------------------------------------------------------

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  const formatDateAndTime = (AssignDate) => {
    // Convert AssignDate to a Date object
    const date = new Date(AssignDate);

    // Convert UTC date to Indian time zone
    const options = { timeZone: "Asia/Kolkata" };
    const indianDate = date.toLocaleString("en-IN", options);
    return indianDate;
  };

  // ------------------------------------------   Fetching Functions --------------------------------------------------


  const fetchApproveRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestCompanyData`);
     
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
      setTotalData(uniqueEnames)
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchRequestedData= async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestCompanyData`);
      setRequestData(response.data.filter((obj) => obj.ename === name));
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchRequestedData();
  }, [name]);

  useEffect(() => {
    fetchRequestedData();
  }, [searchText]);



  useEffect(() => {
        fetchApproveRequests()
  }, [])
  
  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path:'/socket.io',
      reconnection: true, 
      transports: ['websocket'],
    });
    socket.on("approve-request", () => {
        fetchApproveRequests()
        });

    return () => {
      socket.disconnect();
    };
  }, []);


//   useEffect(() => {
//     setData(filterBy === "Pending" ? deletedData.filter(obj => obj.request === false) : deletedData.filter(obj => obj.request === true));
//     setTotalData(filterBy === "Pending" ? deletedData.filter(obj => obj.request === false) : deletedData.filter(obj => obj.request === true));
//   }, [filterBy])

//   useEffect(() => {
//     if (searchText !== "") {
//       setData(totalData.filter(obj => obj.ename.toLowerCase().includes(searchText.toLowerCase())));
//     } else {
//       setData(totalData)
//     }
//   }, [searchText])

// 

//  --------------------------------------- Other Functions  -----------------------------------------------------
const handleConfirmAssign = async () => {
    const updatedCsvdata = selectedRows;
    console.log("updatedcsvdata" , updatedCsvdata)
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

  const formatDateDeserving = (date) =>{
    const formattedDate = new Date(date);
    const returnableDate = `${formattedDate.getFullYear()}-${(formattedDate.getMonth() + 1).toString().padStart(2, '0')}-${formattedDate.getDate().toString().padStart(2, '0')}`;
    return returnableDate;
  }

  const handleSaveCompany = async () => {
 
    try {
        const response = await axios.post(`${secretKey}/requests/change-edit-request/${editableCompany}`, companyObject);
        fetchRequestedData();
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
    <div className="my-card mt-2">
      <div className="my-card-head p-2">
        <div className="filter-area d-flex justify-content-between w-100">
          <div className="filter-by-bde d-flex align-items-center">
            <div className='mr-2'>
              <label htmlFor="search_bde ">BDE : </label>
            </div>
            <div className='Notification_Approve_filter'>
              <input type="text" name="search_bde" id="search_bde" value={searchText} onChange={(e) => setSearchText(e.target.value)} className='form-control col-sm-8' placeholder='Please Enter BDE name' />
            </div>
          </div>
          

        </div>
      </div>
      <div className='my-card-body p-2'>
        <div className='Notification-table-main table-resposive'>
          <table className="table Approve-table m-0">
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Requested By</th>
                <th>Requested On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {mapArray.length !== 0 ? mapArray.map((obj, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td className="text-muted">
                    <div className="Notification-date d-flex align-items-center justify-content-center">

                      <RxAvatar style={{ fontSize: '16px' }} />

                      <div style={{ marginLeft: '5px' }} className="noti-text">
                        <b>

                          {obj.ename}
                        </b>

                      </div>
                    </div>

                  </td>
                  <td className="text-muted">
                    <div className="Notification-date d-flex align-items-center justify-content-center">

                      <MdDateRange style={{ fontSize: '16px' }} />

                      <div style={{ marginLeft: '5px' }} className="noti-text">
                        <b>
                          {obj.date}
                        </b>
                      </div>
                    </div>

                  </td>
                  <td>
                    {filterBy === "Pending" && <div className='Approve-folder'>
                      
                      <FcDatabase  onClick={()=> {
                        functionopenpopup()
                        setName(obj.ename)
                      } }/>
                      
                    </div>}
                    {filterBy === "Completed" && <div className='d-flex align-items-center justify-content-center'>
                      <div className="Notification_completedbtn">
                        <IoCheckmarkDoneCircle />
                      </div>
                    </div>}
                  </td>
                </tr>
              )) : <tr>
                <td colSpan={5}>
                  <span
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      fontWeight: "bold",
                    }}
                  >
                    <Nodata />
                  </span>
                </td>


              </tr>}


            </tbody>
          </table>
        </div>
      </div>
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
  )
}

export default Approve_dataComponents