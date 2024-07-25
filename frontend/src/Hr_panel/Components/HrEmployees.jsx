// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "./Header/Header";
// import Navbar from "./Navbar/Navbar";
// import { v4 as uuidv4 } from "uuid";
// import { Link } from "react-router-dom";
// import { IconTrash } from "@tabler/icons-react";
// import { MdDelete } from "react-icons/md";
// import { MdOutlineAddCircle } from "react-icons/md";
// import Swal from "sweetalert2";
// import io from "socket.io-client";
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import DeleteIcon from "@mui/icons-material/Delete";
// import ModeEditIcon from "@mui/icons-material/ModeEdit";
// import Modal from "react-modal";
// import { IconEye } from "@tabler/icons-react";
// import { styled } from "@mui/material/styles";
// import FormGroup from "@mui/material/FormGroup";
// import FormControlLabel from "@mui/material/FormControlLabel";
// import Switch from "@mui/material/Switch";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import AddEmployee from "./AddEmployees/AddEmployee";
// import NewEmployees from "./NewEmployees";

// function HrEmployees({ onEyeButtonClick }) {
//   const [itemIdToDelete, setItemIdToDelete] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [companyDdata, setCompanyDdata] = useState([]);
//   const [nametodelete, setnametodelete] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [data, setData] = useState([]);
//   const [cdata, setCData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [isUpdateMode, setIsUpdateMode] = useState(false);
//   const [selectedDataId, setSelectedDataId] = useState("2024-01-03");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [number, setNumber] = useState(0);
//   const [bdeFields, setBdeFields] = useState([]);
//   const [ename, setEname] = useState("");
//   const [jdate, setJdate] = useState(null);
//   const [designation, setDesignation] = useState("");
//   const [branchOffice, setBranchOffice] = useState("");
//   const [nowFetched, setNowFetched] = useState(false);
//   const [otherdesignation, setotherDesignation] = useState("");
//   const [companyData, setCompanyData] = useState([]);
//   const defaultObject = {
//     year: "",
//     month: "",
//     amount: 0,
//   };
//   const [targetObjects, setTargetObjects] = useState([defaultObject]);
//   const [targetCount, setTargetCount] = useState(1);

//   // const [open, openchange] = useState(false);
//   const [openAddEmployee, setOpenAddEmployee] = useState(false);

//   // const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedin')==='true');
//   // const handleLogin = ()=>{
//   //   setIsLoggedIn(true)
//   // }

//   useEffect(() => {
//     document.title = `HR-Sahay-CRM`;
//   }, []);

//   const handleEyeButtonClick = (id) => {
//     onEyeButtonClick(id);
//     //console.log(id);
//   };

//   const updateActiveStatus = async () => {
//     try {
//       const response = await axios.get(`${secretKey}/employee/einfo`);
//       setData(response.data);
//       setFilteredData(response.data);
//     } catch (error) {
//       console.error("Error fetching employee info:", error);
//     }
//   };
//   useEffect(() => {
//     const socket =
//       secretKey === "http://localhost:3001/api"
//         ? io("http://localhost:3001")
//         : io("wss://startupsahay.in", {
//           secure: true, // Use HTTPS
//           path: "/socket.io",
//           reconnection: true,
//           transports: ["websocket"],
//         });
//     socket.on("employee-entered", () => {
//       console.log("One user Entered");
//       setTimeout(() => {
//         updateActiveStatus(); // Don't fetch instead, just change that particular active status
//       }, 5000);
//     });

//     socket.on("user-disconnected", () => {
//       updateActiveStatus(); // Same condition
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // const handleDeleteClick = (itemId, nametochange) => {
//   //   // Open the confirm delete modal
//   //   setCompanyDdata(cdata.filter((item) => item.ename === nametochange));

//   //   setItemIdToDelete(itemId);
//   //   setIsModalOpen(true);
//   // };
//   const [dataToDelete, setDataToDelete] = useState([]);

//   const handleDeleteClick = async (
//     itemId,
//     nametochange,
//     dataToDelete,
//     filteredCompanyData
//   ) => {
//     // Open the confirm delete modal
//     // console.log(nametochange)
//     // console.log("filtered" , filteredCompanyData)
//     setCompanyDdata(filteredCompanyData);
//     setItemIdToDelete(itemId);

//     Swal.fire({
//       title: "Are you sure?",
//       text: `Do you really want to remove ${nametochange}?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           const saveResponse = await axios.put(
//             `${secretKey}/employee/savedeletedemployee`,
//             {
//               dataToDelete,
//             }
//           );
//           const deleteResponse = await axios.delete(
//             `${secretKey}/employee/einfo/${itemId}`
//           );

//           const response3 = await axios.put(
//             `${secretKey}/bookings/updateDeletedBdmStatus/${nametochange}`
//           );

//           // Refresh the data after successful deletion
//           handledeletefromcompany(filteredCompanyData);
//           fetchData();

//           Swal.fire({
//             title: "Employee Removed!",
//             text: "You have successfully removed the employee!",
//             icon: "success",
//           });
//         } catch (error) {
//           console.error("Error deleting data:", error);
//           Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: "Please try again later!",
//           });
//         }
//       } else {
//         Swal.fire({
//           title: "Cancelled",
//           text: "Employee is safe!",
//           icon: "info",
//         });
//       }
//     });
//   };

//   const secretKey = process.env.REACT_APP_SECRET_KEY;

//   const handledeletefromcompany = async (filteredCompanyData) => {
//     if (filteredCompanyData && filteredCompanyData.length !== 0) {
//       try {
//         // Update companyData in the second database
//         await Promise.all(
//           filteredCompanyData.map(async (item) => {
//             if (item.Status === "Matured") {
//               await axios.put(
//                 `${secretKey}/company-data/updateCompanyForDeletedEmployeeWithMaturedStatus/${item._id}`
//               );
//             } else {
//               await axios.delete(
//                 `${secretKey}/company-data/newcompanynamedelete/${item._id}`
//               );
//             }
//           })
//         );
//         Swal.fire({
//           title: "Data Deleted!",
//           text: "You have successfully Deleted the data!",
//           icon: "success",
//         });

//         //console.log("All ename updates completed successfully");
//       } catch (error) {
//         console.error("Error updating enames:", error.message);
//         Swal.fire("Error deleting the employee");
//         // Handle the error as needed
//       }
//     }
//   };

//   // const handleCancelDelete = () => {
//   //   // Cancel the delete operation and close the modal
//   //   setIsModalOpen(false);
//   // };

//   const [bdmWork, setBdmWork] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [sortedFormat, setSortedFormat] = useState({
//     ename: "ascending",
//     jdate: "ascending",
//     addedOn: "ascending",
//   });

//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${secretKey}/employee/einfo`);

//       // Set the retrieved data in the state

//       setFilteredData(response.data);
//       setData(response.data);
//       setEmail("");
//       setEname("");
//       setNumber(0);
//       setPassword("");
//       setJdate(null);
//       setDesignation("");
//       setBranchOffice("");
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   };

//   const handleSearch = (e) => {
//     const query = e.target.value;
//     setSearchQuery(query);

//     // Filter the data based on the search query (case-insensitive partial match)
//     const filtered = data.filter(
//       (item) =>
//         item.email.toLowerCase().includes(query.toLowerCase()) ||
//         item.ename.toLowerCase().includes(query.toLowerCase()) ||
//         item.number.includes(query) ||
//         item.branchOffice.toLowerCase().includes(query.toLowerCase())
//     );

//     setFilteredData(filtered);
//   };

//   const handleUpdateClick = (id, echangename) => {
//     // Set the selected data ID and set update mode to true
//     setSelectedDataId(id);
//     setIsUpdateMode(true);
//     setCompanyData(cdata.filter((item) => item.ename === echangename));
//     // Find the selected data object
//     const selectedData = data.find((item) => item._id === id);

//     setNowFetched(selectedData.targetDetails.length !== 0 ? true : false);
//     setTargetCount(
//       selectedData.targetDetails.length !== 0
//         ? selectedData.targetDetails.length
//         : 1
//     );
//     setTargetObjects(
//       selectedData.targetDetails.length !== 0
//         ? selectedData.targetDetails
//         : [
//           {
//             year: "",
//             month: "",
//             amount: 0,
//           },
//         ]
//     );

//     // Update the form data with the selected data values
//     setEmail(selectedData.email);
//     setEname(selectedData.ename);
//     setNumber(selectedData.number);
//     setPassword(selectedData.password);
//     setBdmWork(selectedData.bdmWork);
//     setDesignation(selectedData.designation);
//     setBranchOffice(selectedData.branchOffice);

//     const dateObject = new Date(selectedData.jdate);
//     const day = dateObject.getDate().toString().padStart(2, "0"); // Ensure two-digit day
//     const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
//     const year = dateObject.getFullYear();
//     const formattedDateString = `${year}-${month}-${day}`;

//     // setJdate('2004-04-04');
//     setJdate(formattedDateString);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${secretKey}/employee/permanentDelete/${id}`);
//       // Refresh the data after successful deletion
//       fetchData();
//       Swal.fire({
//         title: "Employee Removed!",
//         text: "You have successfully removed the employee!",
//         icon: "success",
//       });
//     } catch (error) {
//       console.error("Error deleting data:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Please try again later!",
//       });
//     }
//   };

//   useEffect(() => {
//     // Fetch data from the Node.js server
//     setFilteredData(data);
//     // Call the fetchData function
//     fetchData();
//     fetchCData();
//   }, []);

//   function formatDateWP(dateString) {
//     const date = new Date(dateString);
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);

//     if (isSameDay(date, today)) {
//       // If the date is today, format as "Last seen today on HH:MM AM/PM"
//       return `Last seen today on ${formatTime(date)}`;
//     } else if (isSameDay(date, yesterday)) {
//       // If the date is yesterday, format as "Last seen yesterday on HH:MM AM/PM"
//       return `Last seen yesterday on ${formatTime(date)}`;
//     } else {
//       // Otherwise, format as "Last seen on DD/MM/YYYY"
//       return `Last seen on ${formatDateTime(date)}`;
//     }
//   }

//   function isSameDay(date1, date2) {
//     return (
//       date1.getFullYear() === date2.getFullYear() &&
//       date1.getMonth() === date2.getMonth() &&
//       date1.getDate() === date2.getDate()
//     );
//   }

//   function formatTime(date) {
//     const hours = date.getHours();
//     const minutes = date.getMinutes().toString().padStart(2, "0");
//     const ampm = hours >= 12 ? "PM" : "AM";
//     const formattedHours = hours % 12 || 12;
//     return `${formattedHours}:${minutes} ${ampm}`;
//   }

//   function formatDateTime(date) {
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   }
//   const fetchCData = async () => {
//     try {
//       const response = await axios.get(`${secretKey}/company-data/leads`);

//       setCData(response.data);
//     } catch (error) {
//       console.error("Error fetching data:", error.message);
//     }
//   };

//   const handleSubmit = async (e) => {
//     // const referenceId = uuidv4();
//     const AddedOn = new Date().toLocaleDateString();
//     try {
//       let dataToSend = {
//         email: email,
//         number: number,
//         ename: ename,
//         password: password,
//         jdate: jdate,
//         AddedOn: AddedOn,
//         branchOffice: branchOffice,
//         targetDetails: targetObjects,
//         bdmWork,
//       };

//       let dataToSendUpdated = {
//         email: email,
//         number: number,
//         ename: ename,
//         password: password,
//         jdate: jdate,
//         designation: designation,
//         branchOffice: branchOffice,
//         targetDetails: targetObjects,
//         bdmWork,
//       };

//       // Set designation based on otherDesignation
//       if (otherdesignation !== "") {
//         dataToSend.designation = otherdesignation;
//       } else {
//         dataToSend.designation = designation;
//       }
//       if (designation === "Sales Manager") {
//         dataToSend.bdmWork = true;
//       } else {
//         dataToSend.bdmWork = false;
//       }
//       console.log(isUpdateMode, "updateMode");

//       if (isUpdateMode) {
//         if (dataToSend.ename === "") {
//           Swal.fire(
//             "Invalid Details",
//             "Please Enter Details Properly",
//             "warning"
//           );
//           return true;
//         }
//         //console.log(dataToSend, "Bhoom");
//         //console.log("updateddata",dataToSendUpdated)
//         const response = await axios.put(
//           `${secretKey}/employee/einfo/${selectedDataId}`,
//           dataToSendUpdated
//         );

//         //console.log(response.data,"updateddata")

//         Swal.fire({
//           title: "Data Updated Succesfully!",
//           text: "You have successfully updated the name!",
//           icon: "success",
//         });

