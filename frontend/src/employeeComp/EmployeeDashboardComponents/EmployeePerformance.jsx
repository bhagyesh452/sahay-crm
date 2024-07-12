import React, { useRef, useState, useEffect } from 'react';
import axios from "axios";


function EmployeePerformance({ data}) {

    const secretKey = process.env.REACT_APP_SECRET_KEY;
    
    

    const [callData, setCallData] = useState([]);
    const [error, setError] = useState(null);

    const [employeeData, setEmployeeData] = useState([])
    
    const [redesignedData, setRedesignedData] = useState([])
    const [sortedEmployeeData, setSortedEmployeeData] = useState([]);
    const [bookingStartDate, setBookingStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [bookingEndDate, setBookingEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
    const [loading, setLoading] = useState(false)
    const [initialDate, setInitialDate] = useState(new Date());
    const currentYear = initialDate.getFullYear();
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    const currentMonth = monthNames[initialDate.getMonth()];
    console.log("currentMonth" , currentMonth)


  
     //----------------------fetching employee info----------------------------------------
     const fetchEmployeeInfo = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${secretKey}/employee/einfo`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const filteredData = data.filter((employee) => (employee.designation === "Sales Executive" || employee.designation === "Sales Manager") && employee.ename !== "DIRECT")
            setEmployeeData(filteredData);
            setSortedEmployeeData(filteredData.sort((a,b)=>functionCalculateOnlyAchieved(b.ename) - functionCalculateOnlyAchieved(a.ename)));

        } catch (error) {
            console.error('Error Fetching Employee Data ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRedesignedBookings()
    }, [])  

    useEffect(() => {
      fetchEmployeeInfo()
    }, [redesignedData])
    
   




    //  -----------------------------------   callizer api functions  -----------------------------------------------------------

    const fetchRedesignedBookings = async () => {
        try {
          const response = await axios.get(
            `${secretKey}/bookings/redesigned-final-leadData`
          );
          const bookingsData = response.data;
    
    
          setRedesignedData(bookingsData);
        //   const sortedEmployeeData = employeeData.sort((a,b)=>functionCalculateOnlyAchieved(b.ename) - functionCalculateOnlyAchieved(a.ename));
            
        //   setSortedEmployeeData(sortedEmployeeData);
          
        } catch (error) {
          console.log("Error Fetching Bookings Data", error);
        }
      };

    

    // ------------------------------------  function for Calculation  -----------------------------------------
 

    const functionCalculateOnlyAchieved = (bdeName) => {
        let achievedAmount = 0;
        let remainingAmount = 0;
        let expanse = 0;
        redesignedData.map((mainBooking) => {
            const bookingDate = new Date(mainBooking.bookingDate);
            const startDate = new Date(bookingStartDate);
            const endDate = new Date(bookingEndDate);
            bookingDate.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);

            const isSameDayMonthYear = (date1, date2) => {
                return (
                    date1.getDate() === date2.getDate() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getFullYear() === date2.getFullYear()
                );
            };

            if (bookingDate >= startDate && bookingDate <= endDate || (isSameDayMonthYear(bookingDate, startDate) && isSameDayMonthYear(bookingDate, endDate))) {
                if (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName) {

                    if (mainBooking.bdeName === mainBooking.bdmName) {
                        achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount);
                        mainBooking.services.map(serv => {
                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse : expanse;
                            }

                        });

                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                        achievedAmount = achievedAmount + Math.floor(mainBooking.generatedReceivedAmount) / 2;
                        mainBooking.services.map(serv => {
                            // console.log(serv.expanse , bdeName ,"this is services");
                            let expanseDate = null
                            if (serv.expanse) {
                                expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                expanseDate.setHours(0, 0, 0, 0);
                                const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                expanse = condition ? expanse + serv.expanse / 2 : expanse;
                            }

                        });
                    } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                        if (mainBooking.bdeName === bdeName) {
                            achievedAmount += Math.floor(mainBooking.generatedReceivedAmount);
                            mainBooking.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                        }
                    }
                }

            } else if (mainBooking.remainingPayments.length !== 0) {
                mainBooking.remainingPayments.map((remainingObj) => {
                    const moreBookingDate = new Date(remainingObj.paymentDate);

                    moreBookingDate.setHours(0, 0, 0, 0);


                    if (((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) && (mainBooking.bdeName === bdeName || mainBooking.bdmName === bdeName)) {
                        const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
                        const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                        if (mainBooking.bdeName === mainBooking.bdmName) {
                            remainingAmount += Math.floor(tempAmount);
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by") {
                            remainingAmount += Math.floor(tempAmount) / 2;
                        } else if (mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by") {
                            if (mainBooking.bdeName === bdeName) {
                                remainingAmount += Math.floor(tempAmount);
                            }
                        }
                    }
                })
            }
            mainBooking.moreBookings.map((moreObject) => {
                const moreBookingDate = new Date(moreObject.bookingDate);
                moreBookingDate.setHours(0, 0, 0, 0);

                if ((moreBookingDate >= startDate && moreBookingDate <= endDate) || (isSameDayMonthYear(moreBookingDate, startDate) && isSameDayMonthYear(moreBookingDate, endDate))) {
                    if (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName) {
                        if (moreObject.bdeName === moreObject.bdmName) {
                            achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount);
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                            achievedAmount = achievedAmount + Math.floor(moreObject.generatedReceivedAmount) / 2;
                            moreObject.services.map(serv => {
                                // console.log(serv.expanse , bdeName ,"this is services");
                                let expanseDate = null
                                if (serv.expanse) {
                                    expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                    expanseDate.setHours(0, 0, 0, 0);
                                    const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                    expanse = condition ? expanse + serv.expanse : expanse;
                                }
                            });
                        } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                            if (moreObject.bdeName === bdeName) {
                                achievedAmount += Math.floor(moreObject.generatedReceivedAmount);
                                moreObject.services.map(serv => {
                                    // console.log(serv.expanse , bdeName ,"this is services");
                                    let expanseDate = null
                                    if (serv.expanse) {
                                        expanseDate = serv.expanseDate ? new Date(serv.expanseDate) : new Date(mainBooking.bookingDate);

                                        expanseDate.setHours(0, 0, 0, 0);
                                        const condition = (expanseDate >= startDate && expanseDate <= endDate || (isSameDayMonthYear(expanseDate, startDate) && isSameDayMonthYear(expanseDate, endDate)))
                                        expanse = condition ? expanse + serv.expanse : expanse;
                                    }
                                });
                            }
                        }
                    }
                } else if (moreObject.remainingPayments.length !== 0) {

                    moreObject.remainingPayments.map((remainingObj) => {
                        const moreRemainingDate = new Date(remainingObj.paymentDate);
                        moreRemainingDate.setHours(0, 0, 0, 0);
                        if (((moreRemainingDate >= startDate && moreRemainingDate <= endDate) || (isSameDayMonthYear(moreRemainingDate, startDate) && isSameDayMonthYear(moreRemainingDate, endDate))) && (moreObject.bdeName === bdeName || moreObject.bdmName === bdeName)) {

                            const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                            const tempAmount = findService.withGST ? Math.floor(remainingObj.receivedPayment) / 1.18 : Math.floor(remainingObj.receivedPayment);
                            if (moreObject.bdeName === moreObject.bdmName) {
                                remainingAmount += Math.floor(tempAmount);
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by") {
                                remainingAmount += Math.floor(tempAmount) / 2;
                            } else if (moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by") {
                                if (moreObject.bdeName === bdeName) {
                                    remainingAmount += Math.floor(tempAmount);
                                }
                            }
                        }
                    })
                }
            })
        })

        const amount = achievedAmount + Math.floor(remainingAmount) - expanse;
        
        return amount
    }
    const functionGetOnlyAmount = (object) => {
        if (object.targetDetails.length !== 0) {
            const foundObject = object.targetDetails.find(
                (item) =>
                    Math.floor(item.year) === currentYear && item.month === currentMonth
            );


            return foundObject ? foundObject.amount : 0;
        } else {
            return 0;
        }
    };
// console.log(data.ename , employeeData)
  return (
    <div>
        <div className="dash-card" style={{minHeight:'299px'}}>
            <div className="dash-card-head">
                <h2 className="m-0 d-flex align-items-end justify-content-between flex-wrap">
                    <div>Top 5 Performers</div>
                    <div style={{fontSize:"11px"}}> (Ranking Is Done Based On Collection)</div>
                </h2>
            </div>
            <div className="dash-card-body table-responsive">
            <table class="table top_5_table m-0">
                <thead>
                    <tr >
                        <th style={{  borderRadius:' 8px 0 0 0'}}>Rank </th>
                        
                        <th>Name</th>
                        <th>Branch</th>

                        <th style={{  borderRadius:' 0 8px  0 0'}}>Achievement</th>         
                    </tr>
                </thead>
                {sortedEmployeeData.length!==0 && <tbody>
                <tr className={sortedEmployeeData[0].ename === data.ename ? "clr-bg-light-1cba19 myself " : "clr-bg-light-1cba19 " }  >
                    <td><div className="ranktd clr-fff clr-bg-1cba19">1</div></td>
                    <td>
                        <div className='My_Text_Wrap'>
                            {sortedEmployeeData[0].ename === data.ename ? "You" : sortedEmployeeData[0].ename }
                        </div>
                    </td>
                    <td>{sortedEmployeeData[0].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                    <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[0].ename) / functionGetOnlyAmount(sortedEmployeeData[0])) * 100).toFixed(2)} %</td>
                </tr>
                <tr className={sortedEmployeeData[1].ename === data.ename ? "clr-bg-light-ffb900 myself " : "clr-bg-light-ffb900 " }  >
                
                    <td><div className="ranktd clr-bg-ffb900 clr-fff">2</div></td>
                    <td>
                        <div className='My_Text_Wrap'>    
                            {sortedEmployeeData[1].ename === data.ename ? "You" : sortedEmployeeData[1].ename}
                        </div>
                    </td>
                    <td>{sortedEmployeeData[1].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                    <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[1].ename) / functionGetOnlyAmount(sortedEmployeeData[1])) * 100).toFixed(2)} %</td>
                </tr>
                <tr className={sortedEmployeeData[2].ename === data.ename ? "clr-bg-light-00d19d myself " : "clr-bg-light-00d19d " }  >
                
            
                    <td><div className="ranktd  clr-bg-00d19d clr-fff">3</div></td>
                    <td>
                        <div className='My_Text_Wrap'>
                            {sortedEmployeeData[2].ename === data.ename ? "You" : sortedEmployeeData[2].ename}
                        </div>
                    </td>
                    <td>{sortedEmployeeData[2].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                    <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[2].ename) / functionGetOnlyAmount(sortedEmployeeData[2])) * 100).toFixed(2)} %</td>
                </tr>
                <tr className={sortedEmployeeData[3].ename === data.ename ? "clr-bg-light-e65b5b myself " : "clr-bg-light-e65b5b " }  >
                
            
                    <td><div className="ranktd clr-bg-e65b5b clr-fff">4</div></td>
                    <td>
                        <div className='My_Text_Wrap'>
                            {sortedEmployeeData[3].ename === data.ename ? "You" : sortedEmployeeData[3].ename}
                        </div>
                    </td>
                    <td>{sortedEmployeeData[3].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                    <td>{((functionCalculateOnlyAchieved(sortedEmployeeData[3].ename) / functionGetOnlyAmount(sortedEmployeeData[3])) * 100).toFixed(2)} %</td>
                </tr>
                <tr className={sortedEmployeeData[4].ename === data.ename ? "clr-bg-light-4299e1 myself " : "clr-bg-light-4299e1 " }  >
                
                
                    <td  style={{  borderRadius:' 0 0 0 8px '}}><div className="ranktd clr-bg-4299e1 clr-fff">5</div></td>
                    <td>
                        <div className='My_Text_Wrap'>    
                            {sortedEmployeeData[4].ename === data.ename ? "You" : sortedEmployeeData[4].ename}
                        </div>                    
                    </td>
                    <td>{sortedEmployeeData[4].branchOffice === "Gota" ? "Gota" : "SBR"}</td>
                    <td  style={{  borderRadius:' 0 0  8px 0 '}}>{((functionCalculateOnlyAchieved(sortedEmployeeData[4].ename) / functionGetOnlyAmount(sortedEmployeeData[4])) * 100).toFixed(2)} %</td>
                </tr>
                </tbody>}
            </table>
            </div>
        </div>
    </div>
  )
}

export default EmployeePerformance