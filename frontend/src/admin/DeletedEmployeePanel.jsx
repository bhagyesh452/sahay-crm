import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import Stack from '@mui/material/Stack';
import Nodata from "../components/Nodata";
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { IconEye } from "@tabler/icons-react";
import Switch from '@mui/material/Switch';
import Swal from "sweetalert2";
import { TbRestore } from "react-icons/tb";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { TiArrowBack } from "react-icons/ti";

function DeletedEmployeePanel() {
  const [filteredData, setFilteredData] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  

  //-----------date formats-----------------------
  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  //--------------------fetching employee data-----------------
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/deletedemployeeinfo`);

      // Set the retrieved data in the state

      setFilteredData(response.data);
      setData(response.data)
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData()
  }, [])


  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query (case-insensitive partial match)
    const filtered = data.filter((item) =>
      item.email.toLowerCase().includes(query.toLowerCase()) ||
      item.ename.toLowerCase().includes(query.toLowerCase()) ||
      item.number.includes(query) ||
      item.branchOffice.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const adminName = localStorage.getItem("adminName")
  // ----------------------------------------- material ui bdm work switch---------------------------------------

  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 15,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(9px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(12px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
  }));


  //--------------function to revertback employee to main database---------------------


  const handleRevertBackEmployee = async (itemId, name, dataToRevertBack) => {
    

    Swal.fire({
        title: `Are you sure you want to revert back ${name}?`,
        text: "This action will move the employee back to the main database.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, revert back!',
        cancelButtonText: 'Cancel'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await axios.delete(`${secretKey}/employee/deleteemployeedromdeletedemployeedetails/${itemId}`);

                const response2 = await axios.put(`${secretKey}/employee/revertbackdeletedemployeeintomaindatabase`, {
                  dataToRevertBack
            });

                Swal.fire(
                    'Reverted!',
                    `Employee ${name} has been reverted back.`,
                    'success'
                );
                
                fetchData()
                console.log('Revert back successful:', response2.data);
            } catch (error) {
                Swal.fire(
                    'Error!',
                    'There was an error reverting the employee back.',
                    'error'
                );

                console.error('Error reverting employee', error);
            }
        }
    });
}




  return (
    <div>
      <div className="">
        <div className="page-header d-print-none m-0">
          <div className="row g-2 align-items-center">
            <div className="col m-0">
              {/* <!-- Page pre-title --> */}
              <h2 className="page-title">Employees</h2>
            </div>
            <div style={{ width: "20vw" }} className="input-icon">
              <span className="input-icon-addon">

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon"
                  width="20"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                className="form-control"
                placeholder="Search…"
                aria-label="Search in website"
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employee table */}
      <div
        onCopy={(e) => {
          e.preventDefault();
        }}
        className="mt-2"
      >
        <div className="card">
          <div style={{ padding: "0px" }} className="card-body">
            <div
              id="table-default"
              style={{ overflow: "auto", maxHeight: "70vh" }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  border: "1px solid #ddd",
                }}
                className="table-vcenter table-nowrap"
              >
                <thead>
                  <tr className="tr-sticky">
                    <th>
                      <button className="table-sort" data-sort="sort-name">
                        Sr.No
                      </button>
                    </th>
                    <th>
                      <button
                        //onClick={sortDataByName}
                        className="table-sort"
                        data-sort="sort-city"
                      >
                        Name
                      </button>
                    </th>
                    <th>
                      <button className="table-sort" data-sort="sort-type">
                        Phone No
                      </button>
                    </th>
                    <th>
                      <button className="table-sort" data-sort="sort-score">
                        Email
                      </button>
                    </th>
                    <th>
                      <button
                        //onClick={sortDataByJoiningDate}
                        className="table-sort"
                        data-sort="sort-date"
                      >
                        Joining date
                      </button>
                    </th>
                    <th>
                      <button className="table-sort" data-sort="sort-date">
                        Designation
                      </button>
                    </th>
                    <th>
                      <button className="table-sort" data-sort="sort-date">
                        Branch Office
                      </button>
                    </th>
                    {(adminName === "Nimesh" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi") && <> <th>
                      <button
                        //onClick={sortDateByAddedOn}
                        className="table-sort"
                        data-sort="sort-date"
                      >
                        Added on
                      </button>
                    </th>
                      <th>Deleted Date</th>
                      <th>
                        BDM Work
                      </th>
                      <th>
                        <button
                          className="table-sort"
                          data-sort="sort-quantity"
                        >
                          Action
                        </button>
                      </th>
                      <th>Revoke Employee</th></>}
                  </tr>
                </thead>
                {filteredData.length == 0 ? (
                  <tbody>
                    <tr>
                      <td
                        className="particular"
                        colSpan="10"
                        style={{ textAlign: "center" }}
                      >
                        <Nodata />
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="table-tbody">
                    {filteredData.map((item, index) => (
                      <tr key={index} style={{ border: "1px solid #ddd" }}>
                        <td className="td-sticky">{index + 1}</td>
                        <td>{item.ename}</td>
                        <td>{item.number}</td>
                        <td>{item.email}</td>
                        <td>{formatDateFinal(item.jdate)}</td>
                        <td>{item.designation}</td>
                        <td>{item.branchOffice}</td>
                        {(adminName === "Nimesh" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi")
                          &&
                          <>
                            <td>
                              {formatDate(item.AddedOn) === "Invalid Date"
                                ? "06/02/2024"
                                : formatDateFinal(item.AddedOn)}
                            </td>
                            <td>{formatDateFinal(item.deletedDate)}</td>
                            <td>
                              <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                <AntSwitch checked={item.bdmWork} inputProps={{ 'aria-label': 'ant design' }}
                                // onClick={(event) => {
                                //   handlChecked(item._id, item.bdmWork)
                                // }} 
                                />
                              </Stack>
                            </td>
                            <td>
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="icons-btn">
                                  <Link
                                    style={{ color: "black" }}
                                    to={`/admin/employees/${item._id}`}
                                  >
                                    <IconButton>
                                      {" "}
                                      <IconEye
                                        style={{
                                          width: "14px",
                                          height: "14px",
                                          color: "#d6a10c",
                                        }}
                                      />
                                    </IconButton>
                                  </Link>
                                </div>
                              </div>
                            </td>
                            <td>
                              <IconButton>
                              {" "}
                              <TbRestore
                                style={{
                                  width: "14px",
                                  height: "14px",
                                  color: "#fbb900",
                                }}
                                onClick={async () => {
                                  const dataToRevertBack = filteredData.filter(obj => obj._id === item._id);
                                  handleRevertBackEmployee(item._id, item.ename, dataToRevertBack);
                                }}
                              />
                            </IconButton>
                            </td></>}
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeletedEmployeePanel