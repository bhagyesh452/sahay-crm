import React from "react";
import Papa from "papaparse";
import Header from "./Header";
import Navbar from "./Navbar";
import axios from "axios";
import { IconChevronLeft } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { IconEye } from "@tabler/icons-react";
import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../components/styles/table.css";
import "./styles/main.css";
import Swal from "sweetalert2";
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
import { json } from "react-router-dom";

function Leads() {
  const [open, openchange] = useState(false);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState();
  const [openNew, openchangeNew] = useState(false);
  const [openEmp, openchangeEmp] = useState(false);
  const [openConf, openChangeConf] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csvdata, setCsvData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [citySearch, setcitySearch] = useState("");
  const [selectedField, setSelectedField] = useState("Company Name");
  const [employeeSelection, setEmployeeSelection] = useState("Not Alloted");
  const [newemployeeSelection, setnewEmployeeSelection] =
    useState("Not Alloted");
  const [newempData, setnewEmpData] = useState([]);
  // const [currentData, setCurrentData] = useState([]);

  const [newDate, setNewDate] = useState([null]);
  const [dataStatus, setDataStatus] = useState("Unassigned");

  // Manual Data
  const [cname, setCname] = useState("");
  const [cemail, setCemail] = useState("");
  const [cnumber, setCnumber] = useState(0);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [cidate, setCidate] = useState(null);
  const itemsPerPage = 10;
  const [visibility, setVisibility] = useState("none");
  const [visibilityOther, setVisibilityOther] = useState("block");
  const [visibilityOthernew, setVisibilityOthernew] = useState("none");
  const [subFilterValue, setSubFilterValue] = useState("");

  // Requested Details
  const [requestData, setRequestData] = useState([]);
  const [requestGData, setRequestGData] = useState([]);
  const [mainData, setmainData] = useState([]);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  //fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/leads`);

      // Set the retrieved data in the state

      setData(response.data);
      setmainData(response.data.filter((item) => item.ename === "Not Alloted"));
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    // Fetch data from the Node.js server
    // Call the fetchData function
    fetchData();
    fetchnewData();
    fetchRequestDetails();
    fetchRequestGDetails();
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

    console.log(selectedField);
  };
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
      console.log(month);
      console.log(year);
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
  // csvdata.map((item)=>{
  //   console.log(formatDateFromExcel(item["Company Incorporation Date  "]))
  // })
  console.log(csvdata);

  const handleUploadData = async (e) => {
    if (selectedOption === "someoneElse") {
      const updatedCsvdata = csvdata.map(data => ({
        ...data,
        ename:newemployeeSelection
      }));
      if (updatedCsvdata.length !== 0) {
        setLoading(true); // Move setLoading outside of the loop

        try {
          await axios.post(`${secretKey}/leads`, updatedCsvdata);
          console.log("Data sent successfully");
          Swal.fire({
            title: "Data Send!",
            text: "Data successfully sent to the Employee",
            icon: "success",
          });

          fetchData();
          closepopup();
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
      console.log("Assigning Normally");
      if (csvdata.length !== 0) {
        setLoading(true); // Move setLoading outside of the loop

        try {
          await axios.post(`${secretKey}/leads`, csvdata);
          console.log("Data sent successfully");
          Swal.fire({
            title: "Data Send!",
            text: "Data successfully sent to the Employee",
            icon: "success",
          });

          fetchData();
          closepopup();
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

  // const handleUploadClick = () => {
  //   fileInputRef.current.click();
  // };

  // to delete the data
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
      })
      .then((response) => {
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
        Swal.fire("Please Enter Unique data!");
      });
  };

  // ------------------------------------------- CHECK BOX CONTENT----------------------------------------------------

  const [selectedRows, setSelectedRows] = useState([]);
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
    console.log("Selected Data:", selectedData);
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
    if (selectedObjects.length === 0) {
      Swal.fire("Empty Data!");
      closepopupEmp();
    }

    for (const obj of selectedObjects) {
      if (!obj.ename || obj.ename === "Not Alloted") {
        handleAssignData();
        setEmployeeSelection("");
      } else {
        // If ename is present, show a confirmation dialog
        console.log(obj.ename);
        const userConfirmed = window.confirm(
          `Data is already assigned to: ${obj.ename}. Do you want to continue?`
        );

        if (userConfirmed) {
          // If user confirms, perform the assignation
          handleAssignData();
        } else {
          // If user cancels, you can handle it as needed (e.g., show a message)
          console.log("User canceled the assignation.");
        }
      }
    }
  };

  const handleAssignData = async () => {
    // // Find the selected employee object
    const selectedObjects = data.filter((row) =>
      selectedRows.includes(row._id)
    );
    // console.log(selectedObjects, employeeSelection);

    try {
      const response = await axios.post(`${secretKey}/postData`, {
        employeeSelection,
        selectedObjects,
      });
      Swal.fire("Data Assigned");
      fetchData();
      console.log("Data posted successfully");
    } catch (err) {
      console.log("Internal server Error", err);
      Swal.fire("Error Assigning Data");
    }

    // const selectedempData = selectedRows.find(
    //   (employee) => employee.ename === employeeSelection
    // );
    // const selectedData = data.filter((row) => selectedRows.includes(row._id));

    // Check if an employee is selected
    // if (!selectedEmployee) {
    //   console.warn("No employee selected");
    //   return;
    // }

    // try {
    //   // Map the selected data to the format expected by the backend
    //   const formattedSelectedData = selectedData.map((row) => ({
    //     "Company Name": row["Company Name"],
    //     "Company Number": row["Company Number"],
    //     "Company Email": row["Company Email"],
    //     "Company Incorporation Date  ": row["Company Incorporation Date  "],
    //     City: row.City,
    //     State: row.State,
    //   }));

    //   // Check for duplicates in company names or numbers
    //   const existingCompanyNames = new Set();
    //   const existingCompanyNumbers = new Set();

    //   formattedSelectedData.forEach((row) => {
    //     if (existingCompanyNames.has(row["Company Name"]) || existingCompanyNumbers.has(row["Company Number"])) {
    //       // Duplicate found, perform your action
    //       functionopenpopupConf();
    //       console.log("Duplicate data found");
    //       return;
    //     }

    //   });

    //   // Make a PUT request using Axios to update the value on the backend
    //   const response = await axios.put(
    //     `${secretKey}/neweinfo/${selectedEmployee._id}`,
    //     {
    //       cInfo: formattedSelectedData,
    //     }
    //   );

    //   if (response.status === 200) {
    //     const updatedData = response.data.updatedData;
    //     console.log(`Value assigned to ${updatedData._id}`);
    //     window.location.reload();

    //     // Optionally, you can update the state or trigger a re-fetch of the data
    //     // based on your application's requirements.
    //   } else {
    //     console.error("Error updating data:", response.statusText);
    //     Swal.fire("Data Already exist");
    //   }
    // } catch (error) {
    //   functionopenpopupConf();

    //   console.error("Error updating data:", error.message);
    // }
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
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete the selected rows?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'No, cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // If user confirms, proceed with deletion
          await axios.delete(`${secretKey}/delete-rows`, {
            data: { selectedRows }, // Pass selected rows to the server
          });
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

  console.log(selectedRows);
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

      <Dialog open={openNew} onClose={closepopupNew} fullWidth maxWidth="sm">
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
      </Dialog>
      {/* Loading Screen */}

      {/* ----------------------------ADD-Lead Ends here------------------------------------------------------------------------  */}

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
                  <a href="#">Download Sample</a>
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
                    <label htmlFor="direct">Assign Directly?</label>
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
      {/* Main Page Starts from here */}
      {loading && (
        // Your loading screen component or message
        <Box style={{zIndex:"999999999"}} sx={{ display: "flex" }}>
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
                  <div style={{ margin: "0px 10px" }} className="addLeads">
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
                  <div style={{ margin: "0px 10px" }} className="addLeads">
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
                  <div style={{ margin: "0px 10px" }} className="addLeads">
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
                        Add Leads
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
                  <div className="importCSV">
                    <div className="btn-list">
                      <button
                        onClick={handleImportClick}
                        className="btn btn-primary d-none d-sm-inline-block"
                      >
                        {/* <!-- Download SVG icon from http://tabler-icons.io/i/plus --> */}
                        <svg
                          style={{
                            verticalAlign: "middle",
                          }}
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
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                className="features"
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                  className="features"
                >
                  <div style={{ display: "flex" }} className="feature1">
                    <div
                      className="form-control"
                      style={{ height: "fit-content", width: "15vw" }}
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
                        fontSize: "16px",
                        fontFamily: "sans-serif",
                      }}
                      className="results"
                    >
                      {filteredData.length} results found
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* table body */}
      <div className="page-body">
        <div className="container-xl">
          <div className="card">
            <div className="card-body p-0">
              <div className="container-xl">
                <div class="card-header">
                  <ul
                    class="nav nav-tabs card-header-tabs nav-fill"
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
                          setDataStatus("Unassigned");
                          setmainData(
                            data.filter((item) => item.ename === "Not Alloted")
                          );
                        }}
                      >
                        UnAssigned
                      </a>
                    </li>
                    <li class="nav-item data-heading">
                      <a
                        href="#tabs-home-5"
                        className={
                          dataStatus === "Assigned"
                            ? "nav-link active item-act"
                            : "nav-link"
                        }
                        data-bs-toggle="tab"
                        onClick={() => {
                          setDataStatus("Assigned");
                          setmainData(
                            data.filter((item) => item.ename !== "Not Alloted")
                          );
                        }}
                      >
                        Assigned
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div id="table-default" className="table-responsive">
                <table className="table table-vcenter table-nowrap">
                  <thead>
                    <tr>
                      <th
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 1,
                          background: "white",
                        }}
                      >
                        <th>
                          <input
                            type="checkbox"
                            checked={selectedRows.length === data.length}
                            onChange={() => handleCheckboxChange("all")}
                          />
                        </th>
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          left: "59px",
                          zIndex: 1,
                          background: "white",
                        }}
                      >
                        <button className="table-sort" data-sort="sort-name">
                          Sr.No
                        </button>
                      </th>
                      <th
                        style={{
                          position: "sticky",
                          left: "140px",
                          zIndex: 1,
                          background: "white",
                        }}
                      >
                        <button className="table-sort" data-sort="sort-city">
                          Company Name
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-type">
                          Company Number
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-score">
                          Company Email
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Incorporation Date
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          City
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          State
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Status
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Remarks
                        </button>
                      </th>
                      <th>
                        <button className="table-sort" data-sort="sort-date">
                          Assigned to
                        </button>
                      </th>
                      <th>
                        <button
                          className="table-sort"
                          data-sort="sort-quantity"
                        >
                          Last Updated on:
                        </button>
                      </th>
                      <th>
                        <button
                          className="table-sort"
                          data-sort="sort-quantity"
                        >
                          Action
                        </button>
                      </th>
                    </tr>
                  </thead>
                  {currentData.length == 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan="12" style={{ textAlign: "center" }}>
                          No data available
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    currentData.map((company, index) => (
                      <tbody className="table-tbody">
                        <tr>
                          <td
                            style={{
                              position: "sticky",
                              left: 0,
                              zIndex: 1,
                              background: "white",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(company._id)}
                              onChange={() => handleCheckboxChange(company._id)}
                            />
                          </td>
                          <td
                            style={{
                              position: "sticky",
                              left: "59px",
                              zIndex: 1,
                              background: "white",
                            }}
                            className="sort-name"
                          >
                            {startIndex + index + 1}
                          </td>
                          <td
                            style={{
                              position: "sticky",
                              left: "140px",
                              zIndex: 1,
                              background: "white",
                            }}
                            className="sort-name"
                          >
                            {company["Company Name"]}
                          </td>
                          <td className="sort-name">
                            {company["Company Number"]}
                          </td>
                          <td className="sort-name">
                            {company["Company Email"]}
                          </td>
                          <td className="sort-name">
                            {formatDate(
                              company["Company Incorporation Date  "]
                            )}
                          </td>
                          <td className="sort-name">{company["City"]}</td>
                          <td className="sort-name">{company["State"]}</td>
                          <td className="sort-name">{company["Status"]}</td>
                          <td className="sort-name">{company["Remarks"]}</td>
                          <td className="sort-name">{company["ename"]}</td>
                          <td className="sort-name">
                            {formatDate(company["AssignDate"])}
                          </td>
                          <td className="sort-name">
                            <IconButton
                              onClick={() => handleDeleteClick(company._id)}
                            >
                              <DeleteIcon>Delete</DeleteIcon>
                            </IconButton>
                          </td>
                        </tr>
                      </tbody>
                    ))
                  )}
                  <tbody className="table-tbody"></tbody>
                </table>
              </div>
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
