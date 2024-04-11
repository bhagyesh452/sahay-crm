
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

    //console.log("data", employeeData)

    useEffect(() => {
        fetchData()
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
    }
    const [bdmNameSelected, setBdmNameSelected] = useState(false);

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

    const [latestName, setLatestName] = useState()

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
    const [errorMessage , setErrorMessage] = useState("")

    const handleSubmit = async () => {
        try {
            const teamData = {
                teamName: ename,
                branchOffice: branchOffice,
                bdmName: designation,
                employees: selectedBdes.map(ename => ({ ename, branchOffice }))
            };
            if (teamData && selectedBdes.length !== 0) {
                const response = await axios.post(`${secretKey}/teaminfo`, teamData);
                Swal.fire({
                    title: "Data Added!",
                    text: "You have successfully created a team!",
                    icon: "success",
                });
                console.log('Team created:', response.data);
                closepopup()
                // Optionally, you can reset the form state here

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Atleast One BDE is required!",
                });

            }
        } catch (error) {
            const errorfound = error.response.data.message
            Swal.fire({
                icon: "error",
                title: "Oops...",
                html: `${errorMessage}!`,
            });
            setErrorMessage(errorfound)
            console.error('Error creating team:', error.response.data.message);
        }
    };


    return (
        <div>
            <Header />
            <Navbar />
            <div className="page-wrapper">
                <div className="page-header d-print-none">
                    <div className="container-xl">
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
            </div>
            <div className="page-body">
                
            </div>
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


                                {/* {openBdeField && <div className="mb-3">
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
                                            value={selectBde}
                                            required
                                            onChange={(e) => {
                                                setSelectedBde(e.target.value);
                                            }}>
                                            <option value="" disabled selected>
                                                Select BDE Name
                                            </option>
                                            {
                                                employeeData && Array.isArray(employeeData) && employeeData
                                                    .filter((employee) => employee.designation === "Sales Executive")
                                                    .map((employee) => (
                                                        <option key={employee._id} value={employee.ename}>{employee.ename}</option>
                                                    ))
                                            }
                                        </select>
                                    </div>
                                </div>} */}
                                {/* {bdeFields.map((bdeField, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <label className="form-label">BDE Selection</label>
                                            <IconButton>
                                                <MdDelete
                                                    color="#bf2020"
                                                    style={{ width: "14px", height: "14px" }}
                                                    onClick={() => handleRemoveBdeField(index)}
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
                                                value={selectedBdes[index] || ''}
                                                onChange={(event) => {
                                                    handleBdeSelect(index, event.target.value)}

                                                }
                                                   
                                                required
                                            >
                                                <option value="" disabled>Select BDE Name</option>
                                                {employeeData
                                                    .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice && !selectedBdes.includes(employee.ename))
                                                    .map(employee => (
                                                        <option key={employee.email} value={employee.ename}>
                                                            {employee.ename}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                ))} */}
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
                                                value={selectedBdes[0] || " "}
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
                                {/* <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <input
                                        value={email}
                                        type="email"
                                        className="form-control"
                                        name="example-text-input"
                                        placeholder="Your report name"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            className="form-control"
                                            name="example-text-input"
                                            placeholder="Your report name"
                                            required
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                            }}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6 mb-3">
                                        <label className="form-label">Designation</label>
                                        <div className="form-control">
                                            <select
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "fit-content",
                                                }}
                                                value={designation}
                                                required
                                                onChange={(e) => {
                                                    setDesignation(e.target.value);
                                                }}>
                                                <option value="" disabled selected>
                                                    Select Designation
                                                </option>
                                                <option value="Sales Executive">Sales Executive</option>
                                                <option value="Sales Manager">Sales Manager</option>
                                                <option value="Graphics Designer">
                                                    Graphics Designer
                                                </option>
                                                <option value="Software Developer">
                                                    Software Developer
                                                </option>
                                                <option value="Finance Analyst">Finance Analyst</option>
                                                <option value="Content Writer">Content Writer</option>
                                                <option value="Data Manager">Data Manager</option>
                                                <option value="Admin Team">Admin Team</option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-6 mb-3">
                                        <label className="form-label">Branch Office</label>
                                        <div className="form-control">
                                            <select
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "fit-content",
                                                }}
                                                value={branchOffice}
                                                required
                                                onChange={(e) => {
                                                    setBranchOffice(e.target.value);
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
                                </div>
                                {designation === "Others" && (
                                    <div className="mb-3">
                                        <input
                                            value={otherdesignation}
                                            type="email"
                                            className="form-control"
                                            name="example-text-input"
                                            placeholder="Please enter your designation"
                                            onChange={(e) => {
                                                setotherDesignation(e.target.value);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label className="form-label">Phone No.</label>
                                        <input
                                            value={number}
                                            type="number"
                                            className="form-control"
                                            onChange={(e) => {
                                                setNumber(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="mb-3">
                                        <label className="form-label">Joining Date</label>
                                        <input
                                            value={jdate}
                                            type="date"
                                            onChange={(e) => {
                                                setJdate(e.target.value);
                                            }}
                                            className="form-control"
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button variant="contained" style={{ backgroundColor: "#fbb900" }} onClick={handleSubmit}>
                    Submit
                </Button>
            </Dialog>
        </div>





    )
}

export default Team;