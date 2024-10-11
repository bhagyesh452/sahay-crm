import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogTitle , IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import IconEye from "@mui/icons-material/Visibility"; // This is the 'View' icon in MUI
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import debounce from "lodash/debounce";
import axios from "axios";

const RemarksDialog = ({
  currentCompanyName,
  remarksHistory, // Remarks history data
  companyId, // Pass the companyID
  remarksKey, // Key to determine the type of remarks ("remarks" or "bdmRemarks")
  isEditable, // Flag to enable or disable editing for remarks
  handleUpdateRemarksHistory, // Function to refresh remarks history after updates
  bdmAcceptStatus,
  companyStatus,
  secretKey,
  fetchRemarksHistory,
  bdeName,
  fetchNewData,
  bdmName,
  mainRemarks

}) => {
  const [open, setOpen] = useState(false);
  const [filteredRemarks, setFilteredRemarks] = useState([]);
  const [changeRemarks, setChangeRemarks] = useState(mainRemarks);
  const [cid, setcid] = useState("");
  const [updateData, setUpdateData] = useState({});
  const [openRemarks, openchangeRemarks] = useState(false);


  const debouncedSetChangeRemarks = useCallback(
    debounce((value) => setChangeRemarks(value), 300),
    []
  );
  const closepopupRemarks = () => {
    openchangeRemarks(false);
    setFilteredRemarks([]);
};

  // Function to open the dialog and filter remarks
  const handleOpenDialog = () => {
    let filtered;
    if(remarksKey === "bdmRemarks"){
    filtered = remarksHistory.filter(
      (obj) => obj.companyID === companyId && obj.bdmName === bdmName
    );
}else{
    filtered = remarksHistory.filter(
        (obj) => obj.companyID === companyId && obj.bdeName === bdeName
      );
}
    // console.log("filteredfiltered", filtered , companyId);
    setFilteredRemarks(filtered);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFilteredRemarks([]);
  };
  const handleUpdate = async () => {
    // Now you have the updated Status and Remarks, perform the update logic
    console.log(companyId);
    const Remarks = changeRemarks;
    if (Remarks === "") {
        Swal.fire({ title: "Empty Remarks!", icon: "warning" });
        return true;
    }
    try {
        // Make an API call to update the employee status in the database
        const response = await axios.post(`${secretKey}/remarks/update-remarks/${companyId}`, {
            Remarks,
        });
        const response2 = await axios.post(
            `${secretKey}/remarks/remarks-history/${companyId}`,
            {
                Remarks,
                bdeName,
                currentCompanyName
            }
        );

        // Check if the API call was successful
        if (response.status === 200) {
            Swal.fire("Remarks updated!");
            // setChangeRemarks("");
            fetchNewData(companyStatus);
            fetchRemarksHistory();
            handleCloseDialog();
            closepopupRemarks(); // Assuming fetchData is a function to fetch updated employee data
        } else {
            // Handle the case where the API call was not successful
            console.error("Failed to update status:", response.data.message);
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

    // After updating, you can disable the button
};

const handleDeleteRemarks = async (remarksId, remarksValue) => {
    const mainRemarks = remarksValue === changeRemarks;
    try {
      await axios.delete(`${secretKey}/remarks/remarks-history/${remarksId}`);
      if (mainRemarks) {
        const response = await axios.delete(`${secretKey}/remarks/remarks-delete/${companyId}`);
        console.log("response" , response)
      }
      Swal.fire("Remarks Deleted");
      fetchRemarksHistory();
      fetchNewData(companyStatus);
      handleCloseDialog();
    } catch (error) {
      console.error("Error deleting remarks:", error);
    }
  };

  // Render button based on bdmAcceptStatus and company status
  const renderButton = () => {
    if (
      bdmAcceptStatus !== "Accept" ||
      ["Matured", "Not Interested", "Busy", "Not Picked Up", "Junk"].includes(
        companyStatus
      )
    ) {
      return (
        <IconButton
          onClick={handleOpenDialog}
        >
          <EditIcon
            style={{ width: "12px", height: "12px", color: "rgb(139, 139, 139)" }}
          />
        </IconButton>
      );
    }

    if (
      bdmAcceptStatus === "Accept" &&
      !["Matured", "Not Interested", "Busy", "Not Picked Up", "Junk"].includes(
        companyStatus
      )
    ) {
      return (
        <IconButton
          onClick={handleOpenDialog}
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
      );
    }

    return null;
  };

  return (
    <div>
      {/* Conditionally rendered button based on the status */}
      {renderButton()}

      <Dialog className="My_Mat_Dialog" open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>{currentCompanyName}'s Remarks</span>
          <button onClick={handleCloseDialog} style={{ border: "transparent", background: "none" ,float: "right" }}>
            <CloseIcon color="primary" />
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {filteredRemarks.length !== 0 ? (
              filteredRemarks.map((historyItem) => (
                <div className="col-sm-12" key={historyItem._id}>
                  <div className="card RemarkCard position-relative">
                    <div className="d-flex justify-content-between">
                      <div className="reamrk-card-innerText">
                        <pre className="remark-text">{historyItem[remarksKey]}</pre>
                      </div>
                      {isEditable && (
                        <div className="dlticon">
                          <DeleteIcon
                            style={{ cursor: "pointer", color: "#f70000", width: "14px" }}
                            onClick={() => handleDeleteRemarks(historyItem._id, historyItem[remarksKey])}
                          />
                        </div>
                      )}
                    </div>
                    <div className="d-flex card-dateTime justify-content-between">
                      <div className="date">{historyItem.date}</div>
                      <div className="time">{historyItem.time}</div>
                    </div>
                  </div>
                </div>
              ))
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
                    debouncedSetChangeRemarks(e.target.value)
                    console.log("New remark input:", e.target.value); // Debugging: Log the new value
                  }}
                ></textarea>
              </div>
            </div>
          )}
        </DialogContent>

        {isEditable && (
          <button
            onClick={handleUpdate}
            type="submit"
            className="btn btn-primary bdr-radius-none"
            style={{ width: "100%" }}
          >
            Submit
          </button>
        )}
      </Dialog>
    </div>
  );
};

export default RemarksDialog;
