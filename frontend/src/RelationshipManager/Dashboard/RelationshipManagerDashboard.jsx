import React, { useEffect } from 'react';

function RelationshipManagerDashboard() {

    useEffect(() => {
        document.title = "Relationship-Manager-Sahay-CRM";
    }, []);

    return (
        <div>
            <h1>Relationship Manager Dashboard</h1>
        </div>
    );
}

export default RelationshipManagerDashboard;