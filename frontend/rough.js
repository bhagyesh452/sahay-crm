// import React, { useState, useEffect } from "react"
// import Header from './Header.js'
// import Navbar from './Navbar.js'
// import {
//     Button,
//     Dialog,
//     DialogContent,
//     DialogTitle,
//     IconButton,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios"
// import { MdDelete } from "react-icons/md";
// import { MdOutlineAddCircle } from "react-icons/md";
// import Swal from "sweetalert2";





// function Team() {
//     const [open, openchange] = useState(false);
//     const [ename, setEname] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("")
//     const [showPassword, setShowPassword] = useState(false);
//     const [designation, setDesignation] = useState("");
//     const [selectBde, setSelectedBde] = useState("");
//     const [otherdesignation, setotherDesignation] = useState("");
//     const [number, setNumber] = useState(0);
//     const [jdate, setJdate] = useState(null);
//     const [branchOffice, setBranchOffice] = useState("");
//     const secretKey = process.env.REACT_APP_SECRET_KEY;
//     const [employeeData, setEmployeeData] = useState([]);
//     const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
//     const [openBdmField, setOpenBdmField] = useState(false);
//     const [openBdeField, setOpenBdeField] = useState(false);
//     const [bdeFields, setBdeFields] = useState([]);
//     const [selectedBdes, setSelectedBdes] = useState([]);



//     const fetchData = async () => {
//         try {
//             const response = await axios.get(`${secretKey}/einfo`);
//             //console.log(response.data)
//             setEmployeeData(response.data)
//             setEmployeeDataFilter(response.data)
//         } catch (error) {
//             console.log("error Fetching data", error.message)

//         }
//     }

//     //console.log("data", employeeData)

//     useEffect(() => {
//         fetchData()
//     }, [])



//     const functionopenpopup = () => {
//         openchange(true)
//     }

//     const closepopup = () => {
//         openchange(false)
//         fetchData()
//         setEname("");
//         setDesignation("");
//         setSelectedBde("");
//         setBranchOffice("");
//         setOpenBdeField(false);
//         setOpenBdmField(false);
//         setBdeFields([])
//         setSelectedBdes([])
//         newArray([])
//         setBdmNameSelected(false)
//     }
//     const [bdmNameSelected, setBdmNameSelected] = useState(false);

//     const handleSelectBdm = (value) => {
//         const branch = value;
//         //console.log(branch)
//         setOpenBdmField(true)
//         setOpenBdeField(true)
//         setBdmNameSelected(true)
//         // if (branch === "Gota") {
//         //     setEmployeeData(employeeDataFilter.filter((employee) => employee.branchOffice === "Gota"))
//         // } else {
//         //     setEmployeeData(employeeDataFilter.filter((employee) => employee.branchOffice === "Sindhu Bhawan"))
//         // }
//     }
//     const handleAddBdeField = () => {
//         const newBdeFields = [...bdeFields];
//         newBdeFields.push('');
//         setBdeFields(newBdeFields);
//     };

//     const handleRemoveBdeField = (indexToRemove) => {
//         const newBdeFields = bdeFields.filter((_, index) => index !== indexToRemove);
//         setBdeFields(newBdeFields);

//         const newSelectedBdes = [...selectedBdes];
//         newSelectedBdes.splice(indexToRemove, 1);
//         setSelectedBdes(newSelectedBdes);
//     };

//     const [latestName, setLatestName] = useState()
//     const [array , newArray] = useState([])




//     const handleBdeSelect = (index, value) => {
//         console.log(index)
//         const newSelectedBdes = [...selectedBdes];
//         newSelectedBdes[index] = value;
//         //setLatestName(newSelectedBdes[index])
//         // console.log(newSelectedBdes[index])
//         setSelectedBdes(newSelectedBdes);
//     };

//     //console.log(selectedBdes)
//     //console.log(latestName)

//     console.log("array" , array)

//     //console.log(ename, branchOffice, designation)
//     const [errorMessage , setErrorMessage] = useState("")

//     const handleSubmit = async () => {
//         try {
//             const teamData = {
//                 teamName: ename,
//                 branchOffice: branchOffice,
//                 bdmName: designation,
//                 employees: array.map(ename => ({ ename, branchOffice }))
//             };
//             if (teamData && array.length !== 0) {
//                 const response = await axios.post(`${secretKey}/teaminfo`, teamData);
//                 Swal.fire({
//                     title: "Data Added!",
//                     text: "You have successfully created a team!",
//                     icon: "success",
//                 });
//                 console.log('Team created:', response.data);
//                 closepopup()
//                 // Optionally, you can reset the form state here

//             } else {
//                 Swal.fire({
//                     icon: "error",
//                     title: "Oops...",
//                     text: "Atleast One BDE is required!",
//                 });
//             }
//         } catch (error) {
//             const errorfound = error.response.data.message
//             Swal.fire({
//                 icon: "error",
//                 title: "Oops...",
//                 html: `${errorMessage}!`,
//             });
//             setErrorMessage(errorfound)
//             console.error('Error creating team:', error.response.data.message);
//         }
//     };


