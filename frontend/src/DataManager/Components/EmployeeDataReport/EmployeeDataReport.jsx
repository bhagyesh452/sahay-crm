import React , {useState , useEffect} from "react";
import Calendar from '@mui/icons-material/Event';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import moment from 'moment'
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import dayjs from 'dayjs';
import { IoClose } from "react-icons/io5";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Link } from 'react-router-dom'
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { debounce } from 'lodash';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";




export default function EmployeeDataReport() {
    const [searchTerm, setSearchTerm] = useState("")
    const [employeeData, setEmployeeData] = useState([]);
    const [employeeDataFilter, setEmployeeDataFilter] = useState([]);
    const debouncedFilterSearch = debounce(filterSearch, 100);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
    const [selectedDateRangeEmployee, setSelectedDateRangeEmployee] = useState([]);
    const [sortType, setSortType] = useState({
        untouched: "none",
        notPickedUp: "none",
        busy: "none",
        junk: "none",
        notInterested: "none",
        followUp: "none",
        matured: "none",
        interested: "none",
        lastLead: "none",
        totalLeads: 'none'
      });
      const [incoFilter, setIncoFilter] = useState("");
      const [companyData, setCompanyData] = useState([]);
      const [companyDataFilter, setcompanyDataFilter] = useState([])
      const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
      const [openEmployeeTable, setOpenEmployeeTable] = useState(false);
      const [selectedEmployee, setSelectedEmployee] = useState("");












      const fetchCompanyData = async () => {
        fetch(`${secretKey}/leads`)
          .then((response) => response.json())
          .then((data) => {
            setCompanyData(data.filter((obj) => obj.ename !== "Not Alloted"));
            setcompanyDataFilter(data.filter((obj) => obj.ename !== "Not Alloted"));
    
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      };

    const fetchEmployeeInfo = async () => {
        fetch(`${secretKey}/einfo`)
          .then((response) => response.json())
          .then((data) => {
            setEmployeeData(data);
            setEmployeeDataFilter(data)
            // setEmployeeDataFilter(data.filter)
          })
          .catch((error) => {
            console.error(`Error Fetching Employee Data `, error);
          });
      };
      const debounceDelay = 300;
      const debouncedFetchCompanyData = debounce(fetchCompanyData, debounceDelay);
      const debouncedFetchEmployeeInfo = debounce(fetchEmployeeInfo, debounceDelay);
       
      useEffect(() => {
        // Call the fetchData function when the component mounts
    
        //fetchCompanies();
        debouncedFetchCompanyData();
        debouncedFetchEmployeeInfo();
    
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

  // Modified filterSearch function with debounce
  function filterSearch(searchTerm) {
    setSearchTerm(searchTerm);
    setEmployeeData(employeeDataFilter.filter(company =>
      company.ename.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }

  const handleSelectEmployee = (values) => {
    console.log(values)
    if (values[1]) {
      const startDate = values[0].format('MM/DD/YYYY');
      const endDate = values[1].format('MM/DD/YYYY');

      const filteredDataDateRange = companyDataFilter.filter(product => {
        const productDate = new Date(product.AssignDate).setHours(0, 0, 0, 0);

        // Check if the formatted productDate is within the selected date range
        if (startDate === endDate) {
          // If both startDate and endDate are the same, filter for transactions on that day
          return new Date(productDate) === new Date(startDate);
        } else if (startDate !== endDate) {
          // If different startDate and endDate, filter within the range
          return new Date(productDate) >= new Date(startDate) && new Date(productDate) <= new Date(endDate);
        } else {
          return false;
        }
      });
      setCompanyData(filteredDataDateRange);
    } else {
      return true;
    }
  }

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const convertedDate = date.toLocaleDateString();
    return convertedDate;
  };

  const functionOpenEmployeeTable = (employee) => {
    setOpenEmployeeTable(true);
    setSelectedEmployee(employee);
  };
  const closeEmployeeTable = () => {
    setOpenEmployeeTable(false);
  };

  const numberFormatOptions = {
    style: 'currency',
    currency: 'INR', // Use the currency code for Indian Rupee (INR)
    minimumFractionDigits: 0, // Minimum number of fraction digits (adjust as needed)
    maximumFractionDigits: 2, // Maximum number of fraction digits (adjust as needed)
  };
  const shortcutsItems = [
    {
      label: 'This Week',
      getValue: () => {
        const today = dayjs();
        return [today.startOf('week'), today.endOf('week')];
      },
    },
    {
      label: 'Last Week',
      getValue: () => {
        const today = dayjs();
        const prevWeek = today.subtract(7, 'day');
        return [prevWeek.startOf('week'), prevWeek.endOf('week')];
      },
    },
    {
      label: 'Last 7 Days',
      getValue: () => {
        const today = dayjs();
        return [today.subtract(7, 'day'), today];
      },
    },
    {
      label: 'Current Month',
      getValue: () => {
        const today = dayjs();
        return [today.startOf('month'), today.endOf('month')];
      },
    },
    {
      label: 'Next Month',
      getValue: () => {
        const today = dayjs();
        const startOfNextMonth = today.endOf('month').add(1, 'day');
        return [startOfNextMonth, startOfNextMonth.endOf('month')];
      },
    },
    { label: 'Reset', getValue: () => [null, null] },
  ];

  const formattedDates =
  companyData.length !== 0 &&
  selectedEmployee !== "" &&
  companyData
    .filter((data) => data.ename === selectedEmployee) // Filter data based on ename
    .map((data) => formatDate(data.AssignDate));

  const uniqueArray = formattedDates && [...new Set(formattedDates)];

  const properCompanyData =
    selectedEmployee !== "" &&
    companyData.filter((obj) => obj.ename === selectedEmployee);


  //-------------------------- Sort filteres for different status  -------------------------------------------------------------------------
  const handleSortUntouched = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      untouched: prevData.untouched === "ascending"
        ? "descending"
        : prevData.untouched === "descending"
          ? "none"
          : "ascending"
    }));

    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Untouched")
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });

        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Untouched")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortNotPickedUp = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      notPickedUp: prevData.notPickedUp === "ascending"
        ? "descending"
        : prevData.notPickedUp === "descending"
          ? "none"
          : "ascending"
    }));

    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Not Picked Up")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Not Picked Up")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };

  // for busy

  const handleSortbusy = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      busy: prevData.busy === "ascending"
        ? "descending"
        : prevData.busy === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Busy")

          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });

        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Busy")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortInterested = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      interested: prevData.interested === "ascending"
        ? "descending"
        : prevData.interested === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Interested")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Interested")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortMatured = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      matured: prevData.matured === "ascending"
        ? "descending"
        : prevData.matured === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Matured")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Matured")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortNotInterested = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      notInterested: prevData.notInterested === "ascending"
        ? "descending"
        : prevData.notInterested === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Not Interested")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Not Interested")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortJunk = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      junk: prevData.junk === "ascending"
        ? "descending"
        : prevData.junk === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Junk")

          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "Junk")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortFollowUp = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      followUp: prevData.followUp === "ascending"
        ? "descending"
        : prevData.followUp === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {
          if ((company.Status === "Follow Up")
            // (openFilters.busy && company.Status === "Busy") ||
            // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
            // (openFilters.junk && company.Status === "Junk") ||
            // (openFilters.followUp && company.Status === "FollowUp") ||
            // (openFilters.interested && company.Status === "Interested") ||
            // (openFilters.notInterested && company.Status === "Not Interested") ||
            // (openFilters.matured && company.Status === "Matured") ||
            // (openFilters.totalLeads) ||
            // (openFilters.lastleadassign)
          ) {
            untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {
          if ((company.Status === "FollowUp")
          ) {
            untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;
          }
        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortLastLead = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      lastLead: prevData.lastLead === "ascending"
        ? "descending"
        : prevData.lastLead === "descending"
          ? "none"
          : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {

          untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {

          untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };
  const handleSortTotalLeads = (sortBy1) => {
    setSortType(prevData => ({
      ...prevData,
      totalLeads: prevData.totalLeads === "ascending" ? "descending" : "ascending"
    }));
    switch (sortBy1) {

      case "ascending":
        setIncoFilter("ascending");
        const untouchedCountAscending = {}
        companyData.forEach((company) => {

          untouchedCountAscending[company.ename] = (untouchedCountAscending[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses in ascending order
        employeeData.sort((a, b) => {
          const countA = untouchedCountAscending[a.ename] || 0;
          const countB = untouchedCountAscending[b.ename] || 0;
          return countA - countB; // Sort in ascending order of "Untouched" count
        });
        // ||
        // (openFilters.busy && company.Status === "Busy") ||
        // (openFilters.notPickedUp && company.Status === "Not Picked Up") ||
        // (openFilters.junk && company.Status === "Junk") ||
        // (openFilters.followUp && company.Status === "FollowUp") ||
        // (openFilters.interested && company.Status === "Interested") ||
        // (openFilters.notInterested && company.Status === "Not Interested") ||
        // (openFilters.matured && company.Status === "Matured") ||
        // (openFilters.totalLeads) ||
        // (openFilters.lastleadassign)
        break;
      case "descending":
        setIncoFilter("descending");
        const untouchedCount = {};
        companyData.forEach((company) => {

          untouchedCount[company.ename] = (untouchedCount[company.ename] || 0) + 1;

        });

        // Step 2: Sort employeeData based on the count of "Untouched" statuses
        employeeData.sort((a, b) => {
          const countA = untouchedCount[a.ename] || 0;
          const countB = untouchedCount[b.ename] || 0;
          return countB - countA; // Sort in descending order of "Untouched" count
        });
        break;
      case "none":
        setIncoFilter("none");
        if (originalEmployeeData.length > 0) {
          // Restore to previous state
          setEmployeeData(originalEmployeeData);
        }
        break;
      default:
        break;

    }
  };



  useEffect(() => {
    setOriginalEmployeeData([...employeeData]); // Store original state of employeeData
  }, [employeeData]);




    return ( 
    <div>
        <div className="container-xl mt-2">
        <div className="employee-dashboard" id="employeedashboardadmin">
            <div className="card">
                <div className="card-header employeedashboard d-flex align-items-center justify-content-between">
                    <div className="d-flex justify-content-between">
                        <div style={{ minWidth: '14vw' }} className="dashboard-title">
                            <h2 style={{ marginBottom: '5px' }}>Employees Data Report</h2>
                        </div>
                    </div>
                    <div className="d-flex gap-2">

                        <div className="general-searchbar form-control d-flex justify-content-center align-items-center input-icon">
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
                                    stroke-linejoin="round">
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                        fill="none"
                                    />
                                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                                    <path d="M21 21l-6 -6" />
                                </svg>
                            </span>
                            <input value={searchTerm}
                                onChange={(e) => debouncedFilterSearch(e.target.value)} placeholder="Enter BDE Name..." style={{ border: "none", padding: "0px 0px 0px 21px", width: "100%" }} type="text" name="bdeName-search" id="bdeName-search" />
                        </div>
                        <LocalizationProvider dateAdapter={AdapterDayjs} style={{ padding: "0px" }}>
                            <DemoContainer components={['SingleInputDateRangeField']}>
                                <DateRangePicker
                                    onChange={(values) => {
                                        const startDateEmp = moment(values[0]).format('DD/MM/YYYY');
                                        const endDateEmp = moment(values[1]).format('DD/MM/YYYY');
                                        setSelectedDateRangeEmployee([startDateEmp, endDateEmp]);
                                        handleSelectEmployee(values); // Call handleSelect with the selected values
                                    }}
                                    slots={{ field: SingleInputDateRangeField }}
                                    slotProps={{
                                        shortcuts: {
                                            items: shortcutsItems,
                                        },
                                        actionBar: { actions: [] },
                                        textField: { InputProps: { endAdornment: <Calendar /> } }
                                    }}
                                //calendars={1}
                                />
                            </DemoContainer>
                        </LocalizationProvider>

                    </div>
                </div>
                <div className="card-body">
                    <div
                        className="row"
                        style={{
                            overflowX: "auto",
                            overflowY: "auto",
                            maxHeight: "60vh",
                            lineHeight: "32px",
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                border: "1px solid #ddd",
                                marginBottom: "5px",
                                lineHeight: "32px",
                                position: "relative", // Make the table container relative
                            }}
                            className="table-vcenter table-nowrap"
                        >
                            {/* <thead>
                          <tr
                            style={{
                              backgroundColor: "#ffb900",
                              color: "white",
                              fontWeight: "bold",

                            }}
                          > */}
                            <thead
                                style={{
                                    position: "sticky", // Make the header sticky
                                    top: '-1px', // Stick it at the top
                                    backgroundColor: "#ffb900",
                                    color: "black",
                                    fontWeight: "bold",
                                    zIndex: 1, // Ensure it's above other content
                                }}
                            >
                                <tr>
                                    <th
                                        style={{
                                            lineHeight: "32px",
                                        }}
                                    >
                                        Sr. No
                                    </th>
                                    <th>BDE/BDM Name

                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.untouched === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.untouched === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortUntouched(newSortType);
                                    }}>Untouched

                                        <ArrowDropUpIcon style={{ color: sortType.untouched === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.untouched === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.busy === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.untouched === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortbusy(newSortType);
                                    }}>Busy

                                        <ArrowDropUpIcon style={{ color: sortType.busy === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.busy === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.notPickedUp === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.notPickedUp === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortNotPickedUp(newSortType);
                                    }}>Not Picked Up

                                        <ArrowDropUpIcon style={{ color: sortType.notPickedUp === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.notPickedUp === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.junk === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.junk === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortJunk(newSortType);
                                    }}>Junk

                                        <ArrowDropUpIcon style={{ color: sortType.junk === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.junk === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.followUp === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.followUp === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortFollowUp(newSortType);
                                    }}>Follow Up

                                        <ArrowDropUpIcon style={{ color: sortType.followUp === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.followUp === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.interested === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.interested === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortInterested(newSortType);
                                    }}>Interested

                                        <ArrowDropUpIcon style={{ color: sortType.interested === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.interested === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.notInterested === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.notInterested === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortNotInterested(newSortType);
                                    }}>Not Interested

                                        <ArrowDropUpIcon style={{ color: sortType.notInterested === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.notInterested === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.matured === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.matured === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortMatured(newSortType);
                                    }}>Matured

                                        <ArrowDropUpIcon style={{ color: sortType.matured === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.matured === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.totalLeads === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.totalLeads === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortTotalLeads(newSortType);
                                    }}>Total Leads

                                        <ArrowDropUpIcon style={{ color: sortType.totalLeads === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.totalLeads === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                    <th style={{ cursor: 'pointer' }} onClick={(e) => {
                                        let newSortType;
                                        if (sortType.lastLead === "ascending") {
                                            newSortType = "descending";
                                        } else if (sortType.lastLead === "descending") {
                                            newSortType = "none";
                                        } else {
                                            newSortType = "ascending";
                                        }
                                        handleSortLastLead(newSortType);
                                    }}>Last lead Assign Date

                                        <ArrowDropUpIcon style={{ color: sortType.lastLead === "descending" ? "black" : "#9d8f8f", marginRight: "-24px", marginTop: "-11px" }} />

                                        <ArrowDropDownIcon style={{ color: sortType.lastLead === "ascending" ? "black" : "#9d8f8f", marginTop: "3px" }} />
                                    </th>
                                </tr>
                            </thead>
                            <tbody style={{ userSelect: "none" }} onContextMenu={(e) => e.preventDefault()}>
                                {employeeData.length !== 0 &&
                                    companyData.length !== 0 &&
                                    employeeData.map((obj, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <td
                                                    style={{
                                                        lineHeight: "32px",
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                    key={`row-${index}-1`}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td key={`row-${index}-2`}>{obj.ename}</td>

                                                <td key={`row-${index}-3`} >
                                                    <Link to={`/employeereport/${obj.ename}/Untouched`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "Untouched"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>


                                                <td key={`row-${index}-4`}>
                                                    <Link to={`/employeereport/${obj.ename}/Busy`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "Busy"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>


                                                <td key={`row-${index}-5`}>
                                                    <Link
                                                        to={`/employeereport/${obj.ename}/Not Picked Up`}
                                                        style={{ color: "black", textDecoration: "none" }}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "Not Picked Up"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>


                                                <td key={`row-${index}-6`}>
                                                    <Link to={`/employeereport/${obj.ename}/Junk`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "Junk"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>

                                                <td key={`row-${index}-7`}>
                                                    <Link to={`/employeereport/${obj.ename}/FollowUp`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "FollowUp"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>
                                                <td key={`row-${index}-8`}>
                                                    <Link to={`/employeereport/${obj.ename}/Interested`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "Interested"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>
                                                <td key={`row-${index}-9`}>
                                                    <Link to={`/employeereport/${obj.ename}/Not Interested`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "Not Interested"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>
                                                <td key={`row-${index}-10`}>
                                                    <Link to={`/employeereport/${obj.ename}/Matured`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">

                                                        {
                                                            (companyData.filter(
                                                                (data) =>
                                                                    data.ename === obj.ename &&
                                                                    data.Status === "Matured"
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>
                                                <td key={`row-${index}-11`}>
                                                    <Link to={`/employeereport/${obj.ename}/complete`} style={{
                                                        color: "black",
                                                        textDecoration: "none"
                                                    }}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        {
                                                            (companyData.filter(
                                                                (data) => data.ename === obj.ename
                                                            ).length).toLocaleString()
                                                        }
                                                    </Link>
                                                </td>
                                                <td key={`row-${index}-12`}>
                                                    {formatDate(
                                                        companyData
                                                            .filter(
                                                                (data) => data.ename === obj.ename
                                                            )
                                                            .reduce(
                                                                (latestDate, data) => {
                                                                    return latestDate.AssignDate >
                                                                        data.AssignDate
                                                                        ? latestDate
                                                                        : data;
                                                                },
                                                                { AssignDate: 0 }
                                                            ).AssignDate
                                                    )}
                                                    <OpenInNewIcon
                                                        onClick={() => {
                                                            functionOpenEmployeeTable(obj.ename);

                                                        }}
                                                        style={{ cursor: "pointer", marginRight: "-41px", marginLeft: "21px", fontSize: '17px' }}
                                                    />
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                            </tbody>
                            {employeeData.length !== 0 &&
                                companyData.length !== 0 && (
                                    <tfoot style={{
                                        position: "sticky", // Make the footer sticky
                                        bottom: -1, // Stick it at the bottom
                                        backgroundColor: "#f6f2e9",
                                        color: "black",
                                        fontWeight: 500,
                                        zIndex: 2,
                                        userSelect: "none" // Ensure it's above the content
                                    }} onContextMenu={(e) => e.preventDefault()}>
                                        <tr style={{ fontWeight: 500 }}>
                                            <td style={{ lineHeight: "32px" }} colSpan="2">
                                                Total
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) =>
                                                            partObj.Status === "Untouched"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) => partObj.Status === "Busy"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) =>
                                                            partObj.Status === "Not Picked Up"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) => partObj.Status === "Junk"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) => partObj.Status === "FollowUp"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) =>
                                                            partObj.Status === "Interested"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) =>
                                                            partObj.Status === "Not Interested"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>
                                                {
                                                    (companyData.filter(
                                                        (partObj) => partObj.Status === "Matured"
                                                    ).length).toLocaleString()
                                                }
                                            </td>
                                            <td>{(companyData.length).toLocaleString()}</td>
                                            <td>-</td>
                                        </tr>
                                    </tfoot>
                                )}
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <Dialog
            open={openEmployeeTable}
            onClose={closeEmployeeTable}
            fullWidth
            maxWidth="lg">
            <DialogTitle>
              <div className="title-header d-flex justify-content-between">
                <div className="title-name">
                  <strong>
                    {selectedEmployee}
                  </strong>
                </div>
                <div style={{ cursor: 'pointer' }} className="closeIcon" onClick={closeEmployeeTable}>
                  <IoClose />
                </div>
              </div>

            </DialogTitle>
            <DialogContent>
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
                    marginBottom: "10px",
                  }}
                  className="table-vcenter table-nowrap"
                >
                  <thead stSyle={{ backgroundColor: "grey" }}>
                    <tr
                      style={{
                        backgroundColor: "#ffb900",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      <th
                        style={{
                          lineHeight: "32px",
                        }}
                      >
                        Sr. No
                      </th>
                      <th>Lead Assign Date</th>
                      <th>Untouched</th>
                      <th>Busy</th>
                      <th>Not Picked Up</th>
                      <th>Junk</th>
                      <th>Follow Up</th>
                      <th>Interested</th>
                      <th>Not Interested</th>
                      <th>Matured</th>
                      <th>Total Leads</th>
                    </tr>
                  </thead>
                  <tbody style={{ userSelect: "none" }} onContextMenu={(e) => e.preventDefault()}>
                    {uniqueArray &&
                      uniqueArray.map((obj, index) => (
                        <tr key={`row-${index}`}>
                          <td>{index + 1}</td>
                          <td style={{
                            lineHeight: "32px",
                          }}>{obj}</td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Untouched"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Busy"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Picked Up"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Junk"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "FollowUp"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Interested"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Not Interested"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) =>
                                  formatDate(partObj.AssignDate) === obj &&
                                  partObj.Status === "Matured"
                              ).length).toLocaleString()
                            }
                          </td>
                          <td>
                            {
                              (properCompanyData.filter(
                                (partObj) => formatDate(partObj.AssignDate) === obj
                              ).length).toLocaleString()
                            }
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  {uniqueArray && (
                    <tfoot style={{ userSelect: "none" }} onContextMenu={(e) => e.preventDefault()}>
                      <tr style={{ fontWeight: 500 }}>
                        <td colSpan="2">Total</td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Untouched"
                            ).length).toLocaleString()
                          }
                        </td>

                        <td
                          style={{
                            lineHeight: "32px",
                          }}
                        >
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Busy"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Not Picked Up"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Junk"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "FollowUp"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Interested"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Not Interested"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>
                          {
                            (properCompanyData.filter(
                              (partObj) => partObj.Status === "Matured"
                            ).length).toLocaleString()
                          }
                        </td>
                        <td>{(properCompanyData.length).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>
        
    )



}