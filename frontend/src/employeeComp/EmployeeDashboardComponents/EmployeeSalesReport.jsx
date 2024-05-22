import React from 'react';
import { GoArrowUp } from "react-icons/go";
import { LineChart } from '@mui/x-charts/LineChart';
import GaugeComponent from 'react-gauge-component';

import Box from '@mui/material/Box';



function EmployeeSalesReport({data , redesignedData , moreEmpData , followData}) {

  function formatDateNow(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
  function formatDateFinal(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

const AchivedData = [5000, 10000, 80000, 5200, 8200, 3200, 4200];
const ProjectionData =  [10000, 10033, 50000, 52330, 85200, 32100, 42500];
const xLabels = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  // '8',
  // '9',
  // '10',
  // '11',
  // '12',
  // '13',
  // '14',
  // '15',
  // '16',
  // '17',
  // '18',
  // '19',
  // '20',
  // '21',
  // '22',
  // '23',
  // '24',
  // '25',
  // '26',
  // '27',
  // '28',
  // '29',
  // '30',
  // '31',
];
const yLabels = [
  '100000',
  '75000',
  '50000',
  '25000',
  '10000',
  '5000',
  '0',
];

let totalMaturedCount = 0;
let totalTargetAmount = 0;
let totalAchievedAmount = 0;

const functionCalculateMatured = (istrue) => {

  let maturedCount = 0;
  const today = new Date();

  redesignedData.map((mainBooking)=>{
    if(istrue){
      if(new Date(mainBooking.bookingDate).toLocaleDateString() === today.toLocaleDateString()){
       
        if(mainBooking.bdeName === mainBooking.bdmName){
          maturedCount = maturedCount + 1
        }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
          maturedCount = maturedCount + 0.5;
        }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
          if(mainBooking.bdeName === data.ename){
            maturedCount = maturedCount + 1;
          }
        }
    }
      mainBooking.moreBookings.map((moreObject)=>{
        if(new Date(moreObject.bookingDate).toLocaleDateString() === today.toLocaleDateString()){
       
            if(moreObject.bdeName === moreObject.bdmName){
              maturedCount = maturedCount + 1;
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
              maturedCount = maturedCount + 0.5
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
              if(moreObject.bdeName === data.ename){
                maturedCount = maturedCount + 1;
              }
            }
       
        }
      })

    }else{
      if(new Date(mainBooking.bookingDate).getMonth() === today.getMonth()){
       
          if(mainBooking.bdeName === mainBooking.bdmName){
            maturedCount = maturedCount + 1
          }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
            maturedCount = maturedCount + 0.5;
          }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
            if(mainBooking.bdeName === data.ename){
              maturedCount = maturedCount + 1;
            }
          }
      }
        mainBooking.moreBookings.map((moreObject)=>{
          if(new Date(moreObject.bookingDate).getMonth() === today.getMonth()){
         
              if(moreObject.bdeName === moreObject.bdmName){
                maturedCount = maturedCount + 1;
              }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
                maturedCount = maturedCount + 0.5;
              }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
                if(moreObject.bdeName === data.ename){
                  maturedCount = maturedCount + 1;
                }
              }         
          }
        })
      }    
    
  })

  // Set hours, minutes, and seconds to zero
  // const todayData = istrue
  //   ? redesignedData.filter(
  //     (obj) => new Date(obj.bookingDate).toLocaleDateString() === today.toLocaleDateString()
  //   )
  //   : redesignedData.filter(
  //     (obj) => new Date(obj.bookingDate).getMonth() === today.getMonth()
  //   );

  // todayData.forEach((obj) => {
  //   if (obj.moreBookings.length === 0) {
  //     if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
  //       maturedCount += 0.5;
  //     } else {
  //       maturedCount += 1;
  //     }
  //   } else {
  //     if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
  //       maturedCount += 0.5;
  //     } else {
  //       maturedCount += 1;
  //     }

  //     obj.moreBookings.forEach((booking) => {
  //       if (
  //         booking.bdeName !== booking.bdmName &&
  //         booking.bdmType === "Close-by"
  //       ) {
  //         maturedCount += 0.5;
  //       } else {
  //         maturedCount += 1;
  //       }
  //     });
  //   }
  // });
  totalMaturedCount = totalMaturedCount + maturedCount;
  return maturedCount;
};
const functionCalculateTotalRevenue = (istrue) => {
  let achievedAmount = 0;
  const today = new Date();
  // Set hours, minutes, and seconds to zero
  const todayData = istrue ? redesignedData.filter(obj => new Date(obj.bookingDate).toLocaleDateString() === today.toLocaleDateString()) : redesignedData.filter(
    (obj) => new Date(obj.bookingDate).getMonth() === today.getMonth()
  );

  todayData.forEach((obj) => {
    if (obj.moreBookings.length === 0) {
      if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
        achievedAmount += Math.round(obj.generatedTotalAmount / 2);
      } else {
        achievedAmount += Math.round(obj.generatedTotalAmount);
      }
    } else {
      if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
        achievedAmount += Math.round(obj.generatedTotalAmount / 2);
      } else {
        achievedAmount += Math.round(obj.generatedTotalAmount);
      }
      obj.moreBookings.forEach((booking) => {
        if (
          booking.bdeName !== booking.bdmName &&
          booking.bdmType === "Close-by"
        ) {
          achievedAmount += Math.round(obj.generatedTotalAmount / 2);
        } else {
          achievedAmount += Math.round(obj.generatedTotalAmount);
        }
      });
    }
  });
  return achievedAmount

};
const functionCalculateAchievedRevenue = (istrue) => {
  let achievedAmount = 0;
  let remainingAmount = 0;
  let expanse = 0;
  const today = new Date();

  redesignedData.map((mainBooking)=>{
    if(istrue){
      if(new Date(mainBooking.bookingDate).toLocaleDateString() === today.toLocaleDateString()){
       
        if(mainBooking.bdeName === mainBooking.bdmName){
          achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
          mainBooking.services.map(serv=>{
            // console.log(serv.expanse , bdeName ,"this is services");
            expanse = serv.expanse ?  expanse + serv.expanse : expanse;
          });
        }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
          achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount)/2;
          mainBooking.services.map(serv=>{
            expanse = serv.expanse ?  expanse + serv.expanse/2 : expanse;
          })
        }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
          if(mainBooking.bdeName === data.ename){
            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
            mainBooking.services.map(serv=>{
              expanse = serv.expanse ?  expanse + serv.expanse : expanse;
            })
          }
        }
      }
      mainBooking.moreBookings.map((moreObject)=>{
        if(new Date(moreObject.bookingDate).toLocaleDateString() === today.toLocaleDateString()){
       
            if(moreObject.bdeName === moreObject.bdmName){
              achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
              moreObject.services.map(serv=>{
                expanse = serv.expanse ?  expanse + serv.expanse : expanse;
              })
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
              achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount)/2;
              moreObject.services.map(serv=>{
                expanse = serv.expanse ?  expanse + serv.expanse/2 : expanse;
              })
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
              if(moreObject.bdeName === data.ename){
                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                moreObject.services.map(serv=>{
                  expanse = serv.expanse ?  expanse + serv.expanse : expanse;
                })
              }
            }
       
        }
      })

    }else{
      if(new Date(mainBooking.bookingDate).getMonth() === today.getMonth()){
       
        if(mainBooking.bdeName === mainBooking.bdmName){
          achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
          mainBooking.services.map(serv=>{
            expanse = serv.expanse ?  expanse + serv.expanse : expanse;
          })
        }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
          achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount)/2;
          mainBooking.services.map(serv=>{
            expanse = serv.expanse ?  expanse + serv.expanse/2 : expanse;
          })
        }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
          if(mainBooking.bdeName === data.ename){
            achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
            mainBooking.services.map(serv=>{
              expanse = serv.expanse ?  expanse + serv.expanse : expanse;
            })
          }
        }
      }else if(mainBooking.remainingPayments.length !== 0){
        mainBooking.remainingPayments.map((remainingObj)=>{
          if(new Date(remainingObj.paymentDate).getMonth() === today.getMonth()){
            const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
            if(mainBooking.bdeName === mainBooking.bdmName){
                remainingAmount += Math.round(tempAmount);
            }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
              remainingAmount += Math.round(tempAmount)/2;
            }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
              if(mainBooking.bdeName === data.ename){
                remainingAmount += Math.round(tempAmount);
              }
            }         
          }
        })
      }
        mainBooking.moreBookings.map((moreObject)=>{
          if(new Date(moreObject.bookingDate).getMonth() === today.getMonth()){
         
            if(moreObject.bdeName === moreObject.bdmName){
              achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
              moreObject.services.map(serv=>{
                expanse = serv.expanse ?  expanse + serv.expanse : expanse;
              })
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
              achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount)/2;
              moreObject.services.map(serv=>{
                expanse = serv.expanse ?  expanse + serv.expanse/2 : expanse;
              })
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
              if(moreObject.bdeName === data.ename){
                achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
                moreObject.services.map(serv=>{
                  expanse = serv.expanse ?  expanse + serv.expanse : expanse;
                })
              }
            }
         
          }else if(moreObject.remainingPayments.length!==0){
         
            moreObject.remainingPayments.map((remainingObj)=>{
              if(new Date(remainingObj.paymentDate).getMonth() === today.getMonth()){
                
                const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
                const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
                if(moreObject.bdeName === moreObject.bdmName){
                    remainingAmount += Math.round(tempAmount);
                }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
                  remainingAmount += Math.round(tempAmount)/2;
                }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
                  if(moreObject.bdeName === data.ename){
                    remainingAmount += Math.round(tempAmount);
                  }
                }         
              }
            })
          }
        })
    }
   
 
    
    
  })
  // const today = new Date();
  // // Set hours, minutes, and seconds to zero
  // const todayData = istrue ? redesignedData.filter(obj => new Date(obj.bookingDate).toLocaleDateString() === today.toLocaleDateString()) : redesignedData.filter(
  //   (obj) => new Date(obj.bookingDate).getMonth() === today.getMonth()
  // );

  // todayData.forEach((obj) => {
  //   if (obj.moreBookings.length === 0) {
  //     if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
  //       achievedAmount += Math.round(obj.generatedReceivedAmount / 2);
  //     } else {
  //       achievedAmount += Math.round(obj.generatedReceivedAmount);
  //     }
  //   } else {
  //     if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
  //       achievedAmount += Math.round(obj.generatedReceivedAmount / 2);
  //     } else {
  //       achievedAmount += Math.round(obj.generatedReceivedAmount);
  //     }
  //     obj.moreBookings.forEach((booking) => {
  //       if (
  //         booking.bdeName !== booking.bdmName &&
  //         booking.bdmType === "Close-by"
  //       ) {
  //         achievedAmount += Math.round(obj.generatedReceivedAmount / 2);
  //       } else {
  //         achievedAmount += Math.round(obj.generatedReceivedAmount);
  //       }
  //     });
  //   }
  // });
  return achievedAmount + Math.round(remainingAmount) - expanse;
};

const functionCalculateYesterdayRevenue = () => {
  let achievedAmount = 0;
  let remainingAmount = 0;
  const boom = new Date();
  const today = new Date(boom);
  today.setDate(boom.getDate() - 1);


  // Set hours, minutes, and seconds to zero
  redesignedData.map((mainBooking)=>{
    if(new Date(mainBooking.bookingDate).toLocaleDateString() === today.toLocaleDateString()){
       
      if(mainBooking.bdeName === mainBooking.bdmName){
        achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
      }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
        achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount)/2;
      }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
        if(mainBooking.bdeName === data.ename){
          achievedAmount = achievedAmount + Math.round(mainBooking.generatedReceivedAmount);
        }
      }
    }else if(mainBooking.remainingPayments.length !== 0){
      mainBooking.remainingPayments.map((remainingObj)=>{
        if(new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString()){
          const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
          const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
          if(mainBooking.bdeName === mainBooking.bdmName){
              remainingAmount += Math.round(tempAmount);
          }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
            remainingAmount += Math.round(tempAmount)/2;
          }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
            if(mainBooking.bdeName === data.ename){
              remainingAmount += Math.round(tempAmount);
            }
          }         
        }
      })
    }
    mainBooking.moreBookings.map((moreObject)=>{
      if(new Date(moreObject.bookingDate).toLocaleDateString() === today.toLocaleDateString()){
     
          if(moreObject.bdeName === moreObject.bdmName){
            achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
          }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
            achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount)/2;
          }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
            if(moreObject.bdeName === data.ename){
              achievedAmount = achievedAmount + Math.round(moreObject.generatedReceivedAmount);
            }
          }
     
      }else if(moreObject.remainingPayments.length!==0){
       
        moreObject.remainingPayments.map((remainingObj)=>{
          if(new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString()){
            
            const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
            if(moreObject.bdeName === moreObject.bdmName){
                remainingAmount += Math.round(tempAmount);
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
              remainingAmount += Math.round(tempAmount)/2;
            }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
              if(moreObject.bdeName === data.ename){
                remainingAmount += Math.round(tempAmount);
              }
            }         
          }
        })
      }
    })
  })
  
  // const todayData = redesignedData.filter(obj => new Date(obj.bookingDate).toLocaleDateString() === today.toLocaleDateString());

  // todayData.forEach((obj) => {
  //   if (obj.moreBookings.length === 0) {
  //     if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
  //       achievedAmount += Math.round(obj.receivedAmount / 2);
  //     } else {
  //       achievedAmount += Math.round(obj.receivedAmount);
  //     }
  //   } else {
  //     if (obj.bdeName !== obj.bdmName && obj.bdmType === "Close-by") {
  //       achievedAmount += Math.round(obj.receivedAmount / 2);
  //     } else {
  //       achievedAmount += Math.round(obj.receivedAmount);
  //     }
  //     obj.moreBookings.forEach((booking) => {
  //       if (
  //         booking.bdeName !== booking.bdmName &&
  //         booking.bdmType === "Close-by"
  //       ) {
  //         achievedAmount += Math.round(obj.receivedAmount / 2);
  //       } else {
  //         achievedAmount += Math.round(obj.receivedAmount);
  //       }
  //     });
  //   }
  // });
  return achievedAmount + Math.round(remainingAmount)
};
const functionCalculatePendingRevenue = () => {
  
  let remainingAmount = 0;
  const today = new Date();

  redesignedData.map((mainBooking)=>{
    
      if(mainBooking.remainingPayments.length !== 0){
        mainBooking.remainingPayments.map((remainingObj)=>{
          if(new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString()){
            const findService = mainBooking.services.find((services) => services.serviceName === remainingObj.serviceName)
            const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
            if(mainBooking.bdeName === mainBooking.bdmName){
                remainingAmount += Math.round(tempAmount);
            }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Close-by"){
              remainingAmount += Math.round(tempAmount)/2;
            }else if(mainBooking.bdeName !== mainBooking.bdmName && mainBooking.bdmType === "Supported-by"){
              if(mainBooking.bdeName === data.ename){
                remainingAmount += Math.round(tempAmount);
              }
            }         
          }
        })
      }
      mainBooking.moreBookings.map((moreObject)=>{
         if(moreObject.remainingPayments.length!==0){
         
          moreObject.remainingPayments.map((remainingObj)=>{
            if(new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString()){
              
              const findService = moreObject.services.find((services) => services.serviceName === remainingObj.serviceName)
              const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
              if(moreObject.bdeName === moreObject.bdmName){
                  remainingAmount += Math.round(tempAmount);
              }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Close-by"){
                remainingAmount += Math.round(tempAmount)/2;
              }else if(moreObject.bdeName !== moreObject.bdmName && moreObject.bdmType === "Supported-by"){
                if(moreObject.bdeName === data.ename){
                  remainingAmount += Math.round(tempAmount);
                }
              }         
            }
          })
        }
      })

    
   
 
    
    
  })
  return remainingAmount

};

// console.log(followData
//   .filter(obj => obj.bdeName === data.ename)
//   .reduce((total, obj) => total + obj.totalPayment, 0))

// console.log(followDataToday
//   .filter(obj => obj.bdeName === data.ename)
//   .reduce((total, obj) => total + obj.totalPayment, 0))

// console.log("followData", followData.filter(obj => obj.bdeName === data.ename))

// console.log("followDataToday", followDataToday.filter(obj => obj.bdeName === data.ename))



const currentYear = new Date().getFullYear();
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
const currentMonth = monthNames[new Date().getMonth()];

function functionCalculateGeneratedRevenue(isBdm) {

  let generatedRevenue = 0;
  const requiredObj = moreEmpData.filter((obj) => formatDateNow(obj.bdmStatusChangeDate) === new Date().toISOString().slice(0, 10) && (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
  requiredObj.forEach((object) => {
    const newObject = isBdm ? redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdmName === data.ename) : redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === data.ename);
    if (newObject) {
      generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
    }

  });

  return generatedRevenue;
  //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
  //  console.log("This is generated Revenue",requiredObj);

}


function functionCalculateGeneratedTotalRevenue(isBdm) {
  let generatedRevenue = 0;
  const requiredObj = moreEmpData.filter((obj) => (obj.bdmAcceptStatus === "Accept") && obj.Status === "Matured");
  requiredObj.forEach((object) => {
    const newObject = isBdm ? redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdmName === data.ename) : redesignedData.find(value => value["Company Name"] === object["Company Name"] && value.bdeName === data.ename);
    if (newObject) {
      generatedRevenue = generatedRevenue + newObject.generatedReceivedAmount;
    }

  });

  return generatedRevenue;
  //  const generatedRevenue =  redesignedData.reduce((total, obj) => total + obj.receivedAmount, 0);
  //  console.log("This is generated Revenue",requiredObj);

}

