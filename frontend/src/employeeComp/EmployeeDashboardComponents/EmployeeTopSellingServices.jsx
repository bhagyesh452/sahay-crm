import React, { useEffect, useState, CSSProperties, useRef } from "react";
import Header from "../../components/Header.js";
import EmpNav from "../EmpNav.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { options } from "../../components/Options.js";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import Swal from "sweetalert2";
import Select from "react-select";
import Nodata from "../../components/Nodata";

function EmployeeTopSellingServices({redesignedData , ename}) {

    const [selectedMonthOption, setSelectedMonthOption] = useState("This Month")

    const functionCalculateServiceCount = () => {
        const serviceCountMap = new Map();
        const today = new Date();
        
        redesignedData.forEach((mainObj) => {
            let condition1 = false;
            let condition2 = false;
            switch (selectedMonthOption) {
              case 'Today':
                condition1 = (new Date(mainObj.bookingDate).toLocaleDateString() === today.toLocaleDateString())
                break;
              case 'Last Month':
                condition1 = (new Date(mainObj.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
                break;
              case 'This Month':
                condition1 = (new Date(mainObj.bookingDate).getMonth() === today.getMonth())
                break;
              default:
                break;
            }
          if ((mainObj.bdeName === ename || mainObj.bdmName === ename) && condition1) {
            mainObj.services.forEach((service) => {
              if (serviceCountMap.has(service.serviceName)) {
                serviceCountMap.set(service.serviceName, serviceCountMap.get(service.serviceName) + 1);
              } else {
                serviceCountMap.set(service.serviceName, 1);
              }
            });
          }
          mainObj.moreBookings.length !==0 && mainObj.moreBookings.map((moreObj)=>{
            switch (selectedMonthOption) {
                case 'Today':
                  condition2 = (new Date(moreObj.bookingDate).toLocaleDateString() === today.toLocaleDateString())
                  break;
                case 'Last Month':
                  condition2 = (new Date(moreObj.bookingDate).getMonth() === (today.getMonth === 0 ? 11 : today.getMonth() - 1))
                  break;
                case 'This Month':
                  condition2 = (new Date(moreObj.bookingDate).getMonth() === today.getMonth())
                  break;
                default:
                  break;
              }
            if ((moreObj.bdeName === ename || moreObj.bdmName === ename) && condition2) {
                moreObj.services.forEach((service) => {
                  if (serviceCountMap.has(service.serviceName)) {
                    serviceCountMap.set(service.serviceName, serviceCountMap.get(service.serviceName) + 1);
                  } else {
                    serviceCountMap.set(service.serviceName, 1);
                  }
                });
              }
          })
         

        });
        const serviceArray = Array.from(serviceCountMap, ([value, count]) => ({ value, count }));
        serviceArray.sort((a, b) => b.count - a.count);
        return serviceArray;
      };
      

      const serviceArray = functionCalculateServiceCount();
      

    return (
        <div>
            <div style={{minHeight:'299px'}} className="dash-card">
                <div className="dash-card-head d-flex align-items-center justify-content-between">
                    <h2 className="m-0">
                        Top Selling Services
                    </h2>
                    <div className="dash-select-filter">
            <select class="form-select form-select-sm my-filter-select"
              aria-label=".form-select-sm example"
              value={selectedMonthOption}
              onChange={(e)=>{
                setSelectedMonthOption(e.target.value)
              }}
            >
              <option value="Today">Today</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>
                </div>
                <div className="dash-card-body">
                    <div className="top-selling-s">
                      {serviceArray.length === 0 && <div className="if-n0-dash-data">
                        <Nodata/>
                        </div>}
                       {serviceArray.length!==0 && <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-1cba19">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-1cba19">
                                    1
                                </div>
                                <div className="top-selling-s-name">
                                   {serviceArray[0].value}
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-1cba19">
                                {serviceArray[0].count}
                            </div>
                        </div>}
                       {serviceArray.length > 1 && <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-00d19d">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-00d19d">
                                    2
                                </div>
                                <div className="top-selling-s-name">
                                {serviceArray[1].value}
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-00d19d">
                            {serviceArray[1].count}
                            </div>
                        </div>}
                        {serviceArray.length > 2 && <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-fff536">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-fff536">
                                    3
                                </div>
                                <div className="top-selling-s-name">
                                {serviceArray[2].value}
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-fff536">
                            {serviceArray[2].count}
                            </div>
                        </div>}
                       {serviceArray.length > 3 &&  <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-ffb900">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-ffb900">
                                    4
                                </div>
                                <div className="top-selling-s-name">
                                {serviceArray[3].value}
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-ffb900">
                            {serviceArray[3].count}
                            </div>
                        </div>}
                       {serviceArray.length > 4 &&  <div className="top-selling-s-cards d-flex align-items-center justify-content-between clr-bg-light-e65b5b">
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="top-selling-s-no bdr-l-clr-e65b5b">
                                    5
                                </div>
                                <div className="top-selling-s-name">
                                {serviceArray[4].value}
                                </div>
                            </div>
                            <div className="top-selling-s-num clr-bg-e65b5b">
                            {serviceArray[4].count}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeTopSellingServices;