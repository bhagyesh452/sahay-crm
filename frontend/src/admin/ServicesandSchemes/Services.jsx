import React, { useState, useEffect } from 'react';
import Header from '../Header';
import Navbar from '../Navbar';
import Nodata from '../../components/Nodata';
import ClipLoader from 'react-spinners/ClipLoader';
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import { IconEye } from '@tabler/icons-react';
import CloseIcon from "@mui/icons-material/Close";
import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Swal from 'sweetalert2';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import axios from 'axios';
import AddServices from './AddServices';


function Services() {

    const secretKey = process.env.REACT_APP_SECRET_KEY;

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

    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddDepartment, setShowAddDepartment] = useState(false);
    const [showAddService, setShowAddService] = useState(false);
    const [showAddServiceDetails, setShowAddServiceDetails] = useState(false);
    const [showDepartments, setShowDepartments] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [departmentName, setDepartmentName] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [serviceDescription, setServiceDescription] = useState("");
    const [departmentErrorMessage, setDepartmentErrorMessage] = useState("");
    const [sericeErrorMessage, setServiceErrorMessage] = useState("");
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

    const handleCloseAddService = () => {
        setShowAddDepartment(false);
        setShowDepartments(false);
        setDepartmentErrorMessage("");
        setServiceErrorMessage("");
        setDescriptionErrorMessage("");
        setDepartmentName("");
        setServiceName("");
        setServiceDescription("");
    };

    const handleCloseShowAddServiceDetails = () => {
        setShowAddServiceDetails(false);
    }

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${secretKey}/department/fetchDepartments`);
            const sortedServices = res.data.data.sort((a, b) => {
                if (a.departmentName < b.departmentName) return -1;
                if (a.departmentName > b.departmentName) return 1;
                return 0;
            });
            // console.log("Fetched services are :", sortedServices);
            setServices(sortedServices);
        } catch (error) {
            console.log("Error fetching services :", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await axios.get(`${secretKey}/department/fetchDepartments`);
            const data = res.data.data;
            const uniqueDepartments = [...new Set(data.map((item) => item.departmentName))];
            setDepartments(uniqueDepartments); // Set the unique department names to state
            // console.log("Fetched unique departments are:", uniqueDepartments);
        } catch (error) {
            console.log("Error fetching departments :", error);
        }
    }

    const handleSubmit = async () => {
        try {
            let hasError = false;

            // Check if department name is empty
            if (departmentName.trim().length === 0) {
                setDepartmentErrorMessage("Please enter department name");
                hasError = true;
            } else {
                setDepartmentErrorMessage("");
            }

            // Check if service name is empty
            if (serviceName.trim().length === 0) {
                setServiceErrorMessage("Please enter service name");
                hasError = true;
            } else {
                setServiceErrorMessage("");
            }

            // Check if service description is empty
            if (serviceDescription.trim().length === 0) {
                setDescriptionErrorMessage("Please enter service description");
                hasError = true;
            } else {
                setDescriptionErrorMessage("");
            }

            // If any errors were found, do not proceed
            if (hasError) return;

            const res = await axios.post(`${secretKey}/department/addDepartment`, {
                departmentName: departmentName,
                serviceName: serviceName,
                serviceDescription: serviceDescription
            });
            // console.log("Department successfully created :", res.data.data);
            Swal.fire("success", "Department Successfully Created", "success");
            setShowAddDepartment(false);
            setShowDepartments(false);
            setDepartmentName("");
            setServiceName("");
            setServiceDescription("");
            fetchServices();
        } catch (error) {
            Swal.fire("error", "Error creating department", "error");
            console.log("Error creating department :", error);
        }
    };

    const handleToggleChange = async (serviceName) => {
        try {
            // Fetch the current status of hideService for the selected service
            const res = await axios.get(`${secretKey}/department/fetchService/${serviceName}`);
            const currentHideServiceStatus = res.data.data.hideService;

            // Toggle the hideService value
            const updatedHideService = !currentHideServiceStatus;

            // Update the hideService status in the database
            const updateRes = await axios.put(`${secretKey}/department/updateServiceHideStatus/${serviceName}`, {
                hideService: updatedHideService,
            });
            fetchServices();
            if(updatedHideService) {
                Swal.fire("success","Service successfully hidden","success");
            } else {
                Swal.fire("success","Service successfully shown","success");
            }

            if (updateRes.data.result) {
                // console.log("Service hide status updated successfully");
                // Optionally, you can update the local state to reflect changes in the UI
            }
        } catch (error) {
            console.error("Error updating hideService status:", error);
            Swal.fire("Error","Error hiding services","error");
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        if (showDepartments) {
            fetchDepartments(); // Fetch departments only when the checkbox is checked
        }
    }, [showDepartments]);
    return (
        <div>
            <Header />
            <Navbar />

            
            {!showAddServiceDetails && 
            <div className="page-wrapper">

                <div className="page-header">
                    <div className="container-xl">
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className="dashboard-title"  >
                                <h2 className="m-0">
                                    Services and Schemes
                                </h2>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="filter-booking mr-1 d-flex align-items-center">
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <div className='form-group'>
                                            <button
                                                className="btn action-btn-primary"
                                                onClick={() => setShowAddDepartment(true)}
                                            >
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
                                                Add Department
                                            </button>
                                        </div>
                                        <div className='form-group ml-1'>
                                            <button
                                                className="btn action-btn-alert"
                                                onClick={() => setShowAddService(true)}
                                            >
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
                                                Add Service
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-body">
                    <div className="container-xl">
                        <div className='my-card mt-2'>
                            <div className="card-body">
                                <div id="table-default" className="row tbl-scroll">
                                    <table className="table-vcenter table-nowrap admin-dash-tbl"  >

                                        <thead className="admin-dash-tbl-thead">
                                            <tr>
                                                <th>Sr. No</th>
                                                <th>Department Name</th>
                                                <th>Services Name</th>
                                                <th>Hide Service</th>
                                                <th>Add Service Details</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        {isLoading ? (
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" >
                                                        <div className="LoaderTDSatyle w-100" >
                                                            <ClipLoader
                                                                color="lightgrey"
                                                                currentDataLoading
                                                                size={30}
                                                                aria-label="Loading Spinner"
                                                                data-testid="loader"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : services.length !== 0 ? (
                                            <>

                                                <tbody>
                                                    {services.map((service, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{service.departmentName}</td>
                                                            <td>{service.serviceName}</td>
                                                            <td>
                                                                <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                                                    <AntSwitch
                                                                        checked={service.hideService}
                                                                        onChange={(e) => handleToggleChange(service.serviceName)}
                                                                        inputProps={{ 'aria-label': 'ant design' }} />
                                                                </Stack>
                                                            </td>
                                                            <td>
                                                                <button className='btn btn-sm btnaction-btn action-btn-primary' onClick={() => setShowAddServiceDetails(true)}>
                                                                    Add
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex justify-content-center align-items-center">
                                                                    <div className="icons-btn">
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
                                                                    </div>

                                                                    <div className="icons-btn">
                                                                        <IconButton>
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

                                                                    <div className="icons-btn">
                                                                        <IconButton>
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
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                                <tfoot className="admin-dash-tbl-tfoot">
                                                    {/* <tr style={{ fontWeight: 500 }}>
                                                        <td>Total</td>
                                                        <td>{serviceAnalysisData.length}</td>
                                                        <td>{totalTimesSold}</td>
                                                        <td>₹ {formatSalary(totalTotalPayment.toFixed(2))}</td>
                                                        <td>₹ {formatSalary(totalAdvancePayment.toFixed(2))}</td>
                                                        <td>₹ {formatSalary(totalRemainingPayment.toFixed(2))}</td>
                                                        <td>₹ {formatSalary(totalAverageSellingPrice.toFixed(2))}</td>
                                                    </tr> */}
                                                </tfoot>
                                            </>
                                        ) : (
                                            <tbody>
                                                <tr>
                                                    <td colSpan="5" className="text-center"><Nodata /></td>
                                                </tr>
                                            </tbody>
                                        )}

                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            }
            

            {/* Dialog box to add department */}
            <Dialog
                className='My_Mat_Dialog'
                open={showAddDepartment}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    Add Department{" "}
                    <IconButton onClick={handleCloseAddService} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className='d-flex'>
                                        <div className="mb-3 col-6">
                                            <div className="d-flex">
                                                <label className="form-label">Department Name</label>
                                                <input type="checkbox" className="ms-2 mb-2" name="selectDepartment" onChange={() => setShowDepartments(!showDepartments)} /><label className="form-label">Select Department</label>
                                            </div>
                                            {!showDepartments ? (
                                                <input
                                                    type="text"
                                                    value={departmentName}
                                                    className="form-control"
                                                    placeholder="Enter Department Name"
                                                    required
                                                    onChange={(e) => {
                                                        setDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    }}
                                                />
                                            ) : (
                                                <select
                                                    className="form-select"
                                                    value={departmentName}
                                                    onChange={(e) => {
                                                        setDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    }}
                                                >
                                                    <option value="" disabled>Select Department</option>
                                                    {departments.map((dept, index) => (
                                                        <option key={index} value={dept}>
                                                            {dept}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            {departmentErrorMessage && <p className="text-danger">{departmentErrorMessage}</p>}
                                        </div>

                                        <div className="mb-3 col-6 mx-1">
                                            <label className="form-label">Service Name</label>
                                            <input
                                                type="text"
                                                value={serviceName}
                                                className="form-control"
                                                placeholder="Enter Service Name"
                                                required
                                                onChange={(e) => {
                                                    setServiceName(e.target.value);
                                                    setServiceErrorMessage("");
                                                }}
                                            />
                                            {sericeErrorMessage && <p className="text-danger">{sericeErrorMessage}</p>}
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-12">
                                            <label className="form-label">Service Description</label>
                                            <textarea
                                                name="serviceDescription"
                                                value={serviceDescription}
                                                className="form-control"
                                                required
                                                onChange={(e) => {
                                                    setServiceDescription(e.target.value);
                                                    setDescriptionErrorMessage("");
                                                }}
                                            />
                                            {descriptionErrorMessage && <p className="text-danger">{descriptionErrorMessage}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button
                    className="btn btn-primary bdr-radius-none"
                    onClick={handleSubmit}
                    variant="contained"
                >
                    Submit
                </Button>
            </Dialog>

            {showAddServiceDetails && <AddServices close={handleCloseShowAddServiceDetails} fetchServices={fetchServices} />}
        </div>
    )
}

export default Services