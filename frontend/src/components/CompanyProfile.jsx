import React from 'react';
import CmpnyPHlogo from "../static/sahayion.png";
import { GoHistory } from "react-icons/go";

function CompanyProfile() {
  return (
    <div className='CompanyProfileMain'>
      <div className="container-xl">
        <div className='CompanyProfileHead'>
          <div className='d-flex align-items-center'> 
            <div className='Cmpny-pH-logo'>
              <img src={CmpnyPHlogo}/>
            </div>
            <div className='Cmpny-pH-Details'>
              <h3 className='m-0'>START-UP SAHAY PRIVATE LIMITED</h3>
              <div className='d-flex align-items-center'>
                <div className='CPH_subdtl'>
                  <p className='m-0'>Total Booking : <span>0</span></p>
                </div>
                <div className='CPH_subdtl'>
                  <p className='m-0'>Recent BDM : <span>Vishnu Desai</span></p>
                </div>
                <div className='CPH_subdtl'>
                  <div className='d-flex'>
                    <p className='m-0 mr-1' style={{lineHeight:'11px'}}><span><GoHistory /></span></p>
                    <p className='m-0 ms-1'>Call History</p>
                  </div>
                </div>
              </div>
                
            </div>
          </div>
        </div>
        <div className='CompanyProfilebody'>
          <div className='row'>
            <div className='col-lg-3 col-md-4'>
              <div class="accordion CompanyProfileAccordi" id="accordionPanelsStayOpenExample">
                <div class="accordion-item">
                  <h2 class="accordion-header" id="panelsStayOpen-headingOne">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                      Company Details 
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                    <div class="accordion-body">
                      <div className='CPaccordi_Dtl_inner'>
                        <div className='row align-items-center'>
                          <div className='col-5'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Company Email
                            </div>
                          </div>
                          <div className='col-7'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              info@startupsahay.com
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-5'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Phone No
                            </div>
                          </div>
                          <div className='col-7'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              9924283502
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-5'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              Inco. Date
                            </div>
                          </div>
                          <div className='col-7'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              20 Jun 2024
                            </div>
                          </div>
                        </div>
                        <div className='row align-items-center mt-2'>
                          <div className='col-5'>
                            <div className='CPaccordi_Dtl_inner_left'>
                              PAN
                            </div>
                          </div>
                          <div className='col-7'>
                            <div className='CPaccordi_Dtl_inner_right'>
                              DLHPP569K
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="panelsStayOpen-headingTwo">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                      Director's Details
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                    <div class="accordion-body">
                     
                    </div>
                  </div>
                </div>
                <div class="accordion-item">
                  <h2 class="accordion-header" id="panelsStayOpen-headingThree">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                      Documents
                    </button>
                  </h2>
                  <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                    <div class="accordion-body">
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-7 col-md-6'>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfile;