
import React, { useState, useCallback } from "react";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import axios from "axios";
import { MdOutlineEdit } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

const RemarksDialogTeamLeads = ({
  currentCompanyName,
  companyId, // Pass the companyID
  remarksKey, // Key to determine the type of remarks ("remarks" or "bdmRemarks")
  isEditable, // Flag to enable or disable editing for remarks
  bdmAcceptStatus,
  companyStatus,
  secretKey,
  bdeName,
  mainRemarks,
  refetch,
  designation,
  bdmName
}) => {
  const [open, setOpen] = useState(false);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const [changeRemarks, setChangeRemarks] = useState(mainRemarks);

  const debouncedSetChangeRemarks = useCallback(
    debounce((value) => setChangeRemarks(value), 300),
    []
  );

  // Fetch remarks history for the specific company
  const fetchRemarksHistory = async () => {
    try {
      const response = await axios.get(`${secretKey}/remarks/remarks-history-complete/${companyId}`);
      setFilteredRemarks(response.data);
    } catch (error) {
      console.error("Error fetching remarks history:", error);
    }
  };

  // Function to open the modal and fetch remarks
  const handleOpenModal = async () => {
    await fetchRemarksHistory(); // Fetch remarks for the specific company
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setFilteredRemarks([]);
  };

  const handleUpdate = async () => {
    const Remarks = changeRemarks;
    if (Remarks === "") {
      Swal.fire({ title: "Empty Remarks!", icon: "warning" });
      return true;
    }
    try {
      const response = await axios.post(`${secretKey}/remarks/update-remarks/${companyId}`, {
        Remarks,
        bdeName,
        currentCompanyName,
        designation
      });
      // await axios.post(`${secretKey}/remarks/remarks-history/${companyId}`, {
      //   Remarks,
      //   bdeName,
      //   currentCompanyName
      // });

      if (response.status === 200) {
        Swal.fire("Remarks updated!");
        refetch();
        fetchRemarksHistory();
        handleCloseModal();
      } else {
        console.error("Failed to update status:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const handleDeleteRemarks = async (remarksId, remarksValue) => {
    const mainRemarks = remarksValue === changeRemarks;
    try {
      await axios.delete(`${secretKey}/remarks/remarks-history/${remarksId}`);
      if (mainRemarks) {
        await axios.delete(`${secretKey}/remarks/remarks-delete/${companyId}`);
      }
      Swal.fire("Remarks Deleted");
      fetchRemarksHistory();
      refetch();
      handleCloseModal();
    } catch (error) {
      console.error("Error deleting remarks:", error);
    }
  };

  // Render button based on bdmAcceptStatus and company status
  const renderButton = () => {
    if (
      (remarksKey !== "bdmRemarks") && (bdmAcceptStatus !== "Accept" ||
        ["Matured", "Not Interested", "Busy", "Not Picked Up", "Junk"].includes(companyStatus))
    ) {
      return (
        <button
          onClick={handleOpenModal}
          style={{ border: "transparent", background: "none" }}
        >
          <MdOutlineEdit
            style={{ width: "12px", height: "12px", color: "rgb(139, 139, 139)" }}
          />
        </button>
      );
    }

    if (
      (remarksKey === "bdmRemarks") || (bdmAcceptStatus === "Accept" &&
        !["Matured", "Not Interested", "Busy", "Not Picked Up", "Junk"].includes(companyStatus))
    ) {
      return (
        <button
          onClick={handleOpenModal}
          style={{ border: "transparent", background: "none" }}
        >
          <MdOutlineRemoveRedEye
            style={{
              width: "14px",
              height: "14px",
              color: "#d6a10c",
              cursor: "pointer",
            }}
          />
        </button>
      );
    }

    return null;
  };

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

  return (
    <div>
      {/* Conditionally rendered button based on the status */}
      {renderButton()}

      {/* Bootstrap Modal */}
      <div className={`modal fade ${open ? 'show' : ''}`} style={{ display: open ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-truncate" title={currentCompanyName}>{currentCompanyName}'s Remarks</h5>
              <button type="button" className="close" onClick={handleCloseModal} aria-label="Close" style={{ backgroundColor: "transparent", border: "none" }}>
                <IoMdClose color="primary" />
              </button>
            </div>
            <div className="modal-body">
              <div className="remarks-content">
                {filteredRemarks[0]?.remarks?.length > 0 ||
                  filteredRemarks[0]?.serviceWiseRemarks?.length > 0 ? (
                  filteredRemarks[0]?.remarks.slice().map((historyItem) => {
                    if (isEditable && historyItem.bdeName === bdeName) {
                      return (
                        <div className="col-sm-12" key={historyItem._id}>
                          <div className="card RemarkCard position-relative">
                            <div className="d-flex justify-content-between">
                              <div className="reamrk-card-innerText">
                                <pre className="remark-text">{historyItem[remarksKey]}</pre>
                              </div>
                              {isEditable && (
                                <div className="dlticon">
                                  <MdDelete
                                    style={{ cursor: "pointer", color: "#f70000", width: "14px" }}
                                    onClick={() => handleDeleteRemarks(historyItem._id, historyItem[remarksKey])}
                                  />
                                </div>
                              )}
                            </div>
                            <div className="d-flex card-dateTime justify-content-between">
                              <div className="date">
                                {formatDateTimeForYesterday(historyItem.addedOn)}
                              </div>
                              <div className="date">
                                By: {historyItem.employeeName} ({historyItem.designation})
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    // Condition for non-Editable mode: bdmName should match
                    if (!isEditable && historyItem.bdmName === bdmName) {
                      return (
                        <div className="col-sm-12" key={historyItem._id}>
                          <div className="card RemarkCard position-relative">
                            <div className="d-flex justify-content-between">
                              <div className="reamrk-card-innerText">
                                <pre className="remark-text">{historyItem[remarksKey]}</pre>
                              </div>
                            </div>
                            <div className="d-flex card-dateTime justify-content-between">
                              <div className="date">
                                {formatDateTimeForYesterday(historyItem.addedOn)}
                              </div>
                              <div className="date">
                                By: {historyItem.employeeName} ({historyItem.designation})
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    } 
                  })
                ) : (
                  <div className="text-center overflow-hidden">No Remarks History</div>
                )}
              </div>

              {isEditable && (
                <div className="card-footer">
                  <div className="mb-3 remarks-input">
                    <textarea
                      placeholder="Add Remarks Here..."
                      className="form-control"
                      id="remarks-input"
                      rows="3"
                      onChange={(e) => {
                        debouncedSetChangeRemarks(e.target.value);
                        console.log("New remark input:", e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
            {isEditable && (
              <div className="modal-footer">
                <button
                  onClick={handleUpdate}
                  type="submit"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemarksDialogTeamLeads;

