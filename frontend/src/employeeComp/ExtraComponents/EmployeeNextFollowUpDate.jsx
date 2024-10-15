import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeNextFollowDate = ({
    companyName,
    id,
    nextFollowDate,
    refetch,
}) => {

  
    const [exitDateNew, setexitDateNew] = useState(nextFollowDate ? new Date(nextFollowDate).toISOString().substring(0, 10) : "No Data"); // Format date for input
  

    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const functionSubmitNextFollowUpDate = async (exitDateNew) => {

        const data = {
            bdeNextFollowUpDate: exitDateNew
        }
        try {
            const resposne = await axios.post(`${secretKey}/company-data/post-bdenextfollowupdate/${id}`, data)

            //console.log(resposne.data)
           refetch();

        } catch (error) {
            console.log("Error submitting Date", error)
        }

    }


    return (
        <section className="rm_status_dropdown d-flex align-items-center justify-content-around">
            
                <div className="card-footer">
                    <div className="remarks-input">
                        <input
                            style={{ width: "100%", borderRadius: "6px", padding: "3px 5px 4px 5px" }}
                            value={exitDateNew}
                            type='date'
                            onChange={(e) => {
                                setexitDateNew(e.target.value);
                                functionSubmitNextFollowUpDate(e.target.value);
                            }}
                        />
                    </div>
                </div>
            
        </section>
    );
};

export default EmployeeNextFollowDate;
