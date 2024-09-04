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
import EditService from './EditService';
import EmployeeAssetDetails from '../../employeeComp/EmployeeNotificationComponents/EmployeeAssetDetails';


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
    const [showEditDepartment, setShowEditDepartment] = useState(false);

    const [showAddService, setShowAddService] = useState(false);
    const [showEditService, setShowEditService] = useState(false);

    const [showUpdationOptions, setShowUpdateOptions] = useState(false);

    const [showAddServiceDetails, setShowAddServiceDetails] = useState(false);
    const [showEditServiceDetails, setShowEditServiceDetails] = useState(false);
    const [showServiceDetails, setShowServiceDetails] = useState(false);

    const [departments, setDepartments] = useState([]);
    const [serviceDetails, setServiceDetails] = useState({});

    const [departmentName, setDepartmentName] = useState("");
    const [updatedDepartmentName, setUpdatedDepartmentName] = useState("");

    const [serviceName, setServiceName] = useState("");
    const [updatedServiceName, setUpdatedServiceName] = useState("");

    const [serviceDescription, setServiceDescription] = useState("");
    const [updatedServiceDescription, setUpdatedServiceDescription] = useState("");

    const [departmentErrorMessage, setDepartmentErrorMessage] = useState("");
    const [sericeErrorMessage, setServiceErrorMessage] = useState("");
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");

    const handleCloseAddDepartment = () => {
        setShowAddDepartment(false);
        setShowEditDepartment(false);
        setShowEditService(false);
        setDepartmentErrorMessage("");
        setServiceErrorMessage("");
        setDescriptionErrorMessage("");
        setDepartmentName("");
        setUpdatedDepartmentName("");
        setServiceName("");
        setUpdatedServiceName("");
        setServiceDescription("");
        setUpdatedServiceDescription("");
    };

    const handleCloseAddService = () => {
        setShowAddService(false);
        setShowEditService(false);
        setShowEditDepartment(false);
        setDepartmentErrorMessage("");
        setServiceErrorMessage("");
        setDescriptionErrorMessage("");
        setDepartmentName("");
        setUpdatedDepartmentName("");
        setServiceName("");
        setUpdatedServiceName("");
        setServiceDescription("");
        setUpdatedServiceDescription("");
    };

    const handleCloseUpdateOptions = () => {
        setShowUpdateOptions(false);
    };

    const handleCloseShowAddServiceDetails = () => {
        setShowAddServiceDetails(false);
        setDepartmentName("");
        setServiceName("");
        setServiceDescription("");
    };

    const handleCloseShowEditServiceDetails = () => {
        setShowEditServiceDetails(false);
        setDepartmentName("");
        setUpdatedDepartmentName("");
        setServiceName("");
        setUpdatedServiceName("");
        setServiceDescription("");
        setUpdatedServiceDescription("");
        setShowEditDepartment(false);
        setShowEditService(false);
    };

    const handleCloseShowServiceDetails = () => {
        setShowServiceDetails(false);
        setDepartmentName("");
        setServiceName("");
        setServiceDescription("");
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

            // Validate department name
            if ((showAddDepartment || showAddService) && departmentName.trim().length === 0) {
                showAddDepartment ? setDepartmentErrorMessage("Please enter department name") : setDepartmentErrorMessage("Please select department name");
                hasError = true;
            } else {
                setDepartmentErrorMessage("");
            }

            // Validate service name and description only if adding a service
            if (showAddService && serviceName.trim().length === 0) {
                setServiceErrorMessage("Please enter service name");
                hasError = true;
            } else {
                setServiceErrorMessage("");
            }

            if (showAddService && serviceDescription.trim().length === 0) {
                setDescriptionErrorMessage("Please enter service description");
                hasError = true;
            } else {
                setDescriptionErrorMessage("");
            }

            // If any errors were found, do not proceed
            if (hasError) return;

            const payload = {
                departmentName: departmentName,
                serviceName: showAddService ? serviceName : "",  // Set empty if only adding department
                serviceDescription: showAddService ? serviceDescription : "" // Set empty if only adding department
            };

            const res = await axios.post(`${secretKey}/department/addDepartment`, payload);
            // console.log("Department successfully created :", res.data.data);

            if (showAddDepartment) {
                Swal.fire("success", "Department Successfully Created", "success");
            } else {
                Swal.fire("success", "Service Successfully Created", "success");
            }

            setShowAddDepartment(false);
            setShowAddService(false);
            setDepartmentName("");
            setServiceName("");
            setServiceDescription("");
            fetchServices();
        } catch (error) {
            if (showAddDepartment) {
                Swal.fire("error", "Error creating department", "error");
            } else {
                Swal.fire("error", "Error creating service", "error");
            }
            console.log("Error creating department:", error);
        }
    };

    const handleUpdateDepartment = async () => {
        // console.log("Updating department");
        try {
            const res = await axios.put(`${secretKey}/department/updateDepartmentInDepartmentModel/${departmentName}`, {
                updatedDepartmentName: updatedDepartmentName
            });
            const res2 = await axios.put(`${secretKey}/services/updateDepartmentInServiceModel/${departmentName}`, {
                updatedDepartmentName: updatedDepartmentName
            });
            // console.log("Department updated in department model :", res.data);
            // console.log("Department updated in service model :", res2.data);
            Swal.fire("success", "Department Successfully Updated", "success");
            setUpdatedDepartmentName("");
            setDepartmentName("");
            fetchServices();
            setShowAddDepartment(false);
            setShowEditDepartment(false);
            setShowEditService(false);
        } catch (error) {
            console.log("Error updating department :", error);
            Swal.fire("error", "Error updating department", "error");
        }
    };

    const handleUpdateService = async () => {
        // console.log("Updating service");
        try {
            const res = await axios.put(`${secretKey}/department/updateServiceInDepartmentModel/${serviceName}`, {
                updatedDepartmentName: updatedDepartmentName,
                updatedServiceName: updatedServiceName,
                updatedServiceDescription: updatedServiceDescription
            });
            const res2 = await axios.put(`${secretKey}/services/updateServiceInServiceModel/${serviceName}`, {
                updatedDepartmentName: updatedDepartmentName,
                updatedServiceName: updatedServiceName
            });
            // console.log("Service updated in department model :", res.data);
            // console.log("Service updated in service model :", res2.data);
            Swal.fire("success", "Service Successfully Updated", "success");
            setUpdatedDepartmentName("");
            setDepartmentName("");
            setUpdatedServiceName("");
            setServiceName("");
            setUpdatedServiceDescription("");
            setServiceDescription("");
            fetchServices();
            setShowAddService(false);
            setShowEditService(false);
            setShowEditDepartment(false);
        } catch (error) {
            console.log("Error updating service :", error);
            Swal.fire("error", "Error updating service", "error");
        }
    };

    const handleDeleteService = async (serviceName) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You want to delete this service",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${secretKey}/department/deleteServiceFromDepartmentModel/${serviceName}`);
                    const res2 = await axios.delete(`${secretKey}/services/deleteServiceFromServiceModel/${serviceName}`);
                    // console.log("Service successfully deleted from department model :", res.data.data);
                    // console.log("Service successfully deleted from service model :", res2.data.data);
                    Swal.fire("success", "Service Successfully Deleted", "success");
                    fetchServices();
                } catch (error) {
                    console.log("Error deleting service:", error);
                    Swal.fire("error", "Error deleting service", "error");
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire("Cancelled", "Service data is safe :)", "error");
            }
        });
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
            if (updatedHideService) {
                Swal.fire("success", "Service successfully hidden", "success");
            } else {
                Swal.fire("success", "Service successfully shown", "success");
            }

            if (updateRes.data.result) {
                // console.log("Service hide status updated successfully");
                // Optionally, you can update the local state to reflect changes in the UI
            }
        } catch (error) {
            console.error("Error updating hideService status:", error);
            Swal.fire("Error", "Error hiding services", "error");
        }
    };

    const fetchServiceDetails = async () => {
        // console.log("Service name inside fetch service details function :", serviceName);
        if (serviceName) {
            try {
                const res = await axios.get(`${secretKey}/services/fetchServiceFromServiceName/${serviceName}`);
                // console.log("Service details is :", res.data.data);
                setServiceDetails(res.data.data);
            } catch (error) {
                console.log("Error fetching service details", error);
            }
        } else {
            setServiceDetails({});
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    useEffect(() => {
        fetchServiceDetails();
    }, [serviceName]);

    useEffect(() => {
        if (showAddService) {
            fetchDepartments(); // Fetch departments only when the checkbox is checked
        }
    }, [showAddService]);

    return (
        <div>
            <Header />
            <Navbar />

            {!showAddServiceDetails && !showEditServiceDetails && !showServiceDetails &&
                <div className="page-wrapper">

                    <div className="page-header">
                        <div className="container-xl">
                            <div className='d-flex align-items-center justify-content-between'>
                                <div className="dashboard-title"  >
                                    <h2 className="m-0">
                                        Schemes and Services
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
                                                    Add Service Category
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

                                            <div className='form-group ml-1'>
                                                <button
                                                    className="btn action-btn-success"
                                                    onClick={() => setShowAddServiceDetails(true)}
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
                                                    Add Service Details
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
                                    <div id="table-default" className="table-responsive tbl-scroll">
                                        <table className="table-vcenter tbl-collps table-nowrap admin-dash-tbl w-100"  >

                                            <thead className="admin-dash-tbl-thead">
                                                <tr>
                                                    <th>Sr. No</th>
                                                    <th>Service Category</th>
                                                    <th>Services Name</th>
                                                    <th>Hide Service</th>
                                                    {/* <th>Add Service Details</th> */}
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
                                                                <td>{service.serviceName || "Need to Add Service"}</td>
                                                                <td>
                                                                    <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                                                        <AntSwitch
                                                                            checked={service.hideService}
                                                                            onChange={(e) => handleToggleChange(service.serviceName)}
                                                                            inputProps={{ 'aria-label': 'ant design' }} />
                                                                    </Stack>
                                                                </td>
                                                                {/* <td>
                                                                    <button className='btn btn-sm btnaction-btn action-btn-primary' onClick={() => {
                                                                        setShowAddServiceDetails(true);
                                                                        setID(service._id);
                                                                        setDepartmentName(service.departmentName);
                                                                        setServiceName(service.serviceName);
                                                                        }}>
                                                                        Add
                                                                    </button>
                                                                </td> */}
                                                                <td>
                                                                    <div className="d-flex justify-content-center align-items-center">
                                                                        <div className="icons-btn">
                                                                            <IconButton onClick={() => {
                                                                                setShowServiceDetails(true);
                                                                                setDepartmentName(service.departmentName);
                                                                                setServiceName(service.serviceName);
                                                                            }}>
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
                                                                            <IconButton onClick={() => {
                                                                                setShowUpdateOptions(true);
                                                                                setShowEditDepartment(true);
                                                                                setShowEditService(true);
                                                                                setDepartmentName(service.departmentName);
                                                                                setUpdatedDepartmentName(service.departmentName);
                                                                                setServiceName(service.serviceName);
                                                                                setUpdatedServiceName(service.serviceName);
                                                                                setServiceDescription(service.serviceDescription);
                                                                                setUpdatedServiceDescription(service.serviceDescription);
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

                                                                        <div className="icons-btn">
                                                                            <IconButton onClick={() => handleDeleteService(service.serviceName)}>
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
                    {showEditDepartment ? "Edit Service Category" : "Add Service Category"}
                    <IconButton onClick={handleCloseAddDepartment} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className='d-flex'>
                                        <div className="mb-3 col-12">
                                            <div className="d-flex">
                                                <label className="form-label">Service Category</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={showEditDepartment ? updatedDepartmentName : departmentName}
                                                className="form-control"
                                                placeholder="Enter Service Category"
                                                required
                                                onChange={(e) => {
                                                    if (showEditDepartment) {
                                                        setUpdatedDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    } else {
                                                        setDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    }
                                                }}
                                            />
                                            {departmentErrorMessage && <p className="text-danger">{departmentErrorMessage}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button
                    className="btn btn-primary bdr-radius-none"
                    onClick={showEditDepartment ? handleUpdateDepartment : handleSubmit}
                    variant="contained"
                >
                    {showEditDepartment ? "Update" : "Submit"}
                </Button>
            </Dialog>

            {/* Dialog box to add service */}
            <Dialog
                className='My_Mat_Dialog'
                open={showAddService}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {showEditService ? "Edit Service" : "Add Service"}
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
                                                <label className="form-label">Service Category</label>
                                            </div>
                                            <select
                                                className="form-select"
                                                value={showEditService ? updatedDepartmentName : departmentName}
                                                onChange={(e) => {
                                                    if (showEditService) {
                                                        setUpdatedDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    } else {
                                                        setDepartmentName(e.target.value);
                                                        setDepartmentErrorMessage("");
                                                    }
                                                }}
                                            >
                                                <option value="" disabled>Select Service Category</option>
                                                {departments.map((dept, index) => (
                                                    <option key={index} value={dept}>
                                                        {dept}
                                                    </option>
                                                ))}
                                            </select>
                                            {departmentErrorMessage && <p className="text-danger">{departmentErrorMessage}</p>}
                                        </div>

                                        <div className="mb-3 col-6 mx-1">
                                            <label className="form-label">Service Name</label>
                                            <input
                                                type="text"
                                                value={showEditService ? updatedServiceName : serviceName}
                                                className="form-control"
                                                placeholder="Enter Service Name"
                                                required
                                                onChange={(e) => {
                                                    if (showEditService) {
                                                        setUpdatedServiceName(e.target.value);
                                                        setServiceErrorMessage("");
                                                    } else {
                                                        setServiceName(e.target.value);
                                                        setServiceErrorMessage("");
                                                    }
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
                                                value={showEditService ? updatedServiceDescription : serviceDescription}
                                                className="form-control"
                                                required
                                                onChange={(e) => {
                                                    if (showEditService) {
                                                        setUpdatedServiceDescription(e.target.value);
                                                        setDescriptionErrorMessage("");
                                                    } else {
                                                        setServiceDescription(e.target.value);
                                                        setDescriptionErrorMessage("");
                                                    }
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
                    onClick={showEditDepartment ? handleUpdateService : handleSubmit}
                    variant="contained"
                >
                    {showEditService ? "Update" : "Submit"}
                </Button>
            </Dialog>

            {/* Dialog box to show edit options */}
            <Dialog
                className='My_Mat_Dialog'
                open={showUpdationOptions}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    What do you want to edit?
                    <IconButton onClick={handleCloseUpdateOptions} style={{ float: "right" }}>
                        <CloseIcon color="primary" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row">
                                    <div className='d-flex'>
                                        <div className="mb-3 col-4">
                                            <div className="d-flex">
                                                <div>
                                                    <button
                                                        className="btn action-btn-primary"
                                                        onClick={() => {
                                                            setShowAddDepartment(true);
                                                            setShowEditDepartment(true);
                                                            setShowUpdateOptions(false);
                                                        }}
                                                    >
                                                        <IconButton>
                                                            <ModeEditIcon
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "orange",
                                                                    width: "14px",
                                                                    height: "14px",
                                                                    marginTop: "2px"
                                                                }}
                                                            />
                                                        </IconButton>
                                                        Edit Service Category
                                                    </button>
                                                </div>

                                                <div className="ms-3">
                                                    <button
                                                        className="btn action-btn-alert"
                                                        onClick={() => {
                                                            setShowAddService(true);
                                                            setShowEditService(true);
                                                            setShowUpdateOptions(false);
                                                        }}
                                                    >
                                                        <IconButton>
                                                            <ModeEditIcon
                                                                style={{
                                                                    cursor: "pointer",
                                                                    color: "blue",
                                                                    width: "14px",
                                                                    height: "14px",
                                                                    marginTop: "2px"
                                                                }}
                                                            />
                                                        </IconButton>
                                                        Edit Service
                                                    </button>
                                                </div>

                                                <div className="ms-3">
                                                    <div className="d-flex">
                                                        <button
                                                            className="btn action-btn-success"
                                                            onClick={() => {
                                                                if (!serviceDetails || !serviceName) {
                                                                    Swal.fire("Info", "Please add service details before editing", "info");
                                                                    setShowUpdateOptions(false);
                                                                    setShowAddDepartment(false);
                                                                    setShowEditDepartment(false);
                                                                    setShowAddService(false);
                                                                    setShowEditService(false);
                                                                    setDepartmentErrorMessage("");
                                                                    setServiceErrorMessage("");
                                                                    setDescriptionErrorMessage("");
                                                                    setDepartmentName("");
                                                                    setUpdatedDepartmentName("");
                                                                    setServiceName("");
                                                                    setUpdatedServiceName("");
                                                                    setServiceDescription("");
                                                                    setUpdatedServiceDescription("");
                                                                } else {
                                                                    setShowEditServiceDetails(true);
                                                                    setShowUpdateOptions(false);
                                                                }
                                                            }}
                                                        >
                                                            <IconButton>
                                                                <ModeEditIcon
                                                                    style={{
                                                                        cursor: "pointer",
                                                                        color: "green",
                                                                        width: "14px",
                                                                        height: "14px",
                                                                        marginTop: "2px"
                                                                    }}
                                                                />
                                                            </IconButton>
                                                            Edit Service Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {showAddServiceDetails && <AddServices close={handleCloseShowAddServiceDetails} fetchServices={fetchServices} />}
            {showEditServiceDetails && <EditService close={handleCloseShowEditServiceDetails} serviceName={serviceName} />}
            {showServiceDetails && <EmployeeAssetDetails back={handleCloseShowServiceDetails} serviceName={serviceName} departmentName={departmentName} />}
        </div>
    )
}

export default Services