import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Header from "./Header";
import { useLocation, useParams } from "react-router-dom";
import { IconBoxPadding, IconChevronLeft, IconEye } from "@tabler/icons-react";
import PageviewIcon from "@mui/icons-material/Pageview";
import { IconChevronRight } from "@tabler/icons-react";
import { IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { options } from "../components/Options";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { Link } from "react-router-dom";
import Select from "react-select";
import "../../src/assets/styles.css";
// import "./styles/table.css";
import { Drawer } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import Swal from "sweetalert2";
import LoginDetails from "../components/LoginDetails";
import Nodata from "../components/Nodata";
import EditForm from "../components/EditForm";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FilterListIcon from "@mui/icons-material/FilterList";
import { HiOutlineEye } from "react-icons/hi";
import { RiEditCircleFill } from "react-icons/ri";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { MdOutlineEditOff } from "react-icons/md";
import { HiChevronDoubleLeft } from "react-icons/hi";
import { HiChevronDoubleRight } from "react-icons/hi";
import { TbChevronLeftPipe } from "react-icons/tb";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import ScaleLoader from "react-spinners/ScaleLoader";
import ClipLoader from "react-spinners/ClipLoader";
import LeadFormPreview from "./LeadFormPreview";
import EditableLeadform from "./EditableLeadform";
import AddLeadForm from "./AddLeadForm";
import { RiInformationLine } from "react-icons/ri";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
//import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { AiOutlineTeam } from "react-icons/ai";
import { GoPerson } from "react-icons/go";
import { MdOutlinePersonPin } from "react-icons/md";
//import Typography from '@mui/material/Typography';
//import Box from '@mui/material/Box';

const secretKey = process.env.REACT_APP_SECRET_KEY;
const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
function EmployeeParticular() {
  const { id } = useParams();
  const [openAssign, openchangeAssign] = useState(false);
  const [openAnchor, setOpenAnchor] = useState(false);
  const [openRemarks, openchangeRemarks] = useState(false);
  const [openlocation, openchangelocation] = useState(false);
  const [projectingCompany, setProjectingCompany] = useState("");
  const [AddForm, setAddForm] = useState(false);
  const [EditForm, setEditForm] = useState(false)
  const [companyName, setCompanyName] = useState("");
  const [maturedID, setMaturedID] = useState("");
  const [currentForm, setCurrentForm] = useState(null);
  const [openProjection, setOpenProjection] = useState(false);
  const [currentProjection, setCurrentProjection] = useState({
    companyName: "",
    ename: "",
    offeredPrize: 0,
    offeredServices: [],
    lastFollowUpdate: "",
    estPaymentDate: "",
    date: "",
    time: "",
  });
  const [projectionData, setProjectionData] = useState([]);
  const [loginDetails, setLoginDetails] = useState([]);
  const [nowToFetch, setNowToFetch] = useState(false);
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dataStatus, setdataStatus] = useState("All");
  const [moreEmpData, setmoreEmpData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 500;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [visibilityOthernew, setVisibilityOthernew] = useState("none");
  const [subFilterValue, setSubFilterValue] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [newempData, setnewEmpData] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);
  const [openCSV, openchangeCSV] = useState(false);
  const [maturedCompanyName, setMaturedCompanyName] = useState("");
  const [companies, setCompanies] = useState([]);
  const [month, setMonth] = useState(0);
  const [incoFilter, setIncoFilter] = useState("");
  const [openIncoDate, setOpenIncoDate] = useState(false);
  const [backButton, setBackButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("Leads");
  // const [updateData, setUpdateData] = useState({});
  const [eData, seteData] = useState([]);
  const [year, setYear] = useState(0);
  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  // Function to fetch employee details by id
  const fetchEmployeeDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Filter the response data to find _id values where designation is "Sales Executive"
      const salesExecutivesIds = response.data
        .filter((employee) => employee.designation === "Sales Executive")
        .map((employee) => employee._id);

      // Set eData to the array of _id values
      seteData(salesExecutivesIds);
      //console.log("kuch bhi" ,salesExecutivesIds)
      // Find the employee by id and set the name
      const selectedEmployee = response.data.find(
        (employee) => employee._id === id
      );

      //
      //
      //console.log("selectedemployee" , selectedEmployee)
      //console.log(selectedEmployee._id)

      //console.log("eData", eData[0])
      //console.log(salesExecutivesIds)

      if (
        salesExecutivesIds.length > 0 &&
        salesExecutivesIds[0] === selectedEmployee._id
      ) {
        // If it's at 0th position, set the visibility of the back button to false
        setBackButton(false); // assuming backButton is your back button element
      } else {
        // Otherwise, set the visibility to true
        setBackButton(true); // or any other appropriate display style
      }

      if (selectedEmployee) {
        setEmployeeName(selectedEmployee.ename);
        setBdmWorkOn(selectedEmployee.bdmWork);
      } else {
        // Handle the case where no employee is found with the given id
        setEmployeeName("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee details:", error.message);
    }
  };
  //console.log(currentProjection);
  const functionopenAnchor = () => {
    setTimeout(() => {
      setOpenAnchor(true);
    }, 500);
  };
  const closeAnchor = () => {
    setOpenAnchor(false);
  };
  const fetchRedesignedFormData = async () => {
    try {
      //console.log(maturedID);
      const response = await axios.get(
        `${secretKey}/redesigned-final-leadData`
      );
      const data = response.data.find((obj) => obj.company === maturedID);
      setCurrentForm(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  useEffect(() => {
    //console.log("Matured ID Changed", maturedID);
    if (maturedID) {
      fetchRedesignedFormData();
    }
  }, [maturedID]);

  useEffect(() => {
    if (employeeName) {
      const fetchCompanies = async () => {
        try {
          setCompaniesLoading(true);
          const response = await fetch(`${secretKey}/companies`);
          const data = await response.json();

          // Filter and format the data based on employeeName
          const formattedData = data.companies
            .filter(
              (entry) =>
                entry.bdeName === employeeName || entry.bdmName === employeeName
            )
            .map((entry) => ({
              "Company Name": entry.companyName,
              "Company Number": entry.contactNumber,
              "Company Email": entry.companyEmail,
              "Company Incorporation Date": entry.incoDate,
              City: "NA",
              State: "NA",
              ename: employeeName,
              AssignDate: entry.bookingDate,
              Status: "Matured",
              Remarks: "No Remarks Added",
            }));
          setCompanies(formattedData);
        } catch (error) {
          console.error("Error fetching companies:", error);
          setCompanies([]);
        } finally {
          setCompaniesLoading(false);
        }
      };

      fetchCompanies();
    }
  }, [employeeName]);


  // Function to fetch new data based on employee name
  const fetchNewData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${secretKey}/employees/${employeeName}`
      );

      // Sort the data by AssignDate property
      const sortedData = response.data.sort((a, b) => {
        // Assuming AssignDate is a string representation of a date
        return new Date(b.AssignDate) - new Date(a.AssignDate);
      });

      setmoreEmpData(sortedData);
      setEmployeeData(
        response.data.filter(
          (obj) =>
            obj.Status === "Busy" ||
            obj.Status === "Not Picked Up" ||
            obj.Status === "Untouched"
        )
      );
    } catch (error) {
      console.error("Error fetching new data:", error);
    } finally {
      setLoading(false);
    }
  };
  //console.log("employeedata", employeeData);
  useEffect(() => {
    // Fetch employee details and related data when the component mounts or id changes
    fetchEmployeeDetails();
    fetchnewData();
    fetchRemarksHistory();
    fetchProjections();
    axios
      .get(`${secretKey}/loginDetails`)
      .then((response) => {
        // Update state with fetched login details
        setLoginDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching login details:", error);
      });
  }, []);
  useEffect(() => {
    if (employeeName) {
      //console.log("Employee found");
      fetchNewData();
    } else {
      console.log("No employees found");
    }
  }, [employeeName]);


  const filteredData = employeeData.filter((company) => {
    const fieldValue = company[selectedField];

    if (selectedField === "State" && citySearch) {
      // Handle filtering by both State and City
      const stateMatches = fieldValue
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const cityMatches = company.City.toLowerCase().includes(
        citySearch.toLowerCase()
      );
      return stateMatches && cityMatches;
    } else if (selectedField === "Company Incorporation Date  ") {
      // Assuming you have the month value in a variable named `month`
      if (month == 0) {
        return fieldValue.includes(searchText);
      } else if (year == 0) {
        return fieldValue.includes(searchText);
      }
      const selectedDate = new Date(fieldValue);
      const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
      const selectedYear = selectedDate.getFullYear();

      // Use the provided month variable in the comparison
      return (
        selectedMonth.toString().includes(month) &&
        selectedYear.toString().includes(year)
      );
    } else if (selectedField === "Status" && searchText === "All") {
      // Display all data when Status is "All"
      return true;
    } else {
      // Your existing filtering logic for other fields
      if (typeof fieldValue === "string") {
        return fieldValue.toLowerCase().includes(searchText.toLowerCase());
      } else if (typeof fieldValue === "number") {
        return fieldValue.toString().includes(searchText);
      } else if (fieldValue instanceof Date) {
        // Handle date fields
        return fieldValue.includes(searchText);
      }

      return false;
    }
  });


  const handleFieldChange = (event) => {
    if (event.target.value === "Company Incorporation Date  ") {
      setSelectedField(event.target.value);
      setVisibility("block");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    } else if (event.target.value === "Status") {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("none");
      setSubFilterValue("");
      setVisibilityOthernew("block");
    } else {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("block");
      setSubFilterValue("");
      setVisibilityOthernew("none");
    }

    //console.log(selectedField);
  };

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
    setCurrentPage(0);

    // Check if the dateValue is not an empty string
    if (dateValue) {
      const dateObj = new Date(dateValue);
      const formattedDate = dateObj.toISOString().split("T")[0];
      setSearchText(formattedDate);
    } else {
      // Handle the case when the date is cleared
      setSearchText("");
    }
  };
  const currentData = filteredData.slice(startIndex, endIndex);

  // useEffect(() => {
  //   // Fetch new data based on employee name when the name changes
  //   if (employeeName !== 'Employee not found') {
  //     fetchNewData();
  //   }
  // }, [employeeName]);

  const [selectedRows, setSelectedRows] = useState([]);

  const handleCheckboxChange = (id, event) => {
    // If the id is 'all', toggle all checkboxes
    if (id === "all") {
      // If all checkboxes are already selected, clear the selection; otherwise, select all
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.length === filteredData.length
          ? []
          : filteredData.map((row) => row._id)
      );
    } else {
      // Toggle the selection status of the row with the given id
      setSelectedRows((prevSelectedRows) => {
        // If the Ctrl key is pressed
        if (event.ctrlKey) {
          //console.log("pressed");
          const selectedIndex = filteredData.findIndex((row) => row._id === id);
          const lastSelectedIndex = filteredData.findIndex((row) =>
            prevSelectedRows.includes(row._id)
          );

          // Select rows between the last selected row and the current row
          if (lastSelectedIndex !== -1 && selectedIndex !== -1) {
            const start = Math.min(selectedIndex, lastSelectedIndex);
            const end = Math.max(selectedIndex, lastSelectedIndex);
            const idsToSelect = filteredData
              .slice(start, end + 1)
              .map((row) => row._id);

            return prevSelectedRows.includes(id)
              ? prevSelectedRows.filter((rowId) => !idsToSelect.includes(rowId))
              : [...prevSelectedRows, ...idsToSelect];
          }
        }

        // Toggle the selection status of the row with the given id
        return prevSelectedRows.includes(id)
          ? prevSelectedRows.filter((rowId) => rowId !== id)
          : [...prevSelectedRows, id];
      });
    }
  };

  // const [employeeSelection, setEmployeeSelection] = useState("Select Employee");
  const [newemployeeSelection, setnewEmployeeSelection] = useState("Not Alloted");



  const fetchnewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state

      setnewEmpData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  //console.log("empData" , newempData)

  const handleFilterIncoDate = () => {
    setOpenIncoDate(!openIncoDate);
  };
  useEffect(() => {
    fetchNewData();
  }, [nowToFetch]);


  const handleSort = (sortType) => {
    switch (sortType) {
      case "oldest":
        setIncoFilter("oldest");
        setEmployeeData(
          employeeData.sort((a, b) =>
            a["Company Incorporation Date  "].localeCompare(
              b["Company Incorporation Date  "]
            )
          )
        );
        break;
      case "newest":
        setIncoFilter("newest");
        setEmployeeData(
          employeeData.sort((a, b) =>
            b["Company Incorporation Date  "].localeCompare(
              a["Company Incorporation Date  "]
            )
          )
        );
        break;
      case "none":
        setIncoFilter("none");
        setEmployeeData(
          employeeData.sort((a, b) =>
            b["AssignDate"].localeCompare(a["AssignDate"])
          )
        );
        break;
      default:
        break;
    }
  };
  const fetchProjections = async () => {
    try {
      const response = await axios.get(`${secretKey}/projection-data`);
      setProjectionData(response.data);
    } catch (error) {
      console.error("Error fetching Projection Data:", error.message);
    }
  };
  const functionOpenAssign = () => {
    openchangeAssign(true);
  };
  const closepopupAssign = () => {
    openchangeAssign(false);
  };
  const functionopenlocation = () => {
    openchangelocation(true);
  };
  const closepopuplocation = () => {
    openchangelocation(false);
  };
  const [selectedOption, setSelectedOption] = useState("direct");
  const [startRowIndex, setStartRowIndex] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };


  const functionopenprojection = (comName) => {
    setProjectingCompany(comName);
    setOpenProjection(true);
    const findOneprojection =
      projectionData.length !== 0 &&
      projectionData.find((item) => item.companyName === comName);
    if (findOneprojection) {
      setCurrentProjection({
        companyName: findOneprojection.companyName,
        ename: findOneprojection.ename,
        offeredPrize: findOneprojection.offeredPrize,
        offeredServices: findOneprojection.offeredServices,
        lastFollowUpdate: findOneprojection.lastFollowUpdate,
        estPaymentDate: findOneprojection.estPaymentDate,
        totalPayment: findOneprojection.totalPayment,
        date: "",
        time: "",
      });
    }
  };

  const closeProjection = () => {
    setOpenProjection(false);
    setProjectingCompany("");
    setCurrentProjection({
      companyName: "",
      ename: "",
      offeredPrize: "",
      offeredServices: "",
      lastFollowUpdate: "",
      date: "",
      time: "",
    });
  };

  const [companyId, setCompanyId] = useState("")

  // const handleUploadData = async (e) => {
  //   //console.log("Uploading data");

  //   const currentDate = new Date().toLocaleDateString();
  //   const currentTime = new Date().toLocaleTimeString();

  //   const csvdata = employeeData
  //     .filter((employee) => selectedRows.includes(employee._id))
  //     .map((employee) => {
  //       //setCompanyId(employee._id)
  //       //console.log("company" , companyId)
  //       if (
  //         employee.Status === "Interested" ||
  //         employee.Status === "FollowUp"
  //       ) {
  //         // If Status is "Interested" or "FollowUp", don't change Status and Remarks
  //         return { ...employee };
  //       } else {
  //         // For other Status values, update Status to "Untouched" and Remarks to "No Remarks Added"
  //         return {
  //           ...employee,
  //           Status: "Untouched",
  //           Remarks: "No Remarks Added",
  //           bdmAcceptStatus : "NotForwarded"
  //         };
  //       }
  //     });

  //     console.log("csvdata" , csvdata)

  //   // Create an array to store promises for updating CompanyModel
  //   const updatePromises = [];

  //   for (const data of csvdata) {
  //     const updatedObj = {
  //       ...data,
  //       date: currentDate,
  //       time: currentTime,
  //       ename: newemployeeSelection,
  //       companyName: data["Company Name"],
  //     };

  //     console.log("updatedObj" , updatedObj)

  //     // Add the promise for updating CompanyModel to the array
  //     updatePromises.push(
  //       axios.post(`${secretKey}/assign-new`, {
  //         newemployeeSelection,
  //         data: updatedObj,
  //       })
  //     );
  //   }

  //   try {
  //     // Wait for all update promises to resolve
  //     await Promise.all(updatePromises);
  //     //console.log("Employee data updated!");

  //     // Clear the selection
  //     setnewEmployeeSelection("Not Alloted");

  //     Swal.fire({
  //       title: "Data Sent!",
  //       text: "Data sent successfully!",
  //       icon: "success",
  //     });

  //     // Fetch updated employee details and new data
  //     fetchEmployeeDetails();
  //     fetchNewData();
  //     closepopupAssign();
  //   } catch (error) {
  //     console.error("Error updating employee data:", error);

  //     Swal.fire({
  //       title: "Error!",
  //       text: "Failed to update employee data. Please try again later.",
  //       icon: "error",
  //     });
  //   }
  // };

  const handleUploadData = async (e) => {
    //console.log("Uploading data");

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const csvdata = employeeData
      .filter((employee) => selectedRows.includes(employee._id))
      .map((employee) => {
        if (
          employee.Status === "Interested" ||
          employee.Status === "FollowUp"
        ) {
          // If Status is "Interested" or "FollowUp", don't change Status and Remarks
          return { ...employee };
        } else {
          // For other Status values, update Status to "Untouched" and Remarks to "No Remarks Added"
          return {
            ...employee,
            Status: "Untouched",
            Remarks: "No Remarks Added",
            bdmAcceptStatus: "NotForwarded",
          };
        }
      });

    console.log("csvdata", csvdata);

    // Create an array to store promises for updating CompanyModel
    const updatePromises = [];
    const deleteCompanyIds = []; // Store company IDs to be deleted

    for (const data of csvdata) {
      console.log("data", data);
      const updatedObj = {
        ...data,
        date: currentDate,
        time: currentTime,
        ename: newemployeeSelection,
        companyName: data["Company Name"],
      };

      console.log("updatedObj", updatedObj);

      // Add the promise for updating CompanyModel to the array
      updatePromises.push(
        axios.post(`${secretKey}/assign-new`, {
          newemployeeSelection,
          data: updatedObj,
        })
      );

      // Push company ID to the array for deletion if it's not null, empty, or length 0
      if (data.bdmAcceptStatus === "Accept") {
        deleteCompanyIds.push(data._id);
      }
    }

    try {
      // Wait for all update promises to resolve
      await Promise.all(updatePromises);

      // Make an API call to delete companies from Team Leads Model if deleteCompanyIds is not empty
      if (deleteCompanyIds.length > 0) {
        await axios.post(`${secretKey}/delete-companies-teamleads-assignednew`, {
          companyIds: deleteCompanyIds,
        });
      }

      // Clear the selection
      setnewEmployeeSelection("Not Alloted");

      Swal.fire({
        title: "Data Sent!",
        text: "Data sent successfully!",
        icon: "success",
      });

      // Fetch updated employee details and new data
      fetchEmployeeDetails();
      fetchNewData();
      closepopupAssign();
    } catch (error) {
      console.error("Error updating employee data:", error);

      Swal.fire({
        title: "Error!",
        text: "Failed to update employee data. Please try again later.",
        icon: "error",
      });
    }
  };










  //console.log(loginDetails);

  const handleMouseDown = (id) => {
    // Initiate drag selection
    setStartRowIndex(filteredData.findIndex((row) => row._id === id));
  };

  const handleMouseEnter = (id) => {
    // Update selected rows during drag selection
    if (startRowIndex !== null) {
      const endRowIndex = filteredData.findIndex((row) => row._id === id);
      const selectedRange = [];
      const startIndex = Math.min(startRowIndex, endRowIndex);
      const endIndex = Math.max(startRowIndex, endRowIndex);

      for (let i = startIndex; i <= endIndex; i++) {
        selectedRange.push(filteredData[i]._id);
      }

      setSelectedRows(selectedRange);

      // Scroll the window vertically when dragging beyond the visible viewport
      const windowHeight = document.documentElement.clientHeight;
      const mouseY = window.event.clientY;
      const tableHeight = document.querySelector("table").clientHeight;
      const maxVisibleRows = Math.floor(
        windowHeight / (tableHeight / filteredData.length)
      );

      if (mouseY >= windowHeight - 20 && endIndex >= maxVisibleRows) {
        window.scrollTo(0, window.scrollY + 20);
      }
    }
  };

  const handleMouseUp = () => {
    // End drag selection
    setStartRowIndex(null);
  };
  const [cid, setcid] = useState("");
  const [cstat, setCstat] = useState("");
  const [remarksHistory, setRemarksHistory] = useState([]);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const fetchRemarksHistory = async () => {
    try {
      const response = await axios.get(`${secretKey}/remarks-history`);
      setRemarksHistory(response.data.reverse());
      setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));

      //console.log(response.data);
    } catch (error) {
      console.error("Error fetching remarks history:", error);
    }
  };
  const functionopenpopupremarks = (companyID, companyStatus, ename) => {
    openchangeRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID && obj.bdeName === ename)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))

    setcid(companyID);
    setCstat(companyStatus);
  };
  const closepopupRemarks = () => {
    openchangeRemarks(false);
    setFilteredRemarks([]);
  };

  const handleChangeUrl = () => {
    const currId = id;
    //console.log(eData); // This is how the array looks like ['65bcb5ac2e8f74845bdc6211', '65bde8cf23df48d5fe3227ca']

    // Find the index of the currentId in the eData array
    const currentIndex = eData.findIndex((itemId) => itemId === currId);

    if (currentIndex !== -1) {
      // Calculate the next index in a circular manner
      const nextIndex = (currentIndex + 1) % eData.length;

      // Get the nextId from the eData array
      const nextId = eData[nextIndex];
      window.location.replace(`/admin/employees/${nextId}`);
      //setBackButton(nextId !== 0);
    } else {
      console.log("Current ID not found in eData array.");
    }
  };

  const handleDeleteBooking = async (companyId) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to delete this booking. This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(
          `${secretKey}/redesigned-delete-booking/${companyId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        Swal.fire({
          title: "Booking Deleted Successfully",
          icon: "success",
        });
        fetchNewData();
      } catch (error) {
        Swal.fire({
          title: "Error Deleting the booking!",
          icon: "error",
        });
        console.error("Error deleting booking:", error);
        // Optionally, you can show an error message to the user
      }
    } else {
      console.log("No");
    }
  };

  const handleChangeUrlPrev = () => {
    const currId = id;
    //console.log(eData); // This is how the array looks like ['65bcb5ac2e8f74845bdc6211', '65bde8cf23df48d5fe3227ca']

    // Find the index of the currentId in the eData array
    const currentIndex = eData.findIndex((itemId) => itemId === currId);

    if (currentIndex !== -1) {
      // Calculate the previous index in a circular manner
      const prevIndex = (currentIndex - 1 + eData.length) % eData.length;

      if (currentIndex === 0) {
        // If it's the first page, navigate to the employees page
        window.location.replace(`/admin/admin-user`);
        //setBackButton(false)
      } else {
        // Get the previousId from the eData array
        const prevId = eData[prevIndex];
        window.location.replace(`/admin/employees/${prevId}`);
      }
      //setBackButton(prevIndex !== 0);
    } else {
      console.log("Current ID not found in eData array.");
    }
  };
  // --------------------------------bdm work assgin-------------------------------------------------------------

  const [bdmWorkOn, setBdmWorkOn] = useState(false)

  console.log("bdmWork", bdmWorkOn)

  const handleAssignBdmWork = async () => {
    const currentId = id;

    //console.log("currentId" , currentId)
    // Show Swal confirmation dialog
    const confirmation = await Swal.fire({
      title: 'Assign BDM Work',
      text: 'Are you sure you want to assign BDM work?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    });

    // If user confirms
    if (confirmation.isConfirmed) {
      //console.log("yahna confirm hua")
      try {
        const response = await axios.post(`${secretKey}/post-bdmwork-request/${currentId}`, {
          bdmWork: true
        });

        fetchEmployeeDetails()
        console.log(response.data)
        // Show success message
        Swal.fire('BDM Work Assigned!', '', 'success');
      } catch (error) {
        console.log("error message", error.message);
        // Show error message
        Swal.fire('Error', 'An error occurred while assigning BDM work.', 'error');
      }
    }
  };

  const handleReverseBdmWork = async () => {
    const currentId = id;
    try {
      const confirmation = await Swal.fire({
        title: 'Revoke BDM Work',
        text: 'Are you sure you want to revoke BDM work?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      });
      if (confirmation.isConfirmed) {
        //console.log("Confirmed"); // Log confirmation
        try {
          const response = await axios.post(`${secretKey}/post-bdmwork-revoke/${currentId}`, {
            bdmWork: false
          });
          fetchEmployeeDetails(); // Assuming this function fetches updated employee details
          console.log(response.data); // Log response data
          // Show success message
          Swal.fire('BDM Work Revoked!', '', 'success');
        } catch (error) {
          console.error("Error revoking BDM work:", error);
          // Show error message
          Swal.fire('Error', 'An error occurred while revoking BDM work.', 'error');
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Show error message
      Swal.fire('Error', 'An error occurred.', 'error');
    }
  };

  function formatDateNew(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // ----------------------------------feedback----------------------------------------------

  const [forwardedCompany, setForwardedCompany] = useState("");
  const [bdmNewAcceptStatus, setBdmNewAcceptStatus] = useState("");
  const [forwardCompanyId, setforwardCompanyId] = useState("");
  const [feedbakPoints, setFeedbackPoints] = useState("")
  const [feedbackRemarks, setFeedbackRemarks] = useState("")
  const [feedbackPopupOpen, setFeedbackPopupOpen] = useState(false)
  const [feedbackCompany, setFeedbackCompany] = useState("")


  const handleViewFeedback = (companyId, companyName, companyFeedbackRemarks, companyFeedbackPoints) => {
    setFeedbackPopupOpen(true)
    setFeedbackPoints(companyFeedbackPoints)
    setFeedbackRemarks(companyFeedbackRemarks)
    setFeedbackCompany(companyName)
  }
  const closeFeedbackPopup = () => {
    setFeedbackPopupOpen(false)
  }
  function ValueLabelComponent(props) {
    const { children, value } = props;

    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  }

  ValueLabelComponent.propTypes = {
    children: PropTypes.element.isRequired,
    value: PropTypes.number.isRequired,
  };

  const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

  const IOSSlider = styled(Slider)(({ theme }) => ({
    color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
    height: 5,
    padding: '15px 0',
    '& .MuiSlider-thumb': {
      height: 20,
      width: 20,
      backgroundColor: '#fff',
      boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
      '&:focus, &:hover, &.Mui-active': {
        boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: iOSBoxShadow,
        },
      },
      '&:before': {
        boxShadow:
          '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
      },
    },
    '& .MuiSlider-valueLabel': {
      fontSize: 12,
      fontWeight: 'normal',
      top: -6,
      backgroundColor: 'unset',
      color: theme.palette.text.primary,
      '&::before': {
        display: 'none',
      },
      '& *': {
        background: 'transparent',
        color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      },
    },
    '& .MuiSlider-track': {
      border: 'none',
      height: 5,
    },
    '& .MuiSlider-rail': {
      opacity: 0.5,
      boxShadow: 'inset 0px 0px 4px -2px #000',
      backgroundColor: '#d0d0d0',
    },
  }));

  // ------------------------------panel-----------------------------------------

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname === `/admin/employees/${id}` ? 0 : 1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  console.log(value)

  function formatDateNow(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // ---------------------------bdmpopupremarks----------------------------

  const [openRemarksBdm, setOpenRemarksBdm] = useState(false)
  const [filteredRemarksBdm, setFilteredRemarksBdm] = useState([])
  const [currentCompanyName, setCurrentCompanyName] = useState("")

  const functionopenpopupremarksBdm = (
    companyID,
    companyStatus,
    companyName,
    bdmName
  ) => {
    setOpenRemarksBdm(true);
    setFilteredRemarksBdm(
      remarksHistory.filter((obj) => obj.companyID === companyID && obj.bdmName === bdmName)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
    //setcid(companyID);
    //setCstat(companyStatus);
    setCurrentCompanyName(companyName);

  };

  const closePopUpRemarksBdm = () => {
    setOpenRemarksBdm(false);
    //setOpenPopupByBdm(false);
  };




  return (
    <div>
      <Header />
      <Navbar />
      <div className="page-wrapper">
        <div
          style={{
            margin: "3px 0px 1px 0px",
          }}
          className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col d-flex justify-content-between">
                {/* <!-- Page pre-title --> */}
                <div className="d-flex">
                  <IconButton>
                    <IconChevronLeft onClick={handleChangeUrlPrev} />
                  </IconButton>

                  {/* <Link to={`/admin/employees`}>
                    <IconButton>
                      <IconChevronLeft />
                    </IconButton>
                  </Link> */}

                  <h2 className="page-title">{employeeName}</h2>
                  <div className="nextBtn">
                    <IconButton onClick={handleChangeUrl}>
                      <IconChevronRight
                        style={
                          {
                            // backgroundColor: "#fbb900",
                            // borderRadius: "5px",
                            // padding: "2px",
                            // color: "white"
                          }
                        }
                      />
                    </IconButton>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  {selectedRows.length !== 0 && (
                    <div className="request">
                      <div className="btn-list">
                        <button
                          onClick={functionOpenAssign}
                          className="btn btn-primary d-none d-sm-inline-block 2"
                        >
                          Assign Data
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
                  )}
                  {!AddForm && <>
                    <div className="form-control sort-by">
                      <label htmlFor="sort-by">Sort By:</label>
                      <select
                        style={{
                          border: "none",
                          outline: "none",
                          color: "#666a66",
                        }}
                        name="sort-by"
                        id="sort-by"
                        onChange={(e) => {
                          const selectedOption = e.target.value;

                          switch (selectedOption) {
                            case "Busy":
                            case "Untouched":
                            case "Not Picked Up":
                              setdataStatus("All");
                              setEmployeeData(
                                moreEmpData
                                  .filter((data) =>
                                    [
                                      "Busy",
                                      "Untouched",
                                      "Not Picked Up",
                                    ].includes(data.Status)
                                  )
                                  .sort((a, b) => {
                                    if (a.Status === selectedOption) return -1;
                                    if (b.Status === selectedOption) return 1;
                                    return 0;
                                  })
                              );
                              break;
                            case "Interested":
                              setdataStatus("Interested");
                              setEmployeeData(
                                moreEmpData
                                  .filter((data) => data.Status === "Interested")
                                  .sort((a, b) =>
                                    a.AssignDate.localeCompare(b.AssignDate)
                                  )
                              );
                              break;
                            case "Not Interested":
                              setdataStatus("NotInterested");
                              setEmployeeData(
                                moreEmpData
                                  .filter((data) =>
                                    ["Not Interested", "Junk"].includes(
                                      data.Status
                                    )
                                  )
                                  .sort((a, b) =>
                                    a.AssignDate.localeCompare(b.AssignDate)
                                  )
                              );
                              break;
                            case "FollowUp":
                              setdataStatus("FollowUp");
                              setEmployeeData(
                                moreEmpData
                                  .filter((data) => data.Status === "FollowUp")
                                  .sort((a, b) =>
                                    a.AssignDate.localeCompare(b.AssignDate)
                                  )
                              );
                              break;
                            case "AssignDate":
                              setdataStatus("AssignDate");
                              setEmployeeData(
                                moreEmpData.sort((a, b) =>
                                  b.AssignDate.localeCompare(a.AssignDate)
                                )
                              );
                              break;
                            case "Company Incorporation Date  ":
                              setdataStatus("CompanyIncorporationDate");
                              setEmployeeData(
                                moreEmpData.sort((a, b) =>
                                  b["Company Incorporation Date  "].localeCompare(
                                    a["Company Incorporation Date  "]
                                  )
                                )
                              );
                              break;
                            default:
                              // No filtering if default option selected
                              setdataStatus("All");
                              setEmployeeData(
                                moreEmpData.sort((a, b) => {
                                  if (a.Status === selectedOption) return -1;
                                  if (b.Status === selectedOption) return 1;
                                  return 0;
                                })
                              );
                              break;
                          }
                        }}
                      >
                        <option value="" disabled selected>
                          Select Status
                        </option>
                        <option value="Untouched">Untouched</option>
                        <option value="Busy">Busy</option>
                        <option value="Not Picked Up">Not Picked Up</option>
                        <option value="FollowUp">Follow Up</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="AssignDate">Assigned Date</option>
                        <option value="Company Incorporation Date  ">
                          C.Inco. Date
                        </option>
                      </select>
                    </div>
                    {/* {bdmWorkOn ? (
                      <button className="btn btn-primary d-none d-sm-inline-block ml-1" onClick={() => handleReverseBdmWork()}>
                        Revoke Bdm Work
                      </button>
                    ) : (
                      <button className="btn btn-primary d-none d-sm-inline-block ml-1" onClick={() => handleAssignBdmWork()}>
                        Assign Bdm Work
                      </button>
                    )} */}
                    <Link
                      to={`/admin/employees/${id}/login-details`}
                      style={{ marginLeft: "10px" }}>
                      <button className="btn btn-primary d-none d-sm-inline-block">
                        Login Details
                      </button>
                    </Link>
                  </>}

                  {backButton && (
                    <div>
                      {!AddForm ? <Link
                        to={`/admin/admin-user`}
                        style={{ marginLeft: "10px" }}
                      >
                        <button className="btn btn-primary d-none d-sm-inline-block">
                          <span>
                            <FaArrowLeft
                              style={{
                                marginRight: "10px",
                                marginBottom: "3px",
                              }}
                            />
                          </span>
                          Back
                        </button>
                      </Link> : <>
                        <button className="btn btn-primary d-none d-sm-inline-block" onClick={() => setAddForm(false)}>
                          <span>
                            <FaArrowLeft
                              style={{
                                marginRight: "10px",
                                marginBottom: "3px",
                              }}
                            />
                          </span>
                          Back
                        </button>
                      </>}
                    </div>
                  )}
                </div>
              </div>
              {/* <!-- Page title actions --> */}
              <div className="col-auto ms-auto d-print-none">
                <div className="btn-list">
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
        <div className="container-xl card mt-2 mb-2" style={{ width: "95%" }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <a
                href="#tabs-home-5"
                onClick={() => {
                  setCurrentTab("Leads")
                  window.location.pathname = `/admin/employees/${id}`
                }}
                className={
                  currentTab === "Leads"
                    ? "nav-link"
                    : "nav-link"
                }
                data-bs-toggle="tab"
              ><Tab label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <MdOutlinePersonPin style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                  <span style={{ fontSize: "12px" }}>
                    Leads </span>
                </div>
              } {...a11yProps(0)} /></a>
              {bdmWorkOn && (<a
                href="#tabs-activity-5"
                onClick={() => {
                  setCurrentTab("TeamLeads")
                  window.location.pathname = `/admin/employeeleads/${id}`
                }}
                className={
                  currentTab === "TeamLeads"
                    ? "nav-link"
                    : "nav-link"
                }
                data-bs-toggle="tab"
              ><Tab
                  label={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <AiOutlineTeam style={{ height: "24px", width: "19px", marginRight: "5px" }} />
                      <span style={{ fontSize: "12px" }}>
                        Team Leads</span>
                    </div>
                  }
                  {...a11yProps(1)}
                /></a>)}
            </Tabs>
          </Box>
        </div>
        {!openLogin && !AddForm && !EditForm && (
          <div
            onCopy={(e) => {
              e.preventDefault();
            }}
            className="page-body"
            style={{ marginTop: "0px " }}
          >
            <div className="container-xl">
              <div className="row g-2 align-items-center">
                <div className="col-2">
                  <div
                    className="form-control"
                    style={{ height: "fit-content", width: "auto" }}
                  >
                    <select
                      style={{
                        border: "none",
                        outline: "none",
                        width: "fit-content",
                      }}
                      value={selectedField}
                      onChange={handleFieldChange}
                    >
                      <option value="Company Name">Company Name</option>
                      <option value="Company Number">Company Number</option>
                      <option value="Company Email">Company Email</option>
                      <option value="Company Incorporation Date  ">
                        Company Incorporation Date
                      </option>
                      <option value="City">City</option>
                      <option value="State">State</option>
                      <option value="Status">Status</option>
                    </select>
                  </div>
                </div>

                {visibility === "block" && (
                  <div className="col-2">
                    <input
                      onChange={handleDateChange}
                      style={{ display: visibility }}
                      type="date"
                      className="form-control"
                    />
                  </div>
                )}
                <div className="col-2">
                  {visibilityOther === "block" && (
                    <div
                      style={{
                        //width: "20vw",
                        //margin: "0px 8px",
                        display: visibilityOther,
                      }}
                      className="input-icon"
                    >
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
                        value={searchText}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                          setCurrentPage(0);
                        }}
                        className="form-control"
                        placeholder="Search…"
                        aria-label="Search in website"
                      />
                    </div>
                  )}
                  {visibilityOthernew === "block" && (
                    <div
                      style={{
                        //width: "20vw",
                        width: "120px",
                        // margin: "0px 8px",
                        display: visibilityOthernew,
                      }}
                      className="input-icon"
                    >
                      <select
                        value={searchText}
                        onChange={(e) => {
                          setSearchText(e.target.value);
                          // Set dataStatus based on selected option
                          if (
                            e.target.value === "All" ||
                            e.target.value === "Busy" ||
                            e.target.value === "Not Picked Up"
                          ) {
                            setdataStatus("All");
                          } else if (
                            e.target.value === "Junk" ||
                            e.target.value === "Not Interested"
                          ) {
                            setdataStatus("NotInterested");
                          } else if (e.target.value === "Interested") {
                            setdataStatus("Interested");
                          } else if (e.target.value === "Untouched") {
                            setEmployeeData(
                              moreEmpData.filter(
                                (obj) => obj.Status === "Untouched"
                              )
                            );
                          }
                        }}
                        className="form-select"
                      >
                        <option value="All">All</option>
                        <option value="Busy">Busy</option>
                        <option value="Not Picked Up">Not Picked Up</option>
                        <option value="Junk">Junk</option>
                        <option value="Interested">Interested</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Untouched">Untouched</option>
                      </select>
                    </div>
                  )}
                </div>
                <div
                  className="col-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "7px",
                  }}
                >
                  {selectedField === "State" && (
                    <div style={{ marginLeft: "-16px" }} className="input-icon">
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
                        className="form-control"
                        value={citySearch}
                        onChange={(e) => {
                          setcitySearch(e.target.value);
                          setCurrentPage(0);
                        }}
                        placeholder="Search City"
                        aria-label="Search in website"
                      />
                    </div>
                  )}
                  {selectedField === "Company Incorporation Date  " && (
                    <>
                      <div
                        style={{ width: "fit-content" }}
                        className="form-control"
                      >
                        <select
                          style={{ border: "none", outline: "none" }}
                          onChange={(e) => {
                            setMonth(e.target.value);
                            setCurrentPage(0);
                          }}
                        >
                          <option value="" disabled selected>
                            Select Month
                          </option>
                          <option value="12">December</option>
                          <option value="11">November</option>
                          <option value="10">October</option>
                          <option value="9">September</option>
                          <option value="8">August</option>
                          <option value="7">July</option>
                          <option value="6">June</option>
                          <option value="5">May</option>
                          <option value="4">April</option>
                          <option value="3">March</option>
                          <option value="2">February</option>
                          <option value="1">January</option>
                        </select>
                      </div>
                      <div className="input-icon form-control">
                        {/* <input
                          type="number"
                          value={year}
                          defaultValue="Select Year"
                          className="form-control"
                          placeholder="Select Year.."
                          onChange={(e) => {
                            setYear(e.target.value);
                          }}
                          aria-label="Search in website"
                        /> */}
                        <select
                          select
                          style={{ border: "none", outline: "none" }}
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            setCurrentPage(0); // Reset page when year changes
                          }}
                        >
                          <option value="">Select Year</option>
                          {[...Array(15)].map((_, index) => {
                            const yearValue = 2024 - index;
                            return (
                              <option key={yearValue} value={yearValue}>
                                {yearValue}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="features"
                >
                  <div style={{ display: "flex" }} className="feature1 mb-2">
                    {selectedRows.length !== 0 && (
                      <div className="form-control">
                        {selectedRows.length} Data Selected
                      </div>
                    )}
                    {searchText !== "" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "16px",
                          fontFamily: "sans-serif",
                        }}
                        className="results"
                      >
                        {filteredData.length} results found
                      </div>
                    )}
                  </div>
                </div>

                {/* <!-- Page title actions --> */}
              </div>
              {/* <div class="card-header my-tab">
                <ul
                  class="nav nav-tabs card-header-tabs nav-fill p-0"
                  data-bs-toggle="tabs"
                >
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      onClick={() => {
                        setCurrentTab("Leads")
                        window.location.pathname = `/admin/employees/${id}`
                      }}
                      className={
                        currentTab === "Leads"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      Leads{" "}
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setCurrentTab("TeamLeads")
                        window.location.pathname = `/admin/employeeleads/${id}`
                      }}
                      className={
                        currentTab === "TeamLeads"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      <span>Team Leads</span>
                    </a>
                  </li>
                </ul>
              </div> */}
              <div class="card-header my-tab">
                <ul
                  class="nav nav-tabs card-header-tabs nav-fill p-0"
                  data-bs-toggle="tabs"
                >
                  <li class="nav-item data-heading">
                    <a
                      href="#tabs-home-5"
                      onClick={() => {
                        setdataStatus("All");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Busy" ||
                              obj.Status === "Not Picked Up" ||
                              obj.Status === "Untouched"
                          )
                        );
                      }}
                      className={
                        dataStatus === "All"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      General{" "}
                      <span className="no_badge">
                        {
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Busy" ||
                              obj.Status === "Not Picked Up" ||
                              obj.Status === "Untouched"
                          ).length
                        }
                      </span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("Interested");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Interested" &&
                              obj.bdmAcceptStatus === "NotForwarded"
                          )
                        );
                      }}
                      className={
                        dataStatus === "Interested"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      <span>Interested </span>
                      <span className="no_badge">
                        {
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Interested" &&
                              obj.bdmAcceptStatus === "NotForwarded"
                          ).length
                        }
                      </span>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("FollowUp");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "FollowUp" &&
                              obj.bdmAcceptStatus === "NotForwarded"
                          )
                        );
                      }}
                      className={
                        dataStatus === "FollowUp"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      <span>Follow Up </span>

                      <span className="no_badge">
                        {
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "FollowUp" &&
                              obj.bdmAcceptStatus === "NotForwarded"
                          ).length
                        }
                      </span>
                    </a>
                  </li>

                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("Matured");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData
                            .filter(
                              (obj) =>
                                obj.Status === "Matured" &&
                                (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                            )
                            .sort(
                              (a, b) =>
                                new Date(b.lastActionDate) -
                                new Date(a.lastActionDate)
                            )
                        );
                      }}
                      className={
                        dataStatus === "Matured"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      <span>Matured </span>
                      <span className="no_badge">
                        {" "}
                        {
                          moreEmpData.filter(
                            (obj) =>
                              obj.Status === "Matured" &&
                              (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                          ).length
                        }
                      </span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("Forwarded");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData
                            .filter(
                              (obj) =>
                                obj.bdmAcceptStatus !== "NotForwarded" &&
                                obj.Status !== "Not Interested" && obj.Status !== "Busy" && obj.Status !== "Junk" && obj.Status !== "Not Picked Up" && obj.Status !== "Busy" &&
                                obj.Status !== "Matured"
                            )
                            // .sort(
                            //   (a, b) =>
                            //     convertDateFormat(b.bdeForwardDate) > convertDateFormat(a.bdeForwardDate) ? 1 :
                            //       convertDateFormat(b.bdeForwardDate) < convertDateFormat(a.bdeForwardDate) ? -1 : 0
                            // )
                            .sort((a, b) => new Date(b.bdeForwardDate) - new Date(a.bdeForwardDate))
                        );
                        //setdataStatus(obj.bdmAcceptStatus);
                      }}
                      className={
                        dataStatus === "Forwarded"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      Bdm Forwarded{" "}
                      <span className="no_badge">
                        {" "}
                        {
                          moreEmpData.filter(
                            (obj) =>
                              obj.bdmAcceptStatus !== "NotForwarded" &&
                              obj.Status !== "Not Interested" && obj.Status !== "Busy" && obj.Status !== "Junk" && obj.Status !== "Not Picked Up" && obj.Status !== "Busy" &&
                              obj.Status !== "Matured"
                          ).length
                        }
                      </span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      href="#tabs-activity-5"
                      onClick={() => {
                        setdataStatus("NotInterested");
                        setCurrentPage(0);
                        setEmployeeData(
                          moreEmpData.filter(
                            (obj) =>
                              (obj.Status === "Not Interested" ||
                                obj.Status === "Junk") &&
                              (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                          )
                        );
                      }}
                      className={
                        dataStatus === "NotInterested"
                          ? "nav-link active item-act"
                          : "nav-link"
                      }
                      data-bs-toggle="tab"
                    >
                      <span>Not Interested </span>
                      <span className="no_badge">
                        {
                          moreEmpData.filter(
                            (obj) =>
                              (obj.Status === "Not Interested" ||
                                obj.Status === "Junk") &&
                              (obj.bdmAcceptStatus === "NotForwarded" || obj.bdmAcceptStatus === "Pending" || obj.bdmAcceptStatus === "Accept")
                          ).length
                        }
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card">
                <div className="card-body p-0">
                  <div
                    style={{
                      overflowX: "auto",
                      overflowY: "auto",
                      maxHeight: "60vh",
                    }}
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
                            <input
                              type="checkbox"
                              checked={
                                selectedRows.length === filteredData.length
                              }
                              onChange={() => handleCheckboxChange("all")}
                            />
                          </th>

                          <th className="th-sticky">Sr.No</th>
                          <th className="th-sticky1">Company Name</th>
                          <th>Company Number</th>
                          {dataStatus === "Forwarded" ? (<th>BDE Status</th>) : (<th>Status</th>)}
                          {dataStatus === "Forwarded" ? (<th>BDE Remarks</th>) : (<th>Remarks</th>)}
                          {dataStatus === "Forwarded" && <th>BDM Status</th>}
                          {dataStatus === "Forwarded" &&
                            (dataStatus !== "Interested" ||
                              dataStatus !== "FollowUp" ||
                              dataStatus !== "Untouched" ||
                              dataStatus !== "Matured" ||
                              dataStatus !== "Not Interested") && (
                              <th>BDM Remarks</th>
                            )}
                          {dataStatus === "FollowUp" && <th>Next FollowUp Date</th>}
                          <th>
                            Incorporation Date
                            <FilterListIcon
                              style={{
                                height: "15px",
                                width: "15px",
                                cursor: "pointer",
                                marginLeft: "4px",
                              }}
                              onClick={handleFilterIncoDate}
                            />
                            {openIncoDate && (
                              <div className="inco-filter">
                                <div
                                  className="inco-subFilter"
                                  onClick={(e) => handleSort("oldest")}
                                >
                                  <SwapVertIcon style={{ height: "16px" }} />
                                  Oldest
                                </div>

                                <div
                                  className="inco-subFilter"
                                  onClick={(e) => handleSort("newest")}
                                >
                                  <SwapVertIcon style={{ height: "16px" }} />
                                  Newest
                                </div>

                                <div
                                  className="inco-subFilter"
                                  onClick={(e) => handleSort("none")}
                                >
                                  <SwapVertIcon style={{ height: "16px" }} />
                                  None
                                </div>
                              </div>
                            )}
                          </th>
                          <th>City</th>
                          <th>State</th>
                          <th>Company Email</th>
                          <th>
                            Assigned On
                            <SwapVertIcon
                              style={{
                                height: "15px",
                                width: "15px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                const sortedData = [...employeeData].sort(
                                  (a, b) => {
                                    if (sortOrder === "asc") {
                                      return b.AssignDate.localeCompare(
                                        a.AssignDate
                                      );
                                    } else {
                                      return a.AssignDate.localeCompare(
                                        b.AssignDate
                                      );
                                    }
                                  }
                                );
                                setEmployeeData(sortedData);
                                setSortOrder(
                                  sortOrder === "asc" ? "desc" : "asc"
                                );
                              }}
                            />
                          </th>
                          {(dataStatus === "Matured" && <th>Action</th>) ||
                            (dataStatus === "FollowUp" && (
                              <th>View Projection</th>
                            )) ||
                            (dataStatus === "Interested" && (
                              <th>View Projection</th>
                            ))}
                          {dataStatus === "Forwarded" && (
                            <th>Forwarded Date</th>
                          )}
                          {/* {(dataStatus === "Forwarded" ||
                              dataStatus === "Interested" ||
                              dataStatus === "FollowUp") && (
                                <th>Forward to BDM</th>
                              )} */}
                          {dataStatus === "Forwarded" &&
                            (dataStatus !== "Interested" ||
                              dataStatus !== "FollowUp" ||
                              dataStatus !== "Untouched" ||
                              dataStatus !== "Matured" ||
                              dataStatus !== "Not Interested") && (
                              <th>Feedback</th>
                            )}
                        </tr>
                      </thead>
                      {loading ? (
                        <tbody>
                          <tr>
                            <td
                              colSpan="11"
                              style={{
                                height: "100px !important",
                                padding: "80px !important",
                              }}
                              className="LoaderTDSatyle"
                            >
                              <ClipLoader
                                color="lightgrey"
                                loading
                                size={35}
                                height="25"
                                width="25"
                                aria-label="Loading Spinner"
                                data-testid="loader"
                              />
                            </td>
                          </tr>
                        </tbody>
                      ) : (
                        <>
                          {currentData.length !== 0 && (
                            <tbody>
                              {currentData.map((company, index) => (
                                <tr
                                  key={index}
                                  className={
                                    selectedRows.includes(company._id)
                                      ? "selected"
                                      : ""
                                  }
                                  style={{ border: "1px solid #ddd" }}
                                >
                                  <td
                                    style={{
                                      position: "sticky",
                                      left: 0,
                                      zIndex: 1,
                                      background: "white",
                                    }}>
                                    <input
                                      type="checkbox"
                                      checked={selectedRows.includes(
                                        company._id
                                      )}
                                      onChange={(e) =>
                                        handleCheckboxChange(company._id, e)
                                      }
                                      onMouseDown={() =>
                                        handleMouseDown(company._id)

                                      }
                                      onMouseEnter={() =>
                                        handleMouseEnter(company._id)
                                      }
                                      onMouseUp={handleMouseUp}
                                    />
                                  </td>

                                  <td className="td-sticky">
                                    {startIndex + index + 1}
                                  </td>
                                  <td className="td-sticky1">
                                    {company["Company Name"]}
                                  </td>
                                  <td>{company["Company Number"]}</td>
                                  <td>
                                    <span>{company["Status"]}</span>
                                  </td>
                                  {dataStatus === "FollowUp" && (<td>{formatDateNew(company.bdeNextFollowUpDate)}</td>)}
                                  <td>
                                    <div
                                      key={company._id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <p
                                        className="rematkText text-wrap m-0"
                                        title={company.Remarks}
                                      >
                                        {company.Remarks}
                                      </p>
                                      <span>
                                        <IconButton
                                          onClick={() => {
                                            functionopenpopupremarks(
                                              company._id,
                                              company.Status,
                                              company.ename
                                            );
                                          }}
                                        >
                                          <HiOutlineEye
                                            style={{
                                              fontSize: "14px",
                                              color: "#fbb900",
                                            }}
                                          />
                                        </IconButton>
                                      </span>
                                    </div>
                                  </td>
                                  {dataStatus === "Forwarded" && (
                                    <td>
                                      {company.Status === "Interested" && (
                                        <span>Interested</span>
                                      )}
                                      {company.Status === "FollowUp" && (
                                        <span>FollowUp</span>
                                      )}
                                      {/* {company.Status === "Matured" && (
                                      <span>Matured</span>
                                    )}
                                    {(company.Status === "Not Interested" ||
                                      company.Status === "Junk" ||
                                      company.Status === "Busy") && (
                                      <span></span>
                                    )} */}
                                    </td>
                                  )}
                                  {/* <td>
                                    <div
                                      key={company._id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <p
                                        className="rematkText text-wrap m-0"
                                        title={company.Remarks}
                                      >
                                        {company.Remarks}
                                      </p>
                                      <span>
                                        <IconButton
                                          onClick={() => {
                                            functionopenpopupremarks(
                                              company._id,
                                              company.Status,
                                              company.ename
                                            );
                                          }}
                                        >
                                          <HiOutlineEye
                                            style={{
                                              fontSize: "14px",
                                              color: "#fbb900",
                                            }}
                                          />
                                        </IconButton>
                                      </span>
                                    </div>
                                  </td> */}
                                  {(dataStatus === "Forwarded") && (company.bdmAcceptStatus !== "NotForwarded") && (
                                    <td>
                                      <div key={company._id}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          width: "100px",
                                        }}>
                                        <p
                                          className="rematkText text-wrap m-0"
                                          title={company.bdmRemarks}
                                        >
                                          {!company.bdmRemarks
                                            ? "No Remarks"
                                            : company.bdmRemarks}
                                        </p>
                                        <IconButton
                                          onClick={() => {
                                            functionopenpopupremarksBdm(
                                              company._id,
                                              company.Status,
                                              company["Company Name"],
                                              company.bdmName
                                            );
                                            //setOpenPopupByBdm(true);
                                            //setCurrentRemarks(company.Remarks);
                                            //setCompanyId(company._id);
                                          }}
                                        >
                                          <IconEye
                                            style={{
                                              width: "14px",
                                              height: "14px",
                                              color: "#d6a10c",
                                              cursor: "pointer",
                                            }}
                                          />
                                        </IconButton>
                                      </div>
                                    </td>

                                  )}


                                  <td>
                                    {formatDateNew(
                                      company["Company Incorporation Date  "]
                                    )}
                                  </td>
                                  <td>{company["City"]}</td>
                                  <td>{company["State"]}</td>
                                  <td>{company["Company Email"]}</td>
                                  <td>{formatDateNew(company["AssignDate"])}</td>
                                  {(dataStatus === "FollowUp" ||
                                    dataStatus === "Interested") && (
                                      <td>
                                        {company &&
                                          projectionData &&
                                          projectionData.some(
                                            (item) =>
                                              item.companyName ===
                                              company["Company Name"]
                                          ) ? (
                                          <IconButton>
                                            <HiOutlineEye
                                              onClick={() => {
                                                functionopenprojection(
                                                  company["Company Name"]
                                                );
                                              }}
                                              style={{
                                                cursor: "pointer",
                                                width: "17px",
                                                height: "17px",
                                                color: "fbb900",
                                              }}
                                            />
                                          </IconButton>
                                        ) : (
                                          <IconButton>
                                            <HiOutlineEye
                                              style={{
                                                cursor: "pointer",
                                                width: "17px",
                                                height: "17px",
                                              }}
                                              color="lightgrey"
                                            />
                                          </IconButton>
                                        )}
                                      </td>
                                    )}
                                  {dataStatus === "Forwarded" && (
                                    <>
                                      {company.bdeForwardDate ? (
                                        <td>{formatDateNew(company.bdeForwardDate)}</td>
                                      ) : (<td></td>)}
                                    </>
                                  )}

                                  {dataStatus === "Matured" && (
                                    <>
                                      <td>
                                        <div className="d-flex">
                                          <div
                                            style={{ marginRight: "5px" }}
                                            onClick={() => {
                                              setMaturedID(company._id);
                                              functionopenAnchor();
                                            }}
                                          >
                                            <IconEye
                                              style={{
                                                width: "14px",
                                                height: "14px",
                                                color: "#d6a10c",
                                                cursor: "pointer",
                                              }}
                                            />
                                          </div>
                                          <div
                                            onClick={() => {
                                              handleDeleteBooking(company._id);
                                            }}
                                            className="delete-booking"
                                            style={{ cursor: "pointer", marginRight: "5px" }}
                                          >
                                            <DeleteIcon
                                              style={{
                                                cursor: "pointer",
                                                color: "#f70000",
                                                width: "14px",
                                                height: "14px",
                                              }}
                                            />
                                          </div>
                                          <div onClick={() => {
                                            setCompanyName(company["Company Name"])
                                            setAddForm(true)
                                          }} >
                                            <AddCircleIcon style={{
                                              cursor: "pointer",
                                              color: "#4f5b74",
                                              width: "14px",
                                              height: "14px",
                                            }} />
                                          </div>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                  {(dataStatus === "Forwarded") && (company.bdmAcceptStatus !== "NotForwarded") && (company.feedbackPoints.length !== 0 || company.feedbackRemarks) && (
                                    <td>
                                      <IconButton onClick={() => {
                                        handleViewFeedback(
                                          company._id,
                                          company["Company Name"],
                                          company.feedbackRemarks,
                                          company.feedbackPoints
                                        )
                                      }}>
                                        <RiInformationLine style={{
                                          cursor: "pointer",
                                          width: "17px",
                                          height: "17px",
                                        }}
                                          color="#fbb900" /></IconButton>
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          )}
                        </>
                      )}
                      {companiesLoading ? (
                        <tbody className="d-flex align-items-center justify-content-center LoaderTDSatyle">
                          <ClipLoader
                            color="lightgrey"
                            loading
                            size={10}
                            height="25"
                            width="2"
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                        </tbody>
                      ) : (
                        <>
                          {dataStatus === "null" && companies.length !== 0 && (
                            <tbody>
                              {companies.map((company, index) => (
                                <tr
                                  key={index}
                                  className={
                                    selectedRows.includes(company._id)
                                      ? "selected"
                                      : ""
                                  }
                                  style={{ border: "1px solid #ddd" }}
                                >
                                  <td className="td-sticky">
                                    {startIndex + index + 1}
                                  </td>
                                  <td className="td-sticky1">
                                    {company["Company Name"]}
                                  </td>
                                  <td>{company["Company Number"]}</td>
                                  <td>
                                    <span>{company["Status"]}</span>
                                  </td>
                                  <td>
                                    <div
                                      key={company._id}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <p
                                        className="rematkText text-wrap m-0"
                                        title={company.Remarks}
                                      >
                                        {company.Remarks}
                                      </p>
                                      <span>
                                        {/* <IconEye
                                      onClick={() => {
                                        functionopenpopupremarks(
                                          company._id,
                                          company.Status
                                        );
                                      }}
                                      style={{
                                        width: "18px",
                                        height: "18px",
                                        color: "#d6a10c",
                                        cursor: "pointer",
                                      }}
                                    /> */}
                                        <HiOutlineEye
                                          style={{
                                            fontSize: "15px",
                                            color: "#fbb900",
                                            //backgroundColor: "lightblue",
                                            // Additional styles for the "View" button
                                          }}
                                          //className="btn btn-primary d-none d-sm-inline-block"
                                          onClick={() => {
                                            functionopenpopupremarks(
                                              company._id,
                                              company.Status,
                                              company.ename
                                            );
                                          }}
                                        />
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    {formatDate(
                                      company["Company Incorporation Date"]
                                    )}
                                  </td>
                                  <td>{company["City"]}</td>
                                  <td>{company["State"]}</td>
                                  <td>{company["Company Email"]}</td>
                                  <td>{formatDate(company["AssignDate"])}</td>
                                  <td>
                                    <IconButton>
                                      <RiEditCircleFill
                                        onClick={() => {
                                          functionopenAnchor();
                                          setMaturedCompanyName(
                                            company["Company Name"]
                                          );
                                        }}
                                        style={{
                                          cursor: "pointer",
                                          width: "17px",
                                          height: "17px",
                                        }}
                                        color="lightgrey"
                                      />
                                    </IconButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          )}
                        </>
                      )}
                      {currentData.length === 0 && !loading && (
                        <tbody>
                          <tr>
                            <td colSpan="11" className="p-2">
                              <Nodata />
                            </td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                  {currentData.length !== 0 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      className="pagination"
                    >
                      <IconButton
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.max(prevPage - 1, 0)
                          )
                        }
                        disabled={currentPage === 0}
                      >
                        <IconChevronLeft />
                      </IconButton>
                      <span>
                        Page {currentPage + 1} of{" "}
                        {Math.ceil(filteredData.length / itemsPerPage)}
                      </span>

                      <IconButton
                        onClick={() =>
                          setCurrentPage((prevPage) =>
                            Math.min(
                              prevPage + 1,
                              Math.ceil(filteredData.length / itemsPerPage) - 1
                            )
                          )
                        }
                        disabled={
                          currentPage ===
                          Math.ceil(filteredData.length / itemsPerPage) - 1
                        }
                      >
                        <IconChevronRight />
                      </IconButton>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Login Details */}
        {openLogin && (
          <>
            <LoginDetails loginDetails={loginDetails} />
          </>
        )}
        {
          EditForm && (<>
            <EditableLeadform
              setFormOpen={EditForm}
            />
          </>)
        }
        {
          AddForm && companyName !== "" && (
            <> <AddLeadForm setFormOpen={setAddForm}
              companysName={companyName}
              setDataStatus={setdataStatus}
              setNowToFetch={setNowToFetch} />

            </>
          )
        }
      </div>
      {/* ------------------------------- Assign data -------------------------- */}
      <Dialog
        open={openAssign}
        onClose={closepopupAssign}
        fullWidth
        maxWidth="sm">
        <DialogTitle>
          Change BDE{" "}
          <IconButton onClick={closepopupAssign} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="maincon">
            <div className="con2 d-flex">
              <div
                style={
                  selectedOption === "direct"
                    ? {
                      backgroundColor: "#e9eae9",
                      margin: "10px 10px 0px 0px",
                      cursor: "pointer",
                    }
                    : {
                      backgroundColor: "white",
                      margin: "10px 10px 0px 0px",
                      cursor: "pointer",
                    }
                }
                onClick={() => {
                  setSelectedOption("direct");
                }}
                className="direct form-control"
              >
                <input
                  type="radio"
                  id="direct"
                  value="direct"
                  style={{
                    display: "none",
                  }}
                  checked={selectedOption === "direct"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="direct">Move In General Data</label>
              </div>
              <div
                style={
                  selectedOption === "someoneElse"
                    ? {
                      backgroundColor: "#e9eae9",
                      margin: "10px 0px 0px 0px",
                      cursor: "pointer",
                    }
                    : {
                      backgroundColor: "white",
                      margin: "10px 0px 0px 0px",
                      cursor: "pointer",
                    }
                }
                className="indirect form-control"
                onClick={() => {
                  setSelectedOption("someoneElse");
                }}
              >
                <input
                  type="radio"
                  id="someoneElse"
                  value="someoneElse"
                  style={{
                    display: "none",
                  }}
                  checked={selectedOption === "someoneElse"}
                  onChange={handleOptionChange}
                />
                <label htmlFor="someoneElse">Assign to Employee</label>
              </div>
            </div>
          </div>
          {/* <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button onClick={handleButtonClick}>Choose File</button> */}

          {selectedOption === "someoneElse" && (
            <div>
              {newempData.length !== 0 ? (
                <>
                  <div className="dialogAssign">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        margin: " 10px 0px 0px 0px",
                      }}
                      className="selector"
                    >
                      <label>Select an Employee</label>
                      <div className="form-control">
                        <select
                          style={{
                            width: "inherit",
                            border: "none",
                            outline: "none",
                          }}
                          value={newemployeeSelection}
                          onChange={(e) => {
                            setnewEmployeeSelection(e.target.value);
                          }}
                        >
                          <option value="Not Alloted" disabled>
                            Select employee
                          </option>
                          {newempData.map((item) => (
                            <option value={item.ename}>{item.ename}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <h1>No Employees Found</h1>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <button onClick={handleUploadData} className="btn btn-primary">
          Submit
        </button>
      </Dialog>

      {/* Dialog for location details */}
      <Dialog
        open={openlocation}
        onClose={closepopuplocation}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Location Details{" "}
          <IconButton onClick={closepopuplocation} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {loginDetails.map((details, index) => (
                <tr key={index}>
                  <td>{details.ename}</td>
                  <td>{details.date}</td>
                  <td>{details.time}</td>
                  <td>{details.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>

      {/* Remarks History Pop up */}
      <Dialog
        open={openRemarks}
        onClose={closepopupRemarks}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Remarks
          <IconButton onClick={closepopupRemarks} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarks.length !== 0 ? (
              filteredRemarks
                .slice()
                .reverse()
                .map((historyItem) => (
                  <div className="col-sm-12" key={historyItem._id}>
                    <div className="card RemarkCard position-relative">
                      <div className="d-flex justify-content-between">
                        <div className="reamrk-card-innerText">
                          <pre>{historyItem.remarks}</pre>
                          {historyItem.bdmName !== undefined && (
                            <pre className="remark-text">By BDM</pre>
                          )}
                        </div>
                      </div>

                      <div className="d-flex card-dateTime justify-content-between">
                        <div className="date">{historyItem.date}</div>
                        <div className="time">{historyItem.time}</div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center overflow-hidden">
                No Remarks History
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------dialog to view bdm remarks--------------------------------------------- */}
      <Dialog
        open={openRemarksBdm}
        onClose={closePopUpRemarksBdm}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>
            {currentCompanyName}'s Remarks
          </span>
          <IconButton
            onClick={closePopUpRemarksBdm}
            style={{ float: "right" }}
          >
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarksBdm.length !== 0 ? (
              filteredRemarksBdm.slice().map((historyItem) => (
                <div className="col-sm-12" key={historyItem._id}>
                  <div className="card RemarkCard position-relative">
                    <div className="d-flex justify-content-between">
                      <div className="reamrk-card-innerText">
                        <pre className="remark-text">{historyItem.bdmRemarks}</pre>
                        {/* {historyItem.bdmName !== undefined && (
                          <pre className="remark-text">By BDM</pre>
                        )} */}
                      </div>
                    </div>

                    <div className="d-flex card-dateTime justify-content-between">
                      <div className="date">{historyItem.date}</div>
                      <div className="time">{historyItem.time}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center overflow-hidden">
                No Remarks History
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>


      {/* -------------------------------------------------------------------------dialog for feedback remarks-------------------------------------- */}

      <Dialog
        open={feedbackPopupOpen}
        onClose={closeFeedbackPopup}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>
          <div className="d-flex align-items-center justify-content-between">
            <div className="m-0" style={{ fontSize: "16px" }}>Feedback Of <span className="text-wrap" > {feedbackCompany}</span></div>
            <div>
              <IconButton onClick={closeFeedbackPopup} style={{ float: "right" }}>
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {(feedbackRemarks || feedbakPoints) && (
              <div className="col-sm-12">
                <div className="card RemarkCard position-relative">
                  <div>A. How was the quality of Information?</div>
                  <IOSSlider className="mt-4"
                    aria-label="ios slider"
                    disabled
                    defaultValue={feedbakPoints[0]}
                    min={0}
                    max={10}
                    valueLabelDisplay="on"
                  />
                </div>
                <div className="card RemarkCard position-relative">
                  <div>B. How was the clarity of communication with lead?</div>
                  <IOSSlider className="mt-4"
                    aria-label="ios slider"
                    disabled
                    defaultValue={feedbakPoints[1]}
                    min={0}
                    max={10}
                    valueLabelDisplay="on"
                  />
                </div>
                <div className="card RemarkCard position-relative">
                  <div>C. How was the accuracy of lead qualification?</div>
                  <IOSSlider className="mt-4"
                    aria-label="ios slider"
                    disabled
                    defaultValue={feedbakPoints[2]}
                    min={0}
                    max={10}
                    valueLabelDisplay="on"
                  />
                </div>
                <div className="card RemarkCard position-relative">
                  <div>D. How was engagement level of lead?</div>
                  <IOSSlider className="mt-4"
                    aria-label="ios slider"
                    disabled
                    defaultValue={feedbakPoints[3]}
                    min={0}
                    max={10}
                    valueLabelDisplay="on"
                  />
                </div>
                <div className="card RemarkCard position-relative">
                  <div>E. Payment Chances?</div>
                  <IOSSlider className="mt-4"
                    aria-label="ios slider"
                    disabled
                    defaultValue={feedbakPoints[4]}
                    min={0}
                    max={100}
                    valueLabelDisplay="on"
                  />
                </div>
                <div className="card RemarkCard position-relative">
                  <div className="d-flex justify-content-between">
                    <div className="reamrk-card-innerText">
                      <pre className="remark-text">{feedbackRemarks}</pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Bookings Page */}
      <Drawer anchor="right" open={openAnchor} onClose={closeAnchor}>
        <div className="LeadFormPreviewDrawar">
          <div className="LeadFormPreviewDrawar-header">
            <div className="Container">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="title m-0 ml-1">Current LeadForm</h2>
                </div>
                <div>
                  <IconButton onClick={closeAnchor}>
                    <CloseIcon />
                  </IconButton>
                </div>
              </div>
            </div>
          </div>
          <div>
            <LeadFormPreview
              setOpenAnchor={setOpenAnchor}
              currentLeadForm={currentForm}
            />
          </div>
        </div>
      </Drawer>

      {/* Projecting drawer */}
      <Drawer
        style={{ top: "50px" }}
        anchor="right"
        open={openProjection}
        onClose={closeProjection}
      >
        <div style={{ width: "31em" }} className="container-xl">
          <div
            className="header d-flex justify-content-between align-items-center"
            style={{ margin: "10px 0px" }}
          >
            <h1
              style={{ marginBottom: "0px", fontSize: "20px" }}
              className="title"
            >
              Projection Form
            </h1>
            <IconButton>
              <IoClose
                onClick={closeProjection}
                style={{ width: "17px", height: "17px" }}
              />
            </IconButton>
          </div>
          <hr style={{ margin: "0px" }} />
          <div className="body-projection">
            <div className="header mb-2">
              <h1
                style={{
                  fontSize: "14px",
                  textShadow: "none",
                  fontFamily: "sans-serif",
                  fontWeight: "400",

                  fontFamily: "Poppins, sans-serif",
                  margin: "10px 0px",
                }}
              >
                {projectingCompany}
              </h1>
            </div>
            <div className="label">
              <strong>Offered Services</strong>
              <div className="services mb-3">
                <Select
                  isMulti
                  options={options}
                  value={
                    currentProjection.offeredServices.length !== 0 &&
                    currentProjection.offeredServices.map((value) => ({
                      value,
                      label: value,
                    }))
                  }
                  placeholder="No Services Selected"
                  disabled
                />
              </div>
            </div>
            <div className="label">
              <strong>Offered Prices (With GST)</strong>
              <div className="services mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={currentProjection.offeredPrize}
                //disabled
                />
              </div>
            </div>
            <div className="label">
              <strong>Last Follow Up Date</strong>
              <div className="services mb-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Lasf followUp date is not mentioned"
                  value={currentProjection.lastFollowUpdate}
                //disabled
                />
              </div>
            </div>
            <div className="label">
              <strong>Expected Price(With GST)</strong>
              <div className="services mb-3">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Total Payment is not mentioned"
                  value={currentProjection.totalPayment}

                //disabled
                />
              </div>
            </div>
            <div className="label">
              <strong>Payment Expected on</strong>
              <div className="services mb-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Estimated Date not mentioned"
                  value={currentProjection.estPaymentDate}
                //disabled
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default EmployeeParticular;
