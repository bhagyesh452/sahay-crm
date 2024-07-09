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
  const [status, setStatus] = useState(false)



  function formatDateNew(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }



  const fetchCompanyRequests = async () => {
    try {
      const response = await axios.get(`${secretKey}/requests/requestCompanyData/${ename}`);
      setRequestedCompanyData(response.data);
    } catch (error) {
      console.error("Error fetching company request data:", error.message);
    }
  };

  useEffect(() => {
    if (ename) {
      fetchCompanyRequests();
    }
  }, [ename])


console.log("requestedcompanydata" , requestedCompanyData)



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
                          {formatDateNew(obj.AssignDate)}
                        </b>
                      </div>
                    </div>

                  </td>
                  <td>
                    <div className='Approve-folder'>
                     {obj.assigned}
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


    </div>
  );
};

export default EmployeeApproveDataComponent;