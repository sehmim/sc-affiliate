import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


// http://localhost:3000/extension-active-page?width=400&height=100
const ExtensionActivePage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const width = params.get('width')+"px" || "300px";
    const height = params.get('height')+"px" || "100px";

    const iframeStyle = {
        margin: "auto",
        width: width,
        height: height,
        border: 'none',
        backgroundColor: '#FDFDFD',
        borderRadius: '16px',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        display: 'flex'
    };

    return (
        <div style={{ backgroundColor: "gray", width: "100%", height: "100vh", display: "flex" }}>
            {/* // TODO: Width and height comes from url */}
            <div style={iframeStyle}>

            </div>
        </div>
    );
}

export default ExtensionActivePage;
