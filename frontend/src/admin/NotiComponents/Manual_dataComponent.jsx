import React, { useEffect, useState } from 'react';
import { MdDateRange } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FcOpenedFolder } from "react-icons/fc";
import Swal from "sweetalert2";
import axios from "axios";
import io from "socket.io-client";
import Nodata from "../../components/Nodata";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Manual_dataComponent() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [filterBy, setFilterBy] = useState("Pending");
    const [data, setData] = useState([])
    const [acceptedData, setAcceptedData] = useState([]);
    const [searchText, setSearchText] = useState("")
    const [filteredData, setFilteredData] = useState([]);
    const [search_filteredData, setSearch_FilteredData] = useState([]);
    const [open, openchange] = useState(false);
    const [name, setName] = useState("");
    const [id, setId] = useState("");
    const [damount, setDamount] = useState(0)

    const fetchRequestGDetails = async () => {
        try {
            const response = await axios.get(`${secretKey}/requests/requestData`);
            const tempData = response.data.reverse()
            setData(tempData);
            setFilteredData(tempData.filter(obj => obj.assigned === false));
            setSearch_FilteredData(tempData.filter(obj => obj.assigned === false));
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    const fetchData = async (amount) => {
        try {
            const response = await axios.get(`${secretKey}/company-data/leads`);
            // Set the retrieved data in the state
            const filteredData = response.data.filter(
                (item) =>
                    item.ename === "Select Employee" || item.ename === "Not Alloted"
            );
           
            setAcceptedData(filteredData.slice(0,amount));

        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };


    // --------------------------------------------------  Fetching and socket io  --------------------------------------------------------

    useEffect(() => {
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
          secure: true, // Use HTTPS
          path:'/socket.io',
          reconnection: true, 
          transports: ['websocket'],
        });
        socket.on("newRequest", () => {
          fetchRequestGDetails()
          });
    
       
        // Clean up the socket connection when the component unmounts
        return () => {
          socket.disconnect();
        };
      }, []);
    useEffect(() => {
        fetchRequestGDetails();
    }, [])


    useEffect(() => {
        if (open && damount !== 0) {
            fetchData(damount)
        } else {
            setAcceptedData([])
            setDamount(0)
        }
    }, [open,damount])


    // ----------------------------------------------------   Filtering and Searching ---------------------------------------

    useEffect(() => {
        setFilteredData(filterBy === "Pending" ? data.filter(obj => obj.assigned === false) : data.filter(obj => obj.assigned === true));
        setSearch_FilteredData(filterBy === "Pending" ? data.filter(obj => obj.assigned === false) : data.filter(obj => obj.assigned === true));
    }, [filterBy])

    useEffect(() => {
        if (searchText !== "") {
            setSearch_FilteredData(filteredData.filter(obj => obj.ename.toLowerCase().includes(searchText.toLowerCase())));
        } else {
            setSearch_FilteredData(filteredData)
        }
    }, [searchText])

    //  ---------------------------------------------------  Functions -----------------------------------------------------------


    const [selectedRows, setSelectedRows] = useState([]);
    const handleCheckboxChange = (row) => {
        // If the row is 'all', toggle all checkboxes
        if (row === "all") {
            // If all checkboxes are already selected, clear the selection; otherwise, select all
            setSelectedRows((prevSelectedRows) =>
                prevSelectedRows.length === acceptedData.length
                    ? []
                    : acceptedData.map((row) => row)
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
      

        if(selectedObjects.length===0){
            Swal.fire('Empty Data!', 'Please Select some data to send','warning');
            return true;
        }
        try{
            const response = await axios.post(`${secretKey}/company-data/postData`, {
                selectedObjects , employeeSelection
            });
            await axios.put(`${secretKey}/requests/requestgData/${id}`, {
                read: true,
                assigned: true,
            });
            fetchRequestGDetails();
            openchange(false);
            Swal.fire({
                title: "Data Send",
                text: `Successfully Assigned Data to ${employeeSelection}`,
                icon: "success",
            });
            
        } catch (err) {
            console.log("Internal server Error", err);
            Swal.fire({
                title: "Error!",
                text: "There was an error sending data",
                icon: "error",
            });
        }
        
    };


    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    return (
        <div className="my-card mt-2">
            <div className="my-card-head p-2">
                <div className="filter-area d-flex justify-content-between w-100">
                    <div className="filter-by-bde d-flex align-items-center">
                        <div className='mr-2'>
                            <label htmlFor="search_bde ">BDE : </label>
                        </div>
                        <div className='ManualNoti-Filter'>
                            <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" name="search_bde" id="search_bde" className='form-control col-sm-8' placeholder='Please Enter BDE name' />
                        </div>
                    </div>
                    <div className="filter-by-date d-flex align-items-center">
                        <div className='mr-2'>
                            <label htmlFor="search_bde "> Filter By : </label>
                        </div>
                        <div className='ManualNoti-Filter'>
                            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} name="filter_requests" id="filter_requests" className="form-select">
                                <option value="Pending" selected>Pending</option>
                                <option value="Completed" >Completed</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>
            <div className='my-card-body p-2'>
                <div className='Notification-table-main table-resposive'>
                    <table className="table General-table m-0">
                        <thead>
                            <tr>
                                <th>Sr. No</th>
                                <th>Requested By</th>
                                <th>Requested Data</th>
                                <th>Requested On</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {search_filteredData.length !== 0 ?
                                search_filteredData.map((obj, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>
                                            <div className="Notification-date d-flex align-items-center justify-content-center">
                                                <RxAvatar style={{ fontSize: '16px' }} />
                                                <div style={{ marginLeft: '5px' }} className="noti-text">
                                                    <b>
                                                        {obj.ename}
                                                    </b>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="Notification-date d-flex align-items-center justify-content-center">
                                                <IoDocumentTextOutline style={{ fontSize: '16px' }} />
                                                <div style={{ marginLeft: '5px' }} className="noti-text">
                                                    <b>
                                                        {obj.dAmount}
                                                    </b>
                                                </div>
                                            </div>
                                        </td>
                                        <td><div className="Notification-date d-flex align-items-center justify-content-center">

                                            <MdDateRange style={{ fontSize: '16px' }} />

                                            <div style={{ marginLeft: '5px' }} className="noti-text">
                                                <b>
                                                    {formatDate(obj.cDate)}
                                                </b>
                                            </div>
                                        </div></td>
                                        <td> {filterBy === "Pending" && <div>
                                            <div className="Notification-folder-open" onClick={() => {
                                                setDamount(obj.dAmount)
                                                openchange(true)
                                                setName(obj.ename)
                                                setId(obj._id)
                                            }}>
                                                <FcOpenedFolder />
                                            </div>
                                        </div>}
                                            {filterBy === "Completed" && <div className='d-flex align-items-center justify-content-center'>
                                                <div className="Notification_completedbtn">
                                                    <IoCheckmarkDoneCircle />
                                                </div>
                                            </div>}</td>
                                    </tr>
                                ))
                                : <tr>
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


            {/*  ----------------------------------------------------- Dialog Box for Accept Data */}
            <Dialog open={open} onClose={() => openchange(false)} fullWidth maxWidth="lg">
                <DialogTitle>
                    No of results {acceptedData.length}
                    <IconButton onClick={() => openchange(false)} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    {/* Table content */}
                    <div style={{ overflowX: "auto" , maxHeight:'490px' }}>
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
                                            checked={selectedRows.length === acceptedData.length}
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
                            {acceptedData.length === 0 ? (
                                <tbody>
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: "center" }}>
                                            No data available
                                        </td>
                                    </tr>
                                </tbody>
                            ) : (
                                <tbody>
                                    {acceptedData.map((company, index) => (
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
        </div>
    )
}

export default Manual_dataComponent