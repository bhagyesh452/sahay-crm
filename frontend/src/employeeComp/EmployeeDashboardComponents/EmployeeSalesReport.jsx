import React from 'react'

function EmployeeSalesReport() {
  return (
    <div>
         <div className="dash-card">
                      <div className="row">
                        {/* sales report data*/}
                        <div className="col-sm-5">
                          <div className="dash-sales-report-data">
                            <div className="dash-srd-head-name">
                              <div className="d-flex align-items-top justify-content-between">
                                <div>
                                  <h2 className="m-0">Sales Report</h2>
                                  <div className="dash-select-filter">
                                    <select class="form-select form-select-sm my-filter-select" aria-label=".form-select-sm example">
                                      <option value="1" selected>Today</option>
                                      <option value="2">This Month</option>
                                      <option value="3">Last Month</option>
                                    </select>
                                  </div>
                                </div>
                                <div className="dash-select-filte-show-hide">
                                  <div class="form-check form-switch d-flex align-items-center justify-content-center mt-1 mb-0">
                                    <label class="form-check-label" for="flexSwitchCheckDefault">Show Numbers</label>
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dash-srd-body-data">
                              <div className="row">
                                <div className="col-sm-7 p-0">
                                  <div className="dsrd-body-data-num">
                                      <label className="m-0 dash-Revenue-label">Revenue</label>
                                      <h2 className="m-0 dash-Revenue-amnt">₹ XXXXXX /-</h2>
                                      <div className="d-flex aling-items-center mt-1">
                                        <div className="dsrd-Revenue-up-ration d-flex aling-items-center">
                                          <GoArrowUp /> 
                                          <div>20%</div>
                                        </div>
                                        <div className="dsrd-Revenue-lastmonthfixamnt">
                                          vs Last Month: ₹ 3,00,000
                                        </div>
                                      </div>
                                      <div className="dsrd-TARGET-INCENTIVE">
                                        TARGET - <b>₹ 1,45,000</b> | INCENTIVE - <b>₹ 1,0000</b>
                                      </div>
                                  </div>
                                </div>
                                <div className="col-sm-5 p-0">
                                  <div>
                                    <GaugeComponent
                                    width="226.7375030517578"
                                    height="178.5768051147461"
                                        marginInPercent={{top: 0.03, bottom: 0.05, left: 0.07, right: 0.07 }}
                                        value={25}
                                        type="radial"
                                        labels={{
                                          tickLabels: {
                                            type: "inner",
                                            ticks: [
                                              { value: 20 },
                                              { value: 40 },
                                              { value: 60 },
                                              { value: 80 },
                                              { value: 100 }
                                            ]
                                          }
                                        }}
                                        arc={{
                                          colorArray: ['#EA4228','#5BE12C'],
                                          subArcs: [{limit: 10}, {limit: 30}, {}, {}, {}],
                                          padding: 0.02,
                                          width: 0.1
                                        }}
                                        pointer={{
                                          elastic: true,
                                          animationDelay: 0,
                                          length:0.60,
                                        }}
                                        className="my-speed"
                                      />
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dash-srd-body-footer">
                              <div className="row"> 
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-1cba19">
                                    <div className="dsrd-mini-card-num">
                                        07
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                        Mature Leads
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-00d19d">
                                    <div className="dsrd-mini-card-num">
                                      ₹ 20,000
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Advance collected
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-e65b5b">
                                    <div className="dsrd-mini-card-num">
                                      ₹ 20,000
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Remaining Collected
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-a0b1ad">
                                    <div className="dsrd-mini-card-num">
                                      ₹ 10,000
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Yesterday Collected
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-ffb900">
                                    <div className="dsrd-mini-card-num">
                                      ₹ 10,000
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Projected Amount
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <div className="dsrd-mini-card bdr-l-clr-4299e1">
                                    <div className="dsrd-mini-card-num">
                                        07/05/2012
                                    </div>
                                    <div className="dsrd-mini-card-name">
                                      Last Booking Date
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* sales report chart*/}
                        <div className="col-sm-7">
                          <div className="dash-sales-report-chart">
                            <div className="d-flex justify-content-end">
                              <div className="dash-select-filter mt-2">
                                <select class="form-select form-select-sm my-filter-select" aria-label=".form-select-sm example">
                                  <option value="1" selected>This week</option>
                                  <option value="2">This Month</option>
                                  <option value="3">Last Month</option>
                                </select>
                              </div>
                            </div>
                            <Box>
                              <LineChart
                                height={320}
                                margin={{ left: 60}}
                                series={[
                                  { data: AchivedData, label: 'Achived', color:'#1cba19', stroke: 2 },
                                  { data: ProjectionData, label: 'Projection', color:'#ffb900', stroke: 3 },
                                ]}
                                xAxis={[{ scaleType: 'point', data: xLabels , label:'Days', 
                                    axisLine: {
                                      stroke: '#eee', // Color for the x-axis line
                                      fill: '#ccc'
                                    },
                                    tick: {
                                      stroke: '#eee', // Color for the x-axis ticks
                                      fontSize: '10px',
                                      fill: '#eee', // Color for the x-axis labels
                                    },
                                }]}
                                yAxis={[{ data: yLabels, 
                                  axisLine: {
                                    stroke: '#eee !important', // Color for the y-axis line
                                  },
                                  tick: {
                                    stroke: '#eee', // Color for the y-axis ticks
                                    fontSize: '10px',
                                    fill: '#eee', // Color for the y-axis labels
                                  },
                                  }]}
                                grid={{ vertical: false, horizontal: true, color:'#eee'  }}
                              />
                            </Box>
                          </div>
                        </div>
                      </div>
                    </div>
    </div>
  )
}

export default EmployeeSalesReport