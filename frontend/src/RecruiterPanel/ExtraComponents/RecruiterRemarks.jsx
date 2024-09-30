import React, { useState, useCallback } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
  FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import DeleteIcon from "@mui/icons-material/Delete";

import { FaPencilAlt } from "react-icons/fa";

const RecruiterRemarks = ({
  empName,
  empEmail,
  historyRemarks,
  refreshData,
  mainStatus,
}) => {
  //const [charges, setCharges] = useState(dscPhoneNo);
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const [openEmailPopup, setOpenEmailPopup] = useState(false);
  const [openRemarksPopUp, setOpenRemarksPopUp] = useState(false);
  const [error, setError] = useState("");
  const [changeRemarks, setChangeRemarks] = useState("");
  const [remarksHistory, setRemarksHistory] = useState([]);

  const functionCloseRemarksPopup = () => {
    setChangeRemarks("");
    setError("");
    setOpenRemarksPopUp(false);
  };
  const debouncedSetChangeRemarks = useCallback(
    debounce((value) => {
      setChangeRemarks(value);
    }, 300), // Adjust the debounce delay as needed (e.g., 300 milliseconds)
    [] // Empty dependency array to ensure the function is memoized
  );

  const handleSubmitRemarks = async () => {
    //console.log("changeremarks", changeRemarks)
    try {
      if (changeRemarks) {
        const response = await axios.post(
          `${secretKey}/recruiter/post-remarks-for-recruiter`,
          {
            empName,
            empEmail,
            changeRemarks,
            updatedOn: new Date(),
          }
        );

        //console.log("response", response.data);

        if (response.status === 200) {
          refreshData();
          functionCloseRemarksPopup();
          // Swal.fire(
          //     'Remarks Added!',
          //     'The remarks have been successfully added.',
          //     'success'
          // );
        }
      } else {
        setError("Remarks Cannot Be Empty!");
      }
    } catch (error) {
      console.log("Error Submitting Remarks", error.message);
    }
  };

  const handleDeleteRemarks = async (remarks_id) => {
    try {
      const response = await axios.delete(
        `${secretKey}/recruiter/delete-remark-recruiter`,
        {
          data: {
            remarks_id,
            empName: empName,
            empEmail: empEmail,
          },
        }
      );
      if (response.status === 200) {
        refreshData();
        functionCloseRemarksPopup();
      }
      // Refresh the list
    } catch (error) {
      console.error("Error deleting remark:", error);
    }
  };

  return (
    <div>
      <div className={"d-flex align-items-center justify-content-between"}>
        <div
          className="My_Text_Wrap"
          title={
            historyRemarks && historyRemarks.length > 0
              ? historyRemarks.sort(
                  (a, b) => new Date(b.updatedOn) - new Date(a.updatedOn)
                )[0].remarks
              : "No Remarks"
          }
        >
          {historyRemarks && historyRemarks.length > 0
            ? historyRemarks.sort(
                (a, b) => new Date(b.updatedOn) - new Date(a.updatedOn)
              )[0].remarks
            : "No Remarks"}
        </div>
        <button
          className="td_add_remarks_btn ml-1"
          onClick={() => {
            setOpenRemarksPopUp(true);
          }}
        >
          <FaPencilAlt />
        </button>
      </div>

      <Dialog
        className="My_Mat_Dialog"
        open={openRemarksPopUp}
        onClose={functionCloseRemarksPopup}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <span style={{ fontSize: "14px" }}>{empName}'s Remarks</span>
          <IconButton
            onClick={functionCloseRemarksPopup}
            style={{ float: "right" }}
          >
            <CloseIcon color="primary"></CloseIcon>
          </IconButton>{" "}
        </DialogTitle>
        <DialogContent>
          <div className="remarks-content">
            {historyRemarks.length !== 0 &&
              historyRemarks.slice().map((historyItem) => (
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
                      <div className="date">
                        {new Date(historyItem.updatedOn).toLocaleDateString(
                          "en-GB"
                        )}
                      </div>
                      <div className="time">
                        {new Date(historyItem.updatedOn).toLocaleTimeString(
                          "en-GB",
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {remarksHistory && remarksHistory.length === 0 && (
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
                {error && <FormHelperText error>{error}</FormHelperText>}
              </div>
            )}
          </div>
        </DialogContent>
        <button
          onClick={handleSubmitRemarks}
          type="submit"
          className="btn btn-primary bdr-radius-none"
          style={{ width: "100%" }}
        >
          Submit
        </button>
      </Dialog>
    </div>
  );
};

export default RecruiterRemarks;