//         if (companyData && companyData.length !== 0) {
//           // Assuming ename is part of dataToSend
//           const { ename } = dataToSend;
//           try {
//             // Update companyData in the second database
//             await Promise.all(
//               companyData.map(async (item) => {
//                 await axios.put(
//                   `${secretKey}/company-data/newcompanyname/${item._id}`,
//                   {
//                     ename,
//                   }
//                 );
//                 //console.log(`Updated ename for ${item._id}`);
//               })
//             );
//           } catch (error) {
//             console.error("Error updating enames:", error.message);
//             // Handle the error as needed
//           }
//         }
//       } else {
//         const response = await axios.post(
//           `${secretKey}/employee/einfo`,
//           dataToSend
//         );
//         //console.log(response.data , "datatosend")
//         Swal.fire({
//           title: "Data Added!",
//           text: "You have successfully added the data!",
//           icon: "success",
//         });
//       }
//       //console.log("datatosend", dataToSend);

//       setEmail("");
//       setEname("");
//       setNumber(0);
//       setPassword("");
//       setDesignation("");
//       setBranchOffice("");
//       setotherDesignation("");
//       setJdate(null);
//       setIsUpdateMode(false);
//       setTargetCount(1);
//       setTargetObjects([defaultObject]);
//       fetchData();
//       // closepopup();
//       //console.log("Data sent successfully");
//     } catch {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Something went wrong!",
//       });
//       console.error("Internal server error");
//     }
//   };

//   // const functionopenpopup = () => {
//   //   openchange(true);
//   // };
//   // const closepopup = () => {
//   //   openchange(false);
//   // };

//   function formatDate(inputDate) {
//     const options = { year: "numeric", month: "long", day: "numeric" };
//     const formattedDate = new Date(inputDate).toLocaleDateString(
//       "en-US",
//       options
//     );
//     return formattedDate;
//   }
//   //console.log(new Date("06/02/2024").toLocaleDateString('en-GB'));
//   const sortDataByName = () => {
//     if (sortedFormat.ename === "ascending") {
//       setSortedFormat({
//         ...sortedFormat, // Spread the existing properties
//         ename: "descending", // Update the jdate property
//       });

//       const sortedData = [...filteredData].sort((a, b) =>
//         a.ename.localeCompare(b.ename)
//       );
//       setFilteredData(sortedData);
//     } else {
//       setSortedFormat({
//         ...sortedFormat, // Spread the existing properties
//         ename: "ascending", // Update the jdate property
//       });

//       const sortedData = [...filteredData].sort((a, b) =>
//         b.ename.localeCompare(a.ename)
//       );
//       setFilteredData(sortedData);
//     }
//   };
//   const adminName = localStorage.getItem("adminName");
//   const sortDateByAddedOn = () => {
//     if (sortedFormat.addedOn === "ascending") {
//       setSortedFormat({
//         ...sortedFormat, // Spread the existing properties
//         addedOn: "descending", // Update the jdate property
//       });

//       const sortedData = [...filteredData].sort((a, b) =>
//         a.AddedOn.localeCompare(b.AddedOn)
//       );
//       setFilteredData(sortedData);
//     } else {
//       setSortedFormat({
//         ...sortedFormat, // Spread the existing properties
//         addedOn: "ascending", // Update the jdate property
//       });

//       const sortedData = [...filteredData].sort((a, b) =>
//         b.AddedOn.localeCompare(a.AddedOn)
//       );
//       setFilteredData(sortedData);
//     }
//   };
//   const sortDataByJoiningDate = () => {
//     if (sortedFormat.jdate === "ascending") {
//       setSortedFormat({
//         ...sortedFormat, // Spread the existing properties
//         jdate: "descending", // Update the jdate property
//       });

//       const sortedData = [...filteredData].sort(
//         (a, b) => new Date(a.jdate) - new Date(b.jdate)
//       );
//       setFilteredData(sortedData);
//     } else {
//       setSortedFormat({
//         ...sortedFormat, // Spread the existing properties
//         jdate: "ascending", // Update the jdate property
//       });

//       const sortedData = [...filteredData].sort(
//         (a, b) => new Date(b.jdate) - new Date(a.jdate)
//       );
//       setFilteredData(sortedData);
//     }
//   };

//   const [teamData, setTeamData] = useState([]);

//   const fetchTeamData = async () => {
//     const response = await axios.get(`${secretKey}/teams/teaminfo`);

//     //console.log(response.data);
//     setTeamData(response.data);
//   };

//   useEffect(() => {
//     fetchTeamData();
//   }, []);

//   function formatDateFinal(timestamp) {
//     const date = new Date(timestamp);
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   }

