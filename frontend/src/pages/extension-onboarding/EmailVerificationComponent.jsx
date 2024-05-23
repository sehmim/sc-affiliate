/*global chrome*/
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

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
  // Replace this with the actual URL of your Firebase function
  const functionUrl = "firebase-function-url";

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

  const loginUser = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${functionUrl}?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(verificationCode)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        navigation("/extension-settings", { email: email });
      } else {
        console.log("OTP verification failed:", data.error);
      }
    } catch (error) {
      console.log("ERROR ->", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page-container">
      <div className="body-conatiner" style={{ maxWidth: "500px" }}>
        <div className="fs-1 fw-bold text-center pt-5">Email Verification</div>

        {!isVerificationCodeRequested ? (
          <div className="text-center text-dark font-inter font-weight-light fs-6 text-muted pt-4">
            Please type in your email where we will send you a verification
            code. If email does not appear please check your spam folder.
          </div>
        ) : (
          <div className="text-center text-dark font-inter font-weight-light fs-6 text-muted pt-4">
            Please share the verification code sent to {email}. If email does
            not appear please check your spam folder.
          </div>
        )}

        <div className="p-3 w-full">
          <div
            className="EmailAddress"
            style={{
              textAlign: "left",
              color: "#927FC5",
              fontSize: 24,
              fontFamily: "Inter",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            Email Address:
          </div>
          {/* <label className="pb-2">Email Address</label> <br></br> */}
          {/* <input
            className="form-control w-full"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="user@example.com"
            id="lord-king-shadid"
          /> */}
          <TextField
            id="standard-basic"
            variant="standard"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            //placeholder="user@example.com"
            sx={{ width: "100%" }}
          />
        </div>

        {isVerificationCodeRequested && (
          <div className="p-3 w-full">
            <div
              className="EmailAddress"
              style={{
                textAlign: "left",
                color: "#927FC5",
                fontSize: 24,
                fontFamily: "Inter",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Verification Code:
            </div>
            <TextField
              id="standard-basic"
              variant="standard"
              onChange={(e) => setVerificationCode(e.target.value)}
              value={verificationCode}
              //placeholder="user@example.com"
              sx={{ width: "100%" }}
            />
            <div
              className="ValidFor1Hour"
              style={{
                textAlign: "right",
                color: "#7F7F7F",
                fontSize: 16,
                fontFamily: "Inter",
                fontWeight: "300",
              }}
            >
              Valid for 1 Hour
            </div>
          </div>
        )}

        {!isVerificationCodeRequested && (
          <button
            disabled={loading}
            onClick={() => sendEmailVerificationCode()}
            type="button"
            className="btn btn-dark btn-lg fw-bold pt-2"
            style={{ width: "295px", marginTop: "32px" }}
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
              style={{ width: "295px", marginTop: "32px" }}
            >
              Continue
            </button>
            <div
              className="DidNotGetCodeResendCode"
              style={{ textAlign: "center" }}
            >
              <span
                style={{
                  color: "#7F7F7F",
                  fontSize: 16,
                  fontFamily: "Inter",
                  fontWeight: "300",
                  wordWrap: "break-word",
                }}
              >
                Did not get code?{" "}
              </span>
              <span
                onClick={() => {
                  sendEmailVerificationCode();
                }}
                style={{
                  color: "#6C7CEB",
                  fontSize: 16,
                  fontFamily: "Inter",
                  fontWeight: "400",
                  cursor: "pointer",
                }}
              >
                Resend Code
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationComponent;
