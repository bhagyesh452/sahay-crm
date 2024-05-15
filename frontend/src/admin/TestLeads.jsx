import React,{useState , useEffect} from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';
import { IconChevronLeft } from "@tabler/icons-react";
import debounce from 'lodash/debounce';
import { IconChevronRight } from "@tabler/icons-react";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
  } from "@mui/material";




function TestLeads() {
    const [currentDataLoading, setCurrentDataLoading] = useState(false)
    const [data, setData] = useState([])
    const [mainData, setmainData] = useState([])
    const [dataStatus, setDataStatus] = useState("")
    const [currentPage, setCurrentPage] = useState(0);
    
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const fetchData = async () => {
        try {
          // Set isLoading to true while fetching data
          //setIsLoading(true);
          setCurrentDataLoading(true)
    
          const response = await axios.get(`${secretKey}/leads`);
    
          // Set the retrieved data in the state
          setData(response.data.reverse());
          setmainData(response.data.filter((item) => item.ename === "Not Alloted"));
          setDataStatus("Unassigned")
    
          // Set isLoading back to false after data is fetched
          //setIsLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error.message);
          // Set isLoading back to false if an error occurs
          //setIsLoading(false);
        } finally {
          setCurrentDataLoading(false)
        }
      };

useEffect(()=>{
    fetchData()
})
const itemsPerPage = 500;
const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = mainData.slice(startIndex, endIndex);

    function formatDateFinal(timestamp) {
        const date = new Date(timestamp);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // January is 0
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
  return (
    <div>
        
        <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #ddd",
                    }}
                    className="table-vcenter table-nowrap "
                  >
                    <thead>
                      <tr className="tr-sticky">
                        <th>Sr.No</th>
                        <th>Company Name</th>
                        <th>Company Number</th>

                        <th>
                          Incorporation Date
                        </th>
                        <th>City</th>
                        <th>State</th>
                        <th>Company Email</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {currentDataLoading ? (
                      <tbody>
                        <tr>
                          <td colSpan="13" className="LoaderTDSatyle">
                            <ClipLoader
                              color="lightgrey"
                              loading
                              size={30}
                              aria-label="Loading Spinner"
                              data-testid="loader"
                            />
                          </td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody>
                        {currentData.map((company, index) => (
                          <tr
                            key={index}
                            style={{ border: "1px solid #ddd" }}
                          >
                            <td>{startIndex + index + 1}</td>
                            <td>{company["Company Name"]}</td>
                            <td>{company["Company Number"]}</td>
                            <td>{formatDateFinal(company["Company Incorporation Date  "])}</td>
                            <td>{company["City"]}</td>
                            <td>{company["State"]}</td>
                            <td>{company["Company Email"]}</td>
                            <td>{company["Status"]}</td>
                            <td>{formatDateFinal(company["AssignDate"])}</td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                  {currentData.length !== 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "10px",
                  }}
                  className="pagination"
                >
                  <IconButton
                    onClick={() =>
                      setCurrentPage((prevPage) => Math.max(prevPage - 1, 0))
                    }
                    disabled={currentPage === 0}
                  >
                    <IconChevronLeft />
                  </IconButton>
                  <span>
                    Page {currentPage + 1} of{" "}
                    {Math.ceil(mainData.length / itemsPerPage)}
                  </span>

                  <IconButton
                    onClick={() =>
                      setCurrentPage((prevPage) =>
                        Math.min(
                          prevPage + 1,
                          Math.ceil(mainData.length / itemsPerPage) - 1
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(mainData.length / itemsPerPage) - 1
                    }
                  >
                    <IconChevronRight />
                  </IconButton>
                </div>
              )}
    </div>
  )
}

export default TestLeads