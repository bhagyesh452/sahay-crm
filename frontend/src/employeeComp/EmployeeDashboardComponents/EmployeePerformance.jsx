import React from 'react'

function EmployeePerformance() {
  return (
    <div>
        <div className="dash-card" style={{minHeight:'299px'}}>
                      <div className="dash-card-head">
                          <h2 className="m-0">
                              Top 5 Performer
                          </h2>
                      </div>
                      <div className="dash-card-body table-responsive">
                        <table class="table top_5_table m-0">
                          <thead>
                            <tr>
                              <th>Rank </th>
                              <th>Name</th>
                              <th>Branch</th>
                              <th>Achievement Ratio</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="clr-bg-light-1cba19">
                              <td><div className="ranktd clr-fff clr-bg-1cba19">1</div></td>
                              <td>Vishnu Suthar</td>
                              <td>Gota</td>
                              <td>80%</td>
                            </tr>
                            <tr className="clr-bg-light-ffb900">
                              <td><div className="ranktd clr-bg-ffb900 clr-fff">2</div></td>
                              <td>Vishnu Desai</td>
                              <td>SBR</td>
                              <td>80%</td>
                            </tr>
                            <tr className="clr-bg-light-00d19d">
                              <td><div className="ranktd  clr-bg-00d19d clr-fff">3</div></td>
                              <td>Khushi Gandhi</td>
                              <td>SBR</td>
                              <td>80%</td>
                            </tr>
                            <tr className="clr-bg-light-e65b5b">
                              <td><div className="ranktd clr-bg-e65b5b clr-fff">4</div></td>
                              <td>Vandit Shah</td>
                              <td>Gota</td>
                              <td>80%</td>
                            </tr>
                            <tr className="clr-bg-light-4299e1">
                              <td><div className="ranktd clr-bg-4299e1 clr-fff">5</div></td>
                              <td>Kushal Modh</td>
                              <td>SBR</td>
                              <td>80%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
    </div>
  )
}

export default EmployeePerformance