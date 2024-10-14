import React from 'react';
import { LuHistory } from "react-icons/lu";

function eGeneralLeads() {
  return (
    <div className="RM-my-booking-lists">
        <div className="table table-responsive table-style-3 m-0">
            <table className="table table-vcenter table-nowrap">
                <thead>
                    <tr className="tr-sticky">
                        <th>Sr. No</th>
                        <th>Compnay Name</th>
                        <th>Compnay No</th>
                        <th>Call History</th>
                        <th>Status</th>
                        <th>Remarks</th>
                        <th>Incorporation Date</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Compnay Email</th>
                        <th>Assign Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            1
                        </td>
                        <td>
                            ABC PVT LTD
                        </td>
                        <td>9924283530</td>
                        <td><LuHistory/></td>
                        <td>Untouch</td>
                        <td></td>
                        <td>22 Jun 2022</td>
                        <td>Ahmedabad</td>
                        <td>gujarat</td>
                        <td>nk@gmail.company</td>
                        <td>22 Jun 2022</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  );
}

export default eGeneralLeads;