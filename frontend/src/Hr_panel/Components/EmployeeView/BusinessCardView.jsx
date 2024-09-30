import React from 'react';
import { IoIosPerson } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import logo from "../../../static/mainLogo.png";
import { FaEarthAmericas } from "react-icons/fa6";




function BusinessCardView() {
  return (
    <div className="BusinessCardView">
        <div className='d-flex align-items-center justify-content-center'>
            <div className="BusinessCardBody mt-3">
                <div className='BusinessCardheader'>
                    <div className='d-flex align-items-start'>
                        <div className='BusinessCardheaderIcon'>
                            <IoIosPerson />
                        </div>
                        <div className='BusinessCardheaderName'>
                            <h3 className='m-0'>NimeshKumar Parekh</h3>
                            <p className='m-0'>CTO</p>
                        </div>
                    </div>
                </div>
                <div className='BusinessCardData'>
                    <div className='d-flex align-items-start'>
                        <div className="BusinessCardDetails">
                            <div className='d-flex align-items-center mt-1 mb-2'>
                                <div className='BusinessCardDetailsIcon'>
                                    <IoCall />
                                </div>
                                <div className='BusinessCardDetailsText'>
                                    +91 96647 05783
                                </div>
                            </div>
                            <div className='d-flex align-items-center mt-3 mb-3'>
                                <div className='BusinessCardDetailsIcon'>
                                    <IoIosMail />
                                </div>
                                <div className='BusinessCardDetailsText'>
                                    nimesh@incscale.in
                                </div>
                            </div>
                            <div className='d-flex align-items-center mt-2 mb-2'>
                                <div className='BusinessCardDetailsIcon'>
                                    <FaLocationDot  />
                                </div>
                                <div className='BusinessCardDetailsText'>
                                   <p className='m-0'>B-304, Ganesh Glory 11, Jagatpur<br/>
                                    Road, Gota, Ahmedabad - 382470</p>
                                </div>
                            </div>
                        </div>
                        <div className="BusinessCardLogo">
                            <img src={logo}></img>
                        </div>
                    </div>
                </div>
                <div className='BusinessCardFooter'>
                    <div className='d-flex align-items-center mt-1 mb-2'>
                        <div className='BusinessCardFooterIcon'>
                            <FaEarthAmericas />
                        </div>
                        <div className='BusinessCardFooterText'>
                            www.startupsahay.com
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default BusinessCardView;