function functionGetLastBookingDate() {
  // Filter objects based on bdeName
  let tempBookingDate = null;
  // Filter objects based on bdeName
  redesignedData.map((mainBooking)=>{
   
    if(monthNames[new Date(mainBooking.bookingDate).getMonth()] === currentMonth){

        const bookingDate = new Date(mainBooking.bookingDate);
       tempBookingDate =  bookingDate > tempBookingDate ? bookingDate : tempBookingDate;
      
    }
      mainBooking.moreBookings.map((moreObject)=>{
        if(monthNames[new Date(moreObject.bookingDate).getMonth()] === currentMonth){
         
            const bookingDate = new Date(moreObject.bookingDate);
            tempBookingDate =  bookingDate > tempBookingDate ? bookingDate : tempBookingDate;
          
        }
      })
    
    
  })
  return tempBookingDate ? formatDateFinal(tempBookingDate) : "No Booking";



  // Initialize variable to store the latest booking date
  // let lastBookingDate = null;
  // const finalData = redesignedData.filter((obj) => (monthNames[new Date(obj.bookingDate).getMonth()] === currentMonth))

  // // Iterate through filtered data
  // finalData.forEach((obj) => {
  //   if (obj.moreBookings && obj.moreBookings.length > 0) {
  //     // If moreBookings exist, find the latest bookingDate
  //     const latestBookingDate = obj.moreBookings.reduce(
  //       (latestDate, booking) => {
  //         const bookingDate = new Date(booking.bookingDate);
  //         return bookingDate > latestDate ? bookingDate : latestDate;
  //       },
  //       new Date(0)
  //     ); // Initialize with minimum date

  //     // Update lastBookingDate if latestBookingDate is later
  //     if (latestBookingDate > lastBookingDate || !lastBookingDate) {
  //       lastBookingDate = latestBookingDate;
  //     }
  //   } else {
  //     // If no moreBookings, directly consider bookingDate
  //     const bookingDate = new Date(obj.bookingDate);
  //     if (bookingDate > lastBookingDate || !lastBookingDate) {
  //       lastBookingDate = bookingDate;
  //     }
  //   }
  // });

  // // Return the formatted date string or an empty string if lastBookingDate is null
  // return lastBookingDate ? formatDateFinal(lastBookingDate) : "N/A";
}
const functionCalculateProjections = ()=>{
 const tempData = followData.filter((company) => {
    // Assuming you want to filter companies with an estimated payment date for today
    const today = new Date().toISOString().split("T")[0]; // Get today's date in the format 'YYYY-MM-DD'
    return company.estPaymentDate === today;
  });
  const initialValue = {
    totalSum : 0
  }
  const value = tempData.reduce((total, obj) => total + obj.totalPayment, 0);

return value;
}

