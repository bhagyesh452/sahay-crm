import React, { useState, useEffect } from "react";
import Header from "../../Components/Header/Header.jsx";
import Navbar from '../../Components/Navbar/Navbar.jsx'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaWhatsapp } from "react-icons/fa";
import NoData from '../../Components/NoData/NoData.jsx';
import { Drawer, Icon, IconButton } from "@mui/material";
import { IconChevronLeft, IconEye } from "@tabler/icons-react";
import { IconChevronRight } from "@tabler/icons-react";
import { GrStatusGood } from "react-icons/gr";
import EditIcon from "@mui/icons-material/Edit";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import { useCallback } from "react";
import debounce from "lodash/debounce";
import DeleteIcon from "@mui/icons-material/Delete";
import { RiEditCircleFill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import { options } from "../../../components/Options.js";
import { IoAddCircle } from "react-icons/io5";
import Slider from '@mui/material/Slider';







function BdmTeamLeads() {
  const { userId } = useParams();
  const [data, setData] = useState([])
  const [dataStatus, setdataStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const frontendKey = process.env.REACT_APP_FRONTEND_KEY;
  const itemsPerPage = 500;
  const [currentData, setCurrentData] = useState([])
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const [teamleadsData, setTeamLeadsData] = useState([]);
  const [teamData, setTeamData] = useState([])
  const [openRemarks, setOpenRemarks] = useState(false)
  const [remarksHistory, setRemarksHistory] = useState([]);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const [cid, setcid] = useState("");
  const [cstat, setCstat] = useState("");
  const [currentCompanyName, setCurrentCompanyName] = useState("");
  const [currentRemarks, setCurrentRemarks] = useState("");
  const [currentRemarksBdm, setCurrentRemarksBdm] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [bdmNewStatus, setBdmNewStatus] = useState("Untouched");
  const [changeRemarks, setChangeRemarks] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [projectionData, setProjectionData] = useState([]);



  const fetchData = async () => {
    try {
      const response = await axios.get(`${secretKey}/einfo`);

      // Set the retrieved data in the state
      const tempData = response.data;
      const userData = tempData.find((item) => item._id === userId);
      //console.log(tempData);
      setData(userData);
      //setmoreFilteredData(userData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  const fetchTeamLeadsData = async (status) => {
    const bdmName = data.ename
    try {
      const response = await axios.get(`${secretKey}/forwardedbybdedata/${bdmName}`)




      setTeamData(response.data)
      if (bdmNewStatus === "Untouched") {
        setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Untouched"))
        setBdmNewStatus("Untouched")
      }
      if (status === "Interested") {
        setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Interested"))
        setBdmNewStatus("Interested")
      }
      if (status === "FollowUp") {
        setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "FollowUp"))
        setBdmNewStatus("FollowUp")
      }
      if (status === "Matured") {
        setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Matured"))
        setBdmNewStatus("Matured")
      }
      if (status === "Not Interested") {
        setTeamLeadsData(response.data.filter((obj) => obj.bdmStatus === "Not Interested"))
        setBdmNewStatus("Not Interested")
      }


      console.log("response", response.data)
    } catch (error) {
      console.log(error)
    }
  }

  console.log("teamdata", teamleadsData)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    fetchTeamLeadsData()

  }, [data.ename])

  //console.log("ename" , data.ename)


  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  }
  function formatDateNew(timestamp) {
    const date = new Date(timestamp);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  const closePopUpRemarks = () => {
    setOpenRemarks(false)

  }
  const closePopUpRemarksEdit = () => {
    setOpenRemarksEdit(false)

  }
  const functionopenpopupremarks = (companyID, companyStatus, companyName) => {
    setOpenRemarks(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
    setcid(companyID);
    setCstat(companyStatus);
    setCurrentCompanyName(companyName);

  };




  const [openRemarksEdit, setOpenRemarksEdit] = useState(false)
  const [remarksBdmName, setRemarksBdmName] = useState("")

  const functionopenpopupremarksEdit = (companyID, companyStatus, companyName, bdmName) => {
    setOpenRemarksEdit(true);
    setFilteredRemarks(
      remarksHistory.filter((obj) => obj.companyID === companyID)
    );
    // console.log(remarksHistory.filter((obj) => obj.companyID === companyID))
    setcid(companyID);
    setCstat(companyStatus);
    setCurrentCompanyName(companyName);
    setRemarksBdmName(bdmName)
  };

  console.log("filteredRemarks", filteredRemarks)

  //console.log("currentcompanyname", currentCompanyName);

  const fetchRemarksHistory = async () => {
    try {
      const response = await axios.get(`${secretKey}/remarks-history`);
      setRemarksHistory(response.data.reverse());
      setFilteredRemarks(response.data.filter((obj) => obj.companyID === cid));

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching remarks history:", error);
    }
  };


  useEffect(() => {
    fetchRemarksHistory();
  }, []);

  const debouncedSetChangeRemarks = useCallback(
    debounce((value) => {
      setChangeRemarks(value);
    }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
    [] // Empty dependency array to ensure the function is memoized
  );

  const [isDeleted, setIsDeleted] = useState(false)
  const [maturedCompany, setMaturedCompany] = useState("")
  const [maturedEmail, setMaturedEmail] = useState("")
  const [maturedInco, setMaturedInco] = useState("")
  const [maturedId, setMaturedId] = useState("")
  const [maturedNumber, setMaturedNumber] = useState("")
  const [maturedOpen, setMaturedOpen] = useState(false)

  const handleRejectData = async (companyId) => {
    setIsDeleted(true)
  }

  const handleUpdate = async () => {
    // Now you have the updated Status and Remarks, perform the update logic
    console.log(cid, cstat, changeRemarks, remarksBdmName);
    const Remarks = changeRemarks;
    if (Remarks === "") {
      Swal.fire({ title: "Empty Remarks!", icon: "warning" });
      return true;
    }
    try {
      if (isDeleted) {
        const response = await axios.post(`${secretKey}/teamleads-rejectdata/${cid}`, {
          bdmAcceptStatus: "NotForwarded",
        })
        const response2 = await axios.post(`${secretKey}/update-remarks/${cid}`, {
          Remarks,
        });
        const response3 = await axios.post(
          `${secretKey}/remarks-history/${cid}`,
          {
            Remarks,
            remarksBdmName,

          }
        );
        console.log("remarks", Remarks)
        if (response.status === 200) {
          Swal.fire("Remarks updated!");
          setChangeRemarks("");
          // If successful, update the employeeData state or fetch data again to reflect changes
          //fetchNewData(cstat);
          fetchRemarksHistory();
          // setCstat("");
          closePopUpRemarksEdit(); // Assuming fetchData is a function to fetch updated employee data
        } else {
          // Handle the case where the API call was not successful
          console.error("Failed to update status:", response.data.message);
        }

        console.log("response", response.data);
        fetchTeamLeadsData();
        Swal.fire("Data Rejected");
        setIsDeleted(false)

      } else {
        const response = await axios.post(`${secretKey}/update-remarks/${cid}`, {
          Remarks,
        });
        const response2 = await axios.post(
          `${secretKey}/remarks-history/${cid}`,
          {
            Remarks,
            remarksBdmName,

          }
        );
        console.log("remarks", Remarks)
        if (response.status === 200) {
          Swal.fire("Remarks updated!");
          setChangeRemarks("");
          // If successful, update the employeeData state or fetch data again to reflect changes
          //fetchNewData(cstat);
          fetchRemarksHistory();
          // setCstat("");
          closePopUpRemarksEdit(); // Assuming fetchData is a function to fetch updated employee data
        } else {
          // Handle the case where the API call was not successful
          console.error("Failed to update status:", response.data.message);
        }

      }
    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }

    setUpdateData((prevData) => ({
      ...prevData,
      [companyId]: {
        ...prevData[companyId],
        isButtonEnabled: false,
      },
    }));

    //   // After updating, you can disable the button
  };

  // const handleUpdate = async () => {
  //   // Now you have the updated Status and Remarks, perform the update logic
  //   console.log(cid, cstat, changeRemarks);
  //   const Remarks = changeRemarks;
  //   if (Remarks === "") {
  //     Swal.fire({ title: "Empty Remarks!", icon: "warning" });
  //     return true;
  //   }
  //   try {
  //     // Make an API call to update the remarks in the database
  //     const response = await axios.post(`${secretKey}/update-remarks/${cid}`, {
  //       Remarks,
  //     });

  //     console.log("remarks", Remarks);

  //     // Check if the API call to update remarks was successful
  //     if (response.status === 200) {
  //       // If successful, proceed with rejecting the data
  //       Swal.fire("updated")
  //       const response2 = await axios.post(`${secretKey}/teamleads-rejectdata/${cid}`, {
  //         bdmAcceptStatus: "NotForwarded",
  //       });

  //       // Check if the API call to reject data was successful
  //       if (response2.status === 200) {
  //         // If both API calls were successful, fetch updated team leads data
  //         fetchTeamLeadsData();
  //         Swal.fire("Remarks updated and data rejected!");
  //         closePopUpRemarks(); // Close the remarks dialog
  //       } else {
  //         console.error("Failed to reject data:", response2.data.message);
  //       }
  //     } else {
  //       console.error("Failed to update remarks:", response.data.message);
  //     }
  //   } catch (error) {
  //     // Handle any errors that occur during the API calls
  //     console.error("Error updating remarks or rejecting data:", error.message);
  //   }

  //   setUpdateData((prevData) => ({
  //     ...prevData,
  //     [companyId]: {
  //       ...prevData[companyId],
  //       isButtonEnabled: false,
  //     },
  //   }));
  // };






  const handleAcceptClick = async (
    companyId,
    cName,
    cemail,
    cdate,
    cnumber,
    oldStatus,
    newBdmStatus
  ) => {
    try {
      const response = await axios.post(`${secretKey}/update-bdm-status/${companyId}`, {
        newBdmStatus,
        companyId,
        oldStatus,
        bdmAcceptStatus: "Accept",
      })

      if (response.status === 200) {
        Swal.fire("Accepted");
        fetchTeamLeadsData(oldStatus);
        //setBdmNewStatus(oldStatus)
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.log("Error updating status", error.message)
    }
  }

  console.log("bdmNewStatus", bdmNewStatus)



  // const handleRejectData = async (companyId) => {
  //   setIsDeleted(true)


  //   try {
  //     const response = await axios.post(`${secretKey}/teamleads-rejectdata/${companyId}`, {
  //       bdmAcceptStatus: "NotForwarded",
  //     })
  //     console.log("response", response.data);
  //     fetchTeamLeadsData();
  //     Swal.fire("Data Rejected");
  //   } catch (error) {
  //     console.log("error reversing bdm forwarded data", error.message);
  //     Swal.fire("Error rekecting data")
  //   }
  // }



  // try {
  //   const response = await axios.post(`${secretKey}/teamleads-rejectdata/${companyId}`, {
  //     bdmAcceptStatus: "NotForwarded",
  //   })
  //   console.log("response", response.data);
  //   fetchTeamLeadsData();
  //   Swal.fire("Data Rejected");
  // } catch (error) {
  //   console.log("error reversing bdm forwarded data", error.message);
  //   Swal.fire("Error rekecting data")
  // }


  const handlebdmStatusChange = async (
    companyId,
    bdmnewstatus,
    cname,
    cemail,
    cindate,
    cnum,
    bdeStatus,
    bdmOldStatus
  ) => {
    const title = `${data.ename} changed ${cname} status from ${bdmOldStatus} to ${bdmnewstatus}`;
    const DT = new Date();
    const date = DT.toLocaleDateString();
    const time = DT.toLocaleTimeString();
    try {

      if (bdmnewstatus !== "Matured") {
        const response = await axios.post(
          `${secretKey}/bdm-status-change/${companyId}`,
          {
            bdeStatus,
            bdmnewstatus,
            title,
            date,
            time,
          }
        );
        console.log(bdmnewstatus)
        // Check if the API call was successful
        if (response.status === 200) {
          // Assuming fetchData is a function to fetch updated employee data

          fetchTeamLeadsData(bdmnewstatus);
          setBdmNewStatus(bdmnewstatus)
          setTeamLeadsData(teamData.filter((obj) => obj.bdmStatus === bdmnewstatus))


        } else {
          // Handle the case where the API call was not successful
          console.error("Failed to update status:", response.data.message);
        }

      } else {
        console.log("Matured Status here")
        setMaturedCompany(cname);
        setMaturedEmail(cemail);
        setMaturedInco(cindate);
        setMaturedId(companyId);
        setMaturedNumber(cnum);
        setMaturedOpen(true);
        return true;
      }
      // Make an API call to update the employee status in the database

    } catch (error) {
      // Handle any errors that occur during the API call
      console.error("Error updating status:", error.message);
    }

  }

  const handleDeleteRemarks = async (remarks_id, remarks_value) => {
    const mainRemarks = remarks_value === currentRemarks ? true : false;
    console.log(mainRemarks);
    const companyId = cid;
    console.log("Deleting Remarks with", remarks_id);
    try {
      // Send a delete request to the backend to delete the item with the specified ID
      await axios.delete(`${secretKey}/remarks-history/${remarks_id}`);
      if (mainRemarks) {
        await axios.delete(`${secretKey}/remarks-delete/${companyId}`);
      }
      // Set the deletedItemId state to trigger re-fetching of remarks history
      Swal.fire("Remarks Deleted");
      fetchRemarksHistory();
      //fetchNewData(cstat);
    } catch (error) {
      console.error("Error deleting remarks:", error);
    }
  };


  // -----------------------------projection------------------------------
  const [projectingCompany, setProjectingCompany] = useState("");
  const [openProjection, setOpenProjection] = useState(false);
  const [currentProjection, setCurrentProjection] = useState({
    companyName: "",
    ename: "",
    offeredPrize: 0,
    offeredServices: [],
    lastFollowUpdate: "",
    totalPayment: 0,
    estPaymentDate: "",
    remarks: "",
    date: "",
    time: "",
    editCount: -1,
    totalPaymentError: "",
  });
  const [selectedValues, setSelectedValues] = useState([]);
  const [isEditProjection, setIsEditProjection] = useState(false);
  const [openAnchor, setOpenAnchor] = useState(false);


  const functionopenprojection = (comName) => {
    setProjectingCompany(comName);
    setOpenProjection(true);
    const findOneprojection =
      projectionData.length !== 0 &&
      projectionData.find((item) => item.companyName === comName);
    if (findOneprojection) {
      setCurrentProjection({
        companyName: findOneprojection.companyName,
        ename: findOneprojection.ename,
        offeredPrize: findOneprojection.offeredPrize,
        offeredServices: findOneprojection.offeredServices,
        lastFollowUpdate: findOneprojection.lastFollowUpdate,
        estPaymentDate: findOneprojection.estPaymentDate,
        remarks: findOneprojection.remarks,
        totalPayment: findOneprojection.totalPayment,
        date: "",
        time: "",
        editCount: findOneprojection.editCount,
      });
      setSelectedValues(findOneprojection.offeredServices);
    }
  };

  const closeProjection = () => {
    setOpenProjection(false);
    setProjectingCompany("");
    setCurrentProjection({
      companyName: "",
      ename: "",
      offeredPrize: "",
      offeredServices: "",
      totalPayment: 0,
      lastFollowUpdate: "",
      remarks: "",
      date: "",
      time: "",
    });
    setIsEditProjection(false);
    setSelectedValues([]);
  };
  const functionopenAnchor = () => {
    setTimeout(() => {
      setOpenAnchor(true);
    }, 1000);
  };

  const handleDelete = async (company) => {
    const companyName = company;
    console.log(companyName);

    try {
      // Send a DELETE request to the backend API endpoint
      const response = await axios.delete(
        `${secretKey}/delete-followup/${companyName}`
      );
      console.log(response.data.message); // Log the response message
      // Show a success message after successful deletion
      console.log("Deleted!", "Your data has been deleted.", "success");
      setCurrentProjection({
        companyName: "",
        ename: "",
        offeredPrize: 0,
        offeredServices: [],
        lastFollowUpdate: "",
        totalPayment: 0,
        estPaymentDate: "",
        remarks: "",
        date: "",
        time: "",
      });
      setSelectedValues([]);
      fetchProjections();
    } catch (error) {
      console.error("Error deleting data:", error);
      // Show an error message if deletion fails
      console.log("Error!", "Follow Up Not Found.", "error");
    }
  };

  const handleProjectionSubmit = async () => {
    try {
      const newEditCount =
        currentProjection.editCount === -1
          ? 0
          : currentProjection.editCount + 1;

      const finalData = {
        ...currentProjection,
        companyName: projectingCompany,
        ename: data.ename,
        offeredServices: selectedValues,
        editCount: currentProjection.editCount + 1, // Increment editCount
      };

      if (finalData.offeredServices.length === 0) {
        Swal.fire({ title: "Services is required!", icon: "warning" });
      } else if (finalData.remarks === "") {
        Swal.fire({ title: "Remarks is required!", icon: "warning" });
      } else if (Number(finalData.totalPayment) === 0) {
        Swal.fire({ title: "Total Payment Can't be 0!", icon: "warning" });
      } else if (finalData.totalPayment === "") {
        Swal.fire({ title: "Total Payment Can't be 0", icon: "warning" });
      } else if (Number(finalData.offeredPrize) === 0) {
        Swal.fire({ title: "Offered Prize is required!", icon: "warning" });
      } else if (
        Number(finalData.totalPayment) > Number(finalData.offeredPrize)
      ) {
        Swal.fire({
          title: "Total Payment cannot be greater than Offered Prize!",
          icon: "warning",
        });
      } else if (finalData.lastFollowUpdate === null) {
        Swal.fire({
          title: "Last FollowUp Date is required!",
          icon: "warning",
        });
      } else if (finalData.estPaymentDate === 0) {
        Swal.fire({
          title: "Estimated Payment Date is required!",
          icon: "warning",
        });
      } else {
        // Send data to backend API
        const response = await axios.post(
          `${secretKey}/update-followup`,
          finalData
        );
        Swal.fire({ title: "Projection Submitted!", icon: "success" });
        setOpenProjection(false);
        setCurrentProjection({
          companyName: "",
          ename: "",
          offeredPrize: 0,
          offeredServices: [],
          lastFollowUpdate: "",
          remarks: "",
          date: "",
          time: "",
          editCount: newEditCount,
          totalPaymentError: "", // Increment editCount
        });
        fetchProjections();
        setSelectedValues([]);
      }
    } catch (error) {
      console.error("Error updating or adding data:", error.message);
    }
  };

  const fetchProjections = async () => {
    try {
      const response = await axios.get(
        `${secretKey}/projection-data/${data.ename}`
      );
      setProjectionData(response.data);
    } catch (error) {
      console.error("Error fetching Projection Data:", error.message);
    }
  };

  useEffect(() => {
    fetchProjections();
  }, [data]);


  const [openFeedback, setOpenFeedback] = useState(false)
  const [feedbackCompanyName, setFeedbackCompanyName] = useState("")
  const [valueSlider, setValueSlider] = useState(0)
  const [feedbackRemarks, setFeedbackRemarks] = useState("")
  const [companyFeedbackId, setCompanyFeedbackId] = useState("")
  const [isEditFeedback , setIsEditFeedback] = useState(false)

  const handleOpenFeedback = (companyName, companyId, companyFeedbackPoints, companyFeedbackRemarks) => {
    setOpenFeedback(true)
    setFeedbackCompanyName(companyName)
    setCompanyFeedbackId(companyId)
    setFeedbackRemarks(companyFeedbackRemarks)
    setValueSlider(companyFeedbackPoints)
    //setIsEditFeedback(true)

  }

  const handleCloseFeedback = () => {
    setOpenFeedback(false)
    setValueSlider(0)
    setCompanyFeedbackId("")
    setFeedbackCompanyName("")
    setFeedbackRemarks("")
    setIsEditFeedback(false)
  }

  const handleSliderChange = (valueSlider) => {
    setValueSlider(valueSlider)

  }

  console.log("valueSlider", valueSlider, feedbackRemarks)




  const debouncedFeedbackRemarks = useCallback(
    debounce((value) => {
      setFeedbackRemarks(value);
    }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
    [] // Empty dependency array to ensure the function is memoized
  );

  const handleFeedbackSubmit = async () => {
    const response = await axios.post(`${secretKey}/post-feedback-remarks/${companyFeedbackId}`, {
      feedbackPoints: valueSlider,
      feedbackRemarks: feedbackRemarks,
    })

    try {
      if (response.status === 200) {
        Swal.fire("Feedback Updated")
        handleCloseFeedback()
      }

    } catch (error) {

      Swal.fire("Error sending feedback")
      console.log("error", error.message)

    }

  }











  return (
    <div>

      <Header bdmName={data.ename} />
      <Navbar userId={userId} />
      <div className="page-wrapper">
        <div className="page-header d-print-none">
          <div className="container-xl">
            <div className="row">
              <div className="col-sm-3">
                <div class="input-icon">
                  <span class="input-icon-addon">
                    {/* <CiSearch /> */}
                  </span>
                  <input type="text" value="" class="form-control" placeholder="Search…" aria-label="Search in website" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body" onCopy={(e) => {
          e.preventDefault();
        }}>
          <div className="container-xl">
            <div class="card-header my-tab">
              <ul class="nav nav-tabs card-header-tabs nav-fill p-0"
                data-bs-toggle="tabs">
                <li class="nav-item data-heading">
                  <a
                    href="#tabs-home-5"
                    onClick={() => {
                      setBdmNewStatus("Untouched");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Busy" ||
                            obj.bdmStatus === "Not Picked Up" ||
                            obj.bdmStatus === "Untouched"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "Untouched"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    General{" "}
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Busy" ||
                            obj.bdmStatus === "Not Picked Up" ||
                            obj.bdmStatus === "Untouched"
                        ).length
                      }
                    </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("Interested");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) => obj.bdmStatus === "Interested"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "Interested"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Interested
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) => obj.bdmStatus === "Interested"
                        ).length
                      }
                    </span>

                    {/* <span className="no_badge">
                      <li class="nav-item">
                        <a
                          href="#tabs-activity-5"
                          // onClick={() => {
                          //   setdataStatus("FollowUp");
                          //   setCurrentPage(0);
                          //   setEmployeeData(
                          //     moreEmpData.filter(
                          //       (obj) => obj.Status === "FollowUp"
                          //     )
                          //   );
                          // }}
                          className={
                            dataStatus === "FollowUp"
                              ? "nav-link active item-act"
                              : "nav-link"
                          }
                          data-bs-toggle="tab"
                        >
                           Follow Up{" "} 
                          <span className="no_badge">
                            {
                              teamData.filter(
                                (obj) => obj.Status === "FollowUp"
                              ).length
                            }
                          </span>
                        </a>
                      </li>
                    </span> */}
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("FollowUp");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) => obj.bdmStatus === "FollowUp"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "FollowUp"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Follow Up{" "}
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) => obj.bdmStatus === "FollowUp"
                        ).length
                      }
                    </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("Matured");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData
                          .filter((obj) => obj.bdmStatus === "Matured")
                          .sort(
                            (a, b) =>
                              new Date(b.lastActionDate) -
                              new Date(a.lastActionDate)
                          )
                      );
                    }}
                    className={
                      bdmNewStatus === "Matured"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Matured{" "}
                    <span className="no_badge">
                      {" "}
                      {
                        teamData.filter(
                          (obj) => obj.bdmStatus === "Matured"
                        ).length
                      }
                    </span>
                  </a>
                </li>
                <li class="nav-item">
                  <a
                    href="#tabs-activity-5"
                    onClick={() => {
                      setBdmNewStatus("NotInterested");
                      //setCurrentPage(0);
                      setTeamLeadsData(
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Not Interested" ||
                            obj.bdmStatus === "Junk"
                        )
                      );
                    }}
                    className={
                      bdmNewStatus === "NotInterested"
                        ? "nav-link active item-act"
                        : "nav-link"
                    }
                    data-bs-toggle="tab"
                  >
                    Not-Interested{" "}
                    <span className="no_badge">
                      {
                        teamData.filter(
                          (obj) =>
                            obj.bdmStatus === "Not Interested" ||
                            obj.bdmStatus === "Junk"
                        ).length
                      }
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="card">
              <div className="card-body p-0" >
                <div style={{
                  overflowX: "auto",
                  overflowY: "auto",
                  maxHeight: "66vh",
                }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                  }}
                    className="table-vcenter table-nowrap">
                    <thead>
                      <tr className="tr-sticky">
                        <th className="th-sticky">Sr.No</th>
                        <th className="th-sticky1">Company Name</th>
                        <th>Bde Name</th>
                        <th>Company Number</th>
                        <th>Bde Status</th>
                        <th>Bde Remarks</th>
                        {(bdmNewStatus === "Interested" || bdmNewStatus === "FollowUp" || bdmNewStatus === "Matured" || bdmNewStatus === "Not Interested") && (
                          <>
                            <th>Bdm Status</th>
                            <th>Bdm Remarks</th>
                          </>
                        )}
                        <th>
                          Incorporation Date
                        </th>
                        <th>City</th>
                        <th>State</th>
                        <th>Company Email</th>
                        <th>
                          Assigned Date
                        </th>
                        {bdmNewStatus === "Untouched" && <th>Action</th>}
                        {(bdmNewStatus === "FollowUp" || bdmNewStatus === "Interested") && (<>
                          <th>Add Projection</th>
                          <th>Add Feedback</th>
                        </>)
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {teamleadsData.map((company, index) => (
                        <tr
                          key={index}
                          style={{ border: "1px solid #ddd" }}
                        >
                          <td className="td-sticky">
                            {startIndex + index + 1}
                          </td>
                          <td className="td-sticky1">
                            {company["Company Name"]}
                          </td>
                          <td>{company.ename}</td>
                          <td>
                            <div className="d-flex align-items-center justify-content-between wApp">
                              <div>{company["Company Number"]}</div>
                              <a
                                target="_blank"
                                href={`https://wa.me/91${company["Company Number"]}`}
                              >
                                <FaWhatsapp />
                              </a>
                            </div>
                          </td>
                          <td>
                            {company.Status}
                          </td>
                          <td>
                            <div
                              key={company._id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100px",
                              }}>
                              <p
                                className="rematkText text-wrap m-0"
                                title={company.Remarks}
                              >
                                {!company["Remarks"]
                                  ? "No Remarks"
                                  : company.Remarks}
                              </p>
                              <IconButton
                                onClick={() => {
                                  functionopenpopupremarks(
                                    company._id,
                                    company.Status,
                                    company["Company Name"]
                                  );
                                  setCurrentRemarks(company.Remarks);
                                  //setCurrentRemarksBdm(company.bdmRemarks)
                                  setCompanyId(company._id);
                                }}
                              >
                                <IconEye
                                  style={{
                                    width: "12px",
                                    height: "12px",
                                    color: "#fbb900"
                                  }}
                                />
                              </IconButton>
                            </div>
                          </td>
                          {(bdmNewStatus === "Interested" || bdmNewStatus === "FollowUp" || bdmNewStatus === "Matured" || bdmNewStatus === "Not Interested") && (
                            <>
                              <td>
                                {company.bdmStatus === "Matured" ? (
                                  <span>{company.bdmStatus}</span>
                                ) : (
                                  <select
                                    style={{
                                      background: "none",
                                      padding: ".4375rem .75rem",
                                      border:
                                        "1px solid var(--tblr-border-color)",
                                      borderRadius:
                                        "var(--tblr-border-radius)",
                                    }}
                                    value={company.bdmStatus}
                                    onChange={(e) =>
                                      handlebdmStatusChange(
                                        company._id,
                                        e.target.value,
                                        company["Company Name"],
                                        company["Company Email"],
                                        company[
                                        "Company Incorporation Date  "
                                        ],
                                        company["Company Number"],
                                        company["Status"],
                                        company.bdmStatus
                                      )
                                    }
                                  >
                                    <option value="Not Picked Up">
                                      Not Picked Up
                                    </option>
                                    <option value="Busy">Busy </option>
                                    <option value="Junk">Junk</option>
                                    <option value="Not Interested">
                                      Not Interested
                                    </option>
                                    {bdmNewStatus === "Interested" && (
                                      <>
                                        <option value="Interested">
                                          Interested
                                        </option>
                                        <option value="FollowUp">
                                          Follow Up{" "}
                                        </option>
                                        <option value="Matured">
                                          Matured
                                        </option>
                                      </>
                                    )}

                                    {bdmNewStatus === "FollowUp" && (
                                      <>
                                        <option value="FollowUp">
                                          Follow Up{" "}
                                        </option>
                                        <option value="Matured">
                                          Matured
                                        </option>
                                      </>
                                    )}
                                  </select>
                                )}
                              </td>
                              <td>
                                <div
                                  key={company._id}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100px",
                                  }}
                                >
                                  <p
                                    className="rematkText text-wrap m-0"
                                    title={company.Remarks}
                                  >
                                    {!company.bdmRemarks
                                      ? "No Remarks"
                                      : company.bdmRemarks}

                                  </p>

                                  <IconButton
                                    onClick={() => {
                                      functionopenpopupremarksEdit(
                                        company._id,
                                        company.Status,
                                        company["Company Name"],
                                        company.bdmName
                                      );
                                      setCurrentRemarks(company.Remarks);
                                      //setCurrentRemarksBdm(company.Remarks)
                                      setCompanyId(company._id);
                                    }}>
                                    <EditIcon
                                      style={{
                                        width: "12px",
                                        height: "12px",
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              </td>

                            </>
                          )}
                          <td>
                            {formatDateNew(
                              company["Company Incorporation Date  "]
                            )}
                          </td>
                          <td>{company["City"]}</td>
                          <td>{company["State"]}</td>
                          <td>{company["Company Email"]}</td>
                          <td>{company.bdeForwardDate}</td>
                          {
                            company.bdmStatus === "Untouched" && (
                              <td>
                                <IconButton style={{ color: "green", marginRight: "5px", height: "25px", width: "25px" }}
                                  onClick={(e) => handleAcceptClick(
                                    company._id,
                                    //e.target.value,
                                    company["Company Name"],
                                    company["Company Email"],
                                    company[
                                    "Company Incorporation Date  "
                                    ],
                                    company["Company Number"],
                                    company["Status"],
                                    company.bdmStatus
                                  )}>
                                  <GrStatusGood />
                                </IconButton>
                                <IconButton onClick={() => {
                                  functionopenpopupremarksEdit(company._id,
                                    company.Status,
                                    company["Company Name"],
                                    company.bdmName)
                                  handleRejectData(company._id)
                                }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="red" style={{ width: "12px", height: "12px", color: "red" }}><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c-9.4 9.4-9.4 24.6 0 33.9l47 47-47 47c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l47-47 47 47c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-47-47 47-47c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-47 47-47-47c-9.4-9.4-24.6-9.4-33.9 0z" /></svg></IconButton>
                              </td>
                            )
                          }
                          {(bdmNewStatus === "FollowUp" || bdmNewStatus === "Interested") && (<>
                            <td>
                              {company &&
                                projectionData &&
                                projectionData.some(
                                  (item) => item.companyName === company["Company Name"]
                                ) ? (
                                <IconButton>
                                  <RiEditCircleFill
                                    onClick={() => {
                                      functionopenprojection(
                                        company["Company Name"]
                                      );
                                    }}
                                    style={{
                                      cursor: "pointer",
                                      width: "17px",
                                      height: "17px",
                                      color: "#fbb900", // Set color to yellow
                                    }}
                                  />
                                </IconButton>
                              ) : (
                                <IconButton>
                                  <RiEditCircleFill
                                    onClick={() => {
                                      functionopenprojection(
                                        company["Company Name"]
                                      );
                                      setIsEditProjection(true);
                                    }}

                                    style={{
                                      cursor: "pointer",
                                      width: "17px",
                                      height: "17px",
                                    }}
                                  />
                                </IconButton>
                              )}
                            </td>
                            <td>
                              {(company.feedbackRemarks || company.feedbackPoints) ? (<IconButton>
                                <IoAddCircle
                                  onClick={() => {
                                    handleOpenFeedback(
                                      company["Company Name"],
                                      company._id,
                                      company.feedbackPoints,
                                      company.feedbackRemarks
                                    )
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    width: "17px",
                                    height: "17px",
                                    color: "#fbb900"
                                  }} />
                              </IconButton>) : (
                                <IconButton>
                                  <IoAddCircle
                                    onClick={() => {
                                      handleOpenFeedback(
                                        company["Company Name"],
                                        company._id
                                      )
                                      setIsEditFeedback(true)
                                    }}
                                    style={{
                                      cursor: "pointer",
                                      width: "17px",
                                      height: "17px",
                                    }} />
                                </IconButton>

                              )}
                            </td>
                          </>)}

                          {/* {dataStatus === "Matured" && (
                            <>
                              <td>
                                <div className="d-flex">
                                  <IconButton
                                    style={{ marginRight: "5px" }}
                                    onClick={() => {
                                      setMaturedID(company._id);

                                      functionopenAnchor();
                                    }}
                                  >
                                    <IconEye
                                      style={{
                                        width: "14px",
                                        height: "14px",
                                        color: "#d6a10c",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </IconButton>

                                  <IconButton
                                    onClick={() => {
                                      handleRequestDelete(
                                        company._id,
                                        company["Company Name"]
                                      );
                                    }}
                                    disabled={requestDeletes.some(
                                      (item) =>
                                        item.companyId === company._id &&
                                        item.request === undefined
                                    )}
                                  >
                                    <DeleteIcon
                                      style={{
                                        cursor: "pointer",
                                        color: "#f70000",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      handleEditClick(company._id)
                                    }}
                                  >
                                    <Edit
                                      style={{
                                        cursor: "pointer",
                                        color: "#109c0b",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>
                                  <IconButton
                                    onClick={() => {
                                      setCompanyName(
                                        company["Company Name"]
                                      );
                                      setAddFormOpen(true);
                                    }}
                                  >
                                    <AddCircleIcon
                                      style={{
                                        cursor: "pointer",
                                        color: "#4f5b74",
                                        width: "14px",
                                        height: "14px",
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              </td>
                            </>
                          )} */}
                        </tr>
                      ))}
                    </tbody>
                    {teamleadsData.length === 0 && (
                      <tbody>
                        <tr>
                          <td colSpan="11" className="p-2 particular">
                            <NoData />
                          </td>
                        </tr>
                      </tbody>
                    )}
                    {teamleadsData.length !== 0 && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                        className="pagination"
                      >
                        <IconButton
                          onClick={() =>
                            setCurrentPage((prevPage) =>
                              Math.max(prevPage - 1, 0)
                            )
                          }
                          disabled={currentPage === 0}
                        >
                          <IconChevronLeft />
                        </IconButton>
                        {/* <span>
                          Page {currentPage + 1} of{" "}
                          {Math.ceil(filteredData.length / itemsPerPage)}
                        </span> */}

                        {/* <IconButton
                          onClick={() =>
                            setCurrentPage((prevPage) =>
                              Math.min(
                                prevPage + 1,
                                Math.ceil(filteredData.length / itemsPerPage) -
                                1
                              )
                            )
                          }
                          disabled={
                            currentPage ===
                            Math.ceil(filteredData.length / itemsPerPage) - 1
                          }
                        >
                          <IconChevronRight />
                        </IconButton> */}
                      </div>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      {/* // -------------------------------------------------------------------Dialog for bde Remarks--------------------------------------------------------- */}

      <Dialog
        open={openRemarks}
        onClose={closePopUpRemarks}
        fullWidth
        maxWidth="sm">
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>
            {currentCompanyName}'s Remarks
          </span>
          <IconButton onClick={closePopUpRemarks} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarks.length !== 0 ? (
              filteredRemarks.slice().map((historyItem) => (
                <div className="col-sm-12" key={historyItem._id}>
                  <div className="card RemarkCard position-relative">
                    <div className="d-flex justify-content-between">
                      <div className="reamrk-card-innerText">
                        <pre className="remark-text">{historyItem.remarks}</pre>
                      </div>
                      {/* <div className="dlticon">
                        <DeleteIcon
                          style={{
                            cursor: "pointer",
                            color: "#f70000",
                            width: "14px",
                          }}
                          onClick={() => {
                            handleDeleteRemarks(
                              historyItem._id,
                              historyItem.remarks
                            );
                          }}
                        />
                      </div> */}
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

          {/* <div class="card-footer">
            <div class="mb-3 remarks-input">
              <textarea
                placeholder="Add Remarks Here...  "
                className="form-control"
                id="remarks-input"
                rows="3"
                onChange={(e) => {
                  debouncedSetChangeRemarks(e.target.value);
                }}
              ></textarea>
            </div>
            <button
              onClick={handleUpdate}
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div> */}
        </DialogContent>
      </Dialog>
      {/* ----------------------------------------------------dialog for editing popup--------------------------------------------- */}

      <Dialog
        open={openRemarksEdit}
        onClose={closePopUpRemarksEdit}
        fullWidth
        maxWidth="sm">
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>
            {currentCompanyName}'s Remarks
          </span>
          <IconButton onClick={closePopUpRemarksEdit} style={{ float: "right" }}>
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarks.length !== 0 ? (
              filteredRemarks.slice().map((historyItem) => (
                <div className="col-sm-12" key={historyItem._id}>
                  <div className="card RemarkCard position-relative">
                    <div className="d-flex justify-content-between">
                      <div className="reamrk-card-innerText">
                        <pre className="remark-text">{historyItem.remarks}</pre>
                      </div>
                      <div className="dlticon">
                        <DeleteIcon
                          style={{
                            cursor: "pointer",
                            color: "#f70000",
                            width: "14px",
                          }}
                          onClick={() => {
                            handleDeleteRemarks(
                              historyItem._id,
                              historyItem.remarks
                            );
                          }}
                        />
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

          <div class="card-footer">
            <div class="mb-3 remarks-input">
              <textarea
                placeholder="Add Remarks Here...  "
                className="form-control"
                id="remarks-input"
                rows="3"
                onChange={(e) => {
                  debouncedSetChangeRemarks(e.target.value);
                }}
              ></textarea>
            </div>
            <button
              onClick={handleUpdate}
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* --------------------------------------------------------- dialog for feedback----------------------------------------- */}

      <Dialog
        open={openFeedback}
        onClose={handleCloseFeedback}
        fullWidth
        maxWidth="xs">
        <DialogTitle>
          <span style={{ fontSize: "11px" }}>
            BDM Feedback for {feedbackCompanyName}
          </span>
          <IconButton onClick={handleCloseFeedback} style={{ float: "right" }}>
            <CloseIcon color="primary" style={{width:"16px" , height:"16px"}}></CloseIcon>
          </IconButton>{" "}
          {(valueSlider && feedbackRemarks ) ? (<IconButton
            onClick={() => {
              setIsEditFeedback(true);
            }}
            style={{ float: "right" }}>
            <EditIcon color="grey" style={{width:"16px" , height:"16px"}}></EditIcon>
          </IconButton>):(null)}
        </DialogTitle>
        <DialogContent>

          <div className="card-body mt-5">
            <div className="feedback-slider">
              <Slider
                defaultValue={0}
                //getAriaValueText={valuetext} 
                value={valueSlider}
                onChange={(e) => {handleSliderChange(e.target.value) }}
                sx={{ zIndex: "99999999", color: "#ffb900" }}
                min={0}
                max={10}
                aria-label="Default"
                valueLabelDisplay="auto"
                disabled ={!isEditFeedback} 
                />
            </div>

          </div>

          <div class="card-footer mt-4">
            <div class="mb-3 remarks-input">
              <textarea
                placeholder="Add Remarks Here...  "
                className="form-control"
                id="remarks-input"
                rows="3"
                value={feedbackRemarks}
                onChange={(e) => {
                  debouncedFeedbackRemarks(e.target.value);
                }}
                disabled ={!isEditFeedback}
              ></textarea>
            </div>
            <button
              onClick={handleFeedbackSubmit}
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              Submit
            </button>
          </div>

        </DialogContent>
      </Dialog>




      {/* ---------------------------------projection drawer--------------------------------------------------------- */}

      <div>
        <Drawer
          style={{ top: "50px" }}
          anchor="right"
          open={openProjection}
          onClose={closeProjection}>
          <div style={{ width: "31em" }} className="container-xl">
            <div
              className="header d-flex justify-content-between align-items-center"
              style={{ margin: "10px 0px" }}
            >
              <h1
                style={{ marginBottom: "0px", fontSize: "23px" }}
                className="title"
              >
                Projection Form
              </h1>
              <div>
                {projectingCompany &&
                  projectionData &&
                  projectionData.some(
                    (item) => item.companyName === projectingCompany
                  ) ? (
                  <>
                    <IconButton
                      onClick={() => {
                        setIsEditProjection(true);
                      }}
                    >
                      <EditIcon color="grey"></EditIcon>
                    </IconButton>
                  </>
                ) : null}
                {/* <IconButton
                  onClick={() => {
                    setIsEditProjection(true);
                  }}>
                  <EditIcon color="grey"></EditIcon>
                </IconButton> */}
                {/* <IconButton onClick={() => handleDelete(projectingCompany)}>
                  <DeleteIcon
                    style={{
                      width: "16px",
                      height: "16px",
                      color: "#bf0b0b",
                    }}
                  >
                    Delete
                  </DeleteIcon>
                </IconButton> */}
                <IconButton>
                  <IoClose onClick={closeProjection} />
                </IconButton>
              </div>
            </div>
            <hr style={{ margin: "0px" }} />
            <div className="body-projection">
              <div className="header d-flex align-items-center justify-content-between">
                <div>
                  <h1
                    title={projectingCompany}
                    style={{
                      fontSize: "14px",
                      textShadow: "none",
                      fontFamily: "sans-serif",
                      fontWeight: "400",
                      fontFamily: "Poppins, sans-serif",
                      margin: "10px 0px",
                      width: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {projectingCompany}
                  </h1>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(projectingCompany)}
                    className="btn btn-link"
                    style={{ color: "grey" }}
                  >
                    Clear Form
                  </button>
                </div>
              </div>
              <div className="label">
                <strong>
                  Offered Services{" "}
                  {selectedValues.length === 0 && (
                    <span style={{ color: "red" }}>*</span>
                  )}{" "}
                  :
                </strong>
                <div className="services mb-3">
                  <Select
                    isMulti
                    options={options}
                    onChange={(selectedOptions) => {
                      setSelectedValues(
                        selectedOptions.map((option) => option.value)
                      );
                    }}
                    value={selectedValues.map((value) => ({
                      value,
                      label: value,
                    }))}
                    placeholder="Select Services..."
                    isDisabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Offered Prices(With GST){" "}
                  {!currentProjection.offeredPrize && (
                    <span style={{ color: "red" }}>*</span>
                  )}{" "}
                  :
                </strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter offered Prize"
                    value={currentProjection.offeredPrize}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        offeredPrize: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Expected Price (With GST)
                  {currentProjection.totalPayment === 0 && (
                    <span style={{ color: "red" }}>*</span>
                  )}{" "}
                  :
                </strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter total Payment"
                    value={currentProjection.totalPayment}
                    onChange={(e) => {
                      const newTotalPayment = e.target.value;
                      if (
                        Number(newTotalPayment) <=
                        Number(currentProjection.offeredPrize)
                      ) {
                        setCurrentProjection((prevLeadData) => ({
                          ...prevLeadData,
                          totalPayment: newTotalPayment,
                          totalPaymentError: "",
                        }));
                      } else {
                        setCurrentProjection((prevLeadData) => ({
                          ...prevLeadData,
                          totalPayment: newTotalPayment,
                          totalPaymentError:
                            "Expected Price should be less than or equal to Offered Price.",
                        }));
                      }
                    }}
                    disabled={!isEditProjection}
                  />

                  <div style={{ color: "lightred" }}>
                    {currentProjection.totalPaymentError}
                  </div>
                </div>
              </div>

              <div className="label">
                <strong>
                  Last Follow Up Date{" "}
                  {!currentProjection.lastFollowUpdate && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                  :{" "}
                </strong>
                <div className="services mb-3">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Please enter offered Prize"
                    value={currentProjection.lastFollowUpdate}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        lastFollowUpdate: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Payment Expected on{" "}
                  {!currentProjection.estPaymentDate && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                  :
                </strong>
                <div className="services mb-3">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Please enter Estimated Payment Date"
                    value={currentProjection.estPaymentDate}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        estPaymentDate: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>
                  Remarks{" "}
                  {currentProjection.remarks === "" && (
                    <span style={{ color: "red" }}>*</span>
                  )}
                  :
                </strong>
                <div className="remarks mb-3">
                  <textarea
                    type="text"
                    className="form-control"
                    placeholder="Enter any Remarks"
                    value={currentProjection.remarks}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        remarks: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="submitBtn">
                <button
                  disabled={!isEditProjection}
                  onClick={handleProjectionSubmit}
                  style={{ width: "100%" }}
                  type="submit"
                  class="btn btn-primary mb-3"
                >
                  Submit
                </button>
              </div>
              <div>
                <button>Pay now</button>
                {/* <button onClick={generatePaymentLink}>Generate Payment Link</button>
                {paymentLink && <a href={paymentLink} target="_blank" rel="noopener noreferrer">Proceed to Payment</a>}
                {error && <p>{error}</p>} */}
              </div>
            </div>
          </div>
        </Drawer>
      </div>




    </div>

  );
}

export default BdmTeamLeads;
