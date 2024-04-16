
import React, { useState, useEffect } from "react"
import Header from './Header.js'
import Navbar from './Navbar.js'
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios"
import { MdDelete } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import Swal from "sweetalert2";
import { IconTrash } from "@tabler/icons-react";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { IconEye } from "@tabler/icons-react";





function Team() {
    const [open, openchange] = useState(false);
    const [ename, setEname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [designation, setDesignation] = useState("");
    const [selectBde, setSelectedBde] = useState("");
    const [otherdesignation, setotherDesignation] = useState("");
    const [number, setNumber] = useState(0);
    const [jdate, setJdate] = useState(null);
    const [branchOffice, setBranchOffice] = useState("");
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const [openBdmField, setOpenBdmField] = useState(false);
    const [openBdeField, setOpenBdeField] = useState(false);
    const [bdeFields, setBdeFields] = useState([]);
    const [selectedBdes, setSelectedBdes] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [teamDataFilter, setTeamDataFilter] = useState([])
    const [openTeamDetails, setopenTeamDetails] = useState(false)



    const fetchData = async () => {
        try {
            const response = await axios.get(`${secretKey}/einfo`);
            //console.log(response.data)
            setEmployeeData(response.data)
            setEmployeeDataFilter(response.data)
        } catch (error) {
            console.log("error Fetching data", error.message)

        }
    }

    const fecthTeamData = async () => {
        try {
            const response = await axios.get(`${secretKey}/teaminfo`)

            console.log("teamdata", response.data)
            setTeamData(response.data)
            setTeamDataFilter(response.data)

        } catch (error) {
            console.log("error Fetching data", error.message)
        }
    }

    useEffect(() => {
        fetchData();
        fecthTeamData();
    }, [])



    const functionopenpopup = () => {
        openchange(true)
    }

    const closepopup = () => {
        openchange(false)
        fetchData()
        setEname("");
        setDesignation("");
        setSelectedBde("");
        setBranchOffice("");
        setOpenBdeField(false);
        setOpenBdmField(false);
        setBdeFields([])
        setSelectedBdes([])
        setBdmNameSelected(false)
        fecthTeamData()
    }
    const [bdmNameSelected, setBdmNameSelected] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false)
    const [teamId, setTeamId] = useState("")

    const handleUpdateTeam = (teamId) => {
        const selectedData = teamData.find((item) => item._id === teamId);

        // Extract ename values from the employees array
        const enames = selectedData.employees.map((employee) => employee.ename);

        console.log(selectedData);

        setIsEditMode(true);
        setTeamId(teamId);
        setEname(selectedData.teamName);
        setDesignation(selectedData.bdmName);
        setBranchOffice(selectedData.branchOffice);
        setOpenBdeField(true);
        setOpenBdmField(true);
        setBdmNameSelected(true);
        setBdeFields(enames);
        setSelectedBdes(enames)// Update bdeFields with enames
    };


    const handleSelectBdm = (value) => {
        const branch = value;
        //console.log(branch)
        setOpenBdmField(true)
        setOpenBdeField(true)
        setBdmNameSelected(true)
        if (branch === "Gota") {
            setEmployeeData(employeeDataFilter.filter((employee) => employee.branchOffice === "Gota"))
        } else {
            setEmployeeData(employeeDataFilter.filter((employee) => employee.branchOffice === "Sindhu Bhawan"))
        }
    }


    const handleAddBdeField = () => {
        const newBdeFields = [...bdeFields];
        newBdeFields.push('');
        setBdeFields(newBdeFields);
    };

    const handleRemoveBdeField = (indexToRemove) => {
        const newBdeFields = bdeFields.filter((_, index) => index !== indexToRemove);
        setBdeFields(newBdeFields);

        const newSelectedBdes = [...selectedBdes];
        newSelectedBdes.splice(indexToRemove, 1);
        setSelectedBdes(newSelectedBdes);
    };


    const handleBdeSelect = (index, value) => {
        console.log(index)
        const newSelectedBdes = [...selectedBdes];
        newSelectedBdes[index] = value;
        //setLatestName(newSelectedBdes[index])
        // console.log(newSelectedBdes[index])
        setSelectedBdes(newSelectedBdes);
    };

    console.log(selectedBdes)
    //console.log(latestName)

    console.log(ename, branchOffice, designation)

    const [errorMessage, setErrorMessage] = useState("")
    //console.log(errorMessage)

    // const handleSubmit = async () => {
    //     try {
    //         const teamData = {
    //             teamName: ename,
    //             branchOffice: branchOffice,
    //             bdmName: designation,
    //             employees: selectedBdes.map(ename => ({ ename, branchOffice }))
    //         };

    //         let updatedTeamData = {
    //             teamName: ename,
    //             bdmName: designation,
    //             branchOffice: branchOffice,
    //             employees: selectedBdes.map(ename => ({ ename, branchOffice }))
    //         }

    //         // if (teamData && selectedBdes.length !== 0) {
    //         //     const response = await axios.post(`${secretKey}/teaminfo`, teamData);
    //         //     Swal.fire({
    //         //         title: "Data Added!",
    //         //         text: "You have successfully created a team!",
    //         //         icon: "success",
    //         //     });
    //         //     console.log('Team created:', response.data);
    //         //     closepopup()
    //         //     // Optionally, you can reset the form state here

    //         if (isEditMode) {
    //             await axios.put(`${secretKey}/teaminfo/${teamId}`, updatedTeamData);
    //             Swal.fire({
    //                 title: "Data Updated Succesfully!",
    //                 text: "You have successfully updated the name!",
    //                 icon: "success",
    //             });
    //             console.log("updatedData" , updatedTeamData)
    //         } else {
    //             const response = await axios.post(`${secretKey}/teaminfo`, teamData);
    //             Swal.fire({
    //                 title: "Data Added!",
    //                 text: "You have successfully created a team!",
    //                 icon: "success",
    //             });
    //             console.log('Team created:', response.data);
    //         }
    //         closepopup()
    //         setIsEditMode(false);
    //         setTeamId("");
    //         setEname("");
    //         setDesignation("");
    //         setBranchOffice("");
    //         setOpenBdeField(false);
    //         setOpenBdmField(false);
    //         setBdmNameSelected(false);
    //         setBdeFields([]);
    //         setSelectedBdes([])// Update bdeFields with enames

    //     } catch (error) {
    //         const errorfound = error.response.data.message
    //         setErrorMessage(errorfound)
    //         Swal.fire({
    //             icon: "error",
    //             title: "Oops...",
    //             html: `${errorfound}!`,
    //         });
    //         console.error('Error creating team:', error.response.data.message);
    //     }
    // };

    const handleSubmit = async () => {
        try {
            // Check if teamName, bdmName, and selectedBdes array have values
            if (!ename || !designation || selectedBdes.length === 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Team name, BDM name, and at least one BD ename are required!",
                });
                return; // Exit function if any required field is missing
            }
    
            const teamData = {
                teamName: ename,
                branchOffice: branchOffice,
                bdmName: designation,
                employees: selectedBdes.map(ename => ({ ename, branchOffice }))
            };
    
            let updatedTeamData = {
                teamName: ename,
                bdmName: designation,
                branchOffice: branchOffice,
                employees: selectedBdes.map(ename => ({ ename, branchOffice }))
            }
    
            if (isEditMode && updatedTeamData) {
                await axios.put(`${secretKey}/teaminfo/${teamId}`, updatedTeamData);
                Swal.fire({
                    title: "Data Updated Succesfully!",
                    text: "You have successfully updated the name!",
                    icon: "success",
                });
                console.log("updatedData", updatedTeamData)
            } else {
                const response = await axios.post(`${secretKey}/teaminfo`, teamData);
                Swal.fire({
                    title: "Data Added!",
                    text: "You have successfully created a team!",
                    icon: "success",
                });
                console.log('Team created:', response.data);
            }
            closepopup();
            setIsEditMode(false);
            setTeamId("");
            setEname("");
            setDesignation("");
            setBranchOffice("");
            setOpenBdeField(false);
            setOpenBdmField(false);
            setBdmNameSelected(false);
            setBdeFields([]);
            setSelectedBdes([])// Update bdeFields with enames
    
        } catch (error) {
            const errorfound = error.response.data.message
            setErrorMessage(errorfound)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: `${errorfound}!`,
            });
            console.error('Error creating team:', error.response.data.message);
        }
    };
    

    const closeTeamDetails = () => {
        setopenTeamDetails(false)
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index (0 for January)
        const year = date.getFullYear();

        // Format day and month to ensure they have two digits
        const formattedDay = day < 10 ? '0' + day : day;
        const formattedMonth = month < 10 ? '0' + month : month;

        // Create the formatted date string in dd/mm/yyyy format
        const formattedDate = `${formattedMonth}/${formattedDay}/${year}`;

        return formattedDate;
    }

    const [teamName, setTeamName] = useState("")
    const [teambdmName, setTeamBdmName] = useState("")
    const [teamBranckOffice, setteamBranchOffice] = useState("")
    const [teamemployees, setTeamEmployees] = useState([])

    const functionOpenTeamDeatils = (teamName, bdmName, branchOffice, employees) => {
        setopenTeamDetails(true)
        setTeamName(teamName);
        setTeamBdmName(bdmName);
        setteamBranchOffice(branchOffice)
        setTeamEmployees(employees)
    }

    const handleDeleteTeam = async (teamId) => {
        try {
            const response = await axios.delete(`${secretKey}/delete-bdmTeam/${teamId}`);
            if (response.status === 200) {
                Swal.fire("Team Deleted Successfully");
            }
        } catch (error) {
            Swal.fire("Error", error.message, "error");
        }
    }






    return (
        <div>
            {/* <Header />
            <Navbar /> */}
            <div className="page-wrapper">
                <div className="page-header m-0 d-print-none">
                    <div className="row g-2 align-items-center">
                        <div className="col">
                            <h2 className="page-title">Teams</h2>
                        </div>
                        <div style={{ width: "20vw" }} className="input-icon">
                            <span className="input-icon-addon">
                                {/* <!-- Download SVG icon from http://tabler-icons.io/i/search --> */}
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
                                //value={searchQuery}
                                className="form-control"
                                placeholder="Search…"
                                aria-label="Search in website"
                            // onChange={handleSearch}
                            />
                        </div>
                        <div className="col-auto ms-auto d-print-none">
                            <div className="btn-list">
                                <button
                                    className="btn btn-primary d-none d-sm-inline-block"
                                    onClick={functionopenpopup}>
                                    {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        stroke-width="2"
                                        stroke="currentColor"
                                        fill="none"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 5l0 14" />
                                        <path d="M5 12l14 0" />
                                    </svg>
                                    Add Teams
                                </button>
                                <a
                                    href="#"
                                    className="btn btn-primary d-sm-none btn-icon"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modal-report"
                                    aria-label="Create new report">
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div onCopy={(e) => {
                e.preventDefault();
            }} className="mt-2">
                <div className="card">
                    <div style={{ padding: "0px" }} className="card-body">
                        <div id="table-default"
                            style={{ overflow: "auto", maxHeight: "70vh" }}>
                            <table style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                border: "1px solid #ddd",
                            }}
                                className="table-vcenter table-nowrap" >
                                <thead>
                                    <tr className="tr-sticky">
                                        <th>
                                            Sr.No
                                        </th>
                                        <th>
                                            Team Name
                                        </th>
                                        <th>
                                            BDM Name
                                        </th>
                                        <th>
                                            Branch Office
                                        </th>
                                        <th>
                                            Team Size
                                        </th>
                                        <th>
                                            Created Date
                                        </th>
                                        <th>
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="table-tbody">
                                    {teamDataFilter && (
                                        teamDataFilter.map((item, index) => (
                                            <tr key={index} style={{ border: "1px solid #ddd" }}>
                                                <td className="td-sticky">{index + 1}</td>
                                                <td>{item.teamName}</td>
                                                <td>{item.bdmName}</td>
                                                <td>{item.branchOffice}</td>
                                                <td onClick={() => functionOpenTeamDeatils(
                                                    item.teamName,
                                                    item.bdmName,
                                                    item.branchOffice,
                                                    item.employees
                                                )}>{item.employees.length}
                                                    <IconButton >  <IconEye
                                                        style={{
                                                            width: "14px",
                                                            height: "14px",
                                                            color: "#d6a10c",
                                                        }}
                                                    /></IconButton>
                                                </td>
                                                <td>{item.modifiedAt}</td>
                                                <td><div className="d-flex justify-content-center align-items-center">
                                                    <div className="icons-btn">
                                                        <IconButton onClick={() => { handleDeleteTeam(item._id) }}
                                                        >
                                                            <IconTrash
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "red",
                                                                    width: "14px",
                                                                    height: "14px",
                                                                }}

                                                            />
                                                        </IconButton>
                                                    </div>
                                                    <div className="icons-btn">
                                                        <IconButton onClick={() => {
                                                            functionopenpopup()
                                                            handleUpdateTeam(item._id, item.teamName)
                                                        }}>
                                                            <ModeEditIcon
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "#a29d9d",
                                                                    width: "14px",
                                                                    height: "14px",
                                                                }}

                                                            />
                                                        </IconButton>
                                                    </div>
                                                </div></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            {/* -----------------------------------------------dialog box for adding teams ------------------------------------------------------ */}


            <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    Create Team
                    <IconButton onClick={closepopup} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Team Name</label>
                                    <input
                                        type="text"
                                        value={ename}
                                        className="form-control"
                                        name="example-text-input"
                                        placeholder="Your report name"
                                        onChange={(e) => {
                                            setEname(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Branch Office</label>
                                    <div className="form-control">
                                        <select
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                width: "100%",
                                            }}
                                            value={branchOffice}
                                            required
                                            onChange={(e) => {
                                                setBranchOffice(e.target.value);
                                                handleSelectBdm(e.target.value)
                                            }}
                                        >
                                            <option value="" disabled selected>
                                                Select Branch Office
                                            </option>
                                            <option value="Gota">Gota</option>
                                            <option value="Sindhu Bhawan">Sindhu Bhawan</option>
                                        </select>
                                    </div>
                                </div>
                                {openBdmField && <div className="mb-3">
                                    <label className="form-label">BDM Selection</label>
                                    <div className="form-control">
                                        <select
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                width: "100%",
                                            }}
                                            value={designation}
                                            required
                                            onChange={(e) => {
                                                setDesignation(e.target.value);
                                            }}>
                                            <option value="" disabled selected>
                                                Select BDM Name
                                            </option>
                                            {
                                                employeeData && Array.isArray(employeeData) && employeeData
                                                    .filter((employee) => employee.designation === "Sales Manager")
                                                    .map((employee) => (
                                                        <option key={employee._id} value={employee.ename}>{employee.ename}</option>
                                                    ))
                                            }
                                        </select>
                                    </div>
                                </div>}
                                {bdmNameSelected && (
                                    <div key={0} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <label className="form-label">BDE Selection</label>
                                        </div>
                                        <div className="form-control">
                                            <select
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "100%",
                                                }}
                                                value={selectedBdes.length > 0 ? selectedBdes[0] : ""}
                                                onChange={(event) => handleBdeSelect(0, event.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Select BDE Name</option>
                                                {employeeData
                                                    .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice)
                                                    .map(employee => (
                                                        <option key={employee._id} value={employee.ename} >
                                                            {employee.ename}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {bdeFields.slice(1).map((bdeField, index) => (
                                    <div key={index + 1} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <label className="form-label">BDE Selection</label>
                                            <IconButton>
                                                <MdDelete
                                                    color="#bf2020"
                                                    style={{ width: "14px", height: "14px" }}
                                                    onClick={() => handleRemoveBdeField(index + 1)}
                                                />
                                            </IconButton>
                                        </div>
                                        <div className="form-control">
                                            <select
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "100%",
                                                }}
                                                value={selectedBdes[index + 1] || ''}
                                                onChange={(event) => handleBdeSelect(index + 1, event.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Select BDE Name</option>
                                                {employeeData
                                                    .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice)
                                                    .map(employee => (
                                                        <option key={employee._id} value={employee.ename} disabled={selectedBdes.includes(employee.ename)}>
                                                            {employee.ename}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <IconButton style={{ float: "right" }}>
                                    <MdOutlineAddCircle
                                        color="primary" style={{ float: "right", width: "14px", height: "14px" }}
                                        onClick={handleAddBdeField}></MdOutlineAddCircle>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button variant="contained" style={{ backgroundColor: "#fbb900" }} onClick={handleSubmit}>
                    Submit
                </Button>
            </Dialog>

            {/* -------------------------------------------popup for team details----------------------------------------------------------- */}

            <Dialog open={openTeamDetails} onClose={closeTeamDetails} fullWidth maxWidth="sm">
                <DialogTitle>
                    {teamName}
                    <IconButton onClick={closeTeamDetails} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogTitle>
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 style={{ color: "grey" }}>{teambdmName}</h4>
                        <h4 style={{ color: "grey" }}>{teamBranckOffice}</h4>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>S.no</th>
                                <th>Bde Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamemployees && teamemployees.map((obj, index) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{obj.ename}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </DialogContent>
                <Button variant="contained" style={{ backgroundColor: "#fbb900" }}>

                </Button>
            </Dialog>



        </div>
    )
}

export default Team;