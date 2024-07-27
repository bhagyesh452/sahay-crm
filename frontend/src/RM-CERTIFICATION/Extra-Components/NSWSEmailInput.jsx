import React, { useState } from 'react';
import axios from 'axios';
import { VscSaveAs } from "react-icons/vsc";

const NSWSEmailInput = ({ companyName, serviceName }) => {
    const [email, setEmail] = useState('');
    const secretKey = process.env.REACT_APP_SECRET_KEY;

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${secretKey}/rm-services/post-save-nswsemail`, {
                companyName,
                serviceName,
                email
            });
            if (response.status === 200) {
                alert('Email saved successfully!');
                setEmail(''); // Clear the textarea
            }
        } catch (error) {
            console.error("Error saving email:", error.message);
            alert('Failed to save email');
        }
    };

    return (
       <div>
            <input type="email" value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Enter NSWS Email Id"
            />
            <button className='bdr-none' style={{ lineHeight: '10px', fontSize: '10px', backgroundColor: "transparent" }}
                onClick={(e) => {
                    handleSubmit()
                }}
            >
                <VscSaveAs style={{ width: "12px", height: "12px" }} />
            </button>
            </div>
    );
};

export default NSWSEmailInput;
