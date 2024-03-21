import React , {useState , useEffect}from 'react'
import { Drawer, IconButton } from "@mui/material";
import Swal from "sweetalert2";
import EditIcon from "@mui/icons-material/Edit";
import { IoClose } from "react-icons/io5";
import Select from "react-select";
import axios from 'axios';
import { options } from "../components/Options.js";
import { RiEditCircleFill } from "react-icons/ri";
import { set } from 'date-fns';

function DrawerComponent({ open , onClose , currentProjection1}) {
    const [openProjection, setOpenProjection] = useState(false);
    const [projectingCompany, setProjectingCompany] = useState("");
    const [currentProjection, setCurrentProjection] = useState({
        companyName: "",
        ename: "",
        offeredPrize: 0,
        offeredServices: [],
        lastFollowUpdate: "",
        estPaymentDate: "",
        date: "",
        time: "",
      });
      const [isEditProjection, setIsEditProjection] = useState(false);
      const [selectedValues, setSelectedValues] = useState([]);
      const [data, setData] = useState([]);
      //const [followData, setFollowData] = useState([]);


console.log("yahan bhi kuch likho" , currentProjection1)

console.log(currentProjection1.offeredServices)

      const secretKey = process.env.REACT_APP_SECRET_KEY;

      useEffect(()=>{
        setCurrentProjection({
          companyName: currentProjection1.companyName,
          ename: currentProjection1.ename,
          offeredPrize: currentProjection1.offeredPrize,
          offeredServices: currentProjection1.offeredServices,          
          lastFollowUpdate:currentProjection1.lastFollowUpdate,
          estPaymentDate: currentProjection1.estPaymentDate,
          totalPayment: currentProjection1.totalPayment,
          remarks:currentProjection1.remarks,
          date: "",
          time: "",
        })

      }, [currentProjection1])

  
    const closeProjection = () => {
        setOpenProjection(false);
        setProjectingCompany("");
        setCurrentProjection({
          companyName: "",
          ename: "",
          offeredPrize: "",
          offeredServices: "",
          lastFollowUpdate: "",
          date: "",
          time: "",
        });
        setIsEditProjection(false);
        setSelectedValues([]);
      };
    
      const handleProjectionSubmit = async () => {
        try {
          const finalData = {
            ...currentProjection,
            companyName: projectingCompany,
            ename: data.ename,
            offeredServices: selectedValues,
          };
          if (finalData.offeredServices.length === 0) {
            Swal.fire({ title: "Services is required!", icon: "warning" });
          } else if (finalData.remarks === "") {
            Swal.fire({ title: "Remarks is required!", icon: "warning" });
          } else if (finalData.totalPayment === 0) {
            Swal.fire({ title: "Payment is required!", icon: "warning" });
          } else if (finalData.offeredPrize === 0) {
            Swal.fire({ title: "Offered Prize is required!", icon: "warning" });
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
          }
    
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
          });
        
    
          // Log success message
        } catch (error) {
          console.error("Error updating or adding data:", error.message);
        }
      };

      const handleDelete = async (company) => {
        const companyName = company;
        //console.log(companyName);
    
        try {
          // Send a DELETE request to the backend API endpoint
          const response = await axios.delete(`${secretKey}/delete-followup/${companyName}`);
          console.log(response.data.message); // Log the response message
          // Show a success message after successful deletion
          console.log('Deleted!', 'Your data has been deleted.', 'success');
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
        
        } catch (error) {
          console.error('Error deleting data:', error);
          // Show an error message if deletion fails
          console.log('Error!', 'Follow Up Not Found.', 'error');
        }
      };
      //console.log("projections", currentProjection);
    

  return (
    <div>
        <Drawer
          style={{ top: "50px" }}
          anchor="right"
          open={open}
          onClose={onClose}>
          <div style={{ width: "31em" }} className="container-xl">
            <div className="d-flex justify-content-between align-items-center" style={{ margin: "10px 0px" }}>
              <h1 style={{ marginBottom: "0px", fontSize: "20px", }} className="title">
                Projection Form
              </h1>
              <div>
                <IconButton onClick={() => {
                  setIsEditProjection(true);
                }}>
                  <EditIcon color="grey" style={{ width: "17px", height: "17px" }}></EditIcon>
                </IconButton>
                <IconButton>
                  <IoClose onClick={closeProjection} style={{ width: "17px", height: "17px" }} />
                </IconButton>
              </div>
            </div>
            <hr style={{ margin: "0px" }} />
            <div className="body-projection">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1
                    title={currentProjection1.companyName} style={{
                      fontSize: "14px",
                      textShadow: "none",
                      fontWeight: "400",
                      fontFamily: "Poppins, sans-serif",
                      margin: "10px 0px",
                      width: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>
                    {currentProjection1.companyName}
                  </h1>
                </div>
                <div>
                  <button
                    onClick={() => handleDelete(projectingCompany)}
                    className="btn btn-link" style={{ color: "grey" }}
                  >
                    Clear Form
                  </button>
                </div>

              </div>
              <div className="label">
                <strong>Offered Services :</strong>
                <div className="services mb-3">
                  <Select
                    // styles={{
                    //   customStyles,
                    //   container: (provided) => ({
                    //     border: "1px solid #ffb900",
                    //     borderRadius: "5px",
                    //   }),
                    // }}
                    isMulti
                    options={options}
                    placeholder="Select Services..."
                    isDisabled={!isEditProjection}
                    onChange={(selectedOptions) => {
                      setCurrentProjection(
                        currentProjection1.offeredServices.map((option) => option.value)
                      );
                    }}
                    value={currentProjection1.offeredServices.map((value) => ({
                      value,
                      label: value,
                    }))}
                  />
                </div>
              </div>
              <div className="label">
                <strong>Offered Prices (With GST)</strong>
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
                  />
                </div>
              </div>
              <div className="label">
                <strong>Expected Price (With GST)</strong>
                <div className="services mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Please enter total Payment"
                    value={currentProjection.totalPayment}
                    onChange={(e) => {
                      setCurrentProjection((prevLeadData) => ({
                        ...prevLeadData,
                        totalPayment: e.target.value,
                      }));
                    }}
                    disabled={!isEditProjection}
                  />
                </div>
              </div>
              <div className="label">
                <strong>Last Follow Up Date: </strong>
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
                <strong>Payment Expected on :</strong>
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
                <strong>Remarks :</strong>
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
                  style={{ width: "100%" }}
                  type="submit"
                  class="btn btn-primary mb-3"
                  onClick={handleProjectionSubmit}
                  disabled={!isEditProjection}
                >
                  Submit New Drawer
                </button>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
  )
}

export default DrawerComponent