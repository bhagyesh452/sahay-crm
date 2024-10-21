import React from 'react'
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IoMdClose } from "react-icons/io";
function ForwardToBdmDialog({
    openAssignToBdm,
    handleCloseForwardBdmPopup,
    handleForwardDataToBDM,
    setBdmName,
    bdmName,
    newempData,
    id,
    branchName
}) {
    return (
        <div>
            <Dialog
                open={openAssignToBdm}
                onClose={handleCloseForwardBdmPopup}
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    Forward to BDM{" "}
                    <button onClick={handleCloseForwardBdmPopup} style={{ float: "right",backgroundColor:"transparent",border:"none" }}>
                        <IoMdClose color="primary" />
                    </button>{" "}
                </DialogTitle>
                <DialogContent>
                    <div>
                        {newempData.length !== 0 ? (
                            <>
                                <div className="dialogAssign">
                                    <label>Forward to BDM</label>
                                    <div className="form-control">
                                        <select
                                            style={{
                                                width: "inherit",
                                                border: "none",
                                                outline: "none",
                                            }}
                                            value={bdmName}
                                            onChange={(e) => setBdmName(e.target.value)}
                                        >
                                            <option value="Not Alloted" disabled>
                                                Select a BDM
                                            </option>
                                            {newempData.filter((item) =>
                                                (item._id !== id && item.bdmWork || item.designation === "Sales Manager") && item.branchOffice === branchName
                                            ).map((item) => (
                                                <option value={item.ename}>{item.ename}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h1>No Employees Found</h1>
                            </div>
                        )}
                    </div>
                </DialogContent>
                <button onClick={() => handleForwardDataToBDM(bdmName)} className="btn btn-primary">
                    Submit
                </button>
            </Dialog>
        </div>
    )
}

export default ForwardToBdmDialog