const functionGetAmount = () => {
  if (data.length === 0) {
    return 0; // Return 0 if data is falsy
  }

  const object = data;
  const targetDetails = object.targetDetails;

  if (targetDetails.length === 0) {
    return 0; // Return 0 if targetDetails array is empty
  }

  const foundObject = targetDetails.find(
    (item) => Math.round(item.year) === currentYear && item.month === currentMonth
  );

  if (!foundObject) {
    return 0; // Return 0 if no matching object is found
  }

  const amount = Math.round(foundObject.amount);
  totalTargetAmount += amount; // Increment totalTargetAmount by amount


  return amount;
};

  return (
    <div>
         <div className="dash-card">
                      <div className="row">
                        {/* sales report data*/}
                        <div className="col-sm-5">
                          <div className="dash-sales-report-data">
                            <div className="dash-srd-head-name">
                              <div className="d-flex align-items-top justify-content-between">
                                <div>
                                  <h2 className="m-0">Sales Report</h2>
                                  <div className="dash-select-filter">
                                    <select class="form-select form-select-sm my-filter-select" aria-label=".form-select-sm example">
                                      <option value="1" selected>Today</option>
                                      <option value="2">This Month</option>
                                      <option value="3">Last Month</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="dash-select-filte-show-hide">
                                  <div class="form-check form-switch d-flex align-items-center justify-content-center mt-1 mb-0">
                                    <label class="form-check-label" for="flexSwitchCheckDefault">Show Numbers</label>
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dash-srd-body-data">
                              <div className="row">
                                <div className="col-sm-7 p-0">
                                  <div className="dsrd-body-data-num">
                                      <label className="m-0 dash-Revenue-label">Revenue</label>
                                      <h2 className="m-0 dash-Revenue-amnt">₹ {parseInt(functionCalculateAchievedRevenue()).toLocaleString()} /-</h2>
                                      <div className="d-flex aling-items-center mt-1">
                                        <div className="dsrd-Revenue-up-ration d-flex aling-items-center">
                                          <GoArrowUp /> 
                                          <div>20%</div>
                                        </div>
                                        <div className="dsrd-Revenue-lastmonthfixamnt">
                                          vs Last Month: ₹ 3,00,000
                                        </div>
                                      </div>
                                      <div className="dsrd-TARGET-INCENTIVE">
                                        TARGET - <b>₹ {functionGetAmount().toLocaleString()}</b> | INCENTIVE - <b>₹ {functionGetAmount() < functionCalculateAchievedRevenue() ? parseInt((functionCalculateAchievedRevenue() - functionGetAmount())/10).toLocaleString() : 0}</b>
                                      </div>
                                  </div>
                                </div>
                                <div className="col-sm-5 p-0">
                                  <div>
                                    <GaugeComponent
                                    width="226.7375030517578"
                                    height="178.5768051147461"
                                        marginInPercent={{top: 0.03, bottom: 0.05, left: 0.07, right: 0.07 }}
                                        value={(functionCalculateAchievedRevenue() / functionGetAmount() * 100).toFixed(2) > 100 ? 100 : (functionCalculateAchievedRevenue() / functionGetAmount() * 100).toFixed(2) }
                                        type="radial"
                                        labels={{
                                          tickLabels: {
                                            type: "inner",
                                            ticks: [
                                              { value: 20 },
                                              { value: 40 },
                                              { value: 60 },
                                              { value: 80 },
                                              { value: 100 }
                                            ]
                                          }
                                        }}
                                        arc={{
                                          colorArray: ['#EA4228','#5BE12C'],
                                          subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
                                          padding: 0.02,
                                          width: 0.1
                                        }}
                                        pointer={{
                                          elastic: true,
                                          animationDelay: 0,
                                          length:0.60,
                                        }}
                                        className="my-speed"
                                      />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dash-srd-body-footer">
                              <div className="row"> 
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-1cba19">
                                    <div className="dsrd-mini-card-num">
                                    {functionCalculateMatured()}
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                        Mature Leads
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-00d19d">
                                    <div className="dsrd-mini-card-num">
                                    ₹ {functionCalculateAchievedRevenue().toLocaleString()}
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Advance collected
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-e65b5b">
                                    <div className="dsrd-mini-card-num">
                                    ₹ {functionCalculatePendingRevenue().toLocaleString()}
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Remaining Collected
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-a0b1ad">
                                    <div className="dsrd-mini-card-num">
                                    ₹ {functionCalculateYesterdayRevenue().toLocaleString()}
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Yesterday Collected
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-ffb900">
                                    <div className="dsrd-mini-card-num">
                                      ₹ {functionCalculateProjections()}
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Projected Amount
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-4299e1">
                                    <div className="dsrd-mini-card-num">
                                        07/05/2012
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Last Booking Date
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* sales report chart*/}
                        <div className="col-sm-7">
                          <div className="dash-sales-report-chart">
                            <div className="d-flex justify-content-end">
                              <div className="dash-select-filter mt-2">
                                <select class="form-select form-select-sm my-filter-select" aria-label=".form-select-sm example">
                                  <option value="1" selected>This week</option>
                                  <option value="2">This Month</option>
                                  <option value="3">Last Month</option>
                                </select>
                              </div>
                            </div>
                            <Box>
                              <LineChart
                                height={320}
                                margin={{ left: 60}}
                                series={[
                                  { data: AchivedData, label: 'Achived', color:'#1cba19', stroke: 2 },
                                  { data: ProjectionData, label: 'Projection', color:'#ffb900', stroke: 3 },
                                ]}
                                xAxis={[{ scaleType: 'point', data: xLabels , label:'Days', 
                                    axisLine: {
                                      stroke: '#eee', // Color for the x-axis line
                                      fill: '#ccc'
                                    },
                                    tick: {
                                      stroke: '#eee', // Color for the x-axis ticks
                                      fontSize: '10px',
                                      fill: '#eee', // Color for the x-axis labels
                                    },
                                }]}
                                yAxis={[{ data: yLabels, 
                                  axisLine: {
                                    stroke: '#eee !important', // Color for the y-axis line
                                  },
                                  tick: {
                                    stroke: '#eee', // Color for the y-axis ticks
                                    fontSize: '10px',
                                    fill: '#eee', // Color for the y-axis labels
                                  },
                                  }]}
                                grid={{ vertical: false, horizontal: true, color:'#eee'  }}
                              />
                            </Box>
                          </div>
                        </div>
                      </div>
                    </div>
    </div>
  )
}

export default EmployeeSalesReport