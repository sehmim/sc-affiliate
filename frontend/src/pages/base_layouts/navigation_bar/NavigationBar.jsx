import React, { useState } from 'react';
import './NavigationBar.css'; // Import CSS file for styling

import logo from '../../../spc_logo.png'

const NavigationBar = () => {
    // State to manage the visibility of navigation links
    const [showLinks, setShowLinks] = useState(false);
    return (
        <nav className="navbar">
            <div className="container_nav">
                <a href='/' className="navbar-logo">
                    <img className="nav_logo" src={logo} alt="sponsorcircle"/>
                </a>
                {/* Button to toggle the visibility of navigation links */}
                <button className="toggle-button" onClick={() => setShowLinks(!showLinks)}>
                    ☰
                </button>
                {/* Navigation links */}
                <ul className={showLinks ? "navbar-links active" : "navbar-links"}>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/signup">Signup</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </div>
        </nav>
    );
}

export default NavigationBar;
