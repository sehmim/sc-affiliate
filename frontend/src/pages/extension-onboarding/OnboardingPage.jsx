import React, { useState } from 'react'
import "./OnboardingPage.css"
import SHELL_BROWSER from './shell-broswer.png'
import BottomRightComponent from './BottomRightComponent'
import EmailVerificationComponent from './EmailVerificationComponent';

export default function OnboardingPage(props) {

    const [onboardingStep, setOnboardingStep] = useState(1);

    if(onboardingStep === 0) {
        return (
        <div className='onboarding-page-container'>
            <div className='body-conatiner'>
                <div className='fs-1 fw-bold text-center pt-5'>
                    Empower Your Generosity <br></br>
                    Just One Click Away  
                </div>
                <div className="text-center text-dark font-inter font-weight-light fs-6 text-muted pt-4">
                    Choose the Charity of your Choice.
                </div>

                <div className='text-center py-5'>
                    Quick and easy registration for impact-<br></br>
                    driven shopping experiences.
                </div>

            <button onClick={() => setOnboardingStep(1)} type="button" className="btn btn-dark btn-lg fw-bold pt-2" style={{ width: '300px' }}>
            Register Now
            </button>
            </div>
            <div>
                <img src={SHELL_BROWSER}></img>
            </div>

            <BottomRightComponent />
        </div>)
    }

    if(onboardingStep === 1) {
        return <EmailVerificationComponent />
    }
}
