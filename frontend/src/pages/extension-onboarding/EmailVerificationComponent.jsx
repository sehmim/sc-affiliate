/*global chrome*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function send(extensionId, msg, callback, retry = 20) {
  const timer = setTimeout(send, 100, extensionId, msg, callback, retry - 1);
  chrome.runtime.sendMessage(extensionId, msg, (response) => {
    if (!chrome.runtime.lastError || !retry) {
      clearTimeout(timer);
      callback(response);
    }
  });
}

const EmailVerificationComponent = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationCodeRequested, setVerificationCodeRequested] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigate();

  // const sendDataToExtension = async (data) => {
  //   console.log('Sending data to extension ---->>>', chrome)
  //   const extensionId = 'pjhmpaffmobhpffggcjebledmbihhecb'

  //   const response = await chrome.runtime.sendMessage(extensionId, {
  //     data: data,
  //     message: 'sc-form'
  //   })

  //   console.log('---->><><', response)

  // };

  const sendEmailVerificationCode = async () => {
    // sendDataToExtension({
    //   'email': 'shadid-lord-gulag@email.com'
    // })

    try {
      setLoading(true);
      // Replace this with the actual URL of your Firebase function
      const functionUrl = "firebase-function-url";
      //Note: email is the state variable that holds the email address
      const response = await fetch(
        `${functionUrl}?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setVerificationCodeRequested(true);
    } catch (error) {
      console.log("ERROR ->", error);
    } finally {
      setLoading(false);
    }

  };

  const loginUser = () => {
    // TODO: Verify that email is correct:
    navigation("/extension-settings");
  };

  return (
    <div className="onboarding-page-container">
      <div className="body-conatiner" style={{ maxWidth: "450px" }}>
        <div className="fs-1 fw-bold text-center pt-5">Email Verification</div>
        <div className="text-center text-dark font-inter font-weight-light fs-6 text-muted pt-4">
          Please type in your email where we will send you a verification code.
          If email does not appear please check your spam folder.
        </div>

        <div className="p-3 w-full">
          <label className="pb-2">Email:</label> <br></br>
          <input
            className="form-control w-full"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="user@example.com"
            id="lord-king-shadid"
          />
        </div>

        {isVerificationCodeRequested && (
          <div className="p-3 w-full">
            <label className="pb-2">Code: </label> <br></br>
            <input
              className="form-control w-full"
              onChange={(e) => setVerificationCode(e.target.value)}
              value={verificationCode}
              type="text"
              placeholder=""
            />
          </div>
        )}

        {!isVerificationCodeRequested && (
          <button
            disabled={loading}
            onClick={() => sendEmailVerificationCode()}
            type="button"
            className="btn btn-dark btn-lg fw-bold pt-2"
            style={{ width: "320px" }}
          >
            Send Code
          </button>
        )}

        {isVerificationCodeRequested && (
          <div>
            <button
              disabled={loading}
              onClick={() => loginUser()}
              type="button"
              className="btn btn-dark btn-lg fw-bold"
              style={{ width: "320px" }}
            >
              Login
            </button>
            <div>
              Did not get code?{" "}
              <a onClick={() => {}} href="#">
                Resend Code
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationComponent;