//   // -------------------------------------------------    ADD Target Section   --------------------------------------------------

//   const handleAddTarget = () => {
//     const totalTargets = targetObjects;
//     totalTargets.push(defaultObject);
//     setTargetCount(targetCount + 1);
//     setTargetObjects(totalTargets);
//   };
//   const handleRemoveTarget = () => {
//     const totalTargets = targetObjects;
//     totalTargets.pop();
//     setTargetCount(targetCount - 1);
//     setTargetObjects(totalTargets);
//   };
//   //console.log("target objects:", targetObjects)

//   // ----------------------------------------- material ui bdm work switch---------------------------------------

//   const AntSwitch = styled(Switch)(({ theme }) => ({
//     width: 28,
//     height: 16,
//     padding: 0,
//     display: "flex",
//     "&:active": {
//       "& .MuiSwitch-thumb": {
//         width: 15,
//       },
//       "& .MuiSwitch-switchBase.Mui-checked": {
//         transform: "translateX(9px)",
//       },
//     },
//     "& .MuiSwitch-switchBase": {
//       padding: 2,
//       "&.Mui-checked": {
//         transform: "translateX(12px)",
//         color: "#fff",
//         "& + .MuiSwitch-track": {
//           opacity: 1,
//           backgroundColor:
//             theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
//         },
//       },
//     },
//     "& .MuiSwitch-thumb": {
//       boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
//       width: 12,
//       height: 12,
//       borderRadius: 6,
//       transition: theme.transitions.create(["width"], {
//         duration: 200,
//       }),
//     },
//     "& .MuiSwitch-track": {
//       borderRadius: 16 / 2,
//       opacity: 1,
//       backgroundColor:
//         theme.palette.mode === "dark"
//           ? "rgba(255,255,255,.35)"
//           : "rgba(0,0,0,.25)",
//       boxSizing: "border-box",
//     },
//   }));

//   const handlChecked = async (employeeId, bdmWork) => {
//     if (!bdmWork) {
//       try {
//         const response = await axios.post(
//           `${secretKey}/employee/post-bdmwork-request/${employeeId}`,
//           {
//             bdmWork: true,
//           }
//         );

//         fetchData();

//         //console.log(response.data)
//         setTimeout(() => {
//           Swal.fire("BDM Work Assigned!", "", "success");
//         }, 500);
//       } catch (error) {
//         console.log("error message", error.message);
//         // Show error message
//         Swal.fire(
//           "Error",
//           "An error occurred while assigning BDM work.",
//           "error"
//         );
//       }
//     } else {
//       try {
//         const response = await axios.post(
//           `${secretKey}/employee/post-bdmwork-revoke/${employeeId}`,
//           {
//             bdmWork: false,
//           }
//         );
//         fetchData(); // Assuming this function fetches updated employee details
//         setTimeout(() => {
//           Swal.fire("BDM Work Revoked!", "", "success");
//         }, 500);
//       } catch (error) {
//         console.error("Error revoking BDM work:", error);
//         // Show error message
//         Swal.fire(
//           "Error",
//           "An error occurred while revoking BDM work.",
//           "error"
//         );
//       }
//     }
//   };

//   console.log(cdata.filter((obj) => obj.ename === "Rahul Saiekh"));

//   return (
//     <div>
//       {/* <Header />
//       <Navbar number={1} /> */}
      
//       {openAddEmployee && <AddEmployee openAddEmployee={openAddEmployee}/>}
//       <div className="">
//         <div className="page-header d-print-none m-0">
//           <div className="row g-2 align-items-center">
//             <div className="col m-0">
//               {/* <!-- Page pre-title --> */}
//               <h2 className="page-title">Employees</h2>
//             </div>
//             <div style={{ width: "20vw" }} className="input-icon">
//               <span className="input-icon-addon">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="icon"
//                   width="20"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   stroke-width="2"
//                   stroke="currentColor"
//                   fill="none"
//                   stroke-linecap="round"
//                   stroke-linejoin="round"
//                 >
//                   <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//                   <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
//                   <path d="M21 21l-6 -6" />
//                 </svg>
//               </span>
//               <input
//                 type="text"
//                 value={searchQuery}
//                 className="form-control"
//                 placeholder="Search…"
//                 aria-label="Search in website"
//                 onChange={handleSearch}
//               />
//             </div>

