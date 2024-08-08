import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Navbar from "./Navbar";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import LoginAdmin from "./LoginAdmin";
import "../dist/css/tabler.min.css?1684106062";
import "../dist/css/tabler-flags.min.css?1684106062";
import "../dist/css/tabler-payments.min.css?1684106062";
import "../dist/css/tabler-vendors.min.css?1684106062";
import "../dist/css/demo.min.css?1684106062";
import { IconTrash } from "@tabler/icons-react";
import { MdDelete } from "react-icons/md";
import { MdOutlineAddCircle } from "react-icons/md";
import "../assets/styles.css";
import "../assets/table.css";
import Swal from "sweetalert2";
import io from "socket.io-client";
// import EmployeeTable from "./EmployeeTable";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import Modal from "react-modal";
import { IconEye } from "@tabler/icons-react";
import Nodata from "../components/Nodata";
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';




function Employees({ onEyeButtonClick }) {
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyDdata, setCompanyDdata] = useState([]);
  const [nametodelete, setnametodelete] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState([]);
  const [cdata, setCData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedDataId, setSelectedDataId] = useState("2024-01-03");
  const [bdeFields, setBdeFields] = useState([]);
  const [ename, setEname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [jdate, setJdate] = useState(null);
  // const [designation, setDesignation] = useState("");
  const [branchOffice, setBranchOffice] = useState("");
  const [reportingManager, setReportingManager] = useState("");
  const [nowFetched, setNowFetched] = useState(false);
  const [otherdesignation, setotherDesignation] = useState("");
  const [companyData, setCompanyData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isDepartmentSelected, setIsDepartmentSelected] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!department || department === "Select Department") newErrors.department = "Department is required";
    if (!newDesignation || newDesignation === "Select Designation") newErrors.newDesignation = "Designation is required";
    if (!branchOffice) newErrors.branchOffice = "Branch office is required";
    if (!number) newErrors.number = "Phone number is required";
    if (!jdate) newErrors.jdate = "Joining date is required";
    // Add more validations as needed
    return newErrors;
  };

  const departmentDesignations = {
    "Start-Up": [
      "Admin Head",
      "Accountant",
      "Data Analyst",
      "Content Writer",
      "Graphic Designer",
      "Company Secretary",
      "Admin Head",
      "Admin Executive",
    ],
    HR: ["HR Manager", "HR Recruiter"],
    Operation: [
      "Finance Analyst",
      "Content Writer",
      "Relationship Manager",
      "Graphic Designer",
      "Research Analyst",
    ],
    IT: [
      "Web Developer",
      "Software Developer",
      "SEO Executive",
      "Graphic Designer",
      "Content Writer",
      "App Developer",
      "Digital Marketing Executive",
      "Social Media Executive",
    ],
    Sales: [
      "Business Development Executive",
      "Business Development Manager",
      // "Sales Manager",
      "Team Leader",
      "Floor Manager",
    ],
    Others: ["Receptionist"],
  };

  const departmentManagers = {
    "Start-Up": [
      "Mr. Ronak Kumar",
      "Mr. Krunal Pithadia",
      "Mr. Saurav Mevada",
      "Miss. Dhruvi Gohel"
    ],
    HR: [
      "Mr. Ronak Kumar",
      "Mr. Krunal Pithadia",
      "Mr. Saurav Mevada",
      "Miss. Hiral Panchal"
    ],
    Operation: [
      "Miss. Subhi Banthiya",
      "Mr. Rahul Pancholi",
      "Mr. Ronak Kumar",
      "Mr. Nimesh Parekh"
    ],
    IT: ["Mr. Nimesh Parekh"],
    Sales: [
      "Mr. Vaibhav Acharya",
      "Mr. Vishal Gohel"
    ],
    Others: ["Miss. Hiral Panchal"],
  }

  const renderDesignationOptions = () => {
    const designations = departmentDesignations[department] || [];
    return designations.map((designation, index) => (
      <option key={index} value={designation}>
        {designation}
      </option>
    ));
  };

  const renderManagerOptions = () => {
    const managers = departmentManagers[department] || [];
    return managers.map((manager, index) => (
      <option key={index} value={manager}>
        {manager}
      </option>
    ));
  };

  const defaultObject = {
    year: "",
    month: "",
    amount: 0,
    achievedAmount: 0,
    ratio: 0,
    result: "N/A"
  }
  const [targetObjects, setTargetObjects] = useState([defaultObject]);
  const [targetCount, setTargetCount] = useState(1);


  const [open, openchange] = useState(false);

  const handleEyeButtonClick = (id) => {
    onEyeButtonClick(id);
    //console.log(id);
  };

  const updateActiveStatus = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      setData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      console.error('Error fetching employee info:', error);
    }
  };
  useEffect(() => {
    document.title = `Admin-Sahay-CRM`;
  }, []);

  useEffect(() => {
    const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
      secure: true, // Use HTTPS
      path: '/socket.io',
      reconnection: true,
      transports: ['websocket'],
    });
    socket.on("employee-entered", () => {
      console.log("One user Entered");
      setTimeout(() => {
        updateActiveStatus(); // Don't fetch instead, just change that particular active status
      }, 5000);
    });

    socket.on("user-disconnected", () => {
      updateActiveStatus(); // Same condition
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // app.get('/api/achieved-details/:ename', async (req, res) => {
  //   const { ename } = req.params;

  //   try {
  //     const adminData = await adminModel.findOne({ ename });
  //     if (!adminData) {
  //       return res.status(404).json({ error: 'Admin not found' });
  //     }

  //     const redesignedData = await RedesignedLeaformModel.find();
  //     if (!redesignedData) {
  //       return res.status(404).json({ error: 'No redesigned data found' });
  //     }

  //     const functionCalculateAchievedRevenue = (redesignedData, ename, filterBy = 'This Month') => {
  //       let achievedAmount = 0;
  //       let remainingAmount = 0;
  //       let expanse = 0;
  //       let remainingExpense = 0;
  //       let remainingMoreExpense = 0;
  //       let add_caCommision = 0;
  //       const today = new Date();

  //       redesignedData.map((mainBooking) => {
  //         let condition = false;
  //         switch (filterBy) {
  //           case 'Today':
  //             condition = (new Date(mainBooking.bookingDate).toLocaleDateString() === today.toLocaleDateString());
  //             break;
  //           case 'Last Month':
  //             condition = (new Date(mainBooking.bookingDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1)) && (new Date(mainBooking.bookingDate).getFullYear() === today.getFullYear());
  //             break;
  //           case 'This Month':
  //             condition = (new Date(mainBooking.bookingDate).getMonth() === today.getMonth()) && (new Date(mainBooking.bookingDate).getFullYear() === today.getFullYear());
  //             break;
  //           default:
  //             break;
  //         }
  //         if (condition && (mainBooking.bdeName === ename || mainBooking.bdmName === ename)) {
  //           // Your calculation logic here
  //           // ... (omitted for brevity)
  //         }
  //       });

  //       return achievedAmount + Math.round(remainingAmount) - expanse - remainingExpense - remainingMoreExpense - add_caCommision;
  //     };

  //     const achievedRevenue = functionCalculateAchievedRevenue(redesignedData, ename);

  // //  Ab yaha par jese hi achievedAmount aaye, adminModel me update kar do is month ka //data update ho jaye


  // //Update hone ke baad pura object get karake frontend pe bhej do
  //     res.json();
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // });
  const [dataToDelete, setDataToDelete] = useState([])


  const handleDeleteClick = async (itemId, nametochange, dataToDelete, filteredCompanyData) => {
    // Open the confirm delete modal
    // console.log(nametochange)
    // console.log("filtered" , filteredCompanyData)
    setCompanyDdata(filteredCompanyData);
    setItemIdToDelete(itemId);

    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to remove ${nametochange}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const saveResponse = await axios.put(`${secretKey}/employee/savedeletedemployee`, {
            dataToDelete,
          });
          const deleteResponse = await axios.delete(`${secretKey}/employee/einfo/${itemId}`);

          const response3 = await axios.put(`${secretKey}/bookings/updateDeletedBdmStatus/${nametochange}`)

          // Refresh the data after successful deletion
          handledeletefromcompany(filteredCompanyData);
          fetchData();

          Swal.fire({
            title: "Employee Removed!",
            text: "You have successfully removed the employee!",
            icon: "success",
          });
        } catch (error) {
          console.error("Error deleting data:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Please try again later!",
          });
        }
      } else {
        Swal.fire({
          title: 'Cancelled',
          text: 'Employee is safe!',
          icon: 'info',
        });
      }
    });
  };


  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const handledeletefromcompany = async (filteredCompanyData) => {
    if (filteredCompanyData && filteredCompanyData.length !== 0) {

      try {
        // Update companyData in the second database
        await Promise.all(
          filteredCompanyData.map(async (item) => {
            if (item.Status === 'Matured') {
              await axios.put(`${secretKey}/company-data/updateCompanyForDeletedEmployeeWithMaturedStatus/${item._id}`)

            } else {
              await axios.delete(`${secretKey}/company-data/newcompanynamedelete/${item._id}`);
            }
          })
        );
        Swal.fire({
          title: "Data Deleted!",
          text: "You have successfully Deleted the data!",
          icon: "success",
        });

        //console.log("All ename updates completed successfully");
      } catch (error) {
        console.error("Error updating enames:", error.message);
        Swal.fire("Error deleting the employee");
        // Handle the error as needed
      }
    }
  };

  // const handleCancelDelete = () => {
  //   // Cancel the delete operation and close the modal
  //   setIsModalOpen(false);
  // };
  const [bdmWork, setBdmWork] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedFormat, setSortedFormat] = useState({
    ename: "ascending",
    jdate: "ascending",
    addedOn: "ascending",
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/employee/einfo`);
      // console.log("Fetched employees are :", response.data);
      // Set the retrieved data in the state

      setFilteredData(response.data);
      setData(response.data);
      setEmail("");
      setEname("");
      setNumber(0);
      setPassword("");
      setJdate(null);
      setNewDesignation("");
      setBranchOffice("");


    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

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

  const handleUpdateClick = (id, echangename) => {

    // Set the selected data ID and set update mode to true
    setSelectedDataId(id);
    setIsUpdateMode(true);
    setCompanyData(cdata.filter((item) => item.ename === echangename));
    // Find the selected data object
    const selectedData = data.find((item) => item._id === id);


    setNowFetched(selectedData.targetDetails.length !== 0 ? true : false);
    setTargetCount(selectedData.targetDetails.length !== 0 ? selectedData.targetDetails.length : 1);
    setTargetObjects(
      selectedData.targetDetails.length !== 0
        ? selectedData.targetDetails
        : [
          {
            year: "",
            month: "",
            amount: 0,
            achievedAmount: 0,
            ratio: 0,
            result: "N/A"
          },
        ]
    );

    // Update the form data with the selected data values
    setEmail(selectedData.email);
    setFirstName((selectedData.empFullName || "").split(" ")[0] || "")
    setMiddleName((selectedData.empFullName || "").split(" ")[1] || "")
    setLastName((selectedData.empFullName || "").split(" ")[2] || "")
    setEname(selectedData.ename);
    setNumber(selectedData.number);
    setPassword(selectedData.password);
    setBdmWork(selectedData.bdmWork);
    setDepartment(selectedData.department);
    setNewDesignation(selectedData.newDesignation);
    setBranchOffice(selectedData.branchOffice);
    setReportingManager(selectedData.reportingManager);

    const dateObject = new Date(selectedData.jdate);
    const day = dateObject.getDate().toString().padStart(2, "0"); // Ensure two-digit day
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = dateObject.getFullYear();
    const formattedDateString = `${year}-${month}-${day}`;

    // setJdate('2004-04-04');
    setJdate(formattedDateString);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${secretKey}/employee/permanentDelete/${id}`);
      // Refresh the data after successful deletion
      fetchData();
      Swal.fire({
        title: "Employee Removed!",
        text: "You have successfully removed the employee!",
        icon: "success",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please try again later!",
      });
    }
  };


  useEffect(() => {
    // Fetch data from the Node.js server
    setFilteredData(data);
    // Call the fetchData function
    fetchData();
    fetchCData();
  }, []);

  function formatDateWP(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isSameDay(date, today)) {
      // If the date is today, format as "Last seen today on HH:MM AM/PM"
      return `Last seen today on ${formatTime(date)}`;
    } else if (isSameDay(date, yesterday)) {
      // If the date is yesterday, format as "Last seen yesterday on HH:MM AM/PM"
      return `Last seen yesterday on ${formatTime(date)}`;
    } else {
      // Otherwise, format as "Last seen on DD/MM/YYYY"
      return `Last seen on ${formatDateTime(date)}`;
    }
  }

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  function formatTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  }

  function formatDateTime(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  const fetchCData = async () => {
    try {
      const response = await axios.get(`${secretKey}/company-data/leads`);

      setCData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };



  const handleSubmit = async (e) => {

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Submit form data
      setErrors({});
      // Add your form submission logic here
      // const referenceId = uuidv4();
      const AddedOn = new Date().toLocaleDateString();
      let designation;
      if (newDesignation === "Business Development Executive" || newDesignation === "Business Development Manager") {
        designation = "Sales Executive";
      } else if (newDesignation === "Floor Manager") {
        designation = "Sales Manager";
      } else if (newDesignation === "Data Analyst") {
        designation = "Data Manager";
      } else if (newDesignation === "Admin Head") {
        designation = "RM-Certification";
      } else if (newDesignation === "HR Manager") {
        designation = "HR";
      } else {
        designation = newDesignation;
      }

      try {
        let dataToSend = {
          email: email,
          number: number,
          ename: `${firstName} ${lastName}`,
          empFullName: `${firstName} ${middleName} ${lastName}`,
          department: department,
          oldDesignation: designation || newDesignation,
          newDesignation: newDesignation,
          branchOffice: branchOffice,
          reportingManager: reportingManager,
          password: password,
          jdate: jdate,
          AddedOn: AddedOn,
          targetDetails: targetObjects,
          // bdmWork,
        };

        let dataToSendUpdated = {
          email: email,
          number: number,
          ename: `${firstName} ${lastName}`,
          empFullName: `${firstName} ${middleName} ${lastName}`,
          department: department,
          designation: designation,
          newDesignation: newDesignation,
          branchOffice: branchOffice,
          reportingManager: reportingManager,
          password: password,
          jdate: jdate,
          AddedOn: AddedOn,
          targetDetails: targetObjects,
          // bdmWork,
        };

        // Set designation based on otherDesignation
        // if (otherdesignation !== "") {
        //   dataToSend.designation = otherdesignation;
        // } else {
        //   dataToSend.designation = designation;
        // }

        if (newDesignation === "Floor Manager" || newDesignation === "Business Development Manager") {
          dataToSend.bdmWork = true;
          dataToSendUpdated.bdmWork = true;
        } else {
          dataToSend.bdmWork = false;
          dataToSendUpdated.bdmWork = false;
        }
        // console.log(isUpdateMode, "updateMode")

        if (isUpdateMode) {
          if (dataToSend.ename === "") {
            Swal.fire("Invalid Details", "Please Enter Details Properly", "warning");
            return true;
          }
          const response = await axios.put(
            `${secretKey}/employee/einfo/${selectedDataId}`,
            dataToSendUpdated
          );
          // console.log("Updated employee is :", dataToSendUpdated);

          Swal.fire({
            title: "Data Updated Succesfully!",
            text: "You have successfully updated the name!",
            icon: "success",
          });

          if (companyData && companyData.length !== 0) {
            // Assuming ename is part of dataToSend
            const { ename } = dataToSend;
            try {
              // Update companyData in the second database
              await Promise.all(
                companyData.map(async (item) => {
                  await axios.put(`${secretKey}/company-data/newcompanyname/${item._id}`, {
                    ename,
                  });
                  //console.log(`Updated ename for ${item._id}`);
                })
              );
            } catch (error) {
              console.error("Error updating enames:", error.message);
              // Handle the error as needed
            }
          }
        } else {
          const response = await axios.post(`${secretKey}/employee/einfo`, dataToSend);
          // Adds data in performance report:
          console.log("Created employee is :", response.data);

          Swal.fire({
            title: "Data Added!",
            text: "You have successfully added the data!",
            icon: "success",
          });
        }
        //console.log("datatosend", dataToSend);

        setFirstName("");
        setMiddleName("");
        setLastName("");
        setEname("");
        setEmail("");
        setNumber(0);
        setPassword("");
        setDepartment("");
        setNewDesignation("");
        setBranchOffice("");
        setReportingManager("");
        setotherDesignation("");
        setJdate(null);
        setIsUpdateMode(false);
        setTargetCount(1);
        setTargetObjects([defaultObject])
        fetchData();
        closepopup();
        //console.log("Data sent successfully");
      } catch {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        console.error("Internal server error");
      }
    }
  };
  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setEname("");
    setNumber("");
    setPassword("");
    setBdmWork("");
    setDepartment("");
    setNewDesignation("");
    setBranchOffice("");
    setReportingManager("");
    setJdate("");
    setTargetCount(1);
    setTargetObjects([{ year: "", month: "", amount: 0, achievedAmount: 0, ratio: 0, result: "N/A" }]);
    setShowPassword(false);
    setNowFetched(false);
    setIsDepartmentSelected(false);
    setotherDesignation("");
  };

  const functionopenpopup = () => {
    openchange(true);
  };
  const closepopup = () => {
    openchange(false);
  };
  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  //console.log(new Date("06/02/2024").toLocaleDateString('en-GB'));
  const sortDataByName = () => {
    if (sortedFormat.ename === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        ename: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        a.ename.localeCompare(b.ename)
      );
      setFilteredData(sortedData);
    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        ename: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        b.ename.localeCompare(a.ename)
      );
      setFilteredData(sortedData);
    }
  };
  const adminName = localStorage.getItem("adminName")
  const sortDateByAddedOn = () => {
    if (sortedFormat.addedOn === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        addedOn: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        a.AddedOn.localeCompare(b.AddedOn)
      );
      setFilteredData(sortedData);
    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        addedOn: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort((a, b) =>
        b.AddedOn.localeCompare(a.AddedOn)
      );
      setFilteredData(sortedData);
    }
  };
  const sortDataByJoiningDate = () => {
    if (sortedFormat.jdate === "ascending") {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        jdate: "descending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort(
        (a, b) => new Date(a.jdate) - new Date(b.jdate)
      );
      setFilteredData(sortedData);
    } else {
      setSortedFormat({
        ...sortedFormat, // Spread the existing properties
        jdate: "ascending", // Update the jdate property
      });

      const sortedData = [...filteredData].sort(
        (a, b) => new Date(b.jdate) - new Date(a.jdate)
      );
      setFilteredData(sortedData);
    }
  };

  const [teamData, setTeamData] = useState([]);

  const fetchTeamData = async () => {
    const response = await axios.get(`${secretKey}/teams/teaminfo`);

    //console.log(response.data);
    setTeamData(response.data);
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  // -------------------------------------------------    ADD Target Section   --------------------------------------------------

  const handleAddTarget = () => {
    const totalTargets = targetObjects;
    totalTargets.push(defaultObject);
    setTargetCount(targetCount + 1);
    setTargetObjects(totalTargets);
  };

  const handleRemoveTarget = () => {
    const totalTargets = targetObjects;
    totalTargets.pop();
    setTargetCount(targetCount - 1);
    setTargetObjects(totalTargets);
  };

  //console.log("target objects:", targetObjects)

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

  const handleChecked = async (employeeId, bdmWork, item) => {
    // console.log("BDM Condition is :", bdmWork);
    // console.log("Data to be updated :", item);
    const updatedDesignation = bdmWork ? "Business Development Executive" : "Business Development Manager";

    const dataToUpdate = {
      ...item,
      bdmWork: !bdmWork,
      newDesignation: updatedDesignation
    };

    if (bdmWork === true || bdmWork === false) {
      try {
        const response = await axios.put(`${secretKey}/employee/einfo/${employeeId}`, dataToUpdate);
        // console.log("Updated bdm status is :", response.data);
        fetchData();
      } catch (error) {
        console.log("Errro updating bdm status :", error);
      }
    }

    if (!bdmWork) {
      try {
        const response = await axios.post(`${secretKey}/employee/post-bdmwork-request/${employeeId}`, {
          bdmWork: true
        });

        fetchData();

        //console.log(response.data)
        setTimeout(() => {
          Swal.fire('BDM Work Assigned!', '', 'success');

        }, 500);

      } catch (error) {
        console.log("error message", error.message);
        // Show error message
        Swal.fire('Error', 'An error occurred while assigning BDM work.', 'error');
      }
    } else {
      try {
        const response = await axios.post(`${secretKey}/employee/post-bdmwork-revoke/${employeeId}`, {
          bdmWork: false
        });
        fetchData(); // Assuming this function fetches updated employee details
        setTimeout(() => {
          Swal.fire('BDM Work Revoked!', '', 'success');
        }, 500);

      } catch (error) {
        console.error("Error revoking BDM work:", error);
        // Show error message
        Swal.fire('Error', 'An error occurred while revoking BDM work.', 'error');
      }
    }
  };

  return (
    <div>
      {/* <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            width: "fit-content",
            height: "fit-content",
            margin: "auto",
            textAlign: "center",
          },
        }}>
        <div className="modal-header">
          <h3 style={{ fontSize: "20px" }} className="modal-title">
            Confirm Delete?
          </h3>
        </div>

        <button
          className="btn btn-primary ms-auto"
          onClick={handleConfirmDelete}
        >
          Yes, Delete
        </button>
        <button
          className="btn btn-link link-secondary"
          onClick={handleCancelDelete}
        >
          Cancel
        </button>
      </Modal> */}
      {/* <Header />
      <Navbar number={1} /> */}
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

            {/* <!-- Page title actions --> */}
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button
                  className="btn btn-primary d-none d-sm-inline-block"
                  onClick={() => {
                    functionopenpopup();
                    resetForm();
                    setIsUpdateMode(false)
                  }}
                >
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
                  Add Employees
                </button>
                <a
                  href="#"
                  className="btn btn-primary d-sm-none btn-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#modal-report"
                  aria-label="Create new report"
                >
                  {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                </a>
              </div>
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
                        onClick={sortDataByName}
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
                        onClick={sortDataByJoiningDate}
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
                    {(adminName === "Nimesh" || adminName === "nisarg" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan") && <> <th>
                      <button
                        onClick={sortDateByAddedOn}
                        className="table-sort"
                        data-sort="sort-date"
                      >
                        Added on
                      </button>
                    </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Status
                        </button>
                      </th>
                      {/* <th>Team Name</th> */}
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
                      </th> </>}
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
                        <td>{item.newDesignation === "Business Development Executive" && "BDE" || item.newDesignation === "Business Development Manager" && "BDM" || item.newDesignation || ""}</td>
                        <td>{item.branchOffice}</td>
                        {(adminName === "Nimesh" || adminName === "nisarg" || adminName === "Ronak Kumar" || adminName === "Aakash" || adminName === "shivangi" || adminName === "Karan")
                          &&

                          <>
                            <td>
                              {formatDate(item.AddedOn) === "Invalid Date"
                                ? "06/02/2024"
                                : formatDateFinal(item.AddedOn)}
                            </td>
                            {item.designation === "Sales Executive" && <td>
                              {(item.Active && item.Active.includes("GMT")) ? (
                                <div>
                                  <span
                                    style={{ color: "red", marginRight: "5px" }}
                                  >
                                    ●
                                  </span>
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "rgb(170 144 144)",
                                    }}
                                  >
                                    {formatDateWP(item.Active)}
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <span
                                    style={{ color: "green", marginRight: "5px" }}
                                  >
                                    ●
                                  </span>
                                  <span
                                    style={{ fontWeight: "bold", color: "green" }}
                                  >
                                    Online
                                  </span>
                                </div>
                              )}
                            </td>}
                            {item.designation !== "Sales Executive" && <td>
                              N/A
                            </td>}

                            <td>
                              <Stack direction="row" spacing={10} alignItems="center" justifyContent="center">
                                <AntSwitch checked={item.bdmWork} inputProps={{ 'aria-label': 'ant design' }}
                                  disabled={item.newDesignation !== "Business Development Executive" && item.newDesignation !== "Business Development Manager"}
                                  onClick={(event) => {
                                    handleChecked(item._id, item.bdmWork, item)
                                  }} />
                              </Stack>
                            </td>

                            <td>
                              <div className="d-flex justify-content-center align-items-center">
                                {<div className="icons-btn">
                                  <IconButton
                                    onClick={async () => {
                                      const dataToDelete = data.filter(obj => obj._id === item._id);
                                      setDataToDelete(dataToDelete);
                                      const filteredCompanyData = cdata.filter((obj) => obj.ename === item.ename);
                                      setCompanyDdata(filteredCompanyData);
                                      handleDeleteClick(item._id, item.ename, dataToDelete, filteredCompanyData);
                                    }}
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

                                </div>}
                                <div className="icons-btn">
                                  <IconButton
                                    onClick={() => {
                                      functionopenpopup();
                                      handleUpdateClick(item._id, item.ename);
                                    }}
                                  >
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
      <Dialog className='My_Mat_Dialog' open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Employee Info{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Employee Name</label>
                  <div className="d-flex">
                    <div className="col-4 me-1">
                      <input
                        type="text"
                        name="firstName"
                        className="form-control mt-1"
                        placeholder="First name"
                        value={firstName?.trim()}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setErrors("");
                        }}
                      />
                      {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
                    </div>
                    <div className="col-4 me-1">
                      <input
                        type="text"
                        name="middleName"
                        className="form-control mt-1"
                        placeholder="Middle name"
                        value={middleName?.trim()}
                        onChange={(e) => {
                          setMiddleName(e.target.value);
                          setErrors("");
                        }}
                      />
                      {errors.middleNameName && <p style={{ color: 'red' }}>{errors.middleName}</p>}
                    </div>
                    <div className="col-4">
                      <input
                        type="text"
                        name="lastName"
                        className="form-control mt-1"
                        placeholder="Last name"
                        value={lastName?.trim()}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setErrors("");
                        }}
                      />
                      {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    value={email}
                    type="email"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Email"
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors("");
                    }}
                  />
                  {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      className="form-control"
                      name="example-text-input"
                      placeholder="Password"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors("");
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
                  {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                </div>

                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Department</label>
                    <div >
                      <select
                        className="form-select"
                        value={department}
                        required
                        onChange={(e) => {
                          setDepartment(e.target.value);
                          setIsDepartmentSelected(e.target.value !== "Select Department");
                          // setErrors("");
                        }}
                      >
                        <option value="Select Department" selected> Select Department</option>
                        <option value="Start-Up">Start-Up</option>
                        <option value="HR">HR</option>
                        <option value="Operation">Operation</option>
                        <option value="IT">IT</option>
                        <option value="Sales">Sales</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Designation/Job Title</label>
                    <div>
                      <select className="form-select"
                        name="newDesignation"
                        id="newDesignation"
                        value={newDesignation}
                        onChange={(e) => setNewDesignation(e.target.value)}
                        disabled={!isDepartmentSelected}
                      >
                        <option value="Select Designation">Select Designation</option>
                        {renderDesignationOptions()}
                      </select>
                    </div>
                  </div>
                </div>

                {/* If the designation is others */}
                {/* {designation === "Others" && (
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
                )} */}

                <div className="row">
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Branch Office</label>
                    <div>
                      <select
                        className="form-select"
                        value={branchOffice}
                        required
                        onChange={(e) => {
                          setBranchOffice(e.target.value);
                        }}
                      >
                        <option value="" selected>Select Branch Office</option>
                        <option value="Gota">Gota</option>
                        <option value="Sindhu Bhawan">Sindhu Bhawan</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label className="form-label">Manager</label>
                    <div>
                      <select className="form-select"
                        name="reportingManager"
                        id="reportingManager"
                        value={reportingManager}
                        onChange={(e) => setReportingManager(e.target.value)}
                        disabled={!isDepartmentSelected}
                      >
                        <option value="Select Designation">Select Manager</option>
                        {renderManagerOptions()}
                      </select>
                    </div>
                  </div>
                </div>
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
                </div>
              </div>

              <label className="form-label">ADD Target</label>
              {targetObjects.map((obj, index) => (
                <div className="row">
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <div>
                        <select className="form-select"
                          value={obj.year}
                          onChange={(e) => {
                            setTargetObjects(prevState => {
                              const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                              updatedTargets[index] = { ...updatedTargets[index], year: e.target.value }; // Update the specific object at the given index
                              return updatedTargets; // Set the updated array as the new state
                            });
                          }}
                        >
                          <option value="" disabled selected>
                            Select Year
                          </option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <div>
                        <select className="form-select"
                          value={obj.month}
                          onChange={(e) => {
                            setTargetObjects(prevState => {
                              const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                              updatedTargets[index] = { ...updatedTargets[index], month: e.target.value }; // Update the specific object at the given index
                              return updatedTargets; // Set the updated array as the new state
                            });
                          }}
                        >
                          <option value="" disabled selected>
                            Select Month
                          </option>
                          <option value="January">January</option>
                          <option value="February">February</option>
                          <option value="March">March</option>
                          <option value="April">April</option>
                          <option value="May">May</option>
                          <option value="June">June</option>
                          <option value="July">July</option>
                          <option value="August">August</option>
                          <option value="September">September</option>
                          <option value="October">October</option>
                          <option value="November">November</option>
                          <option value="December">December</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <input
                        placeholder="ADD Target value"
                        type="number"
                        className="form-control"
                        value={obj.amount}
                        onChange={(e) => {
                          setTargetObjects(prevState => {
                            const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                            updatedTargets[index] = { ...updatedTargets[index], amount: e.target.value }; // Update the specific object at the given index
                            return updatedTargets; // Set the updated array as the new state
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <input
                        placeholder="ADD achieved amount"
                        type="number"
                        className="form-control"
                        value={obj.achievedAmount}
                        onChange={(e) => {
                          setTargetObjects(prevState => {
                            const updatedTargets = [...prevState]; // Create a copy of the targetCount array
                            updatedTargets[index] = { ...updatedTargets[index], achievedAmount: e.target.value }; // Update the specific object at the given index
                            return updatedTargets; // Set the updated array as the new state
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="mb-3 d-flex">
                      <IconButton style={{ float: "right" }} onClick={handleAddTarget}>
                        <MdOutlineAddCircle
                          color="primary"
                          style={{
                            float: "right",
                            width: "14px",
                            height: "14px",
                          }}

                        ></MdOutlineAddCircle>
                      </IconButton>
                      <IconButton style={{ float: "right" }} onClick={handleRemoveTarget}>
                        <MdDelete
                          color="primary"
                          style={{
                            float: "right",
                            width: "14px",
                            height: "14px",
                          }}
                        />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <Button className="btn btn-primary bdr-radius-none" onClick={handleSubmit} variant="contained">
          Submit
        </Button>
      </Dialog>
    </div>
  );
}

export default Employees;
