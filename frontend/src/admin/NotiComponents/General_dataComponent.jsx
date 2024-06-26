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
function General_dataComponent() {
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [filterBy, setFilterBy] = useState("Pending");
    const [data, setData] = useState([])
    const [acceptedData, setAcceptedData] = useState([]);
    const [searchText, setSearchText] = useState("")
    const [filteredData, setFilteredData] = useState([]);
    const [search_filteredData, setSearch_FilteredData] = useState([]);
    const [dataOpen, setDataOpen] = useState(false)


    const [open, openchange] = useState(false);

    const fetchRequestGDetails = async () => {
        try {
            const response = await axios.get(`${secretKey}/requests/requestgData`);
            const tempData = response.data.reverse()
            setData(tempData);
            setFilteredData(tempData.filter(obj => obj.assigned === false));
            setSearch_FilteredData(tempData.filter(obj => obj.assigned === false));
        } catch (error) {
            console.error("Error fetching data:", error.message);
        }
    };
    const fetchData = async () => {
        try {
          const response = await axios.get(`${secretKey}/company-data/leads`);
          // Set the retrieved data in the state
          const filteredData = response.data.filter(
            (item) =>
              item.ename === "Select Employee" || item.ename === "Not Alloted"
          );
          setAcceptedData(filteredData);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        }
      };
    
    useEffect(() => {
        fetchRequestGDetails();
    }, [])

    const functionViewFolder = async()=>{
       await fetchData();
    }

    useEffect(() => {
    if(dataOpen){
        fetchData()
    }else {
        setAcceptedData([])
    }
    }, [dataOpen])
    

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

    console.log( "This is the accepted data", acceptedData)


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
                        <div className='GeneralNoti-Filter'>
                            <input value={searchText} onChange={(e)=>setSearchText(e.target.value)} type="text" name="search_bde" id="search_bde" className='form-control col-sm-8' placeholder='Please Enter BDE name' />
                        </div>
                    </div>
                    <div className="filter-by-date d-flex align-items-center">
                        <div className='mr-2'>
                            <label htmlFor="search_bde "> Filter By : </label>
                        </div>
                        <div className='GeneralNoti-Filter'>
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
                                            <div className="Notification-folder-open" onClick={functionViewFolder}>
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


        </div>
    )
}

export default General_dataComponent