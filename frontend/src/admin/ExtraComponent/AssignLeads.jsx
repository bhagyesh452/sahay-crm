import React from 'react';
import { IconButton, Dialog, DialogContent, DialogTitle } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
function AssignLeads({
    openAssign,
    closepopupAssign,
    selectedOption,
    setSelectedOption,
    newemployeeSelection,
    setnewEmployeeSelection,
    handleOptionChange,
    handleUploadData,
    newempData,
}) {
    return (
        <div>
            <Dialog
                open={openAssign}
                onClose={closepopupAssign}
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    Change BDE
                    <IconButton onClick={closepopupAssign} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="maincon">
                        <div className="con2 d-flex">
                            <div
                                style={
                                    selectedOption === "direct"
                                        ? {
                                            backgroundColor: "#e9eae9",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                        }
                                        : {
                                            backgroundColor: "white",
                                            margin: "10px 10px 0px 0px",
                                            cursor: "pointer",
                                        }
                                }
                                onClick={() => {
                                    setSelectedOption("direct");
                                }}
                                className="direct form-control"
                            >
                                <input
                                    type="radio"
                                    id="direct"
                                    value="direct"
                                    style={{
                                        display: "none",
                                    }}
                                    checked={selectedOption === "direct"}
                                    onChange={handleOptionChange}
                                />
                                <label htmlFor="direct">Move In General Data</label>
                            </div>
                            <div
                                style={
                                    selectedOption === "extractedData"
                                        ? {
                                            backgroundColor: "#e9eae9",
                                            margin: "10px 9px 0px 0px",
                                            cursor: "pointer",
                                        }
                                        : {
                                            backgroundColor: "white",
                                            margin: "10px 9px 0px 0px",
                                            cursor: "pointer",
                                        }
                                }
                                className="extractedData form-control"
                                onClick={() => {
                                    setSelectedOption("extractedData");
                                }}>
                                <input
                                    type="radio"
                                    id="extractedData"
                                    value="extractedData"
                                    style={{
                                        display: "none",
                                    }}
                                    checked={selectedOption === "extractedData"}
                                    onChange={(e) => {
                                        handleOptionChange(e);
                                        setnewEmployeeSelection("Extracted");
                                    }}
                                />
                                <label htmlFor="extractedData">Extracted Data</label>
                            </div>
                            <div
                                style={
                                    selectedOption === "someoneElse"
                                        ? {
                                            backgroundColor: "#e9eae9",
                                            margin: "10px 0px 0px 0px",
                                            cursor: "pointer",
                                        }
                                        : {
                                            backgroundColor: "white",
                                            margin: "10px 0px 0px 0px",
                                            cursor: "pointer",
                                        }
                                }
                                className="indirect form-control"
                                onClick={() => {
                                    setSelectedOption("someoneElse");
                                }}
                            >
                                <input
                                    type="radio"
                                    id="someoneElse"
                                    value="someoneElse"
                                    style={{
                                        display: "none",
                                    }}
                                    checked={selectedOption === "someoneElse"}
                                    onChange={handleOptionChange}
                                />
                                <label htmlFor="someoneElse">Assign to Employee</label>
                            </div>
                        </div>
                    </div>
                    {selectedOption === "someoneElse" && (
                        <div>
                            {newempData.length !== 0 ? (
                                <>
                                    <div className="dialogAssign">
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                margin: " 10px 0px 0px 0px",
                                            }}
                                            className="selector"
                                        >
                                            <label>Select an Employee</label>
                                            <div className="form-control">
                                                <select
                                                    style={{
                                                        width: "inherit",
                                                        border: "none",
                                                        outline: "none",
                                                    }}
                                                    value={newemployeeSelection}
                                                    onChange={(e) => {
                                                        setnewEmployeeSelection(e.target.value);
                                                    }}
                                                >
                                                    <option value="Not Alloted" disabled>
                                                        Select employee
                                                    </option>
                                                    {newempData.map((item) => (
                                                        <option value={item.ename}>{item.ename}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <h1>No Employees Found</h1>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
                <button onClick={handleUploadData} className="btn btn-primary">
                    Submit
                </button>
            </Dialog>
        </div>
    )
}

export default AssignLeads