import React, { useState, useEffect } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCheck } from "react-icons/fa6";

function EmployeeInterestedInformationDialog() {
    return (
        <div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Why are you moving this lead to Interested?</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="accordion" id="accordionQue">
                                <div className="accordion-item">
                                    <div className="accordion-header p-2" id="accordionQueOne">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                1. Client asked to send documents/information on WhatsApp for review!
                                            </div>
                                            <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                <div className="yes-no">
                                                    <input type="radio" name="rGroup" value="1" id="r1" />
                                                    <label className="yes-no-alias" for="r1" data-bs-toggle="collapse" data-bs-target="#collapseOneQue" aria-expanded="true" aria-controls="collapseOneQue">
                                                        <div className="yes-alias-i"><FaCheck /></div>
                                                        <div className="ml-1">Yes</div>
                                                    </label>
                                                </div>
                                                <div className="yes-no ml-1">
                                                    <input type="radio" name="rGroup" value="2" id="r2" />
                                                    <label className="yes-no-alias" for="r2">
                                                        <div className="no-alias-i"><CgClose /></div>
                                                        <div className="ml-1">No</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapseOneQue" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionQueOne">
                                        <div className="accordion-body int-sub-que">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Next Follow-Up Date ?</label>
                                                        <input type="date" class="form-control mt-1" id="date" value="" />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="text">Remark Box: </label>
                                                        <input type="text" class="form-control mt-1" placeholder="Additional comments or notes" id="text" value="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <div className="accordion-header p-2" id="accordionQuetwo">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                2. Client asked to send documents/information via email for review.
                                            </div>
                                            <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                <div className="yes-no">
                                                    <input type="radio" name="rGroup" value="3" id="r3" />
                                                    <label className="yes-no-alias" for="r3" data-bs-toggle="collapse" data-bs-target="#collapsetwoQue" aria-expanded="true" aria-controls="collapsetwoQue">
                                                        <div className="yes-alias-i"><FaCheck /></div>
                                                        <div className="ml-1">Yes</div>
                                                    </label>
                                                </div>
                                                <div className="yes-no ml-1">
                                                    <input type="radio" name="rGroup" value="4" id="r4" />
                                                    <label className="yes-no-alias" for="r4">
                                                        <div className="no-alias-i"><CgClose /></div>
                                                        <div className="ml-1">No</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapsetwoQue" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionQuetwo">
                                        <div className="accordion-body int-sub-que">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Next Follow-Up Date ?</label>
                                                        <input type="date" class="form-control mt-1" id="date" value="" />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="text">Remark Box: </label>
                                                        <input type="text" class="form-control mt-1" placeholder="Additional comments or notes" id="text" value="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <div className="accordion-header p-2" id="accordionQuetwo">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                3. Interested in one of our services.
                                            </div>
                                            <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                <div className="yes-no">
                                                    <input type="radio" name="rGroup" value="3" id="r3" />
                                                    <label className="yes-no-alias" for="r3" data-bs-toggle="collapse" data-bs-target="#collapsetwoQue" aria-expanded="true" aria-controls="collapsetwoQue">
                                                        <div className="yes-alias-i"><FaCheck /></div>
                                                        <div className="ml-1">Yes</div>
                                                    </label>
                                                </div>
                                                <div className="yes-no ml-1">
                                                    <input type="radio" name="rGroup" value="4" id="r4" />
                                                    <label className="yes-no-alias" for="r4">
                                                        <div className="no-alias-i"><CgClose /></div>
                                                        <div className="ml-1">No</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapsetwoQue" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionQuetwo">
                                        <div className="accordion-body int-sub-que">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Services Pitched:</label>
                                                        <select type="checkbox" class="form-control mt-1">
                                                            <option>Option 1</option>
                                                            <option>Option 2</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Services Interested In :</label>
                                                        <select type="checkbox" class="form-control mt-1">
                                                            <option>Option 1</option>
                                                            <option>Option 2</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Offered Price: </label>
                                                        <input type="text" class="form-control mt-1" placeholder="Additional comments or notes" id="text" value="" />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="text">Next Follow-Up Date: </label>
                                                        <input type="date" class="form-control mt-1" id="date" value="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Remarks: </label>
                                                        <textarea type="text" class="form-control mt-1" placeholder="Additional comments or notes" id="text" value="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <div className="accordion-header p-2" id="accordionQuetwo">
                                        <div className="d-flex align-items-center justify-content-between"  >
                                            <div className="int-que mr-2">
                                                4. Interested, but doesn't need the service right now.
                                            </div>
                                            <div className="custom-Yes-No d-flex align-items-center int-opt">
                                                <div className="yes-no">
                                                    <input type="radio" name="rGroup" value="3" id="r3" />
                                                    <label className="yes-no-alias" for="r3" data-bs-toggle="collapse" data-bs-target="#collapsetwoQue" aria-expanded="true" aria-controls="collapsetwoQue">
                                                        <div className="yes-alias-i"><FaCheck /></div>
                                                        <div className="ml-1">Yes</div>
                                                    </label>
                                                </div>
                                                <div className="yes-no ml-1">
                                                    <input type="radio" name="rGroup" value="4" id="r4" />
                                                    <label className="yes-no-alias" for="r4">
                                                        <div className="no-alias-i"><CgClose /></div>
                                                        <div className="ml-1">No</div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="collapsetwoQue" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionQuetwo">
                                        <div className="accordion-body int-sub-que">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Services Pitched:</label>
                                                        <select type="checkbox" class="form-control mt-1">
                                                            <option>Option 1</option>
                                                            <option>Option 2</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Services Interested In :</label>
                                                        <select type="checkbox" class="form-control mt-1">
                                                            <option>Option 1</option>
                                                            <option>Option 2</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Offered Price: </label>
                                                        <input type="text" class="form-control mt-1" placeholder="Additional comments or notes" id="text" value="" />
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="text">Next Follow-Up Date: </label>
                                                        <input type="date" class="form-control mt-1" id="date" value="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <div class="form-group mt-2 mb-2">
                                                        <label for="date">Remarks: </label>
                                                        <textarea type="text" class="form-control mt-1" placeholder="Additional comments or notes" id="text" value="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer p-0 m-0">
                            <div className='d-flex w-100 m-0'>
                                <button type="button" class="btn btn-danger w-50 m-0" data-bs-dismiss="modal" style={{ border: "none", borderRadius: "0px" }}>Close</button>
                                <button type="button" class="btn btn-primary w-50 m-0" style={{ border: "none", borderRadius: "0px" }}>Understood</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeInterestedInformationDialog