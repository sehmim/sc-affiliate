import React from "react";
import { useNavigate } from "react-router-dom";
import BottomRightComponent from "./BottomRightComponent";
import "./OnboardingPage.css";
import SHELL_BROWSER from "./shell-broswer.png";


const STORE_LINK = `https://chromewebstore.google.com/detail/shop-for-good/pifflcabiijbniniffeakhadehjilibi`;

export default function OnboardingPage(props) {
  const navigate = useNavigate();

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
      <div className="onboarding-page-container">
        <div className="body-conatiner">
          <div className="fs-1 fw-bold text-center pt-5">
            Empower Your Generosity <br></br>
            Just One Click Away
          </div>
          <div className="text-center text-dark font-inter font-weight-light fs-6 text-muted pt-4">
            Choose the Charity of your Choice.
          </div>

          <div className="text-center py-5">
            Quick and easy registration for impact-<br></br>
            driven shopping experiences.
          </div>

          <button
            onClick={() => handleRedirect()}
            type="button"
            className="btn btn-dark btn-lg fw-bold pt-2"
            style={{ width: "300px" }}
          >
            Register Now
          </button>
        </div>
        <div>
          <img src={SHELL_BROWSER}></img>
        </div>

        <BottomRightComponent />
      </div>
    );
}
