import React, { useEffect } from 'react';

function FinanceAnalystDashboard() {

    useEffect(() => {
        document.title = "Finance-Analyst-Sahay-CRM";
    }, []);

    return (
        <div>
            <h1>Finance Analyst Dashboard</h1>
        </div>
    );
}

export default FinanceAnalystDashboard;