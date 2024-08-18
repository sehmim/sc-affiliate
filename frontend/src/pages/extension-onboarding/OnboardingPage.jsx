import React, { useState } from 'react';
import './RegistrationBanner.css'; 
import { useNavigate } from "react-router-dom";

import hand1 from '../../img/hand1.png';
import hand2 from '../../img/hand2.png';
import hand3 from '../../img/hand3.png';

const STORE_LINK = `https://chromewebstore.google.com/detail/shop-for-good/pifflcabiijbniniffeakhadehjilibi`;

const OnboardingPage = () => {
    const navigate = useNavigate();
    const [isFirstTimeLogin] = useState(!localStorage.getItem("sc-extensionId"));

    const handleRedirect = () => {
        const params = new URLSearchParams(window.location.search);
        let extensionId = params.get("extensionId");

        if(!extensionId){
        extensionId = localStorage.getItem('sc-extensionId');
        } 


        if(!extensionId) return alert('Couldnt find extensionId. Please reinstall the app from: ' + STORE_LINK);

        navigate(`/login?extensionId=${extensionId}`)
    }



  return (
    <div className="registration-banner">
      <div className="hands-container">
        <div className="hand1-image-wrapper">
            <img src={hand1} alt="Hand 1" className="hand-image" />
        </div>
        <div className="hand2-image-wrapper">
            <img src={hand2} alt="Hand 2" className="hand-image" />
        </div>
        <div className="hand3-image-wrapper">
            <img src={hand3} alt="Hand 3" className="hand-image" />
        </div>
      </div>
      <div className="text-container">
        <div className='text-main'>Empower Your Generosity</div>
        {isFirstTimeLogin && <div className='text-main'>Just One Click Away</div>}
        <div className='text-middle'>Choose the Charity of your Choice.</div>
        <div className='text-bottom'>
            <div>Quick and easy registration for impact-</div>
            <div>driven shopping experiences.</div>
        </div>
        <button onClick={() => handleRedirect()} className="register-button">{ isFirstTimeLogin ? "Register Now" : "Get Back To It" }</button>
      </div>
    </div>
  );
};

export default OnboardingPage;