//             {/* <!-- Page title actions --> */}
//             <div className="col-auto ms-auto d-print-none">
//               <div className="btn-list">
//                 <button
//                   className="btn btn-primary d-none d-sm-inline-block"
//                   onClick={() => setOpenAddEmployee(true)}
//                 >
//                   {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="icon"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     stroke-width="2"
//                     stroke="currentColor"
//                     fill="none"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   >
//                     <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//                     <path d="M12 5l0 14" />
//                     <path d="M5 12l14 0" />
//                   </svg>
//                   Add Employees
//                 </button>
//                 <a
//                   href="#"
//                   className="btn btn-primary d-sm-none btn-icon"
//                   data-bs-toggle="modal"
//                   data-bs-target="#modal-report"
//                   aria-label="Create new report"
//                 >
//                   {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Employee table */}
//       <div
//         onCopy={(e) => {
//           e.preventDefault();
//         }}
//         className="mt-2"
//       >
//         <div className="card">
//           <div style={{ padding: "0px" }} className="card-body">
//             <div
//               id="table-default"
//               style={{ overflow: "auto", maxHeight: "70vh" }}
//             >
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   border: "1px solid #ddd",
//                 }}
//                 className="table-vcenter table-nowrap"
//               >
//                 <thead>
//                   <tr className="tr-sticky">
//                     <th>
//                       <button className="table-sort" data-sort="sort-name">
//                         Sr.No
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         onClick={sortDataByName}
//                         className="table-sort"
//                         data-sort="sort-city"
//                       >
//                         Name
//                       </button>
//                     </th>
//                     <th>
//                       <button className="table-sort" data-sort="sort-type">
//                         Phone No
//                       </button>
//                     </th>
//                     <th>
//                       <button className="table-sort" data-sort="sort-score">
//                         Email
//                       </button>
//                     </th>
//                     <th>
//                       <button
//                         onClick={sortDataByJoiningDate}
//                         className="table-sort"
//                         data-sort="sort-date"
//                       >
//                         Joining date
//                       </button>
//                     </th>
//                     <th>
//                       <button className="table-sort" data-sort="sort-date">
//                         Designation
//                       </button>
//                     </th>
//                     <th>
//                       <button className="table-sort" data-sort="sort-date">
//                         Branch Office
//                       </button>
//                     </th>
//                     <>
//                       <th>
//                         <button
//                           // onClick={sortDateByAddedOn}
//                           className="table-sort"
//                         // data-sort="sort-date"
//                         >
//                           Added on
//                         </button>
//                       </th>
//                     </>
//                     <th>
//                       <button className="table-sort" data-sort="sort-date">
//                         Action
//                       </button>
//                     </th>
//                   </tr>
//                 </thead>
//                 {filteredData.length == 0 ? (
//                   <tbody>
//                     <tr>
//                       <td
//                         className="particular"
//                         colSpan="10"
//                         style={{ textAlign: "center" }}
//                       >
//                         {/* <Nodata /> */}
//                       </td>
//                     </tr>
//                   </tbody>
//                 ) : (
//                   <tbody className="table-tbody">
//                     {filteredData.map((item, index) => (
//                       <tr key={index} style={{ border: "1px solid #ddd" }}>
//                         <td className="td-sticky">{index + 1}</td>
//                         <td>{item.ename}</td>
//                         <td>{item.number}</td>
//                         <td>{item.email}</td>
//                         <td>{formatDateFinal(item.jdate)}</td>
//                         <td>{item.designation}</td>
//                         <td>{item.branchOffice}</td>
//                         <td>{item.AddedOn}</td>
//                         <div className="icons-btn">
//                           <Link
//                             style={{ color: "black" }}
//                             to={`/hr/employee/employee-profile-details/${item._id}`}
//                           >
//                             <IconButton>
//                               <IconEye
//                                 style={{
//                                   width: "70px",
//                                   height: "14px",
//                                   color: "#d6a10c",
//                                 }}
//                               />
//                             </IconButton>
//                           </Link>
//                         </div>
//                       </tr>
//                     ))}
//                   </tbody>
//                 )}
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HrEmployees;

import React from 'react';

function HrEmployees({ onAddEmployeeClick }) {
    return (
        <div>
            <button onClick={onAddEmployeeClick}>Add Employee</button>
            {/* Your other HrEmployees component content */}
        </div>
    );
}

export default HrEmployees;

