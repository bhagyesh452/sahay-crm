import React from 'react';
import { Drawer, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import { options } from "../../components/Options.js";


function ProjectionDialog({
    openProjection,
    closeProjection,
    projectingCompany,
    projectionData,
    isEditProjection,
    setIsEditProjection,
    handleDelete,
    currentProjection,
    setCurrentProjection,
    handleProjectionSubmit,
    selectedValues,
    setSelectedValues

}) {

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };
    return (
        <div>
            <Button onClick={toggleDrawer(true)}>Open drawer</Button>
            <Drawer
                style={{ top: "50px" }}
                anchor="right" 
                open={open} 
                onClose={toggleDrawer(false)}
                >
                <div style={{ width: "31em" }}>
                    <h3>Project Details</h3>
                </div>
            </Drawer>
        </div>
    )
}

export default ProjectionDialog