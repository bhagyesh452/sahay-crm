import React, { useEffect } from 'react';

function GraphicDesignerDashboard() {

    useEffect(() => {
        document.title = "Graphic-Designer-Sahay-CRM";
    }, []);

    return (
        <div>
            <h1>Graphic Designer Dashboard</h1>
        </div>
    );
}

export default GraphicDesignerDashboard;