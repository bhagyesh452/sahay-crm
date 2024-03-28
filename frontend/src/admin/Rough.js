 {/* <tbody>
                      {uniqueEnames &&
                        uniqueEnames.map((ename, index) => {
                          // Calculate the count of services for the current ename
                          // const serviceCount = filteredDataDateRange && (
                          //   // If filteredDataDateRange is not empty, use servicesByEnameDateRange
                          //   servicesByEnameDateRange[ename] ? servicesByEnameDateRange[ename].length : 0
                          // );
                          // const companyCount = companiesByEname[ename] ? companiesByEname[ename].length : 0;
                          let serviceCount;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            serviceCount = servicesByEnameDateRange[ename] ? servicesByEnameDateRange[ename].length : 0
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            serviceCount = servicesByEnameToday[ename] ? servicesByEnameToday[ename].length : 0
                          }

                          // const companyCount = filteredDataDateRange && (
                          //   // If filteredDataDateRange is not empty, use companiesByEnameDateRange
                          //   companiesByEnameDateRange[ename] ? companiesByEnameDateRange[ename].length : 0
                          // );
                          let companyCount;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            companyCount = companiesByEnameDateRange[ename] ? companiesByEnameDateRange[ename].length : 0
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            companyCount = companiesByEnameToday[ename] ? companiesByEnameToday[ename].length : 0
                          }
                          let totalPaymentByEname;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            totalPaymentByEname = (sumsDateRange[ename] ? sumsDateRange[ename].totalPaymentSum : 0)
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            totalPaymentByEname = (sumsToday[ename] ? sumsToday[ename].totalPaymentSum : 0)
                          }
                          let offeredPrizeByEname;
                          if (filteredDataDateRange && filteredDataDateRange.length > 0) {
                            // If filteredDataDateRange is not empty, use companiesByEname
                            offeredPrizeByEname = (sumsDateRange[ename] ? sumsDateRange[ename].offeredPaymentSum : 0)
                          } else {
                            // If filteredDataDateRange is empty, use followDataToday
                            offeredPrizeByEname = (sumsToday[ename] ? sumsToday[ename].offeredPaymentSum : 0)
                          }






                          //const totalPaymentByEname = sums[ename] ? sums[ename].totalPaymentSum : 0;
                          // const totalPaymentByEname = filteredDataDateRange &&
                          //   (sumsDateRange[ename] ? sumsDateRange[ename].totalPaymentSum : 0);


                          //const offeredPrizeByEname = sums[ename] ? sums[ename].offeredPaymentSum : 0;
                          // const offeredPrizeByEname = filteredDataDateRange.length &&
                          //   (sumsDateRange[ename] ? sumsDateRange[ename].offeredPaymentSum : 0)


                          const lastFollowDates = lastFollowDate[ename] || []; // Assuming lastFollowDate[ename] is an array of dates or undefined

                          // Get the latest date from the array
                          let latestDate;

                          if (Array.isArray(lastFollowDates) && lastFollowDates.length > 0) {
                            latestDate = new Date(Math.max(...lastFollowDates.map(date => new Date(date))));
                          } else if (lastFollowDates instanceof Date) {
                            // If lastFollowDates is a single date, directly assign it to latestDate
                            latestDate = lastFollowDates;
                          } else {
                            // Handle the case when lastFollowDates is not an array or a date
                            latestDate = new Date(); // Assigning current date as default value
                          }

                          // Format the latest date into a string
                          const formattedDate = latestDate.toLocaleDateString(); //


                          return (
                            <tr key={`row-${index}`}>
                              <td style={{ lineHeight: "32px" }}>{index + 1}</td>
                              <td>{ename}</td>
                              <td>{companyCount}
                                <FcDatabase
                                  onClick={() => {
                                    functionOpenProjectionTable(ename);
                                  }}
                                  style={{ cursor: "pointer", marginRight: "-71px", marginLeft: "58px" }}
                                /></td>
                              <td>{serviceCount}</td>
                              <td>  {totalPaymentByEname.toLocaleString('en-IN', numberFormatOptions)}</td>
                              <td>  {offeredPrizeByEname.toLocaleString('en-IN', numberFormatOptions)}</td>
                              <td>{filteredDataDateRange.length !== 0 ? formattedDate : new Date().toLocaleDateString()}</td>

                            </tr>
                          );
                        })}

                    </tbody>
                    {followData && (
                      <tfoot style={{
                        position: "sticky", // Make the footer sticky
                        bottom: -1, // Stick it at the bottom
                        backgroundColor: "#f6f2e9",
                        color: "black",
                        fontWeight: 500,
                        zIndex: 2, // Ensure it's above the content
                      }}>
                        <tr style={{ fontWeight: 500 }}>
                          <td style={{ lineHeight: '32px' }} colSpan="2">Total</td>
                          <td>{filteredDataDateRange && filteredDataDateRange.length > 0 ? (
                            totalcompaniesByEnameDateRange.length
                          ) : (totalcompaniesByEnameToday.length)
                          }
                          </td>
                          <td>
                            {filteredDataDateRange && filteredDataDateRange.length > 0 ? (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalservicesByEnameDateRange.length
                            ) : (totalservicesByEnameToday.length)}
                          </td>
                          // <td>{totalTotalPaymentSum.toLocaleString()}</td> 
                          <td>
                            {filteredDataDateRange && filteredDataDateRange.length > 0 ? (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalTotalPaymentSumDateRange.toLocaleString('en-IN', numberFormatOptions)
                            ) : (totalTotalPaymentSumToday.toLocaleString('en-IN', numberFormatOptions))}
                          </td>

                          // <td>{totalOfferedPaymentSum.toLocaleString()}</td>

                          <td>
                            {filteredDataDateRange.length && filteredDataDateRange.length > 0 ? (
                              // If filteredDataDateRange is not empty, use totalServicesByEnameDateRange
                              totalOfferedPaymentSumDateRange.toLocaleString('en-IN', numberFormatOptions)
                            ) : (totalOfferedPaymentSumToday.toLocaleString('en-IN', numberFormatOptions))}
                          </td>
                          <td>-</td>

                        </tr>
                      </tfoot>
                    )} */}