//     return (
//         <div>
//             <Header />
//             <Navbar />
//             <div className="page-wrapper">
//                 <div className="page-header d-print-none">
//                     <div className="container-xl">
//                         <div className="row g-2 align-items-center">
//                             <div className="col">
//                                 <h2 className="page-title">Teams</h2>
//                             </div>
//                             <div style={{ width: "20vw" }} className="input-icon">
//                                 <span className="input-icon-addon">
//                                     {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="icon"
//                                         width="20"
//                                         height="24"
//                                         viewBox="0 0 24 24"
//                                         stroke-width="2"
//                                         stroke="currentColor"
//                                         fill="none"
//                                         stroke-linecap="round"
//                                         stroke-linejoin="round"
//                                     >
//                                         <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//                                         <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
//                                         <path d="M21 21l-6 -6" />
//                                     </svg>
//                                 </span>
//                                 <input
//                                     type="text"
//                                     //value={searchQuery}
//                                     className="form-control"
//                                     placeholder="Search…"
//                                     aria-label="Search in website"
//                                 // onChange={handleSearch}
//                                 />
//                             </div>
//                             <div className="col-auto ms-auto d-print-none">
//                                 <div className="btn-list">
//                                     <button
//                                         className="btn btn-primary d-none d-sm-inline-block"
//                                         onClick={functionopenpopup}>
//                                         {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
//                                         <svg
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             className="icon"
//                                             width="24"
//                                             height="24"
//                                             viewBox="0 0 24 24"
//                                             stroke-width="2"
//                                             stroke="currentColor"
//                                             fill="none"
//                                             stroke-linecap="round"
//                                             stroke-linejoin="round"
//                                         >
//                                             <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//                                             <path d="M12 5l0 14" />
//                                             <path d="M5 12l14 0" />
//                                         </svg>
//                                         Add Teams
//                                     </button>
//                                     <a
//                                         href="#"
//                                         className="btn btn-primary d-sm-none btn-icon"
//                                         data-bs-toggle="modal"
//                                         data-bs-target="#modal-report"
//                                         aria-label="Create new report">
//                                     </a>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div onCopy={(e) => {
//                 e.preventDefault();
//             }} className="page-body">
//                 <div style={{ maxWidth: "89vw", overflowX: "auto" }}
//                     className="container-xl">
//                     <div className="card">
//                         <div style={{ padding: "0px" }} className="card-body">
//                             <div id="table-default"
//                                 style={{ overflow: "auto", maxHeight: "70vh" }}>
//                                 <table style={{
//                                     width: "100%",
//                                     borderCollapse: "collapse",
//                                     border: "1px solid #ddd",
//                                 }}
//                                     className="table-vcenter table-nowrap" >
//                                     <thead>
//                                         <tr className="tr-sticky">
//                                             <th>
//                                                 Sr.No
//                                             </th>
//                                             <th>
//                                                 Name
//                                             </th>
//                                             <th>
//                                                 Phone No
//                                             </th>
//                                             <th>
//                                                 Email
//                                             </th>
//                                             <th>
//                                                 Joining Date
//                                             </th>
//                                             <th>
//                                                 Designation
//                                             </th>
//                                             <th>
//                                                 Branch Office
//                                             </th>
//                                             <th>
//                                                 Added On
//                                             </th>
//                                             <th>
//                                                 View Employees
//                                             </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="table-tbody">
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
//                 <DialogTitle>
//                     Create Team
//                     <IconButton onClick={closepopup} style={{ float: "right" }}>
//                         <CloseIcon color="primary"></CloseIcon>
//                     </IconButton>{" "}
//                 </DialogTitle>
//                 <DialogContent>
//                     <div className="modal-dialog modal-lg" role="document">
//                         <div className="modal-content">
//                             <div className="modal-body">
//                                 <div className="mb-3">
//                                     <label className="form-label">Team Name</label>
//                                     <input
//                                         type="text"
//                                         value={ename}
//                                         className="form-control"
//                                         name="example-text-input"
//                                         placeholder="Your report name"
//                                         onChange={(e) => {
//                                             setEname(e.target.value);
//                                         }}
//                                     />
//                                 </div>
//                                 <div className="mb-3">
//                                     <label className="form-label">Branch Office</label>
//                                     <div className="form-control">
//                                         <select
//                                             style={{
//                                                 border: "none",
//                                                 outline: "none",
//                                                 width: "100%",
//                                             }}
//                                             value={branchOffice}
//                                             required
//                                             onChange={(e) => {
//                                                 setBranchOffice(e.target.value);
//                                                 handleSelectBdm(e.target.value)
//                                             }}
//                                         >
//                                             <option value="" disabled selected>
//                                                 Select Branch Office
//                                             </option>
//                                             <option value="Gota">Gota</option>
//                                             <option value="Sindhu Bhawan">Sindhu Bhawan</option>
//                                         </select>
//                                     </div>
//                                 </div>
//                                 {openBdmField && <div className="mb-3">
//                                     <label className="form-label">BDM Selection</label>
//                                     <div className="form-control">
//                                         <select
//                                             style={{
//                                                 border: "none",
//                                                 outline: "none",
//                                                 width: "100%",
//                                             }}
//                                             value={designation}
//                                             required
//                                             onChange={(e) => {
//                                                 setDesignation(e.target.value);
//                                             }}>
//                                             <option value="" disabled selected>
//                                                 Select BDM Name
//                                             </option>
//                                             {
//                                                 employeeData && Array.isArray(employeeData) && employeeData
//                                                     .filter((employee) => employee.designation === "Sales Manager" && employee.branchOffice === branchOffice)
//                                                     .map((employee) => (
//                                                         <option key={employee._id} value={employee.ename}>{employee.ename}</option>
//                                                     ))
//                                             }
//                                         </select>
//                                     </div>
//                                 </div>}
//                                 {openBdeField && (
//                                     <div key={0} className="mb-3">
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <label className="form-label">BDE Selection</label>
//                                         </div>
//                                         <div className="form-control">
//                                             <select
//                                                 style={{
//                                                     border: "none",
//                                                     outline: "none",
//                                                     width: "100%",
//                                                 }}
//                                                 value={latestName}
//                                                 //onChange={(event) => handleBdeSelect(0, event.target.value)}
//                                                 onChange={(e)=>{
//                                                     setLatestName(e.target.value)
//                                                     newArray(prevArray => {
//                                                         const updatedArray = [...prevArray]; // Create a copy of the previous array
//                                                         updatedArray[0] = e.target.value; // Update the desired element
//                                                         return updatedArray; // Return the updated arrayired element
//                                                     })}
//                                                 }
//                                                 required
//                                             >
//                                                 <option value="" disabled>Select BDE Name</option>
//                                                 {employeeData
//                                                     .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice)
//                                                     .map(employee => (
//                                                         <option key={employee._id} value={employee.ename}>
//                                                             {employee.ename}
//                                                         </option>
//                                                     ))}
//                                             </select>
//                                         </div>
//                                     </div>
//                                 )}
//                                 {bdeFields.slice(1).map((bdeField, index) => (
//                                     <div key={index + 1} className="mb-3">
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <label className="form-label">BDE Selection</label>
//                                             <IconButton>
//                                                 <MdDelete
//                                                     color="#bf2020"
//                                                     style={{ width: "14px", height: "14px" }}
//                                                     //onClick={() => handleRemoveBdeField(index + 1)}
//                                                 />
//                                             </IconButton>
//                                         </div>
//                                         <div className="form-control">
//                                             <select
//                                                 style={{
//                                                     border: "none",
//                                                     outline: "none",
//                                                     width: "100%",
//                                                 }}
//                                                 // value={selectedBdes[index + 1] || ''}
//                                                 // onChange={(event) => handleBdeSelect(index + 1, event.target.value)}
//                                                 onChange={(e)=>{
//                                                     newArray(prevArray => {
//                                                         const updatedArray = [...prevArray]; // Create a copy of the previous array
//                                                         updatedArray.push(e.target.value); // Update the desired element
//                                                         return updatedArray; // Return the updated arrayired element
//                                                     })
//                                                 }}
//                                                 required
//                                             >
//                                                 <option value="" disabled>Select BDE Name</option>
//                                                 {employeeData
//                                                     .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice)
//                                                     .map(employee => (
//                                                         <option key={employee._id} value={employee.ename}>
//                                                             {employee.ename}
//                                                         </option>
//                                                     ))}
//                                             </select>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <IconButton style={{ float: "right" }}>
//                                     <MdOutlineAddCircle
//                                         color="primary" style={{ float: "right", width: "14px", height: "14px" }}
//                                         onClick={handleAddBdeField}></MdOutlineAddCircle>
//                                 </IconButton>
//                             </div>
//                         </div>
//                     </div>
//                 </DialogContent>
//                 <Button variant="contained" style={{ backgroundColor: "#fbb900" }} onClick={handleSubmit}>
//                     Submit
//                 </Button>
//             </Dialog>
//         </div>





//     )
// }

// export default Team;

 {/* <Slider
                        defaultValue={feedbakPoints}
                        //getAriaValueText={feedbakPoints} 
                        //value={valueSlider}
                        //onChange={(e) => { handleSliderChange(e.target.value) }}
                        sx={{ zIndex: "99999999", color: "#ffb900" }}
                        min={0}
                        max={10}
                        disabled
                        aria-label="Disabled slider"
                        valueLabelDisplay="on" 
                        valueLabelFormat={feedbakPoints}
                        /> */}

 // useEffect(() => {
    //     // Fetch data about India from REST Countries API
    //     const fetchIndianStates = async () => {
    //       try {
    //         const response = await axios.get('https://restcountries.com/v3.1/name/India');
    //         // Extract the list of states from the response
    //         const indiaData = response.data[0];
    //         if (indiaData?.subdivisions) {
    //           const states = Object.values(indiaData.subdivisions).map((state) => state.name);
    //          console.log(states)
    //         }
    //       } catch (error) {
    //         console.error('Error fetching Indian states:', error);
    //       }
    //     };

    //     fetchIndianStates();
    //   }, []);