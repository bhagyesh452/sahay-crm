import React, { useState, useEffect } from 'react'
import Header_processing from './Header_processing';
import Navbar_processing from './Navbar_processing';
import { GrDocumentStore } from "react-icons/gr";
import { CiCalendar } from "react-icons/ci";
import { HiMiniCurrencyRupee } from "react-icons/hi2";
import Select, { components } from 'react-select';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { FaChevronDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
// import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';


const Analysis_dashboard = () => {


    const [companyCount, setcompanyCount] = useState(0)
    const [currentBookingDate, setcurrentBookingDate] = useState([])
    const [totalPayment, setTotalPayment] = useState()
    const [revenueCurrentMonth, setrevenueCurrentMonth] = useState()
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedField, setSelectedField] = useState([])
    const [completeData, setCompleteData] = useState([])
    const [filterServiceCount, setFilterServiceCount] = useState()
    const [displayDateRange, setDateRangeDisplay] = useState(false)
    const [buttonToggle, setButtonToggle] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filteredDataDateRange, setFilteredDataDateRange] = useState([]);
    const [companiesToday, setcompaniesToday] = useState([])



    const secretKey = process.env.REACT_APP_SECRET_KEY;

    useEffect(() => {
        // Fetch company names from the backend API
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch(`${secretKey}/companies`);
            const data = await response.json();
            const companyLength = data.totalCompanies
            const companyData = data.companies

            const allBookingDates = companyData.flatMap(obj => obj.bookingDate);

            const allPayments = companyData.flatMap(obj => obj.totalPayment)

            const totalPaymentSum = allPayments.reduce((acc, payment) => acc + payment, 0);

            // console.log(allBookingDates);

            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Month is zero-indexed in JavaScript, so we add 1
            const currentYear = currentDate.getFullYear();

            // Filter the booking dates for the current month
            const bookingDatesCurrentMonth = allBookingDates.filter(date => {
                const [year, month] = date.split('-').map(Number);
                return year === currentYear && month === currentMonth;
            });

            let companiesThisMonth = companyData.filter(company => {
                let bookingDate = new Date(company.bookingDate);
                return bookingDate.getMonth() + 1 === currentMonth && bookingDate.getFullYear() === currentYear;
            });
            // console.log(companiesThisMonth)

            const companiesToday = companiesThisMonth.filter(company => {
                const bookingDate = new Date(company.bookingDate);
                const today = new Date(); // Get current date

                // Check if bookingDate is the same as today
                return bookingDate.getDate() === today.getDate() &&
                    bookingDate.getMonth() === today.getMonth() &&
                    bookingDate.getFullYear() === today.getFullYear();
            });
            //console.log(companiesToday)

            const revenueCurrentMonth = companiesThisMonth.flatMap(obj => obj.totalPayment)

            const totalPaymentCurrentMonthSum = revenueCurrentMonth.reduce((acc, payment) => acc + payment, 0);

            setCompleteData(companyData)
            setrevenueCurrentMonth(totalPaymentCurrentMonthSum)
            setTotalPayment(totalPaymentSum)
            setcurrentBookingDate(bookingDatesCurrentMonth)
            setcompanyCount(companyLength);
            setcompaniesToday(companiesToday)
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const options = [
        {
            value: "Certification Services",
            label: "Certification Services",
            isDisabled: true,
        },
        { value: "Start-Up India Certificate", label: "Start-Up India Certificate" },
        { value: "MSME/UYDAM Certificate", label: "MSME/UYDAM Certificate 3" },
        { value: "ISO Certificate", label: "ISO Certificate" },
        { value: "IEC CODE Certificate", label: "IEC CODE Certificate" },
        { value: "BIS Certificate", label: "BIS Certificate" },
        { value: "NSIC Certificate", label: "NSIC Certificate" },
        { value: "FSSAI Certificate", label: "FSSAI Certificate" },
        { value: "APEDA Certificate", label: "APEDA Certificate" },
        { value: "GST Certificate", label: "GST Certificate" },
        {
            value: "Documentation Services",
            label: "Documentation Services",
            isDisabled: true,
        },
        { value: "Pitch Deck Development", label: "Pitch Deck Development" },
        { value: "Financial Modeling", label: "Financial Modeling" },
        { value: "DPR Developmen", label: "DPR Developmen" },
        { value: "CMA Report Development", label: "CMA Report Development" },
        { value: "Company Profile", label: "Company Profile" },
        { value: "Company Brochure", label: "Company Brochure" },
        { value: "Product Catalog", label: "Product Catalog" },
        {
            value: "Fund Raising Support Services",
            label: "Fund Raising Support Services",
            isDisabled: true,
        },
        { value: "Seed Funding Support", label: "Seed Funding Support" },
        { value: "Angel Funding Support", label: "Angel Funding Support" },
        { value: "VC Funding Support", label: "VC Funding Support" },
        { value: "Crowd Funding Support", label: "Crowd Funding Support" },
        { value: "Government Funding Support", label: "Government Funding Support" },
        { value: "Digital Marketing", label: "Digital Marketing", isDisabled: true },
        { value: "SEO Services", label: "SEO Services" },
        { value: "Branding Services", label: "Branding Services" },
        {
            value: "Social Promotion Management",
            label: "Social Promotion Management",
        },
        { value: "Email Marketing", label: "Email Marketing" },
        { value: "Digital Content", label: "Digital Content" },
        { value: "Lead Generation", label: "Lead Generation" },
        { value: "Whatsapp Marketing", label: "Whatsapp Marketing" },
        { value: "IT Services", label: "IT Services", isDisabled: true },
        { value: "Website Development", label: "Website Development" },
        { value: "App Design & Development", label: "App Design & Development" },
        {
            value: "Web Application Development",
            label: "Web Application Development",
        },
        { value: "Software Development", label: "Software Development" },
        { value: "CRM Development", label: "CRM Development" },
        { value: "ERP Development", label: "ERP Development" },
        { value: "E-Commerce Website", label: "E-Commerce Website" },
        { value: "Product Development", label: "Product Development" },
        {
            value: "Business Registration",
            label: "Business Registration",
            isDisabled: true,
        },
        {
            value: "Sole Proprietorship Registration",
            label: "Sole Proprietorship Registration",
        },
        {
            value: "Partnership Firm Registration",
            label: "Partnership Firm Registration",
        },
        { value: "LLP Firm Registration", label: "LLP Firm Registration" },
        {
            value: "Private Limited Registration",
            label: "hPrivate Limited Registrationh",
        },
        {
            value: "Public Company Registration",
            label: "Public Company Registration",
        },
        { value: "Nidhi Company Registration", label: "Nidhi Company Registration" },
        {
            value: "Producer Company Registration",
            label: "Producer Company Registration ",
        },
        { value: "Trademark & IP", label: "Trademark & IP", isDisabled: true },
        { value: "Trademark Registration", label: "Trademark Registration" },
        { value: "Copyright Registration", label: "Copyright Registration" },
        { value: "Patent Registration", label: "Patent Registration" },

        // Add more options as needed
    ];


    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? "blue"
                : state.isDisabled
                    ? "#ffb900"
                    : "white",
            color: state.isDisabled ? "white" : "black",
            // border: "0px solid transparent ",
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "space-between",
            // width: " 100%",
            // Add more styles as needed
        }),
    };


    // const handleChange = (selectedOptions) => {
    //     setSelectedOptions(selectedOptions);
    // };

    const CheckboxOption = ({ children, ...props }) => (
        <components.Option {...props}>
            <input type="checkbox" checked={props.isSelected} onChange={() => null} /> {children}
        </components.Option>
    );



    // ----------------------------------------------------daterangepicker-filter-----------------------------------------------------------------

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
    const currentYear = currentDate.getFullYear();

    const handleIconClick = () => {
        if (!buttonToggle) {
            setDateRangeDisplay(true);
        } else {
            setDateRangeDisplay(false);
        }
        setButtonToggle(!buttonToggle);
    };


    const handleSelect = (date) => {
        const filteredDataDateRange = completeData.filter(product => {
            const productDate = new Date(product["bookingDate"]);
            return (
                productDate >= date.selection.startDate &&
                productDate <= date.selection.endDate
            );
        });
        setStartDate(date.selection.startDate);
        setEndDate(date.selection.endDate);
        setFilteredDataDateRange(filteredDataDateRange);
        //console.log(filteredDataDateRange)
    };
    // console.log(startDate)

    const companieswithDateRangeCurrentMonth = filteredDataDateRange.filter(company => {
        const bookingDate = new Date(company.bookingDate);
        const bookingMonth = bookingDate.getMonth() + 1; // Months are zero-indexed, so we add 1
        const bookingYear = bookingDate.getFullYear();

        return bookingMonth === currentMonth && bookingYear === currentYear;
    });
    console.log(companieswithDateRangeCurrentMonth)

    const companieswithDateRangeToday = filteredDataDateRange.filter(company => {
        const bookingDate = new Date(company.bookingDate);
        const today = new Date(); // Get current date

        // Check if bookingDate is the same as today
        return bookingDate.getDate() === today.getDate() &&
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getFullYear() === today.getFullYear();
    });
    //console.log(companieswithDateRangeToday)


    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    };

    // -----------------------------------------service filter----------------------------------------

    function filterCompaniesByServiceTotal(selectedValues) {

        const newselectedValues = selectedValues;

        return completeData.filter(company => {

            for (let index = 0; index < newselectedValues.length; index++) {

                return company.services[0].includes(newselectedValues[index])

            }
        });

    }
    const filteredCompaniesTotal = filterCompaniesByServiceTotal(selectedValues);
    console.log(filteredCompaniesTotal)

    function countServices(companies) {
        const serviceCounts = {};
        
        // Iterate over each company
        companies.forEach(company => {
            const services = company.services[0];

            console.log(services)
            
            // Iterate over each service within the company
            services.filter(service => {
                if (serviceCounts.hasOwnProperty(service)) {
                    serviceCounts[service]++;
                } else {
                    serviceCounts[service] = 1;
                }
            });
        });
        
        return serviceCounts;
    }
    
    // Calculate the number of each service
    const serviceCounts = countServices(filteredCompaniesTotal);
    console.log(serviceCounts);



    const companieswithServicesInCurrentMonthTotal = filteredCompaniesTotal.filter(company => {
        const bookingDate = new Date(company.bookingDate);
        const bookingMonth = bookingDate.getMonth() + 1; // Months are zero-indexed, so we add 1
        const bookingYear = bookingDate.getFullYear();

        return bookingMonth === currentMonth && bookingYear === currentYear;
    });
    //console.log(companieswithServicesInCurrentMonthTotal)


    // console.log(companieswithServicesInCurrentMonth);
    // console.log(companieswithServicesInCurrentMonth.length);

    const companieswithServicesTodayTotal = companieswithServicesInCurrentMonthTotal.filter(company => {
        const bookingDate = new Date(company.bookingDate);
        const today = new Date(); // Get current date

        // Check if bookingDate is the same as today
        return bookingDate.getDate() === today.getDate() &&
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getFullYear() === today.getFullYear();
    });

    console.log(filteredCompaniesTotal)
    console.log(companieswithServicesInCurrentMonthTotal)
    console.log(companieswithServicesInCurrentMonthTotal)

    // ---------------------------------------------------services filter by date range------------------------------------

    function filterCompaniesByService(selectedValues) {

        const newselectedValues = selectedValues;

        return filteredDataDateRange.filter(company => {

            for (let index = 0; index < newselectedValues.length; index++) {

                return company.services[0].includes(newselectedValues[index])

            }
        });

    }
    const filteredCompanies = filterCompaniesByService(selectedValues);
    console.log(filteredCompanies)
    // console.log(filteredCompanies.length)

    const companieswithServicesInCurrentMonth = filteredCompanies.filter(company => {
        const bookingDate = new Date(company.bookingDate);
        const bookingMonth = bookingDate.getMonth() + 1; // Months are zero-indexed, so we add 1
        const bookingYear = bookingDate.getFullYear();

        return bookingMonth === currentMonth && bookingYear === currentYear;
    });

    // console.log(companieswithServicesInCurrentMonth);
    // console.log(companieswithServicesInCurrentMonth.length);

    const companieswithServicesToday = filteredCompanies.filter(company => {
        const bookingDate = new Date(company.bookingDate);
        const today = new Date(); // Get current date

        // Check if bookingDate is the same as today
        return bookingDate.getDate() === today.getDate() &&
            bookingDate.getMonth() === today.getMonth() &&
            bookingDate.getFullYear() === today.getFullYear();
    });

    // console.log(companieswithServicesToday);
    // console.log(companieswithServicesToday.length);
    const handleRightClick = () => {
        console.log(filteredCompanies)
    }


    return (
        <div>
            <Header_processing />
            <Navbar_processing />
            <div className='container-xl'>
                <div className='row row-deck row-cards mt-3'>
                    <div class="col-sm-6 col-lg-3 ">
                        <div class="card firstClass">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="subheader" style={{ color: "white", fontSize: "10px" }}>Total No of Bookings</div>
                                    <GrDocumentStore style={{ width: "50px", height: "50px" }} />
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <div class="h1 mb-3 me-2">{companyCount}</div>
                                    <div class="me-auto">
                                        {/* <span class="text-yellow d-inline-flex align-items-center lh-1">

                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
                                        </span> */}
                                    </div>
                                </div>
                                <div id="chart-new-clients" class="chart-sm"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3" >
                        <div class="card firstClass">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="subheader" style={{ color: "white", fontSize: "10px" }}>Monthly Bookings</div>
                                    <CiCalendar style={{ width: "50px", height: "50px" }} />
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <div class="h1 mb-3 me-2">{currentBookingDate.length}</div>
                                    <div class="me-auto">
                                        {/* <span class="text-yellow d-inline-flex align-items-center lh-1">

                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
                                        </span> */}
                                    </div>
                                </div>
                                <div id="chart-new-clients" class="chart-sm"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3" >
                        <div class="card firstClass">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="subheader" style={{ color: "white", fontSize: "10px" }}>Total Revenue</div>
                                    <HiMiniCurrencyRupee style={{ width: "50px", height: "50px" }} />
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <div class="h1 mb-0 me-2">&#8377;{totalPayment}</div>
                                    <div class="me-auto">
                                        <span class="text-green d-inline-flex align-items-center lh-1">

                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 17l6 -6l4 4l8 -8" /><path d="M14 7l7 0l0 7" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div id="chart-revenue-bg" class="chart-sm"></div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="card firstClass">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="subheader" style={{ color: "white", fontSize: "10px" }}>Monthly Revenue</div>
                                    <HiMiniCurrencyRupee style={{ width: "50px", height: "50px" }} />
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <div class="h1 mb-0 me-2">&#8377;{revenueCurrentMonth}</div>
                                    <div class="me-auto">
                                        <span class="text-green d-inline-flex align-items-center lh-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon ms-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 17l6 -6l4 4l8 -8" /><path d="M14 7l7 0l0 7" /></svg>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div id="chart-revenue-bg" class="chart-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <div class='container-xl mt-4'>
                <div class="col-12">
                    <div class="row row-cards">
                        <div class="col-sm-6 col-lg-6">
                            <div class="card card-sm">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <span class="bg-primary text-white avatar">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                                            </span>
                                        </div>
                                        <div class="col">
                                            <div>
                                                <Select
                                                    styles={{
                                                        customStyles,
                                                        // border: "0px solid transparent !important",
                                                        // display: "flex !important",
                                                        // alignItems: "center !important",
                                                        // justifyContent: "space-between !important",
                                                        // width: " 100% !important",
                                                        // Add custom styles here
                                                        container: (provided) => ({
                                                            ...provided,
                                                            // Apply display: flex with !important
                                                            //     // Add other custom styles as needed
                                                        }),
                                                    }}
                                                    isMulti
                                                    options={options_new}
                                                    onChange={(selectedOptions) => {
                                                        setSelectedValues(
                                                            selectedOptions.map((option) => option.value)
                                                        );
                                                    }}
                                                    value={selectedValues.map((value) => ({ value, label: value }))}
                                                    placeholder="Select Services..."
                                                >
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div class="col-sm-6 col-lg-3">
                            <div class="card card-sm">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <span class="bg-green text-white avatar">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                                            </span>
                                        </div>
                                        <div class="col">
                                            <div class="font-weight-medium">
                                                78 Orders
                                            </div>
                                            <div class="text-muted">
                                                32 shipped
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-3">
                            <div class="card card-sm">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <span class="bg-twitter text-white avatar">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c0 -.249 1.51 -2.772 1.818 -4.013z" /></svg>
                                            </span>
                                        </div>
                                        <div class="col">
                                            <div class="font-weight-medium">
                                                623 Shares
                                            </div>
                                            <div class="text-muted">
                                                16 today
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> 
                        <div class="col-sm-6 col-lg-6">
                            <div class="card card-sm">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <span class="bg-facebook text-white avatar">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
                                            </span>
                                        </div>
                                        <div class="col">
                                            <div class="font-weight-medium">
                                                132 Likes
                                            </div>
                                            <div class="text-muted">
                                                21 today
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* -------------------------------------------filtersection----------------------------------------------------------- */}

            <div className="container-xl w-100 h-100 mt-2">
                <div className="card d-flex justify-content-center p-4" >
                    <div className='row row-cards'>
                        <div class="col-sm-6 col-lg-6">
                            <div class="card card-sm">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <span class="bg-facebook text-white avatar">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                                            </span>
                                        </div>
                                        <div class="col">
                                            <Select
                                                options={options}
                                                styles={{
                                                    customStyles,
                                                    container: (provided, state) => ({
                                                        ...provided,
                                                        borderColor: "transparent",
                                                        justifyContent: "space-between"
                                                    }),
                                                }}
                                                isMulti
                                                // value={selectedOptions}
                                                // onChange={handleChange}
                                                onChange={(selectedOptions) => {
                                                    setSelectedValues(
                                                        selectedOptions.map((option) => option.value)
                                                    );
                                                }}
                                                value={selectedValues.map((value) => ({ value, label: value }))}
                                                closeMenuOnSelect={false}
                                                hideSelectedOptions={false}
                                                components={{ Option: CheckboxOption }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-6">
                            <div class="card card-sm ">
                                <div class="card-body">
                                    <div class="row align-items-center ">
                                        <div class="col-auto d-flex align-items-center justify-content-between w-100" >
                                            <div className='d-flex align-items-center'>
                                                <span className="bg-facebook text-white avatar">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 448 512" fill='white' strokeWidth="2" stroke="currentColor">
                                                        <path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192H400V448c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192z" />
                                                    </svg>
                                                </span>
                                                <span style={{ border: "none", padding: "0px 20px", color: "#969595" }}>
                                                    {startDate && endDate && startDate.toLocaleDateString() === endDate.toLocaleDateString() ? (
                                                        // If start date is equal to end date
                                                        <span>Select your date here......</span>
                                                    ) : (
                                                        // If start date is not equal to end date
                                                        <span>
                                                            {startDate && startDate.toLocaleDateString()} - {endDate && endDate.toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <button onClick={handleIconClick} style={{ border: "none", padding: "0px", backgroundColor: "white" }}>
                                                <FaChevronDown style={{ width: "14px", height: "14px", color: "#bcbaba", }} />
                                            </button>
                                        </div>
                                        <div class="col position-relative">
                                            {displayDateRange && (
                                                <div class="position-absolute top-100 start-0" style={{ zIndex: "1" }}>
                                                    <DateRangePicker
                                                        ranges={[selectionRange]}
                                                        onClose={() => setDateRangeDisplay(false)}
                                                        onChange={handleSelect}

                                                    />

                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div class="col-sm-6 col-lg-3">
                            <div class="card card-sm">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <span class="bg-facebook text-white avatar">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
                                            </span>
                                        </div>
                                        <div class="col">
                                            <div class="font-weight-medium">
                                                132 Likes
                                            </div>
                                            <div class="text-muted">
                                                21 today
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* <div class="col-sm-6 col-lg-3">
                            <div class="card card-sm">
                                <div class="card-body">
                                    <div class="row align-items-center">
                                        <div class="col-auto">
                                            <span class="bg-facebook text-white avatar">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3" /></svg>
                                            </span>
                                        </div>
                                        <div class="col">
                                            <div class="font-weight-medium">
                                                132 Likes
                                            </div>
                                            <div class="text-muted">
                                                21 today
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>


            {/* -----------------------------------------------------graph sections------------------------------------------------ */}


            <div className='container-xl mt-2'>
                <div className='row row-deck row-cards'>
                    <div class="col-sm-6 col-lg-4">
                        <div class="card secondClass" style={{ boxShadow: "0px 0px 5px #e0d9d9" }}>
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="subheader" style={{ fontSize: "10px" }}>Total Bookings</div>
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <div class="h1 mb-3 me-2 numbers">
                                        {(() => {
                                            if (filteredDataDateRange.length !== 0 && filteredCompaniesTotal.length !== 0) {
                                                return filteredCompanies.length;
                                            } else if (filteredDataDateRange.length !== 0) {
                                                return filteredDataDateRange.length;
                                            } else if (filteredCompaniesTotal.length !== 0) {
                                                return filteredCompaniesTotal.length;
                                            } else {
                                                return completeData.length;
                                            }
                                        })()}
                                    </div>
                                </div>
                                <hr></hr>
                                <div id="chart-new-clients" class="chart-sm">
                                    <Link to="#"> View Details </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-4">
                        <div class="card secondClass" style={{ boxShadow: "0px 0px 5px #e0d9d9" }}>
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="subheader" style={{ fontSize: "10px" }}>Total Bookings</div>
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <div class="h1 mb-3 me-2 numbers">
                                    {(() => {
                                        if (companieswithDateRangeCurrentMonth.length !== 0 && companieswithServicesInCurrentMonthTotal.length !== 0) {
                                            return companieswithServicesInCurrentMonth.length;
                                        } else if (companieswithDateRangeCurrentMonth.length !== 0) {
                                            return companieswithDateRangeCurrentMonth.length;
                                        } else if (companieswithServicesInCurrentMonthTotal.length === 0 && selectedValues.length !== 0) {
                                            return companieswithServicesInCurrentMonthTotal.length;

                                        } else if (companieswithServicesInCurrentMonthTotal.length !== 0) {
                                            return companieswithServicesInCurrentMonthTotal.length;
                                        } else {
                                            return currentBookingDate.length;
                                        }
                                    })()}
                                    </div>
                                </div>
                                <hr></hr>
                                <div id="chart-new-clients" class="chart-sm">
                                    <Link to="#"> View Details </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-4"  >
                        <div class="card secondClass" style={{ boxShadow: "0px 0px 5px #e0d9d9" }}>
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="subheader" style={{ fontSize: "10px" }}>Todays Booking</div>
                                </div>
                                <div class="d-flex align-items-baseline">
                                    <div class="h1 mb-3 me-2 numbers">{(() => {
                                        if (companieswithDateRangeToday.length !== 0 && companieswithServicesTodayTotal.length !== 0) {
                                            return companieswithServicesToday.length;
                                        } else if (companieswithDateRangeToday.length !== 0) {
                                            return companieswithDateRangeToday.length;

                                        }
                                        else if (companieswithServicesTodayTotal.length === 0 && selectedValues.length !== 0) {
                                            return companieswithServicesTodayTotal.length;

                                        } else if (companieswithServicesTodayTotal.length !== 0) {
                                            return companieswithServicesTodayTotal.length;
                                        } else {
                                            return companiesToday.length;
                                        }
                                    })()}
                                    </div>
                                </div>
                                <hr></hr>
                                <div id="chart-new-clients" class="chart-sm">
                                    <Link to="#"> View Details </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div >
    )
}

export default Analysis_dashboard;
