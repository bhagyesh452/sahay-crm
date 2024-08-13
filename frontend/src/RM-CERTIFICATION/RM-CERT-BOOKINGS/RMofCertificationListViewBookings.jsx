import React, { useState, useEffect } from 'react';
import { FaList } from "react-icons/fa6";
import { FaTableCellsLarge } from "react-icons/fa6";
import RmofCertificationBookings from './RmofCertificationBookings';
import ClipLoader from "react-spinners/ClipLoader";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { MdOutlineSwapHoriz } from "react-icons/md";
import axios from 'axios';
import '../../assets/table.css';
import '../../assets/styles.css';

function RMofCertificationListViewBookings({ bookingsData }) {
    const [openTableView, setOpenTableView] = useState(false)
    const [openListView, setOpenListView] = useState(true)
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const rmCertificationUserId = localStorage.getItem("rmCertificationUserId")
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    useEffect(() => {
        document.title = `RMOFCERT-Sahay-CRM`;
      }, []);
      
    const handleViewTable = () => {
        setOpenTableView(true)
        setOpenListView(false)
        window.location.replace(`/adminhead/bookings/${rmCertificationUserId}`);
    }

    const handleViewList = () => {
        setOpenListView(true)
        setOpenTableView(false)
    }
    const allServicesWithDetails = [];

    // Iterate over bookingData
    bookingsData.forEach(booking => {
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
            {openListView && (<>
                {/* <div className="booking_list_Filter">
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
                            <div className="col-6 d-flex">
                                <div className="list-gird-main ms-auto">
                                    <div className={openListView ? "listgrridradio_main d-flex align-items-center" : "d-flex align-items-center"}>
                                        <div className="custom_radio">
                                            <input type="radio" name="rGroup" value="1" id="r1" checked={openTableView} />
                                            <label class="custom_radio-alias" for="r1">
                                                <FaTableCellsLarge onClick={() => { handleViewTable() }} />
                                            </label>
                                        </div>
                                        <div className="custom_radio">
                                            <input type="radio" name="rGroup" value="2" id="r2" checked={openListView} />
                                            <label class="custom_radio-alias" for="r2">
                                                <FaList onClick={() => handleViewList()} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <div className="page-body">
                    <div className="container-xl">
                        <div className="card">
                            <div className="card-body p-0">
                                <div
                                    id="table-default"
                                    style={{
                                        overflowX: "auto",
                                        overflowY: "auto",
                                        maxHeight: "66vh",
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
                                                {/* <th>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.length === allIds.length && selectedRows.length !== 0}
                                                onChange={() => handleCheckboxChange("all")}
                                                defaultChecked={false}
                                            />
                                        </th> */}
                                                <th className="th-sticky">Sr.No</th>
                                                <th className="th-sticky1">Company Name</th>
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
                                                {/* <th>FIRST PAYMENT</th>
                                                <th>SECOND PAYMENT</th>
                                                <th>THIRD PAYMENT</th>
                                                <th>FOURTH PAYMENT</th>
                                                <th>SECOND PAYMENT REMARKS</th>
                                                <th>THIRD PAYMENT REMARKS</th>
                                                <th>FOURTH PAYMENT REMARKS</th> */}
                                                <th>Swap Service</th>
                                            </tr>
                                        </thead>
                                        {currentDataLoading ? (
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
                                                        
                                                        //className={selectedRows.includes(company._id) ? "selected" : ""}
                                                        style={{ border: "1px solid #ddd"}}>
                                                        <td className="td-sticky">{index + 1}</td>
                                                        <td className='td-sticky1'>{obj["Company Name"]}</td>
                                                        <td>{obj["Company Number"]}</td>
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
                        </div>
                    </div>
                </div>
            </>)}
        </div>
    )
}

export default RMofCertificationListViewBookings