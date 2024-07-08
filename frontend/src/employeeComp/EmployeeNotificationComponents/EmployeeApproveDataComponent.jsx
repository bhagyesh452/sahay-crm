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

function EmployeeApproveDataComponent({ ename }) {
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [requestedCompanyData, setRequestedCompanyData] = useState([])

const fetchCompanyRequests=async()=>{
  try{
    const response = await axios.get(`${secretKey}/requests/requestCompanyData/${ename}`)
    setRequestedCompanyData(response.data)

  }catch(error){
    console.log("Error fetching company request data" , error.message)

  }
}

useEffect(()=>{
  fetchCompanyRequests()

},[])






  return (
    <div className="my-card mt-2">
    <div className="my-card-head p-2">
      <div className="filter-area d-flex justify-content-between w-100">
        <div className="filter-by-bde d-flex align-items-center">
          <div className='mr-2'>
            <label htmlFor="search_bde ">BDE : </label>
          </div>
          <div className='Notification_Approve_filter'>
            <input type="text" name="search_bde" id="search_bde" 
            //value={searchText} 
            //onChange={(e) => setSearchText(e.target.value)} 
            className='form-control col-sm-8' placeholder='Please Enter BDE name' />
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
              <th>Company Name</th>
              <th>Requested On</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requestedCompanyData.length !== 0 ? requestedCompanyData.map((obj, index) => (
              <tr>
                <td>{index + 1}</td>
                <td className="text-muted">
                  <div className="Notification-date d-flex align-items-center justify-content-center">

                    <RxAvatar style={{ fontSize: '16px' }} />

                    <div style={{ marginLeft: '5px' }} className="noti-text">
                      <b>
                        {obj["Company Name"]}
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
                  <div className='Approve-folder'>
                    
                    <FcDatabase  
                    // onClick={()=> {
                    //   functionopenpopup()
                    //   setName(obj.ename)
                    // }}
                    />
                    
                  </div>
                  <div className='d-flex align-items-center justify-content-center'>
                    <div className="Notification_completedbtn">
                      <IoCheckmarkDoneCircle />
                    </div>
                  </div>
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





    {/* <Dialog open={open} onClose={closepopup} fullWidth maxWidth="lg">
      <DialogTitle>
        No of results {requestData.length}
        <IconButton onClick={closepopup} style={{ float: "right" }}>
          <CloseIcon color="primary"></CloseIcon>
        </IconButton>{" "}
      </DialogTitle>
      <DialogContent>
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
    </Dialog> */}

  </div>
  )
}

export default EmployeeApproveDataComponent