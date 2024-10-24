import React, { useState, useCallback, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const TeamLeadsRemarksDialog = ({
    companyName,
    companyId,
    remarksKey,
    isEditable,
    bdmAcceptStatus,
    companyStatus,
    name,
    mainRemarks,
    bdeRemarks,
    bdmRemarks,
    designation,
    refetch,
}) => {

    // console.log("Remarks key :", remarksKey);
    // console.log("BDM Accept Status :", bdmAcceptStatus);
    // console.log("BDE Remarks :", bdeRemarks);
    // console.log("BDM Remarks :", bdmRemarks);

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const [remarksData, setRemarksData] = useState([]);
    const [oldRemarks, setOldRemarks] = useState([]);
    const [newRemarks, setNewRemarks] = useState("");
    const [open, setOpen] = useState(false);

    function formatDateTimeForYesterday(dateInput) {
        const createdAt = new Date(dateInput);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Check if the date is today
        if (createdAt.toDateString() === today.toDateString()) {
            return createdAt.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }); // Time in 12-hour format
        }
        // Check if the date is yesterday
        else if (createdAt.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }
        // If it's older than yesterday, return the date
        else {
            return createdAt.toLocaleDateString();
        }
    }

    const fetchRemarksData = async () => {
        try {
            const res = await axios.get(`${secretKey}/remarks/remarks-history-complete/${companyId}`);
            // console.log("Remarks Data :", res.data);
            setRemarksData(res.data);
        } catch (error) {
            console.error("Error fetching remarks data:", error);
        }
    };

    const fetchOldRemarks = async () => {
        try {
            const res = await axios.get(`${secretKey}/remarks/remarks-history/${companyId}`);
            // console.log("Old Remarks :", res.data);
            setOldRemarks(res.data);
        } catch (error) {
            console.error("Error fetching remarks data:", error);
        }
    };

    const handleOpenModal = () => {
        setOpen(true);
        setNewRemarks("");
        fetchRemarksData();
        fetchOldRemarks();
    };

    const handleCloseModal = () => {
        setOpen(false);
        setRemarksData([]);
    };

    const handleUpdate = async () => {
        if (newRemarks === "") {
            Swal.fire({ title: "Empty Remarks!", icon: "warning" });
            return;
        }
        try {
            const res = await axios.post(`${secretKey}/remarks/update-remarks-bdm/${companyId}`, {
                Remarks: newRemarks,
                remarksBdmName: name,
                currentCompanyName: companyName,
                designation: designation,
                bdmWork: true,
            });
            if (res.status === 200) {
                Swal.fire("Remarks updated!");
                refetch();
                fetchRemarksData();
                handleCloseModal();
                setNewRemarks("");
            } else {
                console.error("Failed to update status:", res.data.message);
            }
        } catch (error) {
            console.error("Error updating status:", error.message);
        }
    };

    const handleDeleteRemarks = async (remarksId, companyId) => {
        // console.log("Company id is ", companyId);
        // console.log("Remark id is ", remarksId);
        try {
            await axios.delete(`${secretKey}/remarks/delete-bdm-remarks/${companyId}?remarksId=${remarksId}`);
            Swal.fire("Remarks Deleted");
            fetchRemarksData();
            refetch();
            handleCloseModal();
        } catch (error) {
            console.error("Error deleting remarks:", error);
        }
    };

    useEffect(() => {
        fetchRemarksData();
        fetchOldRemarks();
    }, [companyName, companyId]);

    const renderTeamLeadsButton = () => {
        if (remarksKey === "remarks" && (bdmAcceptStatus === "Pending" || bdmAcceptStatus === "Accept")) {
            return (
                <button onClick={handleOpenModal} style={{ border: "transparent", background: "none" }}>
                    <MdOutlineRemoveRedEye style={{ width: "14px", height: "14px", color: "#d6a10c", cursor: "pointer" }} />
                </button>
            );
        }

        if (remarksKey === "bdmRemarks" && bdmAcceptStatus === "Accept") {
            return (
                <button onClick={handleOpenModal} style={{ border: "transparent", background: "none" }}>
                    <MdOutlineEdit style={{ width: "12px", height: "12px", color: "rgb(139, 139, 139)" }} />
                </button>
            );
        }
    };

    return (
        <div>
            {renderTeamLeadsButton()}
            <div className={`modal fade ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title text-truncate" title={companyName}>{companyName}'s Remarks</h5>
                            <button type="button" className="close" onClick={handleCloseModal} aria-label="Close" style={{ backgroundColor: "transparent", border: "none" }}>
                                <IoMdClose color="primary" />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="remarks-content">

                                {/* Displaying old remarks from old database */}
                                {oldRemarks.length > 0 && (
                                    oldRemarks.map((historyItem) => {
                                        if (isEditable && historyItem.bdmName === name) {
                                            return (
                                                <div className="col-sm-12" key={historyItem._id}>
                                                    <div className="card RemarkCard position-relative">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="reamrk-card-innerText">
                                                                <pre className="remark-text">{historyItem.bdmRemarks}</pre>
                                                            </div>
                                                            {/* {isEditable && (
                                                                <div className="dlticon">
                                                                    <MdDelete
                                                                        style={{ cursor: "pointer", color: "#f70000", width: "14px" }}
                                                                        onClick={() => handleDeleteRemarks(historyItem._id, historyItem[remarksKey])}
                                                                    />
                                                                </div>
                                                            )} */}
                                                        </div>
                                                        <div className="d-flex card-dateTime justify-content-between">
                                                            <div className="date">
                                                                {historyItem.date}
                                                            </div>
                                                            <div className="date">
                                                                By: {historyItem.bdmName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        if (!isEditable && historyItem.bdeName === name) {
                                            return (
                                                <div className="col-sm-12" key={historyItem._id}>
                                                    <div className="card RemarkCard position-relative">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="reamrk-card-innerText">
                                                                <pre className="remark-text">{historyItem.remarks}</pre>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex card-dateTime justify-content-between">
                                                            <div className="date">
                                                                {historyItem.date}
                                                            </div>
                                                            <div className="date">
                                                                By: {historyItem.bdeName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }

                                    })
                                )}

                                {/* Displaying remarks from new database*/}
                                {remarksData && remarksData.length > 0 &&
                                    remarksData[0]?.remarks?.length > 0 ? (
                                    remarksData[0]?.remarks.slice().map((remark) => {

                                        if (isEditable && remark.employeeName === name) {
                                            return (
                                                <div className="col-sm-12" key={remark._id}>
                                                    <div className="card RemarkCard position-relative">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="reamrk-card-innerText">
                                                                <pre className="remark-text">{remark.bdmRemarks}</pre>
                                                            </div>
                                                            {isEditable && (
                                                                <div className="dlticon">
                                                                    <MdDelete
                                                                        style={{ cursor: "pointer", color: "#f70000", width: "14px" }}
                                                                        onClick={() => handleDeleteRemarks(remark._id, remarksData[0].companyID)}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="d-flex card-dateTime justify-content-between">
                                                            <div className="date">
                                                                {formatDateTimeForYesterday(remark.addedOn)}
                                                            </div>
                                                            <div className="date">
                                                                By: {remark.employeeName} ({remark.designation})
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        // Condition for non-Editable mode:
                                        if (!isEditable && remark.employeeName === name) {
                                            return (
                                                <div className="col-sm-12" key={remark._id}>
                                                    <div className="card RemarkCard position-relative">
                                                        <div className="d-flex justify-content-between">
                                                            <div className="reamrk-card-innerText">
                                                                <pre className="remark-text">{remark.remarks}</pre>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex card-dateTime justify-content-between">
                                                            <div className="date">
                                                                {formatDateTimeForYesterday(remark.addedOn)}
                                                            </div>
                                                            <div className="date">
                                                                By: {remark.employeeName} {remark.designation}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    })
                                ) : (
                                    oldRemarks.length === 0 && remarksData.length === 0 && (
                                        <div className="text-center overflow-hidden">No Remarks History</div>
                                    )
                                )}

                            </div>

                            {isEditable && (
                                <div className="card-footer">
                                    <div className="mb-3 remarks-input">
                                        <textarea placeholder="Add Remarks Here..." className="form-control" id="remarks-input" rows="3"
                                            onChange={(e) => setNewRemarks(e.target.value)}></textarea>
                                    </div>
                                </div>
                            )}
                        </div>

                        {isEditable && (
                            <div className="modal-footer">
                                <button onClick={handleUpdate} type="submit" className="btn btn-primary">
                                    Submit
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamLeadsRemarksDialog;