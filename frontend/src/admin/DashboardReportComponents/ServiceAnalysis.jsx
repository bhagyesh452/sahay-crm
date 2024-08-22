import React from 'react';

function ServiceAnalysis() {
  return (
    <div className="card">
      <div className="card-header p-1 employeedashboard d-flex align-items-center justify-content-between">
        <div className="dashboard-title pl-1"  >
          <h2 className="m-0">
            Service Analysis
          </h2>
        </div>
        <div className="d-flex align-items-center pr-1">
          <div className="filter-booking mr-1 d-flex align-items-center">
            <div className="filter-title mr-1">
              <h2 className="m-0">Filter Branch :</h2>
            </div>
            <div className="filter-main">
              <select
                className="form-select"
                id={`branch-filter`}
                onChange={(e) => {
                //   setIsFilter(true);
                //   handleFilterBranchOffice(e.target.value);
                }}
              >
                <option value="" disabled selected>Select Branch</option>
                <option value={"Gota"}>Gota</option>
                <option value={"Sindhu Bhawan"}>Sindhu Bhawan</option>
                <option value={"none"}>None</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div id="table-default" className="row tbl-scroll">
          <table className="table-vcenter table-nowrap admin-dash-tbl"  >
            
            <thead className="admin-dash-tbl-thead">
              <tr>
                <th>Sr. No</th>
                <th>Service Name</th>
                <th>Times Sold</th>
                <th>Total Payment</th>
                <th>Advance Payment</th>
                <th>Remaining Payment</th>
                <th>Average Selling Price</th>
              </tr>
            </thead>

            {/* {currentDataLoading ? (
              <tbody>
                <tr>
                  <td colSpan="11" >
                    <div className="LoaderTDSatyle w-100" >
                      <ClipLoader
                        color="lightgrey"
                        currentDataLoading
                        size={30}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <tbody>
                  
                  
                    <tr>
                      <td colSpan="6" className="text-center"><Nodata /></td>
                    </tr>
                </tbody>
              </>
            )} */}

          </table>
        </div>
      </div>
    </div>
  )
}

export default ServiceAnalysis
