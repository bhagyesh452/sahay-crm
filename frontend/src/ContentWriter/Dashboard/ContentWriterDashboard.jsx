import React, { useEffect } from 'react';

function ContentWriterDashboard() {

    useEffect(() => {
        document.title = "Content-Writer-Sahay-CRM";
    }, []);

    return (
        <div>
            <h1>Content Writer Dashboard</h1>
        </div>
    );
}

export default ContentWriterDashboard;