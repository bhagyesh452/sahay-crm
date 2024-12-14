import React from 'react'

function EmployeeQuestionModal({
    modalId
}) {
    return (
        <div>
            <div class="modal fade" id={modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content q-modal">
                        <div class="modal-body">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div className="que-main">
                                <div class="question-number">5</div>
                                <div class="question-text">How many players has a hockey team got on the ice?</div>
                            </div>
                            <div className="row opt-row" style={{ marginTop: "60px" }}>
                                <div className="col-6">
                                    <div className="option-main">
                                        <div className="option-text">A: TESCT</div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="option-main">
                                        <div className="option-text">A: TESCT</div>
                                    </div>
                                </div>
                                <div className="col-6 mt-5">
                                    <div className="option-main">
                                        <div className="option-text">A: TESCT</div>
                                    </div>
                                </div>
                                <div className="col-6 mt-5">
                                    <div className="option-main">
                                        <div className="option-text">A: TESCT</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeQuestionModal