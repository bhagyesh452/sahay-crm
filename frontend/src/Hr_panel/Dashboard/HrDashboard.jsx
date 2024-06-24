import React from "react";
import { useParams } from 'react-router-dom';

function Dashboard(){
    const { userId } = useParams();

    return(
        <div>
            <h1>HR Dashboard</h1>
            <p>user ID: {userId}</p>
        </div>
    )
}

export default Dashboard;