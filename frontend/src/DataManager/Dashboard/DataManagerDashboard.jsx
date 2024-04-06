import React from "react";
import Papa from "papaparse";
import { useParams } from "react-router-dom";
import Header from "../Components/Header/Header.jsx";
import Navbar from "../Components/Navbar/Navbar.jsx";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import debounce from 'lodash/debounce';
import { IconChevronRight } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import UndoIcon from "@mui/icons-material/Undo";
import Box from "@mui/material/Box";
import { IconEye } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import "react-datepicker/dist/react-datepicker.css";
import "../../assets/styles.css"
//import "../assets/styles.css";
import Swal from "sweetalert2";
import ClipLoader from "react-spinners/ClipLoader";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHouseLock } from '@fortawesome/free-solid-svg-icons'

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "react-modal";
import { Link, json } from "react-router-dom";
import Nodata from "../Components/Nodata/Nodata.jsx";
import FilterListIcon from "@mui/icons-material/FilterList";
import EmployeeDataReport from "../Components/EmployeeDataReport/EmployeeDataReport.jsx";

function DataManagerDashboard() {
  const { userId } = useParams();
  const [open, openchange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState();
  const [openNew, openchangeNew] = useState(false);
  const [openPopupModify, setopenPopupModify] = useState(false);
  const [openEmp, openchangeEmp] = useState(false);
  const [openConf, openChangeConf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvdata, setCsvData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [openAssign, setOpenAssign] = useState(false);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [employeeSelection, setEmployeeSelection] = useState("Not Alloted");
  const [incoFilter, setIncoFilter] = useState("");
  const [currentDataLoading, setCurrentDataLoading] = useState(false)

  const [newemployeeSelection, setnewEmployeeSelection] =
    useState("Not Alloted");
  const [newempData, setnewEmpData] = useState([]);
  // const [currentData, setCurrentData] = useState([]);

  const [newDate, setNewDate] = useState([null]);
  const [dataStatus, setDataStatus] = useState("Unassigned");

  // Manual Data
  const [sortOrder, setSortOrder] = useState("asc");
  const [cname, setCname] = useState("");
  const [cemail, setCemail] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [directorNameFirst, setDirectorNameFirst] = useState("");
  const [directorNameSecond, setDirectorNameSecond] = useState("");
  const [directorNameThird, setDirectorNameThird] = useState("");
  const [directorNumberFirst, setDirectorNumberFirst] = useState(0);
  const [directorNumberSecond, setDirectorNumberSecond] = useState(0);
  const [directorNumberThird, setDirectorNumberThird] = useState(0);
  const [directorEmailFirst, setDirectorEmailFirst] = useState("");
  const [directorEmailSecond, setDirectorEmailSecond] = useState("");
  const [directorEmailThird, setDirectorEmailThird] = useState("");
  const [cnumber, setCnumber] = useState(0);
  const [state, setState] = useState("");
  const [openRemarks, openchangeRemarks] = useState(false);
  const [city, setCity] = useState("");
  const [cidate, setCidate] = useState(null);
  const itemsPerPage = 500;
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [visibilityOthernew, setVisibilityOthernew] = useState("none");
  const [subFilterValue, setSubFilterValue] = useState("");
  const [openIncoDate, setOpenIncoDate] = useState(false);

  // Requested Details
  const [requestData, setRequestData] = useState([]);
  const [requestGData, setRequestGData] = useState([]);
  const [mainData, setmainData] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
  //fetch data
  const fetchDatadebounce = async () => {
    try {
      // Set isLoading to true while fetching data
      setIsLoading(true);
      setCurrentDataLoading(true)

      const response = await axios.get(`${secretKey}/leads`);

      // Set the retrieved data in the state
      setData(response.data.reverse());
      setmainData(response.data.filter((item) => item.ename === "Not Alloted"));

      // Set isLoading back to false after data is fetched
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      // Set isLoading back to false if an error occurs
      setIsLoading(false);
    } finally {
      setCurrentDataLoading(false)
    }
  };

  //console.log("Main-Data" , mainData)

  const fetchData = debounce(async () => {
    const data = await fetchDatadebounce();
    if (data) {
      setData(data.reverse());
      setmainData(data.filter((item) => item.ename === 'Not Alloted'));
    }
  }, 300); // Adjust debounce delay as needed

  // Fetch data automatically when the component mounts

  const handleSort = (sortType) => {
    switch (sortType) {
      case "oldest":
        setIncoFilter("oldest");
        setmainData(
          mainData.sort((a, b) => {
            const dateA = a["Company Incorporation Date  "] || "";
            const dateB = b["Company Incorporation Date  "] || "";
            return dateA.localeCompare(dateB);
          })
        );
        setOpenIncoDate(!openIncoDate)
        break;
      case "newest":
        setIncoFilter("newest");
        setmainData(
          mainData.sort((a, b) => {
            const dateA = a["Company Incorporation Date  "] || "";
            const dateB = b["Company Incorporation Date  "] || "";
            return dateB.localeCompare(dateA);
          })
        );
        setOpenIncoDate(!openIncoDate)
        break;
      case "none":
        setIncoFilter("none");
        setmainData(
          mainData.sort((a, b) => {
            const dateA = a["AssignDate"] || "";
            const dateB = b["AssignDate"] || "";
            return dateB.localeCompare(dateA);
          })
        );
        setOpenIncoDate(!openIncoDate)
        break;
      default:
        break;
    }
  };
  const handleSortAssign = (sortType) => {
    switch (sortType) {
      case "oldest":

        setmainData(
          mainData.sort((a, b) => {
            const dateA = a["AssignDate"] || "";
            const dateB = b["AssignDate"] || "";
            return dateA.localeCompare(dateB);
          })
        );
        setOpenIncoDate(!openIncoDate)
        break;
      case "newest":

        setmainData(
          mainData.sort((a, b) => {
            const dateA = a["AssignDate"] || "";
            const dateB = b["AssignDate"] || "";
            return dateB.localeCompare(dateA);
          })
        );
        setOpenIncoDate(!openIncoDate)
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Fetch data from the Node.js server
    // Call the fetchData function
    fetchData();
    fetchnewData();
    fetchRequestDetails();
    fetchRequestGDetails();
    fetchRemarksHistory();
  }, []);
  // const fileInputRef = useRef(null);
  const functionopenpopup = () => {
    openchange(true);
    setCsvData([]);
  };
  const functionopenpopupEmp = () => {
    openchangeEmp(true);
  };
  const handleFieldChange = (event) => {
    if (event.target.value === "Company Incorporation Date  ") {
      setSelectedField(event.target.value);
      setVisibility("block");
      setVisibilityOther("none");
      setSubFilterValue("");
    } else {
      setSelectedField(event.target.value);
      setVisibility("none");
      setVisibilityOther("block");
      setSubFilterValue("");
    }


  };

  const functionopenModifyPopup = () => {
    setopenPopupModify(true)
  }

  const functioncloseModifyPopup = () => {
    setopenPopupModify(false);
    setIsEditProjection(false);
  }

  const functionopenpopupNew = () => {
    openchangeNew(true);
  };
  const functionopenpopupConf = () => {
    openChangeConf(true);
  };
  const closepopup = () => {
    openchange(false);

    setCsvData([]);
  };
  const closepopupNew = () => {
    openchangeNew(false);
    setOpenFirstDirector(true);
    setOpenSecondDirector(false);
    setOpenThirdDirector(false);
    setFirstPlus(true);
    setSecondPlus(false);
    setOpenThirdMinus(false)
    fetchData();
  };
  const closepopupEmp = () => {
    openchangeEmp(false);
    fetchData();
  };
  const closepopupConf = () => {
    openChangeConf(false);
    fetchData();
  };

  const handleImportClick = () => {
    // fileInputRef.current.click();
    functionopenpopup();
  };
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // -------------------- SEARCH BAR-------------------------

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter the data based on the search query (case-insensitive partial match)
    const filtered = "ahmedabad";
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

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const filteredData = mainData.filter((company) => {
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
        return true;
      } else if (year == 0) {
        return true;
      }
      const selectedDate = new Date(fieldValue);
      const selectedMonth = selectedDate.getMonth() + 1; // Months are 0-indexed
      const selectedYear = selectedDate.getFullYear();

      // console.log(selectedMonth);
      //

      // Use the provided month variable in the comparison
      return (
        selectedMonth.toString().includes(month) &&
        selectedYear.toString().includes(year)
      );
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
  const currentData = filteredData.slice(startIndex, endIndex);

  //  Sub-filter value

  const handleSubFilterChange = (event) => {
    setSubFilterValue(event.target.value);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (
      file &&
      file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming there's only one sheet in the XLSX file
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        const formattedJsonData = jsonData
          .slice(1) // Exclude the first row (header)
          .map((row) => ({
            "Sr. No": row[0],
            "Company Name": row[1],
            "Company Number": row[2],
            "Company Email": row[3],
            "Company Incorporation Date  ": formatDateFromExcel(row[4]), // Assuming the date is in column 'E' (0-based)
            City: row[5],
            State: row[6],
            "Company Address": row[7],
            "Director Name(First)": row[8],
            "Director Number(First)": row[9],
            "Director Email(First)": row[10],
            "Director Name(Second)": row[11],
            "Director Number(Second)": row[12],
            "Director Email(Second)": row[13],
            "Director Name(Third)": row[14],
            "Director Number(Third)": row[15],
            "Director Email(Third)": row[16]
          }));

        setCsvData(formattedJsonData);
      };

      reader.readAsArrayBuffer(file);
    } else if (file.type === "text/csv") {
      // CSV file
      const parsedCsvData = parseCsv(data);
      setCsvData(parsedCsvData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>',
      });

      console.error("Please upload a valid XLSX file.");
    }
  };

  const parseCsv = (data) => {
    // Use a CSV parsing library (e.g., Papaparse) to parse CSV data
    // Example using Papaparse:
    const parsedData = Papa.parse(data, { header: true });
    return parsedData.data;
  };
  function formatDateFromExcel(serialNumber) {
    // Excel uses a different date origin (January 1, 1900)
    const excelDateOrigin = new Date(Date.UTC(1900, 0, 0));
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    // Adjust for Excel leap year bug (1900 is not a leap year)
    const daysAdjustment = serialNumber > 59 ? 1 : 0;

    // Calculate the date in milliseconds
    const dateMilliseconds =
      excelDateOrigin.getTime() +
      (serialNumber - daysAdjustment) * millisecondsPerDay;

    // Create a Date object using the calculated milliseconds
    const formattedDate = new Date(dateMilliseconds);

    // Format the date as needed (you can use a library like 'date-fns' or 'moment' for more options)
    // const formattedDateString = formattedDate.toISOString().split('T')[0];

    return formattedDate;
  }
  //console.log(csvdata)

  const handleUploadData = async (e) => {
    // Get current date and time

    // newArray now contains objects with updated properties

    if (selectedOption === "someoneElse") {
      const updatedCsvdata = csvdata.map((data) => ({
        ...data,
        ename: newemployeeSelection,
      }));
      const currentDate = new Date().toLocaleDateString();
      const currentTime = new Date().toLocaleTimeString();
      //console.log(updatedCsvdata)
      // Create a new array of objects with desired properties
      const newArray = updatedCsvdata.map((data) => ({
        date: currentDate,
        time: currentTime,
        ename: newemployeeSelection,
        companyName: data["Company Name"], // Assuming companyName is one of the existing properties in updatedCsvdata
      }));
      if (updatedCsvdata.length !== 0) {
        setLoading(true); // Move setLoading outside of the loop

        try {
          const response = await axios.post(
            `${secretKey}/leads`,
            updatedCsvdata
          );
          await axios.post(`${secretKey}/employee-history`, newArray);
          // await axios.post(`${secretKey}/employee-history`, updatedCsvdata);

          const counter = response.data.counter;
         // console.log("counter", counter)
          const successCounter = response.data.sucessCounter;
          //console.log(successCounter)

          if (counter === 0) {
            //console.log(response.data)
            Swal.fire({
              title: "Data Send!",
              text: "Data successfully sent to the Employee",
              icon: "success",
            });
          } else {
            const lines = response.data.split('\n');

            // Count the number of lines (entries)
            const numberOfDuplicateEntries = lines.length - 1;
            const noofSuccessEntries = newArray.length - numberOfDuplicateEntries
            Swal.fire({
              title: 'Do you want download duplicate entries report?',
              html: `Successful Entries: ${noofSuccessEntries}<br>Duplicate Entries: ${numberOfDuplicateEntries}<br>Click Yes to download report?`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Yes',
              cancelButtonText: 'No'
            }).then((result) => {
              if (result.isConfirmed) {
                //console.log(response.data)
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "DuplicateEntriesLeads.csv");
                document.body.appendChild(link);
                link.click();
                // User clicked "Yes", perform action
                // Call your function or execute your code here
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                return true;
              }
            });
          }
          fetchData();
          closepopup();
          setnewEmployeeSelection("Not Alloted");
        } catch (error) {
          if (error.response.status !== 500) {
            setErrorMessage(error.response.data.error);
            Swal.fire("Some of the data are not unique");
          } else {
            setErrorMessage("An error occurred. Please try again.");
            Swal.fire("Please upload unique data");
          }
          console.log("Error:", error);
        }
        setLoading(false); // Move setLoading outside of the loop
        setCsvData([]);
      } else {
        Swal.fire("Please upload data");
      }
    } else {

      if (csvdata.length !== 0) {
        setLoading(true); // Move setLoading outside of the loop
        try {
          await axios.post(`${secretKey}/leads`, csvdata);
          Swal.fire({
            title: "Data Send!",
            text: "Data successfully sent to the Employee",
            icon: "success",
          });

          fetchData();
          closepopup();
        } catch (error) {
          console.log("Error:", error);
        }

        setLoading(false); // Move setLoading outside of the loop

        setCsvData([]);
      } else {
        Swal.fire("Please upload data");
      }
    }
  };




  const [itemIdToDelete, setItemIdToDelete] = useState(null);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${secretKey}/leads/${id}`);
      // Refresh the data after successful deletion
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDeleteClick = (itemId) => {
    // Open the confirm delete modal
    setItemIdToDelete(itemId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // Perform the delete operation here (call your delete API, etc.)
    // After deletion, close the modal
    handleDelete(itemIdToDelete);
    setIsModalOpen(false);
  };
  const handleCancelDelete = () => {
    // Cancel the delete operation and close the modal
    setIsModalOpen(false);
  };

  // Submit the Dialogue box data manually

  const handleSubmitData = (e) => {
    e.preventDefault();
    axios
      .post(`${secretKey}/manual`, {
        "Company Name": cname,
        "Company Number": cnumber,
        "Company Email": cemail,
        "Company Incorporation Date  ": cidate,
        City: city,
        State: state,
        AssignDate: new Date(),
        "Company Address": companyAddress,
        "Director Name(First)": directorNameFirst,
        "Director Number(First)": directorNumberFirst,
        "Director Email(First)": directorEmailFirst,
        "Director Name(Second)": directorNameSecond,
        "Director Number(Second)": directorNumberSecond,
        "Director Email(Second)": directorEmailSecond,
        "Director Name(Third)": directorNameThird,
        "Director Number(Third)": directorNumberThird,
        "Director Email(Third)": directorEmailThird
      })
      .then((response) => {
        //console.log("response" , response)
        Swal.fire({
          title: "Data Added!",
          text: "Successfully added new Data!",
          icon: "success",
        });
        fetchData();
        closepopupNew();
      })
      .catch((error) => {
        Swal.fire("Please Enter Unique data!");
      });
  };

  const [openSecondDirector, setOpenSecondDirector] = useState(false)
  const [openFirstDirector, setOpenFirstDirector] = useState(true)
  const [openThirdDirector, setOpenThirdDirector] = useState(false)
  const [firstPlus, setFirstPlus] = useState(true)
  const [secondPlus, setSecondPlus] = useState(false)
  const [openThirdMinus, setOpenThirdMinus] = useState(false)

  const functionOpenSecondDirector = () => {
    setOpenSecondDirector(true);
    setFirstPlus(false);
    setSecondPlus(true);
  };
  const functionOpenThirdDirector = () => {
    setOpenSecondDirector(true);
    setOpenThirdDirector(true);
    setFirstPlus(false);
    setSecondPlus(false);
    setOpenThirdMinus(true);
  };

  const functionCloseSecondDirector = () => {
    setOpenFirstDirector(false);
    //setOpenThirdMinus(true);
    setOpenThirdMinus(false);
    setOpenSecondDirector(false);
    setSecondPlus(false);
    setFirstPlus(true)
  }
  const functionCloseThirdDirector = () => {
    setOpenSecondDirector(true);
    setOpenThirdDirector(false);
    setFirstPlus(false);
    setOpenThirdMinus(false)
    setSecondPlus(true)
  }

  // ------------------------------------------- CHECK BOX CONTENT----------------------------------------------------

  const [selectedRows, setSelectedRows] = useState([]);
  const [startRowIndex, setStartRowIndex] = useState(null);
  const handleCheckboxChange = (id) => {
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
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter((rowId) => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
    }
  };
  //console.log(selectedRows);

  const exportData = async () => {
    try {
      const response = await axios.post(
        `${secretKey}/exportLeads/`,
        selectedRows
      );
      //console.log("response",response.data)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      dataStatus === "Assigned"
        ? link.setAttribute("download", "AssignedLeads_Admin.csv")
        : link.setAttribute("download", "UnAssignedLeads_Admin.csv");

      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading CSV:", error);
    }
  };

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
    }
  };

  const handleMouseUp = () => {
    // End drag selection
    setStartRowIndex(null);
  };

  // const handleCheckboxChange = (id) => {
  //   // Toggle the selection status of the row with the given id
  //   setSelectedRows((prevSelectedRows) => {
  //     if (prevSelectedRows.includes(id)) {
  //       return prevSelectedRows.filter((rowId) => rowId !== id);
  //     } else {
  //       return [...prevSelectedRows, id];
  //     }
  //   });
  // };

  const handlePrintSelectedData = () => {
    // Print the data of the selected rows

    const selectedData = data.filter((row) => selectedRows.includes(row._id));

  };

  // Fetch Employees Data
const [dataManager,setDataManager] = useState([])

  const fetchnewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);
      const employeeData = response.data;
      const user = employeeData.find((user)=>user._id === userId)
      //console.log("user" , user)
      // Set the retrieved data in the state
      setDataManager(user)
      setnewEmpData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //console.log(dataManager)

  const handleconfirmAssign = async () => {
    const selectedObjects = data.filter((row) =>
      selectedRows.includes(row._id)
    );

    // Check if no data is selected
    if (selectedObjects.length === 0) {
      Swal.fire("Empty Data!");
      closepopupEmp();
      return; // Exit the function early if no data is selected
    }

    const alreadyAssignedData = selectedObjects.filter(
      (obj) => obj.ename && obj.ename !== "Not Alloted"
    );

    // If all selected data is not already assigned, proceed with assignment
    if (alreadyAssignedData.length === 0) {
      handleAssignData();
      return; // Exit the function after handling assignment
    }

    // If some selected data is already assigned, show confirmation dialog
    const userConfirmed = window.confirm(
      `Some data is already assigned. Do you want to continue?`
    );

    if (userConfirmed) {
      handleAssignData();
    } else {

    }
  };

  const handleAssignData = async () => {
    const title = `${selectedRows.length} data assigned to ${employeeSelection}`;
    const DT = new Date();
    const date = DT.toLocaleDateString();
    const time = DT.toLocaleTimeString();

    try {
      const response = await axios.post(`${secretKey}/postData`, {
        employeeSelection,
        selectedObjects: data.filter((row) => selectedRows.includes(row._id)),
        title,
        date,
        time,
      });
      Swal.fire("Data Assigned");
      fetchData();

    } catch (err) {
      console.log("Internal server Error", err);
      Swal.fire("Error Assigning Data");
    }
  };

  // const handleAssignData = async () => {
  //   // Find the selected employee object

  //   const selectedEmployee = newempData.find(
  //     (employee) => employee.ename === employeeSelection
  //   );
  //   const selectedData = data.filter((row) => selectedRows.includes(row._id));

  //   // Check if an employee is selected
  //   if (!selectedEmployee) {
  //     console.warn("No employee selected");
  //     return;
  //   }

  //   try {
  //     // Map the selected data to the format expected by the backend
  //     const formattedSelectedData = selectedData.map((row) => ({
  //       "Company Name": row["Company Name"],
  //       "Company Number": row["Company Number"],
  //       "Company Email": row["Company Email"],
  //       "Company Incorporation Date  ": row["Company Incorporation Date  "],
  //       City: row.City,
  //       State: row.State,
  //     }));

  //     // Make a PUT request using Axios to update the value on the backend
  //     const response = await axios.put(
  //       `${secretKey}/neweinfo/${selectedEmployee._id}`,
  //       {
  //         cInfo: formattedSelectedData,
  //       }
  //     );

  //     if (response.status === 200) {
  //       const updatedData = response.data.updatedData;
  //       console.log(`Value assigned to ${updatedData._id}`);
  //       window.location.reload();

  //       // Optionally, you can update the state or trigger a re-fetch of the data
  //       // based on your application's requirements.
  //     } else {
  //       console.error("Error updating data:", response.statusText);
  //       Swal.fire("Data Already exist");
  //     }
  //   } catch (error) {
  //     functionopenpopupConf();
  //     console.error("Error updating data:", error.message);
  //   }
  // };

  // delete selection

  const handleDeleteSelection = async () => {
    if (selectedRows.length !== 0) {
      // Show confirmation dialog using SweetAlert2
      Swal.fire({
        title: "Confirm Deletion",
        text: "Are you sure you want to delete the selected rows?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "No, cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // If user confirms, proceed with deletion
            await axios.delete(`${secretKey}/delete-rows`, {
              data: { selectedRows }, // Pass selected rows to the server
            });
            // Store backup process
            // After deletion, fetch updated data
            fetchData();
            setSelectedRows([]); // Clear selectedRows state
          } catch (error) {
            console.error("Error deleting rows:", error.message);
          }
        }
      });
    } else {
      // If no rows are selected, show an alert
      Swal.fire("Select some rows first!");
    }
  };

  const handleUndo = async () => {
    try {
      // Make a POST request to the /api/undo endpoint
      await axios.post(`${secretKey}/undo`);

      // Show success message
      Swal.fire('Data for the "newcdatas" collection restored successfully!');
    } catch (error) {
      console.error("Error restoring data:", error.message);
      // Show error message
      Swal.fire("Error restoring data:", error.message, "error");
    }
  };

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }

  // Assign to someone else

  const [selectedOption, setSelectedOption] = useState("direct");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // ----------------------------------------- INCOMING REQUEST FROM AN EMPLOYEE---------------------------------------------

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestData`);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const fetchRequestGDetails = async () => {
    try {
      const response = await axios.get(`${secretKey}/requestgData`);
      setRequestGData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };
  const [cid, setcid] = useState("");
  const [cstat, setCstat] = useState("");
  const [remarksHistory, setRemarksHistory] = useState([]);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const fetchRemarksHistory = async () => {
    try {
      const response = await axios.get(`${secretKey}/remarks-history`);
      setRemarksHistory(response.data);
      setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));


    } catch (error) {
      console.error("Error fetching remarks history:", error);
    }
  };
  const functionopenpopupremarks = (companyID, companyStatus) => {
    openchangeRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))

    setcid(companyID);
    setCstat(companyStatus);
  };
  const closepopupRemarks = () => {
    openchangeRemarks(false);
    setFilteredRemarks([]);
  };
  // console.log(requestData);
  // console.log(requestGData);

  const thTdStyle = {
    padding: "8px",
    border: "1px solid #ddd",
  };

  const thStyle = {
    backgroundColor: "#f2f2f2",
    position: "sticky",
    top: "0",
    zIndex: "1",
  };

  const stickyColumnsStyle = {
    left: "0",
    zIndex: "2",
    backgroundColor: "#fff",
  };

  const handleFilterIncoDate = () => {
    setOpenIncoDate(!openIncoDate);
  };
  const handleFilterAssignDate = () => {
    setOpenAssign(!openAssign);
  };

  const debouncedFilterData = debounce((status) => {
    // Filtering logic to set the mainData based on the status
    if (status === "Assigned") {
      setmainData(data.filter((item) => item.ename !== "Not Alloted"));
    }
    else {
      setmainData(data.filter((item) => item.ename === "Not Alloted"));
    }

    setDataStatus(status)
  }, 300);


  // --------------------------------------------------------------function to modify leads----------------------------------------------------------------


  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleSubmit = async (e) => {
    try {
      let dataToSend = {
        "Company Name": companyName,
        "Company Email": companyEmail,
        "Company Number": companynumber,
        "Company Incorporation Date ": companyIncoDate,
        "City": companyCity,
        "State": companyState,
      };
      const dateObject = new Date(companyIncoDate);

      // Check if the parsed Date object is valid
      if (!isNaN(dateObject.getTime())) {
        // Date object is valid, proceed with further processing
        //console.log("Company Incorporation Date:", dateObject);

        // Format the date as yyyy-mm-ddThh:mm:ss.000
        const isoDateString = dateObject.toISOString();

        // Update dataToSendUpdated with the formatted date
        let dataToSendUpdated = {
          "Company Name": companyName,
          "Company Email": companyEmail,
          "Company Number": companynumber,
          "Company Incorporation Date ": isoDateString, // Updated format
          "City": companyCity,
          "State": companyState,
        };

        //console.log("Data to send with updated date format:", dataToSendUpdated);
        if (isUpdateMode) {
          await axios.put(`${secretKey}/leads/${selectedDataId}`, dataToSendUpdated);
          Swal.fire({
            title: "Data Updated!",
            text: "You have successfully updated the name!",
            icon: "success",
          });
        }

        // Rest of your code...
      } else {
        // Date string couldn't be parsed into a valid Date object
        console.error("Invalid Company Incorporation Date string:", companyIncoDate);
      }



      // setEmail("");
      // setEname("");
      // setNumber(0);
      // setPassword("");
      // setDesignation("");
      // setotherDesignation("");
      // setJdate(null);
      setIsUpdateMode(false);
      fetchDatadebounce();
      functioncloseModifyPopup();
      //console.log("Data sent successfully");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.error("Internal server error");
    }
  };

  const [selectedDataId, setSelectedDataId] = useState()
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyIncoDate, setCompanyIncoDate] = useState(null);
  const [companyCity, setCompnayCity] = useState("");
  const [companyState, setCompnayState] = useState("");
  const [companynumber, setCompnayNumber] = useState("");
  const [isEditProjection, setIsEditProjection] = useState(false);


  //console.log(companyCity, companyEmail, companyIncoDate, companyState, companyName, companynumber)

  const handleUpdateClick = (id) => {
    console.log(id)
    //Set the selected data ID and set update mode to true
    setSelectedDataId(id);
    setIsUpdateMode(true);
    // setCompanyData(cdata.filter((item) => item.ename === echangename));

    // // Find the selected data object
    const selectedData = mainData.find((item) => item._id === id);
    //console.log(selectedData["Company Incorporation Date  "])
    //console.log(selectedData)
    // console.log(echangename);

    // // Update the form data with the selected data values
    setCompanyEmail(selectedData["Company Email"]);
    setCompanyName(selectedData["Company Name"]);
    //setCompanyIncoDate(new Date(selectedData["Company Incorporation Date  "]));
    setCompnayCity(selectedData["City"]);
    setCompnayState(selectedData["State"]);
    setCompnayNumber(selectedData["Company Number"]);

    const dateString = selectedData["Company Incorporation Date  "];

    // Parse the date string into a Date object
    const dateObject = new Date(dateString);

    // Check if the parsed Date object is valid
    if (!isNaN(dateObject.getTime())) {
      // Date object is valid, proceed with further processing
      //console.log("Company Incorporation Date:", dateObject);

      // Format the date as dd-mm-yyyy
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
      const year = dateObject.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;
      setCompanyIncoDate(formattedDate)

      //console.log("Formatted Company Incorporation Date:", formattedDate);

      // Rest of your code...
    } else {
      // Date string couldn't be parsed into a valid Date object
      console.error("Invalid Company Incorporation Date string:", dateString);
    }



  };


//console.log(dataManager.ename)
//console.log(dataManager.designation)

const dataManagerName = localStorage.getItem("dataManagerName")
console.log(dataManagerName)





  return (
    <div>
      <Header name={dataManagerName}/>
      <Navbar name={dataManagerName} />
      <EmployeeDataReport/>
    </div>
  );
}

export default DataManagerDashboard;
