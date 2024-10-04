import React, { useRef, useState } from 'react';
import { IoIosPerson } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { IoIosMail } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import logo from "../../../static/mainLogo.png";
import { FaEarthAmericas } from "react-icons/fa6";
import html2canvas from 'html2canvas';
import { MdFileDownload } from "react-icons/md";
import { MdFlipCameraAndroid } from "react-icons/md";

function BusinessCardView({ employeeInformation }) {
    const frontCardRef = useRef(null);
    const backCardRef = useRef(null);
    const [flipped, setFlipped] = useState(false);

    // const handleDownloadJPG = async () => {
    //     if (!frontCardRef.current || !backCardRef.current) {
    //         return;
    //     }
    
    //     try {
    //         // Hide buttons before capturing
    //         document.querySelectorAll(".profile-pic-upload, .profile-pic-flip").forEach((button) => {
    //             button.style.visibility = 'hidden';
    //         });
    
    //         // Capture front side
    //         const frontCanvas = await html2canvas(frontCardRef.current, { useCORS: true });
    
    //         // Temporarily unflip back side to capture it correctly
    //         setFlipped(true);
    //         await new Promise(resolve => setTimeout(resolve, 300)); // Wait for animation to complete
    
    //         // Capture back side
    //         const backCanvas = await html2canvas(backCardRef.current, { useCORS: true });
    
    //         // Define the margin between front and back images
    //         const margin = 20; // You can adjust this value as needed
    
    //         // Create a new canvas to combine both sides
    //         const combinedCanvas = document.createElement('canvas');
    //         combinedCanvas.width = Math.max(frontCanvas.width, backCanvas.width);
    //         combinedCanvas.height = frontCanvas.height + backCanvas.height + margin;
    
    //         const ctx = combinedCanvas.getContext('2d');
            
    //         // Draw front image
    //         ctx.drawImage(frontCanvas, 0, 0);
            
    //         // Draw back image with margin space
    //         ctx.drawImage(backCanvas, 0, frontCanvas.height + margin);
    
    //         // Convert combined canvas to image and download
    //         const combinedImage = combinedCanvas.toDataURL('image/jpeg', 1.0);
    //         const link = document.createElement('a');
    //         link.href = combinedImage;
    //         link.download = `${employeeInformation.empFullName}-business-card-combined.jpg`;
    //         link.click();
    
    //     } catch (err) {
    //         console.error('Oops, something went wrong!', err);
    //     } finally {
    //         // Show buttons after capturing
    //         document.querySelectorAll(".profile-pic-upload, .profile-pic-flip").forEach((button) => {
    //             button.style.visibility = 'visible';
    //         });
    //     }
    // };
    

    const handleDownloadJPG = async () => {
        if (!frontCardRef.current || !backCardRef.current) {
            return;
        }
    
        try {
            // Hide buttons before capturing
            document.querySelectorAll(".profile-pic-upload, .profile-pic-flip").forEach((button) => {
                button.style.visibility = 'hidden';
            });
    
            // Set fixed width and height for capturing business card
            const CARD_WIDTH = 475;  // Fixed width in pixels
            const CARD_HEIGHT = 260;  // Fixed height in pixels
    
            // Capture front side with fixed size
            const frontCanvas = await html2canvas(frontCardRef.current, {
                useCORS: true,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                scale: 2,  // Higher value for better quality
            });
    
            // Temporarily unflip back side to capture it correctly
            setFlipped(true);
            await new Promise(resolve => setTimeout(resolve, 300)); // Wait for the flip animation to complete
    
            // Capture back side with fixed size
            const backCanvas = await html2canvas(backCardRef.current, {
                useCORS: true,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                scale: 2,  // Higher value for better quality
            });
    
            // Define the margin between front and back images
            const margin = 40;  // Adjust this value for better spacing
    
            // Create a new canvas to combine both sides
            const combinedCanvas = document.createElement('canvas');
            combinedCanvas.width = CARD_WIDTH;
            combinedCanvas.height = CARD_HEIGHT * 2 + margin;
    
            const ctx = combinedCanvas.getContext('2d');
    
            // Draw front image
            ctx.drawImage(frontCanvas, 0, 0, CARD_WIDTH, CARD_HEIGHT);
    
            // Draw back image with margin space
            ctx.drawImage(backCanvas, 0, CARD_HEIGHT + margin, CARD_WIDTH, CARD_HEIGHT);
    
            // Convert combined canvas to image and download
            const combinedImage = combinedCanvas.toDataURL('image/jpeg', 1.0);
            const link = document.createElement('a');
            link.href = combinedImage;
            link.download = `${employeeInformation.empFullName}-business-card-combined.jpg`;
            link.click();
    
        } catch (err) {
            console.error('Oops, something went wrong!', err);
        } finally {
            // Show buttons after capturing
            document.querySelectorAll(".profile-pic-upload, .profile-pic-flip").forEach((button) => {
                button.style.visibility = 'visible';
            });
        }
    };

    const handleFlip = () => {
        setFlipped(true);
    };

    const handleFlipBack = () => {
        setFlipped(false);
    };

    return (
        <div className="BusinessCardView flip-card">
            <div className={`d-flex align-items-center justify-content-center mt-3 flip-card-inner ${flipped ? 'flipped' : ''}`}>
                {/* Front Side */}
                <div className="BusinessCardBody front" ref={frontCardRef}>
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
                                                Sindhubhavn Road, Ahmedabad - 380054 </p>)}
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
                    <button className="profile-pic-upload" onClick={handleDownloadJPG}>
                        <MdFileDownload />
                    </button>
                    <button id="flipButton" className='profile-pic-flip' onClick={handleFlip}><MdFlipCameraAndroid /></button>
                </div>
                {/* Back Side */}
                <div className='BusinessCardBody1 back' ref={backCardRef}>
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
                                (<p className='m-0'>1307/08, Zion Z1, Shindhubhavan Road,<br />
                                    Ahmedabad - 380054 </p>)}
                            </div>
                        </div>
                    </div>
                    {/* <button className="profile-pic-upload" onClick={handleDownloadJPG}>
                        <MdFileDownload />
                    </button> */}
                    <button id="flipButtonBack" className='profile-pic-upload' onClick={handleFlipBack}><MdFlipCameraAndroid /></button>
                </div>
            </div>
        </div>
    );
}

export default BusinessCardView;
