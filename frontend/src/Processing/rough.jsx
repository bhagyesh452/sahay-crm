import React, { useState, useEffect } from "react";
import Navbar_processing from "./Navbar_processing";
import Header_processing from "./Header_processing";
import CompanyList from "./CompanyList";
import CompanyDetails from "./CompanyDetails";

function Dashboard_processing() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Fetch company names from the backend API
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/companies");
      const data = await response.json();
      console.log("Fetched companies:", data); // Log the fetched data
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const handleCompanyClick = (companyId) => {
    setSelectedCompanyId(companyId);
  };

  return (
    <div>
      <Header_processing />
      <Navbar_processing />
      <div className="container-xl">
        <div className="row">
          <div className="col-md-4">
            <CompanyList companies={companies} onCompanyClick={handleCompanyClick} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard_processing;
