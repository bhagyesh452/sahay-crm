import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import ClipLoader from "react-spinners/ClipLoader";
import Nodata from "../components/Nodata";

const EmployeeFolowUpCompanies = () => {
  const { ename } = useParams(); // Get the ename from the route
  const location = useLocation();
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Parse the query string to get the filtered data
    const query = new URLSearchParams(location.search);
    const filtered = query.get("filtered");

    console.log("filtered" , filtered)

    if (filtered) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(filtered));
        setFilteredData(parsedData);
        console.log(parsedData)
      } catch (error) {
        console.error("Error parsing filtered data", error);
      }
    }
  }, [location.search]);

  function formatDate(inputDate) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(
        "en-US",
        options
    );
    return formattedDate;
}

  return (
    <div>
           
            <div className='container-xl mt-2'>
                <div className='card'>
                    <div className='card-header employeedashboard'>
                        <div className="d-flex justify-content-between">
                            <div style={{ minWidth: '14vw' }} className="dashboard-title">
                                <h2 style={{ marginBottom: '5px' }}>{ename}  Status Report</h2>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div
                            id="table-default"
                            style={{
                                overflowX: "auto",
                                overflowY: "auto",
                                maxHeight: "60vh",
                            }}
                        >
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

                                        <th>Incorporation Date</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Company Email</th>
                                        <th>Status</th>
                                        <th>Remarks</th>
                                        <th>
                                            Assigned on
                                        </th>
                                    </tr>
                                </thead>

                                
                                    <tbody>
                                        {filteredData.map((company, index) => (
                                            <tr
                                                key={index}
                                                //className="selected"
                                                style={{ border: "1px solid #ddd" }}
                                            >

                                                <td>{index + 1}</td>
                                                <td>{company["Company Name"]}</td>
                                                <td>{company["Company Number"]}</td>
                                                <td>{formatDate(company["Company Incorporation Date  "])}</td>
                                                <td>{company["City"]}</td>
                                                <td>{company["State"]}</td>
                                                <td>{company["Company Email"]}</td>
                                                <td>{company["Status"]}</td>
                                                <td>
                                                    {company["Remarks"]}
                                                </td>
                                                <td>{formatDate(company["AssignDate"])}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                              
                            </table>
                        </div>
                    </div>
                    {filteredData.length === 0 && 
                    // !currenDataLoading &&
                        (
                            <table>
                                <tbody>
                                    <tr>
                                        <td colSpan="10" className="p-2 particular">
                                            <Nodata />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}

                  
                </div>
            </div>
        </div >
  );
};

export default EmployeeFolowUpCompanies;
