import React, { useState, useEffect } from 'react';
import { FaList } from "react-icons/fa6";
import { FaTableCellsLarge } from "react-icons/fa6";
import ClipLoader from "react-spinners/ClipLoader";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MdOutlineSwapHoriz } from "react-icons/md";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import '../../assets/table.css';
// import '../../assets/styles.css';

function BookingsTableView({

    tabelViewState,
    listViewState,
    listViewOpen,
    tableViewOpen,
}) {
    // const [openTableView, setOpenTableView] = useState(false)
    // const [openListView, setOpenListView] = useState(true)
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const navigate = useNavigate();
    useEffect(() => {
        document.title = `AdminHead-Sahay-CRM`;
    }, []);

    const handleViewTable = () => {
        // tabelViewState(true)
        // listViewState(false)
        navigate(`/md/bookings`);
    }
    const allServicesWithDetails = [];

    const { data: bookingsData, isLoading: isBookingDataLoading, isError: isBookingDataError, refetch: refetchBookingData } = useQuery({
        queryKey: ["bookingsData"],
        queryFn: async () => {

            // Normalize searchText by replacing non-breaking spaces with regular spaces
            //   const normalizedSearchText = searchText.replace(/\u00A0/g, " ");

            const res = await axios.get(`${secretKey}/bookings/redesigned-final-leadData`, {

            });
            return res.data;
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        refetchInterval: 300000,  // Fetch the data after every 5 minutes
        refetchIntervalInBackground: true,  // Fetching the data in the background even the tab is not opened
    });


    // Iterate over bookingData
    bookingsData?.forEach(booking => {
        // Add services from main booking with booking details
        booking.services.forEach(service => {
            allServicesWithDetails.push({
                "Company Name": booking["Company Name"],
                "Company Number": booking["Company Number"],
                "Company Email": booking["Company Email"],
                panNumber: booking.panNumber,
                bdeName: booking.bdeName,
                bdeEmail: booking.bdeEmail || '', // Make sure to handle optional fields if they are not always provided
                bdmName: booking.bdmName,
                bdmType: booking.bdmType || 'Close-by', // Default value if not provided
                bookingDate: booking.bookingDate,
                paymentMethod: booking.paymentMethod || '', // Make sure to handle optional fields if they are not always provided
                caCase: booking.caCase || false, // Default to false if not provided
                caNumber: booking.caNumber || 0, // Default to 0 if not provided
                caEmail: booking.caEmail || '', // Make sure to handle optional fields if they are not always provided
                serviceName: service.serviceName || '',
                totalPaymentWOGST: service.totalPaymentWOGST || 0, // Default to 0 if not provided
                totalPaymentWGST: service.totalPaymentWGST || 0,
                withGST: service.withGST, // Default to 0 if not provided
                firstPayment: service.firstPayment || 0, // Default to 0 if not provided
                secondPayment: service.secondPayment || 0, // Default to 0 if not provided
                thirdPayment: service.thirdPayment || 0, // Default to 0 if not provided
                fourthPayment: service.fourthPayment || 0,
                secondPaymentRemarks: service.secondPaymentRemarks || "",
                thirdPaymentRemarks: service.thirdPaymentRemarks || "",
                fourthPaymentRemarks: service.fourthPaymentRemarks || "", // Default to 0 if not provided
                bookingPublishDate: booking.bookingPublishDate || '', // Placeholder for bookingPublishDate, can be set if available
            });
        });

        // Iterate over moreBookings in each booking
        booking.moreBookings.forEach(moreBooking => {
            // Add services from moreBookings with booking and moreBooking details
            moreBooking.services.forEach(service => {
                allServicesWithDetails.push({
                    "Company Name": booking["Company Name"],
                    "Company Number": booking["Company Number"],
                    "Company Email": booking["Company Email"],
                    panNumber: booking.panNumber,
                    bdeName: moreBooking.bdeName,
                    bdeEmail: moreBooking.bdeEmail || '', // Make sure to handle optional fields if they are not always provided
                    bdmName: moreBooking.bdmName,
                    bdmType: moreBooking.bdmType || 'Close-by', // Default value if not provided
                    bookingDate: moreBooking.bookingDate,
                    paymentMethod: moreBooking.paymentMethod || '', // Make sure to handle optional fields if they are not always provided
                    caCase: moreBooking.caCase || false, // Default to false if not provided
                    caNumber: moreBooking.caNumber || 0, // Default to 0 if not provided
                    caEmail: moreBooking.caEmail || '', // Make sure to handle optional fields if they are not always provided
                    serviceName: service.serviceName || '',
                    totalPaymentWOGST: service.totalPaymentWOGST || 0, // Default to 0 if not provided
                    totalPaymentWGST: service.totalPaymentWGST || 0,
                    withGST: service.withGST, // Default to 0 if not provided
                    firstPayment: service.firstPayment || 0, // Default to 0 if not provided
                    secondPayment: service.secondPayment || 0, // Default to 0 if not provided
                    thirdPayment: service.thirdPayment || 0, // Default to 0 if not provided
                    fourthPayment: service.fourthPayment || 0,
                    secondPaymentRemarks: service.secondPaymentRemarks || "",
                    thirdPaymentRemarks: service.thirdPaymentRemarks || "",
                    fourthPaymentRemarks: service.fourthPaymentRemarks || "", // Default to 0 if not provided
                    bookingPublishDate: moreBooking.bookingPublishDate || '', // Placeholder for bookingPublishDate, can be set if available
                });
            });
        });
    });

    const handleOpenServices = async (dataToSend) => {
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-rmservices-from-listview`, {
                dataToSend: dataToSend
            });
            if (response.status === 200) {
                // Success response
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    html: 'Bookings Uploaded Successfully.'
                });
            } else if (response.status === 400) {
                // Bad request response
                Swal.fire({
                    icon: 'warning', // Exclamation icon
                    title: 'Warning',
                    html: response.data.message || 'Service has already been added'
                });
            }
        } catch (error) {
            // Check if error response is available
            if (error.response) {
                if (error.response.status === 500) {
                    // Internal server error response
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: 'Error swapping services'
                    });
                } else {
                    // Other errors
                    Swal.fire({
                        icon: 'warning', // Exclamation icon
                        title: 'Warning',
                        html: error.response.data.message || 'Failed to upload bookings'
                    });
                }
            } else {
                // Network or other errors
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: 'Failed to upload bookings'
                });
            }

            console.log("Error sending data", error);
        }
    };



    console.log(allServicesWithDetails);
    console.log(bookingsData)



    return (
        <div>
            <>
                <div className="booking_list_Filter">
                    <div className="container-xl">
                        <div className="row justify-content-between">
                            <div className="col-2">
                                <div class="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                                    <div class="input-icon">
                                        <span class="input-icon-addon">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="icon"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                stroke-width="2"
                                                stroke="currentColor"
                                                fill="none"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >
                                                <path
                                                    stroke="none"
                                                    d="M0 0h24v24H0z"
                                                    fill="none"
                                                ></path>
                                                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                                <path d="M21 21l-6 -6"></path>
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            //value={searchText}
                                            class="form-control"
                                            placeholder="Search Company"
                                            aria-label="Search in website"
                                        //onChange={(e) => setSearchText(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-primary mr-1" onClick={() => handleViewTable()}>
                                        Grid View
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sales-panels-main no-select container-xl mt-2">
                            <div className="table table-responsive e-Leadtable-style m-0">
                                <table className="table table-vcenter table-nowrap" style={{ width: "1800px" }}>
                                    <thead>
                                        <tr className="tr-sticky">
                                            {/* <th className="AEP-sticky-left-1">
                                                <label className="table-check">
                                                    <input type="checkbox" />
                                                    <span className="table_checkmark"></span>
                                                </label>
                                            </th> */}
                                            <th className="rm-sticky-left-1">Sr.No</th>
                                                <th className="rm-sticky-left-2">Company Name</th>
                                                <th>Company Number</th>
                                                <th>SERVICE NAME</th>
                                                {/* <th>Company Email</th> */}
                                                {/* <th>PAN NUMBER</th> */}
                                                <th>BDE NAME</th>
                                                {/* <th>BDE EMAIL</th> */}
                                                <th>BDM NAME</th>
                                                <th>BDM TYPE</th>
                                                <th>BOOKING DATE</th>
                                                {/* <th>PAYMENT METHOD</th> */}
                                                <th>CA CASE</th>
                                                <th>CA NUMBER</th>
                                                {/* <th>CA EMAIL</th> */}
                                                <th>WITH GST</th>
                                                <th>TOTAL PAYMENT WITHOUT GST</th>
                                                <th>TOTAL PAYMENT WITH GST</th>
                                        </tr>
                                    </thead>
                                    {isBookingDataLoading ? (
                                            <tbody>
                                                <tr>
                                                    <td colSpan="14" >
                                                        <div className="LoaderTDSatyle">
                                                            <ClipLoader
                                                                color="lightgrey"
                                                                loading
                                                                size={30}
                                                                aria-label="Loading Spinner"
                                                                data-testid="loader"
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        ) : (
                                            <tbody>
                                                {allServicesWithDetails.length !== 0 && allServicesWithDetails.map((obj, index) => (
                                                    <tr
                                                        key={index}
                                                        
                                                        // className={selectedRows.includes(company._id) ? "selected" : ""}
                                                        >
                                                        <td className='rm-sticky-left-1 '>{index + 1}</td>
                                                        <td className='rm-sticky-left-2 '>{obj["Company Name"]}</td>
                                                        <td >{obj["Company Number"]}</td>
                                                        <td>{obj.serviceName}</td>
                                                        {/* <td>{obj["Company Email"]}</td> */}
                                                        {/* <td>{obj.panNumber}</td> */}
                                                        <td>{obj.bdeName}</td>
                                                        {/* <td>{obj.bdeEmail}</td> */}
                                                        <td>{obj.bdmName}</td>
                                                        <td>{obj.bdmType}</td>
                                                        <td>{obj.bookingDate}</td>
                                                        {/* <td>{obj.paymentMethod}</td> */}
                                                        <td>{obj.caCase}</td>
                                                        <td>{obj.caNumber}</td>
                                                        {/* <td>{obj.caEmail}</td> */}
                                                        <td>{obj.withGST ? 'Yes' : 'No'}</td>
                                                        <td>{obj.totalPaymentWOGST}</td>
                                                        <td>{obj.totalPaymentWGST}</td>
                                                        {/* <td>{obj.firstPayment}</td>
                                                        <td>{obj.secondPayment}</td>
                                                        <td>{obj.thirdPayment}</td>
                                                        <td>{obj.fourthPayment}</td>
                                                        <td>{obj.secondRemarks}</td>
                                                        <td>{obj.thirdRemarks}</td>
                                                        <td>{obj.fourthRemarks}</td> */}
                                                        <td>
                                                            <button className='tbl-action-btn'
                                                                title="Swap Services">
                                                                <MdOutlineSwapHoriz onClick={() => (
                                                                    //setOpenServicesPopup(true),
                                                                    //setSelectedCompanyData(leadFormData.find(company => company["Company Name"] === obj["Company Name"])),
                                                                    handleOpenServices(obj)
                                                                )} />
                                                            </button></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        )}
                                  
                                    
                                </table>

                            </div>
                           
                     
                   
                </div>

            </>
        </div>
    )
}

export default BookingsTableView;