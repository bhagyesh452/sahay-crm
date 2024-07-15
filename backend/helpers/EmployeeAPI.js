var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const adminModel = require("../models/Admin.js");
const PerformanceReportModel = require("../models/MonthlyPerformanceReportModel.js");
const TodaysCollectionModel = require("../models/TodaysGeneralProjection.js");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const EmployeeHistory = require("../models/EmployeeHistory");
const json2csv = require("json2csv").parse;
const deletedEmployeeModel = require("../models/DeletedEmployee.js");
const RedesignedLeadformModel = require("../models/RedesignedLeadform");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine the destination path based on the fieldname and company name
    const employeeName = req.params.employeeName;
    let destinationPath = "";

    if (file.fieldname === "file" && employeeName) {
      destinationPath = `EmployeeImages/${employeeName}`;
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.put("/online-status/:id/:socketID", async (req, res) => {
  const { id } = req.params;
  const { socketID } = req.params;
  console.log("kuhi", socketID);
  try {
    const admin = await adminModel.findByIdAndUpdate(
      id,
      { Active: socketID },
      { new: true }
    );
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/employee-history", async (req, res) => {
  const csvData = req.body;

  try {
    for (const employeeData of csvData) {
      try {
        const employee = new EmployeeHistory(employeeData);
        const savedEmployee = await employee.save();
      } catch (error) {
        console.error("Error saving employee:", error.message);
        // res.status(500).json({ error: 'Internal Server Error' });

        // Handle the error for this specific entry, but continue with the next one
      }
    }

    res.status(200).json({ message: "Data sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    console.error("Error in bulk save:", error.message);
  }
});

router.post("/post-bdmwork-request/:eid", async (req, res) => {
  const eid = req.params.eid;
  const { bdmWork } = req.body;

  //console.log("bdmwork" , bdmWork)// Extract bdmWork from req.body
  try {
    await adminModel.findByIdAndUpdate(eid, { bdmWork: bdmWork });
    // Assuming you're returning updatedCompany and remarksHistory after update
    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating BDM work:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/post-bdmwork-revoke/:eid", async (req, res) => {
  const eid = req.params.eid;
  const { bdmWork } = req.body;

  try {
    await adminModel.findByIdAndUpdate(eid, { bdmWork: bdmWork });

    res.status(200).json({ message: "Status Updated Successfully" });
  } catch (error) {
    console.error("error updating bdm work", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/einfo", async (req, res) => {
  try {
    adminModel.create(req.body).then((result) => {
      // Change res to result
      res.json(result); // Change res.json(res) to res.json(result)
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/savedeletedemployee", async (req, res) => {
  const { dataToDelete } = req.body;

  if (!dataToDelete || dataToDelete.length === 0) {
    return res.status(400).json({ error: "No employee data to save" });
  }
  try {
    const newLeads = await Promise.all(
      dataToDelete.map(async (data) => {
        // Retain the original _id
        const newData = {
          ...data,
          _id: data._id,
          deletedDate: new Date().toISOString(),
        };

        // Create a new document in the deletedEmployeeModel with the same _id
        return await deletedEmployeeModel.create(newData);
      })
    );

    res.status(200).json(newLeads);
  } catch (error) {
    console.error("Error saving deleted employee", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/deletedemployeeinfo", async (req, res) => {
  try {
    const data = await deletedEmployeeModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete(
  "/deleteemployeedromdeletedemployeedetails/:id",
  async (req, res) => {
    const { id: itemId } = req.params; // Correct destructuring
    console.log(itemId);
    try {
      const data = await deletedEmployeeModel.findByIdAndDelete(itemId);

      if (!data) {
        return res.status(404).json({ error: "Data not found" });
      } else {
        return res
          .status(200)
          .json({ message: "Data deleted successfully", data });
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

router.put("/revertbackdeletedemployeeintomaindatabase", async (req, res) => {
  const { dataToRevertBack } = req.body;

  if (!dataToRevertBack || dataToRevertBack.length === 0) {
    return res.status(400).json({ error: "No employee data to save" });
  }

  try {
    const newLeads = await Promise.all(
      dataToRevertBack.map(async (data) => {
        const newData = {
          ...data,
          _id: data._id,
        };
        return await adminModel.create(newData);
      })
    );

    res.status(200).json(newLeads);
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      console.error("Duplicate key error:", error.message);
      return res.status(409).json({
        error: "Duplicate key error. Document with this ID already exists.",
      });
    }
    console.error("Error reverting back employee:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// router.get('/achieved-details/:ename', async (req, res) => {
//   const { ename } = req.params;

//   try {
//     const employeeData = await adminModel.findOne({ ename });
//     if (!employeeData) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const redesignedData = await RedesignedLeadformModel.find();
//     if (!redesignedData) {
//       return res.status(404).json({ error: 'No redesigned data found' });
//     }

//     const calculateAchievedRevenue = (data, ename, filterBy = 'This Month') => {
//       let achievedAmount = 0;
//       let expanse = 0;
//       let caCommision = 0;
//       const today = new Date();

//       const isDateInRange = (date, filterBy) => {
//         const bookingDate = new Date(date);
//         switch (filterBy) {
//           case 'Today':
//             return bookingDate.toLocaleDateString() === today.toLocaleDateString();
//           case 'Last Month':
//             return bookingDate.getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1);
//           case 'This Month':
//             return bookingDate.getMonth() === today.getMonth();
//           default:
//             return false;
//         }
//       };

//       const processBooking = (booking, ename) => {
//         if ((booking.bdeName === ename || booking.bdmName === ename) && isDateInRange(booking.bookingDate, filterBy)) {
//           if (booking.bdeName === booking.bdmName) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommision += parseInt(booking.caCommission);
//           } else if (booking.bdmType === "Close-by") {
//             achievedAmount += Math.round(booking.generatedReceivedAmount) / 2;
//             expanse += booking.services.reduce((sum, serv) => sum + ((serv.expanse || 0) / 2), 0);
//             if (booking.caCase === "Yes") caCommision += parseInt(booking.caCommission) / 2;
//           } else if (booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommision += parseInt(booking.caCommission);
//           }
//         }
//       };

//       data.forEach(mainBooking => {
//         processBooking(mainBooking, ename);
//         mainBooking.moreBookings.forEach(moreObject => processBooking(moreObject, ename));
//       });

//       return achievedAmount - expanse - caCommision;
//     };

//     const currentYear = new Date().getFullYear();
//     const currentMonth = new Date().getMonth();

//     const achievedObject = employeeData.achievedObject.filter(obj => !(obj.year === currentYear && obj.month === currentMonth));

//     const newAchievedObject = {
//       year: currentYear,
//       month: currentMonth,
//       achievedAmount: calculateAchievedRevenue(redesignedData, ename)
//     };

//     achievedObject.push(newAchievedObject);

//     const updateResult = await adminModel.updateOne({ ename }, {
//       $set: { achievedObject }
//     });

//     res.json({ updateResult });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// router.get('/achieved-details/:ename', async (req, res) => {
//   const { ename } = req.params;

//   try {
//     const employeeData = await adminModel.findOne({ ename });
//     if (!employeeData) {
//       return res.status(404).json({ error: 'Admin not found' });
//     }

//     const redesignedData = await RedesignedLeadformModel.find();
//     if (!redesignedData) {
//       return res.status(404).json({ error: 'No redesigned data found' });
//     }

//     const calculateAchievedRevenue = (data, ename, filterBy = 'Last Month') => {
//       let achievedAmount = 0;
//       let expanse = 0;
//       let caCommission = 0;
//       let remainingAmount = 0;
//       let remainingExpense = 0;
//       const today = new Date();

//       const isDateInRange = (date, filterBy) => {
//         const bookingDate = new Date(date);
//         switch (filterBy) {
//           case 'Today':
//             return bookingDate.toLocaleDateString() === today.toLocaleDateString();
//           case 'Last Month':
//             const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//             return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === today.getFullYear();
//           case 'This Month':
//             return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
//           default:
//             return false;
//         }
//       };

//       const processBooking = (booking, ename) => {
//         if ((booking.bdeName === ename || booking.bdmName === ename) && isDateInRange(booking.bookingDate, filterBy)) {
//           if (booking.bdeName === booking.bdmName) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//           } else if (booking.bdmType === "Close-by") {
//             achievedAmount += Math.round(booking.generatedReceivedAmount) / 2;
//             expanse += booking.services.reduce((sum, serv) => sum + ((serv.expanse || 0) / 2), 0);
//             if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission) / 2;
//           } else if (booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//             achievedAmount += Math.round(booking.generatedReceivedAmount);
//             expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
//             if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
//           }
//         }

//         if (booking.remainingPayments.length !== 0 && (booking.bdeName === ename || booking.bdmName === ename)) {
//           let remainingExpanseCondition = false;
//           switch (filterBy) {
//             case 'Today':
//               remainingExpanseCondition = booking.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString());
//               break;
//             case 'Last Month':
//               remainingExpanseCondition = booking.remainingPayments.some(item => {
//                 const paymentDate = new Date(item.paymentDate);
//                 const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
//                 return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === today.getFullYear();
//               });
//               break;
//             case 'This Month':
//               remainingExpanseCondition = booking.remainingPayments.some(item => {
//                 const paymentDate = new Date(item.paymentDate);
//                 return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
//               });
//               break;
//             default:
//               break;
//           }

//           if (remainingExpanseCondition && filterBy === "Last Month") {
//             const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
//             const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//             booking.services.forEach(serv => {
//               if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
//                 if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//                   remainingExpense += serv.expanse / 2;
//                 } else if (booking.bdeName === booking.bdmName) {
//                   remainingExpense += serv.expanse;
//                 } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//                   remainingExpense += serv.expanse;
//                 }
//               }
//             });
//           }

//           booking.remainingPayments.forEach(remainingObj => {
//             let condition = false;
//             switch (filterBy) {
//               case 'Today':
//                 condition = new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString();
//                 break;
//               case 'Last Month':
//                 condition = new Date(remainingObj.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1);
//                 break;
//               case 'This Month':
//                 condition = new Date(remainingObj.paymentDate).getMonth() === today.getMonth();
//                 break;
//               default:
//                 break;
//             }

//             if (condition) {
//               const findService = booking.services.find(service => service.serviceName === remainingObj.serviceName);
//               const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
//               if (booking.bdeName === booking.bdmName) {
//                 remainingAmount += Math.round(tempAmount);
//               } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
//                 remainingAmount += Math.round(tempAmount) / 2;
//               } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
//                 remainingAmount += Math.round(tempAmount);
//               }
//             }
//           });
//         }
//       };

//       data.forEach(mainBooking => {
//         processBooking(mainBooking, ename);
//         mainBooking.moreBookings.forEach(moreObject => processBooking(moreObject, ename));
//       });

//       return achievedAmount + remainingAmount - expanse - remainingExpense - caCommission;
//     };

//     const currentYear = new Date().getFullYear();
//     const currentMonth = new Date().getMonth() + 1;  // Month is zero-indexed

//     const achievedAmount = calculateAchievedRevenue(redesignedData, ename);

//     const updateResult = await adminModel.updateOne(
//       {
//         ename,
//         'targetDetails.year': currentYear,
//         'targetDetails.month': currentMonth
//       },
//       {
//         $set: {
//           'targetDetails.$[elem].achievedAmount': achievedAmount
//         }
//       },
//       {
//         arrayFilters: [{ 'elem.year': currentYear, 'elem.month': currentMonth }]
//       }
//     );
//     console.log("achievedamont" , achievedAmount)
//     console.log(updateResult)

//     res.json({ updateResult });
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// });


// Function to calculate achieved revenue


const calculateAchievedRevenue = (data, ename, filterBy = 'Last Month') => {
  let achievedAmount = 0;
  let expanse = 0;
  let caCommission = 0;
  let remainingAmount = 0;
  let remainingExpense = 0;
  const today = new Date();

  const isDateInRange = (date, filterBy) => {
    const bookingDate = new Date(date);
    switch (filterBy) {
      case 'Today':
        return bookingDate.toLocaleDateString() === today.toLocaleDateString();
      case 'Last Month':
        const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
        return bookingDate.getMonth() === lastMonth && bookingDate.getFullYear() === today.getFullYear();
      case 'This Month':
        return bookingDate.getMonth() === today.getMonth() && bookingDate.getFullYear() === today.getFullYear();
      default:
        return false;
    }
  };

  const processBooking = (booking, ename) => {
    if ((booking.bdeName === ename || booking.bdmName === ename) && isDateInRange(booking.bookingDate, filterBy)) {
      if (booking.bdeName === booking.bdmName) {
        achievedAmount += Math.round(booking.generatedReceivedAmount);
        expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
        if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
      } else if (booking.bdmType === "Close-by") {
        achievedAmount += Math.round(booking.generatedReceivedAmount) / 2;
        expanse += booking.services.reduce((sum, serv) => sum + ((serv.expanse || 0) / 2), 0);
        if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission) / 2;
      } else if (booking.bdmType === "Supported-by" && booking.bdeName === ename) {
        achievedAmount += Math.round(booking.generatedReceivedAmount);
        expanse += booking.services.reduce((sum, serv) => sum + (serv.expanse || 0), 0);
        if (booking.caCase === "Yes") caCommission += parseInt(booking.caCommission);
      }
    }else if (booking.remainingPayments.length !== 0 && (booking.bdeName === ename || booking.bdmName === ename)) {
      let remainingExpanseCondition = false;
      switch (filterBy) {
        case 'Today':
          remainingExpanseCondition = booking.remainingPayments.some(item => new Date(item.paymentDate).toLocaleDateString() === today.toLocaleDateString());
          break;
        case 'Last Month':
          remainingExpanseCondition = booking.remainingPayments.some(item => {
            const paymentDate = new Date(item.paymentDate);
            const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
            return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === today.getFullYear();
          });
          break;
        case 'This Month':
          remainingExpanseCondition = booking.remainingPayments.some(item => {
            const paymentDate = new Date(item.paymentDate);
            return paymentDate.getMonth() === today.getMonth() && paymentDate.getFullYear() === today.getFullYear();
          });
          break;
        default:
          break;
      }

      if (remainingExpanseCondition && filterBy === "Last Month") {
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        booking.services.forEach(serv => {
          if (serv.expanseDate && new Date(serv.expanseDate) >= startDate && new Date(serv.expanseDate) <= endDate) {
            if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
              remainingExpense += serv.expanse / 2;
            } else if (booking.bdeName === booking.bdmName) {
              remainingExpense += serv.expanse;
            } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
              remainingExpense += serv.expanse;
            }
          }
        });
      }

      booking.remainingPayments.forEach(remainingObj => {
        let condition = false;
        switch (filterBy) {
          case 'Today':
            condition = new Date(remainingObj.paymentDate).toLocaleDateString() === today.toLocaleDateString();
            break;
          case 'Last Month':
            condition = new Date(remainingObj.paymentDate).getMonth() === (today.getMonth() === 0 ? 11 : today.getMonth() - 1);
            break;
          case 'This Month':
            condition = new Date(remainingObj.paymentDate).getMonth() === today.getMonth();
            break;
          default:
            break;
        }

        if (condition) {
          const findService = booking.services.find(service => service.serviceName === remainingObj.serviceName);
          const tempAmount = findService.withGST ? Math.round(remainingObj.receivedPayment) / 1.18 : Math.round(remainingObj.receivedPayment);
          if (booking.bdeName === booking.bdmName) {
            remainingAmount += Math.round(tempAmount);
          } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Close-by") {
            remainingAmount += Math.round(tempAmount) / 2;
          } else if (booking.bdeName !== booking.bdmName && booking.bdmType === "Supported-by" && booking.bdeName === ename) {
            remainingAmount += Math.round(tempAmount);
          }
        }
      });
    }
  };

  data.forEach(mainBooking => {
    processBooking(mainBooking, ename);
    mainBooking.moreBookings.forEach(moreObject => processBooking(moreObject, ename));
  });

  console.log("function me achieved" ,achievedAmount + remainingAmount - expanse - remainingExpense - caCommission)

  return achievedAmount + remainingAmount - expanse - remainingExpense - caCommission;
};

router.get('/achieved-details/:ename', async (req, res) => {
  const { ename } = req.params;

  try {
    const employeeData = await adminModel.findOne({ ename });
    if (!employeeData) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    const redesignedData = await RedesignedLeadformModel.find();
    if (!redesignedData) {
      return res.status(404).json({ error: 'No redesigned data found' });
    }

    const achievedAmount = calculateAchievedRevenue(redesignedData, ename);

    console.log("achievedAmount" , achievedAmount)

    const today = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const lastMonth = monthNames[today.getMonth() === 0 ? 11 : today.getMonth() - 1];

    const targetDetailsUpdated = employeeData.targetDetails.map((targetDetail) => {
      if (targetDetail.month === lastMonth) {
        targetDetail.achievedAmount = achievedAmount;
        targetDetail.ratio = Math.round((parseFloat(achievedAmount) / parseFloat(targetDetail.amount)) * 100);
        const roundedRatio = Math.round(targetDetail.ratio);
        if (roundedRatio === 0) {
          targetDetail.result = "Poor";
        } else if (roundedRatio > 0 && roundedRatio <= 40) {
          targetDetail.result = "Poor";
        } else if (roundedRatio >= 41 && roundedRatio <= 60) {
          targetDetail.result = "Below Average";
        } else if (roundedRatio >= 61 && roundedRatio <= 74) {
          targetDetail.result = "Average";
        } else if (roundedRatio >= 75 && roundedRatio <= 99) {
          targetDetail.result = "Good";
        } else if (roundedRatio >= 100 && roundedRatio <= 149) {
          targetDetail.result = "Excellent";
        } else if (roundedRatio >= 150 && roundedRatio <= 199) {
          targetDetail.result = "Extraordinary";
        } else if (roundedRatio >= 200 && roundedRatio <= 249) {
          targetDetail.result = "Outstanding";
        } else if (roundedRatio >= 250) {
          targetDetail.result = "Exceptional";
        }
      }
      return targetDetail;
    });

    // Update the employee data
    const updateResult = await adminModel.findOneAndUpdate(
      { ename },
      { targetDetails: targetDetailsUpdated },
      { new: true }
    );

    res.json({ updateResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Read the Employee
router.get("/einfo", async (req, res) => {
  try {
    const data = await adminModel.find();
    res.json(data);
  } catch (error) {
    s
    console.error("Error fetching data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// 3. Update the Employee
// router.put("/einfo/:id", async (req, res) => {
//   const id = req.params.id;
//   const dataToSendUpdated = req.body;
//   console.log("updatedData", dataToSendUpdated)
//   try {
//     const updatedData = await adminModel.findByIdAndUpdate(id, dataToSendUpdated, {
//       new: true,
//     });

//     if (!updatedData) {
//       return res.status(404).json({ error: "Data not found" });
//     }

//     res.json({ message: "Data updated successfully", updatedData });
//   } catch (error) {
//     console.error("Error updating data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.put("/einfo/:id", async (req, res) => {
  const id = req.params.id;
  const dataToSendUpdated = req.body;

  // Calculate ratio and result for each target detail
  dataToSendUpdated.targetDetails.forEach(target => {
    const amount = parseFloat(target.amount);
    const achievedAmount = parseFloat(target.achievedAmount);
    target.ratio = (achievedAmount / amount) * 100;

    // Determine the result based on the ratio
    const roundedRatio = Math.round(target.ratio);
    if (roundedRatio === 0) {
      target.result = "Poor";
    } else if (roundedRatio > 0 && roundedRatio <= 40) {
      target.result = "Poor";
    } else if (roundedRatio >= 41 && roundedRatio <= 60) {
      target.result = "Below Average";
    } else if (roundedRatio >= 61 && roundedRatio <= 74) {
      target.result = "Average";
    } else if (roundedRatio >= 75 && roundedRatio <= 99) {
      target.result = "Good";
    } else if (roundedRatio >= 100 && roundedRatio <= 149) {
      target.result = "Excellent";
    } else if (roundedRatio >= 150 && roundedRatio <= 199) {
      target.result = "Extraordinary";
    } else if (roundedRatio >= 200 && roundedRatio <= 249) {
      target.result = "Outstanding";
    } else if (roundedRatio >= 250) {
      target.result = "Exceptional";
    }
  });

  try {
    const updatedData = await adminModel.findByIdAndUpdate(id, dataToSendUpdated, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data updated successfully", updatedData });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// 4. Delete an Employee
router.delete("/einfo/:id", async (req, res) => {
  const id = req.params.id;
  try {
    // Use findByIdAndDelete to delete the document by its ID
    const deletedData = await adminModel.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }

    res.json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/permanentDelete/:id", async (req, res) => {
  const itemId = req.params.id;
  console.log(itemId);
  try {
    const deletedData = await deletedEmployeeModel.findByIdAndDelete(itemId);

    if (!deletedData) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json({ message: "Data deleted successfully", deletedData });
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/einfo/:email/:password", async (req, res) => {
  const { email, password } = req.params;

  try {
    const data = await adminModel.findOne({ email: email, password: password });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Employee not found" });
    }
  } catch (error) {
    console.log("Error fetching employee data", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post(
  "/employeeimages/:employeeName",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No files were uploaded");
      }

      const employeeName = req.params.employeeName;

      // Find the employee by name
      const employee = await adminModel.findOne({ ename: employeeName });

      if (!employee) {
        return res.status(404).send("Employee Not Found");
      }

      // Construct the file details to store
      const fileDetails = {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };

      // Update the employee_profile array
      // employee.employee_profile(fileDetails);
      // await employee.save();

      employee.employee_profile = fileDetails;
      await employee.save();

      // Remove old employee images after uploading the new one
      removeOldEmployeeImages(employeeName, req.file.filename);

      // Handle other logic like saving to database or processing
      res.status(200).send({
        message: "File Uploaded Successfully",
        imageUrl: `/path/to/${req.file.filename}`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }

    // This function is remove the old employee profile image then store the latest employee profile image
    function removeOldEmployeeImages(employeeName, newFileName) {
      const directoryPath = path.join(
        __dirname,
        `../EmployeeImages/${employeeName}`
      );

      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error("Error reading directory:", err);
          return;
        }

        files.forEach((file) => {
          if (file !== newFileName) {
            const filePath = path.join(directoryPath, file);

            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file:", err);
              } else {
                console.log("Deleted old file:", file);
              }
            });
          }
        });
      });
    }
  }
);

router.get("/employeeImg/:employeeName/:filename", (req, res) => {
  const empName = req.params.employeeName;
  const fileName = req.params.filename;
  const pdfPath = path.join(
    __dirname,
    `../EmployeeImages/${empName}/${fileName}`
  );

  // Check if the file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(err);
      return res.status(404).json({ error: "File not found" });
    }

    // If the file exists, send it
    res.sendFile(pdfPath);
  });
});


// Edit Employee Details by HR-Portal

router.post(
  "/post-employee-detail-byhr/:userId",
  async (req, res) => {
    const { userId } = req.params;
    const { personal_email, personal_number, personal_contact_person, personal_address } = req.body;

    try {
      const updatedEmployee = await adminModel.findByIdAndUpdate(
        userId,
        {
          personal_email,
          personal_number,
          personal_contact_person,
          personal_address,
        },
        { new: true } // This option returns the updated document
      );

      if (!updatedEmployee) {
        return res.status(404).send("Employee not found");
      }

      res.json(updatedEmployee);
    } catch (error) {
      console.error("Error updating employee details:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);


// Adds record for today's collection:
router.post('/addTodaysProjection', async (req, res) => {
  try {
    const { empId, noOfCompany, noOfServiceOffered, totalOfferedPrice, totalCollectionExpected, date, time } = req.body;

    const employeeInfo = await adminModel.findOne({ _id: empId });

    if (!employeeInfo) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const TodaysCollection = await TodaysCollectionModel.create({
      empId: empId,
      empName: employeeInfo.ename,
      noOfCompany: parseInt(noOfCompany),
      noOfServiceOffered: parseInt(noOfServiceOffered),
      totalOfferedPrice: parseInt(totalOfferedPrice),
      totalCollectionExpected: parseInt(totalCollectionExpected),
      date: date || new Date(),
      time: time || new Date()
    });
    res.status(200).json({ result: true, message: "Today's collection successfully added", data: TodaysCollection });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error adding today's collection", error: error });
  }
});

// Displaying all the records for current date:
router.get('/showTodaysCollection', async (req, res) => {
  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // Months are zero-based
    const year = today.getFullYear();
    
    // Format the date as "d/m/yyyy"
    const formattedToday = `${day}/${month}/${year}`;

    const todaysCollections = await TodaysCollectionModel.find({
      date: formattedToday
    });

    res.status(200).json({ result: true, message: "Today's collection successfully fetched", data: todaysCollections });
  } catch (error) {
    res.status(500).json({ result: false, message: "Error displaying today's collection", error: error });
  }
});

module.exports = router;