import React from "react";
import Papa from "papaparse";
import Header from "./Header";
import Navbar from "./Navbar";
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
import "../assets/styles.css";
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
import Nodata from "../components/Nodata";
import FilterListIcon from "@mui/icons-material/FilterList";
import { red } from "@mui/material/colors";

function Leads() {
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
      setDataStatus("Unassigned")

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
    // if (data) {
    //   setData(data.reverse());
    //   setmainData(data.filter((item) => item.ename === 'Not Alloted'));
    // }
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
    setOpenFirstDirector(true);
    setOpenSecondDirector(false);
    setOpenThirdDirector(false);
    setFirstPlus(true);
    setSecondPlus(false);
    setOpenThirdMinus(false)
    //fetchData();
    setError('')
    setErrorDirectorNumberFirst("");
    setErrorDirectorNumberSecond("");
    setErrorDirectorNumberThird("");
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
    setError('')
    setErrorDirectorNumberFirst("");
    setErrorDirectorNumberSecond("");
    setErrorDirectorNumberThird("");
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

  // useEffect(() => {

  //   if(filteredData.length===0 && dataStatus === "Assigned"){
  //     setmainData(data.filter((item) => item.ename === "Not Alloted"));
  //     setDataStatus("Unassigned")
  //   }else if(filteredData.length===0 && dataStatus === "Unassigned") {
  //     setmainData(data.filter((item) => item.ename !== "Not Alloted"));
  //     setDataStatus("Assigned")
  //   }
  // }, [searchText])

  useEffect(() => {
    if (filteredData.length === 0 && dataStatus === "Assigned") {
      setmainData(data.filter((item) => item.ename === "Not Alloted"));
      setDataStatus("Unassigned")
    } else if (filteredData.length === 0 && dataStatus === "Unassigned") {
      setmainData(data.filter((item) => item.ename !== "Not Alloted"));
      setDataStatus("Assigned")
    }
  }, [searchText])


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

  const anotherMainCount = data.filter(obj => dataStatus === "Unassigned" ? obj.ename !== "Not Alloted" : obj.ename === "Not Alloted").filter((company) => {
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

  const mainAdminName = localStorage.getItem("adminName");


  // const filteredData = mainData.filter((company) => {
  //   // Extract the values you want to search from the company object
  //   const valuesToSearch = Object.values(company).map(value => {
  //     if (typeof value === "string") {
  //       return value.toLowerCase();
  //     } else if (typeof value === "number") {
  //       return value.toString();
  //     } else if (typeof value === "email") {
  //       // Convert date to a string representation
  //       return value.toString().toLowerCase();
  //     }
  //     // If the value is not string, number, or date, return an empty string
  //     return "";
  //   });

  //   // Join all values into a single string for easier searching
  //   const allValues = valuesToSearch.join(" ");

  //   // Perform case-insensitive search
  //   return allValues.toLowerCase().includes(searchText.toLowerCase());
  // });

  //console.log(filteredData)

  // const [filteredData, setfilteredData] = useState([])


  //console.log(mainData)
  const currentData = filteredData.slice(startIndex, endIndex);

  //  Sub-filter value

  const handleSubFilterChange = (event) => {
    setSubFilterValue(event.target.value);
  };

  // const parseCsvData = (csvString) => {

  //   const rows = csvString.split('\n');
  //   const header = rows[0].split(',');
  //   const data = [];

  //   for (let i = 1; i < rows.length; i++) {
  //     const values = rows[i].split(',');
  //     const rowData = {};

  //     for (let j = 0; j < header.length; j++) {
  //       rowData[header[j]] = values[j];
  //     }

  //     data.push(rowData);
  //   }

  //   return data;
  // };

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
        const adminName = localStorage.getItem("adminName")
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
            "Director Email(Third)": row[16],
            "UploadedBy": adminName ? adminName : "Admin"
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
    const adminName = localStorage.getItem("adminName")

    if (selectedOption === "someoneElse") {
      const properDate = new Date();
      const updatedCsvdata = csvdata.map((data) => ({
        ...data,
        ename: newemployeeSelection,
        AssignDate: properDate,
        UploadedBy: adminName ? adminName : "Admin"
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
          const response = await axios.post(
            `${secretKey}/leads`,
            csvdata
          );

          // await axios.post(`${secretKey}/employee-history`, updatedCsvdata);

          const counter = response.data.counter;
          // console.log("counter", counter)
          const successCounter = response.data.sucessCounter;
          //console.log(successCounter)

          if (counter === 0) {
            //console.log(response.data)
            Swal.fire({
              title: "Data Added!",
              text: "Data Successfully added to the Leads",
              icon: "success",
            });
          } else {
            const lines = response.data.split('\n');

            // Count the number of lines (entries)
            const numberOfDuplicateEntries = lines.length - 1;
            const noofSuccessEntries = csvdata.length - numberOfDuplicateEntries
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

    if (cname === "") {
      Swal.fire("Please Enter Company Name");
    } else if (!cnumber && !/^\d{10}$/.test(cnumber)) {
      Swal.fire("Company Number is required");
    } else if (cemail === "") {
      Swal.fire("Company Email is required");
    } else if (city === "") {
      Swal.fire("City is required");
    } else if (state === "") {
      Swal.fire("State is required");
    } else if (directorNumberFirst !== 0 && !/^\d{10}$/.test(directorNumberFirst)) {
      Swal.fire("First Director Number should be 10 digits");
    } else if (directorNumberSecond !== 0 && !/^\d{10}$/.test(directorNumberSecond)) {
      Swal.fire("Second Director Number should be 10 digits");
    } else if (directorNumberThird !== 0 && !/^\d{10}$/.test(directorNumberThird)) {
      Swal.fire("Third Director Number should be 10 digits");
    } else {
      axios
        .post(`${secretKey}/manual`, {
          "Company Name": cname.toUpperCase().trim(),
          "Company Number": cnumber,
          "Company Email": cemail,
          "Company Incorporation Date  ": cidate, // Assuming the correct key is "Company Incorporation Date"
          City: city,
          State: state,
          ename: data.ename,
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
          "Director Email(Third)": directorEmailThird,
        })
        .then((response) => {
          console.log("response", response);
          console.log("Data sent Successfully");
          Swal.fire({
            title: "Data Added!",
            text: "Successfully added new Data!",
            icon: "success",
          });
          fetchData();
          closepopupNew();
        })
        .catch((error) => {
          console.error("Error sending data:", error);
          Swal.fire("An error occurred. Please try again later.");
        });
    }
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

  const fetchnewData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state

      setnewEmpData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const handleconfirmAssign = async () => {
    const selectedObjects = data.filter((row) =>
      selectedRows.includes(row._id)
    );

    console.log("selectedObjecyt", selectedObjects)
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
    const currentDataStatus = dataStatus;
    try {
      const response = await axios.post(`${secretKey}/postData`, {
        employeeSelection,
        selectedObjects: data.filter((row) => selectedRows.includes(row._id)),
        title,
        date,
        time,
      });
      Swal.fire("Data Assigned");
      openchangeEmp(false);
      fetchData();
      setSelectedRows([]);
      setDataStatus(currentDataStatus);
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
      //   setmainData(
      //     data.sort((a, b) => {
      //         const dateA = a["AssignDate"] || "";
      //         const dateB = b["AssignDate"] || "";
      //         return dateB.localeCompare(dateA);
      //     })
      // );
    }
    else {
      setmainData(data.filter((item) => item.ename === "Not Alloted"));
    }

    setDataStatus(status)
  }, 300);


  // --------------------------------------------------------------function to modify leads----------------------------------------------------------------


  const [isUpdateMode, setIsUpdateMode] = useState(false);

  // const handleSubmit = async (e) => {
  //   const adminName = localStorage.getItem("adminName");
  //   try {
  //     let dataToSend = {
  //       "Company Name": companyName,
  //       "Company Email": companyEmail,
  //       "Company Number": companynumber,
  //       "Company Incorporation Date ": companyIncoDate,
  //       "City": companyCity,
  //       "State": companyState,
  //       "UploadedBy":adminName ? adminName : "Admin"
  //     };
  //     const dateObject = new Date(companyIncoDate);

  //     // Check if the parsed Date object is valid
  //     if (!isNaN(dateObject.getTime())) {
  //       // Date object is valid, proceed with further processing
  //       //console.log("Company Incorporation Date:", dateObject);

  //       // Format the date as yyyy-mm-ddThh:mm:ss.000
  //       const isoDateString = dateObject.toISOString();

  //       // Update dataToSendUpdated with the formatted date
  //       let dataToSendUpdated = {
  //         "Company Name": companyName,
  //         "Company Email": companyEmail,
  //         "Company Number": companynumber,
  //         "Company Incorporation Date ": isoDateString, // Updated format
  //         "City": companyCity,
  //         "State": companyState,
  //         "Company Address":cAddress,
  //         'Director Name(First)':directorNameFirstModify,
  //         'Director Number(First)':directorNumberFirstModify,
  //         'Director Email(First)':directorEmailFirstModify,
  //         'Director Name(Second)':directorNameSecondModify,
  //         'Director Number(Second)':directorNumberSecondModify,
  //         'Director Email(Second)':directorEmailSecondModify,
  //         'Director Name(Third)':directorNameThirdModify,
  //         'Director Number(Third)':directorNumberThirdModify,
  //         'Director Email(Third)':directorEmailThirdModify,
  //         "UploadedBy":adminName ? adminName : "Admin"
  //       };

  //       //console.log("Data to send with updated date format:", dataToSendUpdated);
  //       if (isUpdateMode) {
  //         if (companyName === "") {
  //           Swal.fire("Please Enter Company Name");
  //         } else if (!companynumber && !/^\d{10}$/.test(companynumber)) {
  //           Swal.fire("Company Number is required");
  //         } else if (companyEmail === "") {
  //           Swal.fire("Company Email is required");
  //         } else if (companyCity === "") {
  //           Swal.fire("City is required");
  //         } else if (companyState === "") {
  //           Swal.fire("State is required");
  //         } else if (directorNumberFirstModify !== 0 && !/^\d{10}$/.test(directorNumberFirstModify)) {
  //           Swal.fire("First Director Number should be 10 digits");
  //         } else if (directorNumberSecondModify !== 0 && !/^\d{10}$/.test(directorNumberSecondModify)) {
  //           Swal.fire("Second Director Number should be 10 digits");
  //         } else if (directorNumberThirdModify !== 0 && !/^\d{10}$/.test(directorNumberThirdModify)) {
  //           Swal.fire("Third Director Number should be 10 digits");
  //         }else{
  //         await axios.put(`${secretKey}/leads/${selectedDataId}`, dataToSendUpdated);
  //         Swal.fire({
  //           title: "Data Updated!",
  //           text: "You have successfully updated the name!",
  //           icon: "success",
  //         });
  //       }
  //     }

  //       // Rest of your code...
  //     } else {
  //       // Date string couldn't be parsed into a valid Date object
  //       console.error("Invalid Company Incorporation Date string:", companyIncoDate);
  //     }
  //     setIsUpdateMode(false);
  //     fetchDatadebounce();
  //     functioncloseModifyPopup();
  //     //console.log("Data sent successfully");
  //   } catch {
  //     Swal.fire({
  //       icon: "error",
  //       title: "Oops...",
  //       text: "Something went wrong!",
  //     });
  //     console.error("Internal server error");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminName = localStorage.getItem("adminName");
    try {
      let validationError = false;

      if (companyName === "") {
        validationError = true;
        Swal.fire("Please Enter Company Name");
      } else if (!companynumber || !/^\d{10}$/.test(companynumber)) {
        validationError = true;
        Swal.fire("Company Number is required and should be 10 digits");
      } else if (companyEmail === "") {
        validationError = true;
        Swal.fire("Company Email is required");
      } else if (companyCity === "") {
        validationError = true;
        Swal.fire("City is required");
      } else if (companyState === "") {
        validationError = true;
        Swal.fire("State is required");
      } else if (directorNumberFirstModify && !/^\d{10}$/.test(directorNumberFirstModify)) {
        validationError = true;
        Swal.fire("First Director Number should be 10 digits");
      } else if (directorNumberSecondModify && !/^\d{10}$/.test(directorNumberSecondModify)) {
        validationError = true;
        Swal.fire("Second Director Number should be 10 digits");
      } else if (directorNumberThirdModify && !/^\d{10}$/.test(directorNumberThirdModify)) {
        validationError = true;
        Swal.fire("Third Director Number should be 10 digits");
      }

      if (!validationError) {
        const dateObject = new Date(companyIncoDate);

        // Check if the parsed Date object is valid
        if (!isNaN(dateObject.getTime())) {
          // Date object is valid, proceed with further processing
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
            "Company Address": cAddress,
            'Director Name(First)': directorNameFirstModify,
            'Director Number(First)': directorNumberFirstModify,
            'Director Email(First)': directorEmailFirstModify,
            'Director Name(Second)': directorNameSecondModify,
            'Director Number(Second)': directorNumberSecondModify,
            'Director Email(Second)': directorEmailSecondModify,
            'Director Name(Third)': directorNameThirdModify,
            'Director Number(Third)': directorNumberThirdModify,
            'Director Email(Third)': directorEmailThirdModify,
            "UploadedBy": adminName ? adminName : "Admin"
          };

          if (isUpdateMode) {
            await axios.put(`${secretKey}/leads/${selectedDataId}`, dataToSendUpdated);
            Swal.fire({
              title: "Data Updated!",
              text: "You have successfully updated the name!",
              icon: "success",
            });
          }

          // Reset the form and any error messages
          setIsUpdateMode(false);
          fetchDatadebounce();
          functioncloseModifyPopup();
        } else {
          // Date string couldn't be parsed into a valid Date object
          console.error("Invalid Company Incorporation Date string:", companyIncoDate);
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.error("Internal server error", error);
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
  const [cAddress, setCAddress] = useState("");
  const [directorNameFirstModify, setDirectorNameFirstModify] = useState("")
  const [directorNumberFirstModify, setDirectorNumberFirstModify] = useState("")
  const [directorEmailFirstModify, setDirectorEmailFirstModify] = useState("")
  const [directorNameSecondModify, setDirectorNameSecondModify] = useState("")
  const [directorNumberSecondModify, setDirectorNumberSecondModify] = useState("")
  const [directorEmailSecondModify, setDirectorEmailSecondModify] = useState("")
  const [directorNameThirdModify, setDirectorNameThirdModify] = useState("")
  const [directorNumberThirdModify, setDirectorNumberThirdModify] = useState("")
  const [directorEmailThirdModify, setDirectorEmailThirdModify] = useState("")




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
    console.log(selectedData)
    // console.log(echangename);

    // // Update the form data with the selected data values
    setCompanyEmail(selectedData["Company Email"]);
    setCompanyName(selectedData["Company Name"]);
    //setCompanyIncoDate(new Date(selectedData["Company Incorporation Date  "]));
    setCompnayCity(selectedData["City"]);
    setCompnayState(selectedData["State"]);
    setCompnayNumber(selectedData["Company Number"]);
    setCAddress(selectedData["Company Address"])
    setDirectorNameFirstModify(selectedData["Director Name(First)"])
    setDirectorNumberFirstModify(selectedData["Director Number(First)"])
    setDirectorEmailFirstModify(selectedData["Director Email(First)"])
    setDirectorNameSecondModify(selectedData["Director Name(Second)"])
    setDirectorNumberSecondModify(selectedData["Director Number(Second)"])
    setDirectorEmailSecondModify(selectedData["Director Email(Second)"])
    setDirectorNameThirdModify(selectedData["Director Name(Third)"])
    setDirectorNumberThirdModify(selectedData["Director Number(Third)"])
    setDirectorEmailThirdModify(selectedData["Director Email(Third)"])
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

  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // -------------------------------------------------add leads form validation and debounce correction----------------------------------

  const debouncedSetCname = debounce((value) => {
    setCname(value);
  }, 10);

  const debouncedSetEmail = debounce((value) => {
    setCemail(value);
  }, 10);

  const debouncedSetAddress = debounce((value) => {
    setCompanyAddress(value);
  }, 10);

  const debouncedSetIncoDate = debounce((value) => {
    setCidate(value);
  }, 10);

  const [error, setError] = useState('');

  const debouncedSetCompanyNumber = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setCnumber(value);
      setError('');
    } else {
      setError('Please enter a 10-digit number');
      setCnumber()
    }

  }, 10);

  const debouncedSetCity = debounce((value) => {
    setCity(value);
  }, 10);

  const debouncedSetState = debounce((value) => {
    setState(value);
  }, 10);

  const debounceSetFirstDirectorName = debounce((value) => {
    setDirectorNameFirst(value);
  }, 10);

  const [errorDirectorNumberFirst, setErrorDirectorNumberFirst] = useState("")
  const [errorDirectorNumberSecond, setErrorDirectorNumberSecond] = useState("")
  const [errorDirectorNumberThird, setErrorDirectorNumberThird] = useState("")

  const debounceSetFirstDirectorNumber = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setDirectorNumberFirst(value)
      setErrorDirectorNumberFirst("")
    } else {
      setErrorDirectorNumberFirst('Please Enter 10 digit Number')
      setDirectorNumberFirst()
    }
  }, 10);

  const debounceSetFirstDirectorEmail = debounce((value) => {
    setDirectorEmailFirst(value);
  }, 10);

  const debounceSetSecondDirectorName = debounce((value) => {
    setDirectorNameSecond(value);
  }, 10);

  const debounceSetSecondDirectorNumber = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setDirectorNumberSecond(value)
      setErrorDirectorNumberSecond("")
    } else {
      setErrorDirectorNumberSecond('Please Enter 10 digit Number')
      setDirectorNumberSecond()
    }
  }, 10);

  const debounceSetSecondDirectorEmail = debounce((value) => {
    setDirectorEmailSecond(value);
  }, 10);

  const debounceSetThirdDirectorName = debounce((value) => {
    setDirectorNameThird(value);
  }, 10);

  const debounceSetThirdDirectorNumber = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setDirectorNumberThird(value)
      setErrorDirectorNumberThird("")
    } else {
      setErrorDirectorNumberThird('Please Enter 10 digit Number')
      setDirectorNumberThird()
    }
  }, 10);

  const debounceSetThirdDirectorEmail = debounce((value) => {
    setDirectorEmailThird(value);
  }, 10);

  // ----------------------------------------modify popup window-------------------------------

  const debouncedSetCompanyName = debounce((value) => {
    setCompanyName(value);
  }, 10);

  const debouncedSetCompanyEmail = debounce((value) => {
    setCompanyEmail(value);
  }, 10);

  const debouncedSetCAddress = debounce((value) => {
    setCAddress(value);
  }, 10);

  const debouncedSetCompanyIncoDate = debounce((value) => {
    setCompanyIncoDate(value);
  }, 10);

  const [errorCompnayNumber, setErrorCompnayNumber] = useState('');

  const debouncedSetCompnayNumber = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setCompnayNumber(value);
      setErrorCompnayNumber('');
    } else {
      setError('Please enter a 10-digit number');
      setCompnayNumber()
    }

  }, 10);

  const debouncedSetCompnayCity = debounce((value) => {
    setCompnayCity(value);
  }, 10);

  const debouncedSetCompanyState = debounce((value) => {
    setCompnayState(value);
  }, 10);

  const debounceSetFirstDirectorNameModify = debounce((value) => {
    setDirectorNameFirstModify(value);
  }, 10);

  const [errorDirectorNumberFirstModify, setErrorDirectorNumberFirstModify] = useState("")
  const [errorDirectorNumberSecondModify, setErrorDirectorNumberSecondModify] = useState("")
  const [errorDirectorNumberThirdModify, setErrorDirectorNumberThirdModify] = useState("")

  const debounceSetFirstDirectorNumberModify = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setDirectorNumberFirstModify(value)
      setErrorDirectorNumberFirstModify("")
    } else {
      setErrorDirectorNumberFirstModify('Please Enter 10 digit Number')
      setDirectorNumberFirstModify()
    }
  }, 10);

  const debounceSetFirstDirectorEmailModify = debounce((value) => {
    setDirectorEmailFirstModify(value);
  }, 10);

  const debounceSetSecondDirectorNameModify = debounce((value) => {
    setDirectorNameSecondModify(value);
  }, 10);

  const debounceSetSecondDirectorNumberModify = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setDirectorNumberSecondModify(value)
      setErrorDirectorNumberSecondModify("")
    } else {
      setErrorDirectorNumberSecondModify('Please Enter 10 digit Number')
      setDirectorNumberSecondModify()
    }
  }, 10);

  const debounceSetSecondDirectorEmailModify = debounce((value) => {
    setDirectorEmailSecondModify(value);
  }, 10);

  const debounceSetThirdDirectorNameModify = debounce((value) => {
    setDirectorNameThirdModify(value);
  }, 10);

  const debounceSetThirdDirectorNumberModify = debounce((value) => {
    if (/^\d{10}$/.test(value)) {
      setDirectorNumberThirdModify(value)
      setErrorDirectorNumberThirdModify("")
    } else {
      setErrorDirectorNumberThirdModify('Please Enter 10 digit Number')
      setDirectorNumberThirdModify()
    }
  }, 10);

  const debounceSetThirdDirectorEmailModify = debounce((value) => {
    setDirectorEmailThirdModify(value);
  }, 10);





  return (
    <div>
      <Header />
      <Navbar />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 9,
          },
          content: {
            width: "fit-content",
            height: "fit-content",
            margin: "auto",
            textAlign: "center",
          },
        }}
      >
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
      </Modal>
      {/* <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
        <DialogTitle>
          Upload Files{" "}
          <IconButton onClick={closepopup} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>

        <DialogContent>
          <input
            type="file"
            style={{ display: "none" }}
            multiple
            // onChange={handleFileChange}
          />

          <div
            style={{
              border: "2px dashed #ccc",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <div
              style={{
                border: "2px dashed #ccc",
                borderRadius: "50%",
                width: "100px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
              // onClick={handleUploadClick}
            >
              <span style={{ fontSize: "24px", cursor: "pointer" }}>+</span>
            </div>
            <p>Drag files here or click to browse</p>
          </div>

          <div style={{display:"flex" , justifyContent:"space-between"}} className="footer">
            <Button onClick={closepopup}>Cancel</Button>
            <button  className="btn btn-primary d-none d-sm-inline-block">
        
              
              Upload
            </button>
          </div>
        </DialogContent>
      </Dialog> */}

      {/* Dialog for Confirmation of Assignment */}

      <Dialog open={openConf} onClose={closepopupConf}>
        <DialogTitle>
          Confirm Assignation!
          <IconButton onClick={closepopupConf} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>

        <DialogContent>
          <div className="Swal.firediv">
            <h3>
              This Data is already assigned to name, are you sure you want to
              continue?
            </h3>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            className="maincontent"
          >
            <button className="btn btn-primary ms-auto">Yes</button>

            <Button>No</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialogue for Assign Leads */}
      <Dialog open={openEmp} onClose={closepopupEmp} fullWidth maxWidth="sm">
        <DialogTitle>
          Assign Data{" "}
          <IconButton onClick={closepopupEmp} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div>
            {newempData.length !== 0 ? (
              <>
                <div className="dialogAssign">
                  <div className="selector form-control">
                    <select
                      style={{
                        width: "inherit",
                        border: "none",
                        outline: "none",
                      }}
                      value={employeeSelection}
                      onChange={(e) => {
                        setEmployeeSelection(e.target.value);
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
              </>
            ) : (
              <div>
                <h1>No Employees Found</h1>
              </div>
            )}
          </div>
        </DialogContent>
        <div className="btn-list">
          <button
            style={{ width: "100vw", borderRadius: "0px" }}
            onClick={handleconfirmAssign}
            className="btn btn-primary ms-auto"
          >
            Assign Data
          </button>
        </div>
      </Dialog>

      {/* Dialog for ADD leads */}

      {/* <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="sm">
        <DialogTitle>
          Company Info{" "}
          <IconButton onClick={closepopupNew} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Company Name"
                    onChange={(e) => {
                      setCname(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="example-text-input"
                    placeholder="example@gmail.com"
                    onChange={(e) => {
                      setCemail(e.target.value);
                    }}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Company Number</label>
                      <input
                        type="number"
                        onChange={(e) => {
                          setCnumber(e.target.value);
                        }}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        onChange={(e) => {
                          setCidate(e.target.value);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        onChange={(e) => {
                          setCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"

                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        //disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <button className="btn btn-primary" onClick={handleSubmitData}>
          Submit
        </button>
      </Dialog> */}
      {/* Loading Screen */}

      <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="md">
        <DialogTitle>
          Company Info{" "}
          <IconButton onClick={closepopupNew} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Your Company Name"
                        onChange={(e) => {
                          debouncedSetCname(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Number <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="number"
                        placeholder="Enter Company's Phone No."
                        onChange={(e) => {
                          debouncedSetCompanyNumber(e.target.value);
                        }}
                        className="form-control"
                      />
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Email <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="example@gmail.com"
                        onChange={(e) => {
                          debouncedSetEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        onChange={(e) => {
                          debouncedSetIncoDate(e.target.value);
                        }}
                        type="date"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">City<span style={{ color: "red" }}>*</span></label>
                      <input
                        onChange={(e) => {
                          debouncedSetCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        placeholder="Enter Your City"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">State<span style={{ color: "red" }}>*</span></label>
                      <input
                        onChange={(e) => {
                          debouncedSetState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        placeholder="Enter Your State"
                      //disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Company Address</label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Enter Your Address"
                        onChange={(e) => {
                          debouncedSetAddress(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Name(First)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Your Company Name"
                        onChange={(e) => {
                          debounceSetFirstDirectorName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Number(First)</label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Enter Phone No."
                        onChange={(e) => {
                          debounceSetFirstDirectorNumber(e.target.value);
                        }}
                      />
                      {errorDirectorNumberFirst && <p style={{ color: 'red' }}>{errorDirectorNumberFirst}</p>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Email(First)</label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="example@gmail.com"
                        onChange={(e) => {
                          debounceSetFirstDirectorEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                {firstPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                  <button
                    onClick={() => { functionOpenSecondDirector() }}
                    className="btn btn-primary d-none d-sm-inline-block">
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
                  </button>
                  <button className="btn btn-primary d-none d-sm-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                      width="24"
                      height="24"
                      fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                  </button></div>)}

                {openSecondDirector && (
                  <div className="row">
                    <div className="col-4">
                      <div className="mb-3">
                        <label className="form-label">Director's Name(Second)</label>
                        <input
                          type="text"
                          className="form-control"
                          name="example-text-input"
                          placeholder="Your Company Name"
                          onChange={(e) => {
                            debounceSetSecondDirectorName(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="mb-3">
                        <label className="form-label">Director's Number(Second)</label>
                        <input
                          type="email"
                          className="form-control"
                          name="example-text-input"
                          placeholder="Enter Phone No."
                          onChange={(e) => {
                            debounceSetSecondDirectorNumber(e.target.value);
                          }}
                        />
                        {errorDirectorNumberSecond && <p style={{ color: 'red' }}>{errorDirectorNumberSecond}</p>}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="mb-3">
                        <label className="form-label">Director's Email(Second)</label>
                        <input
                          type="email"
                          className="form-control"
                          name="example-text-input"
                          placeholder="example@gmail.com"
                          onChange={(e) => {
                            debounceSetSecondDirectorEmail(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>)}
                {secondPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                  <button
                    onClick={() => { functionOpenThirdDirector() }}
                    className="btn btn-primary d-none d-sm-inline-block">
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
                  </button>
                  <button className="btn btn-primary d-none d-sm-inline-block" onClick={() => { functionCloseSecondDirector() }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                      width="24"
                      height="24"
                      fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                  </button></div>)}

                {openThirdDirector && (<div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Name(Third)</label>
                      <input
                        type="text"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Your Company Name"
                        onChange={(e) => {
                          debounceSetThirdDirectorName(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Number(Third)</label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Enter Phone No"
                        onChange={(e) => {
                          debounceSetThirdDirectorNumber(e.target.value);
                        }}
                      />
                      {errorDirectorNumberThird && <p style={{ color: 'red' }}>{errorDirectorNumberThird}</p>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Email(Third)</label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="example@gmail.com"
                        onChange={(e) => {
                          debounceSetThirdDirectorEmail(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>)}
                {openThirdMinus && (<button className="btn btn-primary d-none d-sm-inline-block" style={{ float: "right" }} onClick={() => { functionCloseThirdDirector() }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                    width="24"
                    height="24"
                    fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                </button>)}
              </div>
            </div>
          </div>
        </DialogContent>
        <button className="btn btn-primary" onClick={handleSubmitData}>
          Submit
        </button>
      </Dialog>

      {/* ----------------------------ADD-Lead Ends here------------------------------------------------------------------------  */}


      {/* ------------------------------------------------------------dialog for modify leads----------------------------------------------- */}


      <Dialog open={openPopupModify} onClose={functioncloseModifyPopup} fullWidth maxWidth="md">
        <DialogTitle className="d-flex align-items-center justify-content-between">
          <div>
            Company Info{" "}
          </div>
          <div>
            <IconButton onClick={() => { setIsEditProjection(true) }}>
              <ModeEditIcon color="grey"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              >
              </ModeEditIcon>
            </IconButton>
            <IconButton onClick={functioncloseModifyPopup}>
              <CloseIcon color="grey"></CloseIcon>
            </IconButton>{" "}
          </div>

        </DialogTitle>
        <DialogContent>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Name <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Your Company Name"
                        value={companyName}
                        onChange={(e) => {
                          debouncedSetCompanyName(e.target.value);
                        }}
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Number <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="number"
                        className="form-control"
                        name="example-text-input"
                        placeholder="Your Company Number"
                        value={companynumber}
                        onChange={(e) => {
                          debouncedSetCompnayNumber(e.target.value);
                        }}
                        disabled={!isEditProjection}
                      />
                      {errorCompnayNumber && <p style={{ color: 'red' }}>{errorCompnayNumber}</p>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Company Email <span style={{ color: "red" }}>*</span></label>
                      <input
                        type="email"
                        className="form-control"
                        name="example-text-input"
                        placeholder="example@gmail.com"
                        value={companyEmail}
                        onChange={(e) => {
                          debouncedSetCompanyEmail(e.target.value);
                        }}
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        value={companyIncoDate}
                        onChange={(e) => {
                          debouncedSetCompanyIncoDate(e.target.value)
                        }}
                        type="date"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">City<span style={{ color: "red" }}>*</span></label>
                      <input
                        value={companyCity}
                        onChange={(e) => {
                          debouncedSetCompnayCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <label className="form-label">State<span style={{ color: "red" }}>*</span></label>
                      <input
                        value={companyState}
                        onChange={(e) => {
                          debouncedSetCompanyState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label className="form-label">Company Address</label>
                      <input
                        value={cAddress}
                        onChange={(e) => {
                          debouncedSetCAddress(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Name(First)</label>
                      <input
                        value={directorNameFirstModify}
                        onChange={(e) => {
                          debounceSetFirstDirectorNameModify(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Number(First)</label>
                      <input
                        value={directorNumberFirstModify}
                        onChange={(e) => {
                          debounceSetFirstDirectorNumberModify(e.target.value);
                        }}
                        type="number"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                      {errorDirectorNumberFirst && <p style={{ color: 'red' }}>{errorDirectorNumberFirst}</p>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Email(First)</label>
                      <input
                        value={directorEmailFirstModify}
                        onChange={(e) => {
                          debounceSetFirstDirectorEmailModify(e.target.value);
                        }}
                        type="email"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
                {firstPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                  <button
                    onClick={() => { functionOpenSecondDirector() }}
                    className="btn btn-primary d-none d-sm-inline-block">
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
                  </button>
                  <button className="btn btn-primary d-none d-sm-inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                      width="24"
                      height="24"
                      fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                  </button></div>)}

                {openSecondDirector && (
                  <div className="row">
                    <div className="col-4">
                      <div className="mb-3">
                        <label className="form-label">Director's Name(Second)</label>
                        <input
                          value={directorNameSecondModify}
                          onChange={(e) => {
                            debounceSetSecondDirectorNameModify(e.target.value);
                          }}
                          type="text"
                          className="form-control"
                          disabled={!isEditProjection}
                        />
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="mb-3">
                        <label className="form-label">Director's Number(Second)</label>
                        <input
                          value={directorNumberSecondModify}
                          onChange={(e) => {
                            debounceSetSecondDirectorNumberModify(e.target.value);
                          }}
                          type="number"
                          className="form-control"
                          disabled={!isEditProjection}
                        />
                        {errorDirectorNumberSecondModify && <p style={{ color: 'red' }}>{errorDirectorNumberSecondModify}</p>}
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="mb-3">
                        <label className="form-label">Director's Email(Second)</label>
                        <input
                          value={directorEmailSecondModify}
                          onChange={(e) => {
                            debounceSetSecondDirectorEmailModify(e.target.value);
                          }}
                          type="email"
                          className="form-control"
                          disabled={!isEditProjection}
                        />
                      </div>
                    </div>
                  </div>)}
                {secondPlus && (<div className="d-flex align-items-center justify-content-end gap-2">
                  <button
                    onClick={() => { functionOpenThirdDirector() }}
                    className="btn btn-primary d-none d-sm-inline-block">
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
                  </button>
                  <button className="btn btn-primary d-none d-sm-inline-block" onClick={() => { functionCloseSecondDirector() }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                      width="24"
                      height="24"
                      fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                  </button></div>)}

                {openThirdDirector && (<div className="row">
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Name(Third)</label>
                      <input
                        value={directorNameThirdModify}
                        onChange={(e) => {
                          debounceSetThirdDirectorNameModify(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Number(Third)</label>
                      <input
                        value={directorNumberThirdModify}
                        onChange={(e) => {
                          debounceSetThirdDirectorNumberModify(e.target.value);
                        }}
                        type="number"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                      {errorDirectorNumberThirdModify && <p style={{ color: 'red' }}>{errorDirectorNumberThirdModify}</p>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="mb-3">
                      <label className="form-label">Director's Email(Third)</label>
                      <input
                        value={directorEmailThirdModify}
                        onChange={(e) => {
                          debounceSetThirdDirectorEmailModify(e.target.value);
                        }}
                        type="email"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>)}
                {openThirdMinus && (<button className="btn btn-primary d-none d-sm-inline-block" style={{ float: "right" }} onClick={() => { functionCloseThirdDirector() }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon"
                    width="24"
                    height="24"
                    fill="white" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg>
                </button>)}
              </div>
            </div>
          </div>
        </DialogContent>
        {/* <DialogContent>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    className="form-control"
                    name="example-text-input"
                    placeholder="Your Company Name"
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Email</label>
                  <input
                    type="email"
                    value={companyEmail}
                    className="form-control"
                    name="example-text-input"
                    placeholder="example@gmail.com"
                    onChange={(e) => {
                      setCompanyEmail(e.target.value);
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">Company Number</label>
                      <input
                        type="number"
                        value={companynumber}
                        onChange={(e) => {
                          setCompnayNumber(e.target.value);
                        }}
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">
                        Company Incorporation Date
                      </label>
                      <input
                        value={companyIncoDate}
                        onChange={(e) => {
                          setCompanyIncoDate(e.target.value)
                        }}
                        type="date"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">City</label>
                      <input
                        value={companyCity}
                        onChange={(e) => {
                          setCompnayCity(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label className="form-label">State</label>
                      <input
                        value={companyState}
                        onChange={(e) => {
                          setCompnayState(e.target.value);
                        }}
                        type="text"
                        className="form-control"
                        disabled={!isEditProjection}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent> */}
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </Dialog>

      {open && (
        <div>
          <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
            <DialogTitle>
              Import CSV DATA{" "}
              <IconButton onClick={closepopup} style={{ float: "right" }}>
                <CloseIcon color="primary"></CloseIcon>
              </IconButton>{" "}
            </DialogTitle>
            <DialogContent>
              <div className="maincon">
                <div
                  style={{ justifyContent: "space-between" }}
                  className="con1 d-flex"
                >
                  <div style={{ paddingTop: "9px" }} className="uploadcsv">
                    <label
                      style={{ margin: "0px 0px 6px 0px" }}
                      htmlFor="upload"
                    >
                      Upload CSV File
                    </label>
                  </div>
                  <a href={frontendKey + "/AddLeads_AdminSample.xlsx"} download>
                    Download Sample
                  </a>
                </div>
                <div
                  style={{ margin: "5px 0px 0px 0px" }}
                  className="form-control"
                >
                  <input
                    type="file"
                    name="csvfile
                      "
                    id="csvfile"
                    onChange={handleFileChange}
                  />
                </div>
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
                    <label htmlFor="direct">Upload To General</label>
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
            <button className="btn btn-primary" onClick={handleUploadData}>
              Submit
            </button>
          </Dialog>
        </div>
      )}

      {/* Remarks 3 Pop up */}
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

      {/* Main Page Starts from here */}
      {loading && (
        // Your loading screen component or message
        <Box style={{ zIndex: "999999999" }} sx={{ display: "flex" }}>
          <CircularProgress />
        </Box>
      )}
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="tit"
              >
                {/* <!-- Page pre-title --> */}
                <div className="headtit">
                  <h2 className="page-title">Leads</h2>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  className="feature2"
                >
                  <div
                    style={{ margin: "0px 10px", display: "none" }}
                    className="undoDelete"
                  >
                    <div className="btn-list">
                      <button
                        onClick={handleUndo}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        <UndoIcon />
                      </button>
                    </div>
                  </div>
                  <div style={{ margin: "0px 2px" }} className="addLeads">
                    <div className="btn-list">
                      <button
                        onClick={handleDeleteSelection}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        Delete Selection
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
                  <div style={{ margin: "0px 2px" }} className="addLeads">
                    <div className="btn-list">
                      <button
                        onClick={functionopenpopupEmp}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        AssignLeads
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
                  <div style={{ margin: "0px 2px" }} className="addLeads">
                    <div className="btn-list">
                      <button
                        onClick={
                          data.length === "0"
                            ? Swal.fire("Please Import Some data first")
                            : () => {
                              functionopenpopupNew();
                            }
                        }
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                        {/* <svg
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
                        </svg> */}
                        Add Leads
                      </button>
                      <a
                        href="#"
                        className="btn btn-primary d-sm-none btn-icon"
                        data-bs-toggle="modal"
                        data-bs-target="#modal-report"
                        aria-label="Create new report"
                      >

                      </a>
                    </div>
                  </div>
                  <div className="importCSV" style={{ margin: "0px 2px" }}>
                    <div className="btn-list">
                      <button
                        onClick={handleImportClick}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                        {/* <svg
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
                        </svg> */}
                        {/* <FontAwesomeIcon icon={faHouseLock} /> */}
                        Import CSV
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
                  <div className="importCSV" style={{ margin: "0px 2px" }}>
                    <div className="btn-list">
                      <button
                        onClick={exportData}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                        {/* <svg
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
                        </svg> */}
                        {/* <FontAwesomeIcon icon={faHouseLock} /> */}
                        Export CSV
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="features">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="features">
                  <div style={{ display: "flex", marginBottom: "20px" }} className="feature1" >
                    <div
                      className="form-control"
                      style={{ height: "fit-content", width: "15vw" }}>
                      <select
                        style={{
                          border: "none",
                          outline: "none",
                          width: "fit-content",
                        }}
                        value={selectedField}
                        onChange={handleFieldChange}>
                        <option value="Company Name">Company Name</option>
                        <option value="Company Number">Company Number</option>
                        <option value="Company Email">Company Email</option>
                        <option value="Company Incorporation Date  ">
                          Company Incorporation Date
                        </option>
                        <option value="City">City</option>
                        <option value="State">State</option>
                        <option value="Status">Status</option>
                        <option value="ename">Assigned To</option>
                      </select>
                    </div>
                    {visibility === "block" ? (
                      <div>
                        <input
                          onChange={handleDateChange}
                          style={{ display: visibility }}
                          type="date"
                          className="form-control"
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {visibilityOther === "block" ? (
                      <div
                        style={{
                          width: "20vw",
                          margin: "0px 10px",
                          display: visibilityOther,
                        }}
                        className="input-icon">
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
                    ) : (
                      <div></div>
                    )}
                    {visibilityOthernew === "block" ? (
                      <div
                        style={{
                          width: "20vw",
                          margin: "0px 10px",
                          display: visibilityOthernew,
                        }}
                        className="input-icon form-control"
                      >
                        <select
                          value={searchText}
                          onChange={(e) => {
                            setSearchText(e.target.value);
                          }}
                        >
                          <option value="All">All </option>
                          <option value="Busy ">Busy </option>
                          <option value="Not Picked Up ">Not Picked Up </option>
                          <option value="Junk">Junk</option>
                          <option value="Interested">Interested</option>
                          <option value="Not Interested">Not Interested</option>
                        </select>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                  {searchText !== "" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "14px",
                        fontFamily: "sans-serif",
                      }}
                      className="results"
                    >
                      {dataStatus + ":"} <b>{filteredData.length}</b> ,{dataStatus === "Unassigned" ? "Assigned" : "Unassigned"} : {anotherMainCount.length}
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <div
                    style={{ display: "flex", alignItems: "center" }}
                    className="feature2"
                  >
                    {selectedField === "State" && (
                      <div style={{ width: "15vw" }} className="input-icon">
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
                        <div className="input-icon">
                          <input
                            type="number"
                            value={year}
                            defaultValue="Select Year"
                            className="form-control"
                            placeholder="Select Year.."
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                            aria-label="Search in website"
                          />
                        </div>
                      </>
                    )}
                    {selectedRows.length !== 0 && (
                      <div className="form-control">
                        Total Data Selected : {selectedRows.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* table body */}
        <div className="page-body">
          <div className="container-xl">
            <div class="card-header  my-tab">
              <ul
                class="nav nav-tabs card-header-tabs nav-fill p-0"
                data-bs-toggle="tabs"
              >
                <li class="nav-item data-heading">
                  <a
                    href="#tabs-home-5"
                    className={
                      dataStatus === "Unassigned"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                    onClick={() => {
                      debouncedFilterData("Unassigned")
                    }}
                  >
                    UnAssigned
                    <span className="no_badge">
                      {data.filter((item) => item.ename === "Not Alloted").length}
                    </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-home-5"
                    className={
                      dataStatus === "Assigned"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                    onClick={() => {
                      debouncedFilterData("Assigned")
                    }}
                  >
                    Assigned
                    <span className="no_badge">
                      {data.filter((item) => item.ename !== "Not Alloted").length}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="card">
              <div className="card-body p-0">
                <div
                  id="table-default"
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
                    className="table-vcenter table-nowrap "
                  >
                    <thead>
                      <tr className="tr-sticky">
                        <th>
                          <input
                            type="checkbox"
                            checked={selectedRows.length === data.length}
                            onChange={() => handleCheckboxChange("all")}
                          />
                        </th>
                        <th>Sr.No</th>
                        <th>Company Name</th>
                        <th>Company Number</th>

                        <th>
                          Incorporation Date
                          <FilterListIcon
                            style={{
                              height: "14px",
                              width: "14px",
                              cursor: "pointer",
                              marginLeft: "4px",
                            }}
                            onClick={handleFilterIncoDate}
                          />
                          {openIncoDate && <div className="inco-filter">
                            <div

                              className="inco-subFilter"
                              onClick={(e) => handleSort("oldest")}
                            >
                              <SwapVertIcon style={{ height: "14px" }} />
                              Oldest
                            </div>

                            <div
                              className="inco-subFilter"
                              onClick={(e) => handleSort("newest")}
                            >
                              <SwapVertIcon style={{ height: "14px" }} />
                              Newest
                            </div>

                            <div
                              className="inco-subFilter"
                              onClick={(e) => handleSort("none")}
                            >
                              <SwapVertIcon style={{ height: "14px" }} />
                              None
                            </div>
                          </div>}
                        </th>
                        <th>City</th>
                        <th>State</th>
                        <th>Company Email</th>
                        <th>Status</th>
                        {dataStatus !== "Unassigned" && <th>Remarks</th>}

                        <th>Uploaded By</th>
                        {dataStatus !== "Unassigned" && <th>Assigned to</th>}

                        <th>
                          {dataStatus !== "Unassigned" ? "Assigned On" : "Uploaded On"}

                          <FilterListIcon
                            style={{
                              height: "14px",
                              width: "14px",
                              cursor: "pointer",
                              marginLeft: "4px",
                            }}
                            onClick={handleFilterAssignDate}
                          />
                          {openAssign && <div className="inco-filter">
                            <div

                              className="inco-subFilter"
                              onClick={(e) => handleSortAssign("oldest")}
                            >
                              <SwapVertIcon style={{ height: "14px" }} />
                              Oldest
                            </div>

                            <div
                              className="inco-subFilter"
                              onClick={(e) => handleSortAssign("newest")}
                            >
                              <SwapVertIcon style={{ height: "14px" }} />
                              Newest
                            </div>


                          </div>}
                        </th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {currentDataLoading ? (
                      <tbody>
                        <tr>
                          <td colSpan="13" className="LoaderTDSatyle">
                            <ClipLoader
                              color="lightgrey"
                              loading
                              size={30}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {currentData.map((company, index) => (
                          <tr
                            key={index}
                            className={selectedRows.includes(company._id) ? "selected" : ""}
                            style={{ border: "1px solid #ddd" }}
                          >
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedRows.includes(company._id)}
                                onChange={() => handleCheckboxChange(company._id)}
                                onMouseDown={() => handleMouseDown(company._id)}
                                onMouseEnter={() => handleMouseEnter(company._id)}
                                onMouseUp={handleMouseUp}
                              />
                            </td>
                            <td>{startIndex + index + 1}</td>
                            <td>{company["Company Name"]}</td>
                            <td>{company["Company Number"]}</td>
                            <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                            <td>{company["City"]}</td>
                            <td>{company["State"]}</td>
                            <td>{company["Company Email"]}</td>
                            <td>{company["Status"]}</td>
                            {dataStatus !== "Unassigned" && <td >
                              <div style={{ width: "100px" }} className="d-flex align-items-center justify-content-between">
                                <p className="rematkText text-wrap m-0">
                                  {company["Remarks"]}{" "}
                                </p>
                                <div onClick={() => {
                                  functionopenpopupremarks(company._id, company.Status);
                                }} style={{ cursor: "pointer" }}>
                                  <IconEye

                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      color: "#d6a10c",
                                      cursor: "pointer",
                                      marginLeft: "4px",
                                    }}
                                  />
                                </div>
                              </div>
                            </td>}

                            <td>{company["UploadedBy"] ? company["UploadedBy"] : "-"}</td>
                            {dataStatus !== "Unassigned" && <td>{company["ename"]}</td>}
                            <td>{formatDateFinal(company["AssignDate"])}</td>
                            <td>
                              {(mainAdminName === "Nimesh" || mainAdminName === "Ronak" || mainAdminName === "Aakash" || mainAdminName === "shivangi") && <> <IconButton onClick={() => handleDeleteClick(company._id)}>
                                <DeleteIcon
                                  style={{
                                    width: "14px",
                                    height: "14px",
                                    color: "#bf0b0b",
                                  }}
                                >
                                  Delete
                                </DeleteIcon>
                              </IconButton>
                                <IconButton onClick={
                                  data.length === "0"
                                    ? Swal.fire("Please Import Some data first")
                                    : () => {
                                      functionopenModifyPopup();
                                      handleUpdateClick(company._id);
                                    }
                                }>
                                  < ModeEditIcon
                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      color: "grey",
                                    }}
                                  >
                                    Delete
                                  </ ModeEditIcon>
                                </IconButton> </>}
                              <Link to={`/admin/leads/${company._id}`}>
                                <IconButton>
                                  <IconEye
                                    style={{
                                      width: "14px",
                                      height: "14px",
                                      color: "#d6a10c",
                                      cursor: "pointer",
                                    }}
                                  />
                                </IconButton>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
              {currentData.length === 0 && !currentDataLoading &&
                (
                  <table>
                    <tbody>
                      <tr>
                        <td colSpan="13" className="p-2 particular">
                          <Nodata />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              {currentData.length !== 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px",
                  }}
                  className="pagination"
                >
                  <IconButton
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
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


    </div>
  );
}

export default Leads;
