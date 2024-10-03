import React, { useRef } from 'react';
import { IoIosPerson } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import logo from "../../../static/mainLogo.png";
import { FaEarthAmericas } from "react-icons/fa6";
import html2canvas from 'html2canvas';
import { MdFileDownload } from "react-icons/md";


function BusinessCardView({ employeeInformation }) {
    const cardRef = useRef(null);

    const handleDownloadJPG = () => {
        if (cardRef.current === null) {
            return;
        }

        html2canvas(cardRef.current, { useCORS: true })
            .then((canvas) => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/jpeg', 1.0);
                link.download = `${employeeInformation.empFullName}-business-card.jpg`;
                link.click();
            })
            .catch((err) => {
                console.error('Oops, something went wrong!', err);
            });
    };

    return (
        <div className="BusinessCardView flip-card">
            <div className='d-flex align-items-center justify-content-center flip-card-inner mt-3'>
                <div className="BusinessCardBody flip-card-front" ref={cardRef}>
                    <div className='BusinessCardheader'>
                        <div className='d-flex align-items-start'>
                            <div className='BusinessCardheaderIcon'>
                                <IoIosPerson />
                            </div>
                            <div className='BusinessCardheaderName'>
                                <h3 className='m-0'>{employeeInformation ? employeeInformation.ename : ""}</h3>
                                <p className='m-0'>{employeeInformation ? employeeInformation.newDesignation : ""}</p>
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
                                        +91 {employeeInformation ? employeeInformation.number : ""}
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mt-3 mb-3'>
                                    <div className='BusinessCardDetailsIcon'>
                                        <IoIosMail />
                                    </div>
                                    <div className='BusinessCardDetailsText'>
                                        {employeeInformation ? employeeInformation.email : ""}
                                    </div>
                                </div>
                                <div className='d-flex align-items-center mt-2 mb-2'>
                                    <div className='BusinessCardDetailsIcon'>
                                        <FaLocationDot />
                                    </div>
                                    <div className='BusinessCardDetailsText'>
                                        {employeeInformation && employeeInformation.branchOffice === "Gota" ?
                                            (<p className='m-0'>B-304, Ganesh Glory 11, Jagatpur<br />
                                                Road, Gota, Ahmedabad - 382470</p>) :
                                            (<p className='m-0'>1307/08, Zion Z1, Beside Avalon Hotel,<br />
                                                Sindhubhav Road, Ahmedabad - 380054 </p>)}
                                    </div>
                                </div>
                            </div>
                            <div className="BusinessCardLogo">
                                <img src={logo} alt="Logo" />
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
                    {/* Add a button to download the card as JPG */}
                    <button className="profile-pic-upload" onClick={handleDownloadJPG}>
                        <MdFileDownload />
                    </button>
                </div>
                <div className='BusinessCardBody1 flip-card-back' ref={cardRef}>
                    <div className='businessCardBacklogo'>
                        <img src={logo} alt="Logo" />
                    </div>
                    <div className='businessCardBackfooter'>
                        <div className='d-flex'>
                            <div className='businessCardBackfootericon'>
                                <FaLocationDot />
                            </div>
                            <div className='businessCardBackfootertext'>
                                {employeeInformation && employeeInformation.branchOffice === "Gota" ?
                                (<p className='m-0'>B-304, Ganesh Glory 11, Jagatpur<br />
                                    Road, Gota, Ahmedabad - 382470</p>) :
                                (<p className='m-0'>1307/08, Zion Z1, Beside Avalon Hotel,<br />
                                    Sindhubhav Road, Ahmedabad - 380054 </p>)}
                            </div>
                        </div>
                    </div>
                    <button className="profile-pic-upload" onClick={handleDownloadJPG}>
                        <MdFileDownload />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BusinessCardView;
