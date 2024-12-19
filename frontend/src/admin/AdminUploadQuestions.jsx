import React, { useState, useEffect, useRef, useMemo } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BsFilter } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";
import FilterableComponentEmployee from "../employeeComp/ExtraComponents/FilterableComponentEmployee";
import { GoArrowLeft } from "react-icons/go";
import { GoArrowRight } from "react-icons/go";
import FilterableTable from "../RM-CERTIFICATION/Extra-Components/FilterableTable.jsx";
import { FaRegEye } from "react-icons/fa";
import MaleEmployee from "../static/EmployeeImg/office-man.png";
import FemaleEmployee from "../static/EmployeeImg/woman.png";
import RemainingAmnt from "../static/my-images/money.png";
import QuestionUploadDialog from "./ExtraComponent/QuestionUploadDialog.jsx";
import { MdOutlineEdit } from "react-icons/md";
import EmployeeQuestionModal from "./ExtraComponent/EmployeeQuestionModal.jsx";
import SlotSelectionDialog from "./ExtraComponent/SlotSelectionDialog.jsx";
import Swal from "sweetalert2";
import { MdDeleteOutline } from "react-icons/md";
import io from 'socket.io-client';
import EmployeeAnsweredQuestionDetailsDialog from "./ExtraComponent/EmployeeAnsweredQuestionDetailsDialog.jsx";



function AdminUploadQuestions() {
    const [isBookingDataLoading, setIsBookingDataLoading] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [completeData, setCompleteData] = useState([]);
    const [slotDialogOpen, setSlotDialogOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [questionDetails, setQuestionDetails] = useState([]);
    const [employeesAnswered, setEmployeesAnswered] = useState([]);
    const [employeeAnsDialog, setEmployeeAnsDialog] = useState(false);
    const [editMode, setEditMode] = useState(false); // New state for edit mode
    const [selectedQuestionData, setSelectedQuestionData] = useState(null); // Selected question for editing

    useEffect(() => {
        document.title = `Admin-Sahay-CRM`;
        const socket = secretKey === "http://localhost:3001/api" ? io("http://localhost:3001") : io("wss://startupsahay.in", {
            secure: true, // Use HTTPS
            path: '/socket.io',
            reconnection: true,
            transports: ['websocket'],
        });
        socket.on("employee_answer_submitted", (res) => {
            fetchingData()
            fetchAvailableSlots()
        });
        socket.on("excel_submitted", (res) => {
            fetchingData()
            fetchAvailableSlots()
        })
        // Clean up the socket connection when the component unmounts
        return () => {
            socket.disconnect();
        };
        
    }, []);


    const handleDialogToggle = () => {
        setDialogOpen(false);
        setEditMode(false);
        setSelectedQuestionData(null);
    }


    const handleSlotDialogToggle = () => {
        setSlotDialogOpen(!slotDialogOpen);
        
    };

    const fetchingData = async () => {
        try {
            const response = await axios.get(`${secretKey}/question_related_api/gets_all_questionData`)
            const response2 = await axios.get(`${secretKey}/employee/einfo`)
            setEmployees(response2.data.filter((employee) => employee.designation === "Sales Executive" || employee.designation === "Sales Manager"))
            setCompleteData(response.data)
            //console.log("response", response)
        } catch (error) {
            console.log("Error fetching data", error)
        }
    }
    // console.log(completeData)

    useEffect(() => {
        fetchingData()
    }, [])
    function formatDatePro(uploadedDate) {
        const date = new Date(uploadedDate);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'long' });
        const year = date.getFullYear();

        return `${day} ${month}, ${year}`;
    }

    // =================available slots======================
    // Fetch available slots
    const fetchAvailableSlots = async () => {
        try {
            const response = await axios.get(`${secretKey}/question_related_api/available-slots`);
            console.log("response", response.data)
            setAvailableSlots(response.data.slotAvailability); // Store slot availability data
        } catch (error) {
            console.error("Error fetching available slots:", error);
            Swal.fire({
                title: "Error",
                text: "Could not fetch available slots.",
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    useEffect(() => {
        fetchAvailableSlots();
    }, []);

    // Function to handle Question Click
    const [selectedQuestionFull, setSelectedQuestionFull] = useState("")
    const handleQuestionClick = async (questionId, questionfull) => {
        setEmployeeAnsDialog(true);
        setSelectedQuestion(questionId);
        setSelectedQuestionFull(questionfull);

        try {
            const response = await axios.get(
                `${secretKey}/question_related_api/question-responses/${questionId}`
            );
            console.log("response.data", response.data)

            setEmployeesAnswered(response.data);
        } catch (error) {
            console.error("Error fetching question details", error);
            Swal.fire({
                title: "Error",
                text: "Could not fetch question responses.",
                icon: "error",
                confirmButtonText: "Retry",
            });
        }
    };

    // ==================deleting quetion function=====================
    // Handle Delete Button Click
    const handleDeleteQuestion = async (questionId, slotIndex) => {
        console.log(questionId, slotIndex)
        try {
            const response = await Swal.fire({
                title: "Are you sure?",
                text: "This will delete the question permanently!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, keep it",
            });

            if (response.isConfirmed) {
                await axios.post(`${secretKey}/question_related_api/delete-question`, {
                    questionId: questionId,
                    slotIndex: slotIndex
                });
                Swal.fire("Deleted!", "The question has been deleted.", "success");
                fetchingData();
            }
        } catch (error) {
            console.error("Error deleting question", error);
            Swal.fire("Error!", "Failed to delete the question.", "error");
        }
    };

    // ==================edit question==========================
    // Handle Edit Button Click
    const handleEditQuestion = (question, slotIndex) => {
        console.log("question", question)
        setEditMode(true);
        setSelectedQuestionData({ ...question, slotIndex });
        setDialogOpen(true);
    };
    console.log("selectedQuestionData", selectedQuestionData)

    return (
        <div>
            <div className="page-header mt-3">
                <div className="container-xl">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div class="input-icon">
                                <span class="input-icon-addon">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon mybtn" width="18" height="18" viewBox="0 0 22 22" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
                                        <path d="M21 21l-6 -6"></path>
                                    </svg>
                                </span>
                                <input
                                    className="form-control search-cantrol mybtn"
                                    placeholder="Search..."
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="d-flex align-items-center mr-1">
                            <div className="d-flex align-items-center">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button
                                        className="btn action-btn-primary mr-1"
                                        onClick={handleSlotDialogToggle}
                                    >
                                        Push Question
                                    </button>
                                </div>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn action-btn-primary" onClick={() => {
                                        setDialogOpen(true);
                                        setEditMode(false);
                                        setSelectedQuestionData(null);
                                    }}>
                                        Add Question
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="sales-panels-main no-select">
                    <div className="container-xl mt-2">
                        <div className="table table-responsive e-Leadtable-style m-0" id="bknglisth" style={{ borderRadius: "6px", border: "1px solid #ccc" }}>
                            <table className="table table-vcenter table-nowrap">
                                <thead>
                                    <tr className="tr-sticky">
                                        <th className="rm-sticky-left-1">Sr.No</th>
                                        <th className="rm-sticky-left-2">
                                            Question
                                        </th>
                                        <th>
                                            Option 1
                                        </th>
                                        <th>
                                            Option 2
                                        </th>
                                        <th>
                                            Option 3
                                        </th>
                                        <th>
                                            Option 4
                                        </th>
                                        <th>
                                            Correct Option
                                        </th>
                                        <th>
                                            Right Option Response
                                        </th>
                                        <th>
                                            Wrong Option Response
                                        </th>
                                        <th>
                                            Uploaded Date
                                        </th>
                                        <th>
                                            Slot Number
                                        </th>
                                        <th>
                                            Action
                                        </th>

                                    </tr>
                                </thead>
                                {isBookingDataLoading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="14">
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
                                        {completeData && completeData.length !== 0 && completeData?.map((data) => data?.questions?.map((obj, index) => {
                                            // console.log("obj", obj)
                                            return (
                                                <tr key={index}>
                                                    <td className="rm-sticky-left-1">{index + 1}</td>
                                                    <td className="rm-sticky-left-2"
                                                        title={obj.question}
                                                        onClick={() => handleQuestionClick(obj._id, obj.question)}>{obj.question}</td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.options[0]}>
                                                            {obj.options[0]}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.options[1]}>
                                                            {obj.options[1]}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.options[2]}>
                                                            {obj.options[2]}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.options[3]}>
                                                            {obj.options[3]}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.correctOption}>
                                                            {obj.correctOption}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.responses?.right}>
                                                            {obj.responses?.right}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ellipsis-cell" title={obj.responses?.wrong}>
                                                            {obj.responses?.wrong}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {formatDatePro(obj.uploadedDate)}
                                                    </td>
                                                    <td>
                                                        {data.slotIndex.toUpperCase()}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className='tbl-action-btn'
                                                            onClick={() => handleDeleteQuestion(obj._id, data.slotIndex)}
                                                        >
                                                            <MdDeleteOutline
                                                                style={{
                                                                    width: "14px",
                                                                    height: "14px",
                                                                    color: "#bf0b0b",
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        </button>
                                                        <button className='tbl-action-btn'>
                                                            < MdOutlineEdit
                                                                onClick={() => handleEditQuestion(obj, data.slotIndex)}
                                                                style={{
                                                                    width: "14px",
                                                                    height: "14px",
                                                                    color: "grey",
                                                                    cursor: "pointer",
                                                                }}
                                                            />
                                                        </button>
                                                    </td>
                                                </tr>)
                                        }
                                        ))}

                                    </tbody>
                                )}
                            </table>
                        </div>

                    </div>
                </div>
            </div>

            {/* ===============dialog to select slot====================== */}
            <SlotSelectionDialog
                open={slotDialogOpen}
                onClose={() => setSlotDialogOpen(false)}
                completeData={availableSlots}
                onSelectSlot={(slotId) => {
                    setSelectedSlot(slotId);
                }}
                selectedSlotId={selectedSlot}
                availableSlots={availableSlots}
                setSelectedSlotId={setSelectedSlot}
                fetchAvailableSlots={fetchAvailableSlots}
            />
            {dialogOpen && (
                    <QuestionUploadDialog
                        dialogOpen={dialogOpen}
                        handleDialogToggle={handleDialogToggle}
                        completeData={completeData}
                        editMode={editMode} // Pass editMode
                        setEditMode={setEditMode}
                        selectedQuestionData={selectedQuestionData} // Pass selected question for editing
                        fetchingData={fetchingData}
                    />
                )}
            {/* =============dialog which is shown to employee================= */}
            <EmployeeQuestionModal
            />
            {/* =========================dialog to show employee answered question details===================== */}
            {employeeAnsDialog && (
                <EmployeeAnsweredQuestionDetailsDialog
                employeeAnsDialog={employeeAnsDialog}
                setEmployeeAnsDialog={setEmployeeAnsDialog}
                selectedQuestionFull={selectedQuestionFull}
                employeesAnswered={employeesAnswered || []}
                formatDatePro={formatDatePro}
                 />
            )}
        </div>
    )
}

export default AdminUploadQuestions