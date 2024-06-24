import React from 'react'

function RmDialogToAddServices() {
  return (
    <div>


        {/* -----------------------------------------------dialog box for adding services to rm bookings ------------------------------------------------------ */}
        <Dialog open={open} onClose={closepopup} fullWidth maxWidth="sm">
                <DialogTitle>
                    Create Team
                    <IconButton onClick={closepopup} style={{ float: "right" }}>
                        <CloseIcon color="primary"></CloseIcon>
                    </IconButton>{" "}
                </DialogTitle>
                <DialogContent>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Team Name</label>
                                    <input
                                        type="text"
                                        value={ename}
                                        className="form-control"
                                        name="example-text-input"
                                        placeholder="Your report name"
                                        onChange={(e) => {
                                            setEname(e.target.value);
                                        }}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Branch Office</label>
                                    <div className="form-control">
                                        <select
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                width: "100%",
                                            }}
                                            value={branchOffice}
                                            required
                                            onChange={(e) => {
                                                setBranchOffice(e.target.value);
                                                handleSelectBdm(e.target.value)
                                            }}
                                        >
                                            <option value="" disabled selected>
                                                Select Branch Office
                                            </option>
                                            <option value="Gota">Gota</option>
                                            <option value="Sindhu Bhawan">Sindhu Bhawan</option>
                                        </select>
                                    </div>
                                </div>
                                {openBdmField && <div className="mb-3">
                                    <label className="form-label">BDM Selection</label>
                                    <div className="form-control">
                                        <select
                                            style={{
                                                border: "none",
                                                outline: "none",
                                                width: "100%",
                                            }}
                                            value={designation}
                                            required
                                            onChange={(e) => {
                                                setDesignation(e.target.value);
                                            }}>
                                            <option value="" disabled selected>
                                                Select BDM Name
                                            </option>
                                            {
                                                employeeData && Array.isArray(employeeData) && employeeData
                                                    .filter((employee) => employee.designation === "Sales Manager")
                                                    .map((employee) => (
                                                        <option key={employee._id} value={employee.ename}>{employee.ename}</option>
                                                    ))
                                            }
                                        </select>
                                    </div>
                                </div>}
                                {bdmNameSelected && (
                                    <div key={0} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <label className="form-label">BDE Selection</label>
                                            {
                                                bdeFields.length > 1 && (
                                                    <IconButton>
                                                        <MdDelete
                                                            color="#bf2020"
                                                            style={{ width: "14px", height: "14px" }}
                                                            onClick={() => handleRemoveBdeField(0)}
                                                        />
                                                    </IconButton>

                                                )
                                            }
                                        </div>
                                        <div className="form-control">
                                            <select
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "100%",
                                                }}
                                                value={selectedBdes.length > 0 ? selectedBdes[0] : ""}
                                                onChange={(event) => handleBdeSelect(0, event.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Select BDE Name</option>
                                                {employeeData
                                                    .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice) 
                                                    .map(employee => (
                                                        <option key={employee._id} value={employee.ename} disabled={allEnames.includes(employee.ename)} >
                                                            {employee.ename}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                                {bdeFields.slice(1).map((bdeField, index) => (
                                    <div key={index + 1} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <label className="form-label">BDE Selection</label>
                                            <IconButton>
                                                <MdDelete
                                                    color="#bf2020"
                                                    style={{ width: "14px", height: "14px" }}
                                                    onClick={() => handleRemoveBdeField(index + 1)}
                                                />
                                            </IconButton>
                                        </div>
                                        <div className="form-control">
                                            <select
                                                style={{
                                                    border: "none",
                                                    outline: "none",
                                                    width: "100%",
                                                }}
                                                value={selectedBdes[index + 1] || ''}
                                                onChange={(event) => handleBdeSelect(index + 1, event.target.value)}
                                                required
                                            >
                                                <option value="" disabled>Select BDE Name</option>
                                                {employeeData
                                                    .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice)
                                                    .map(employee => (
                                                        <option key={employee._id} value={employee.ename} disabled={selectedBdes.includes(employee.ename) || allEnames.includes(employee.ename)}>
                                                            {employee.ename}
                                                        </option>
                                                    ))}
                                                {/* {employeeData
                                                    .filter(employee => employee.designation === 'Sales Executive' && employee.branchOffice === branchOffice && !allEnames.includes(employee.ename))
                                                    .map(employee => {
                                                        console.log('allEnames:', allEnames);
                                                        console.log('employee.ename:', employee.ename);
                                                        console.log('Is in allEnames:', allEnames.includes(employee.ename));

                                                        return (
                                                            <option
                                                                key={employee._id}
                                                                value={employee.ename}
                                                                disabled={selectedBdes.includes(employee.ename)}>
                                                                {employee.ename}
                                                            </option>
                                                        );
                                                    })} */}
                                            </select>
                                        </div>
                                    </div>
                                ))}
                                <IconButton style={{ float: "right" }}>
                                    <MdOutlineAddCircle
                                        color="primary" style={{ float: "right", width: "14px", height: "14px" }}
                                        onClick={handleAddBdeField}></MdOutlineAddCircle>
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <Button variant="contained" style={{ backgroundColor: "#fbb900" }} onClick={handleSubmit}>
                    Submit
                </Button>
            </Dialog>
    </div>
  )
}

export default RmDialogToAddServices