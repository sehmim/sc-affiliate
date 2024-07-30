import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

const LOCAL_ENV = false;
export const sendVerificationCodeUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/sendVerificationCode" : "https://sendverificationcode-6n7me4jtka-uc.a.run.app";
export const verifyVerificationCode = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/verifyVerificationCode" : "https://verifyverificationcode-6n7me4jtka-uc.a.run.app";
export const createUserUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/createUser" : "https://createuser-6n7me4jtka-uc.a.run.app";
export const getUserByEmailUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getUser" : "https://getuser-6n7me4jtka-uc.a.run.app";
export const updateUserUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/updateUser": "https://updateuser-6n7me4jtka-uc.a.run.app";
export const defaultCharitiesUrl = LOCAL_ENV ? "http://127.0.0.1:5001/sponsorcircle-3f648/us-central1/getDefaultCharities" : "https://getdefaultcharities-6n7me4jtka-uc.a.run.app";


const EmailVerificationComponent = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationCodeRequested, setVerificationCodeRequested] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const sendEmailVerificationCode = async () => {

    try {
      setLoading(true);

      //Note: email is the state variable that holds the email address
      const response = await fetch(
        `${sendVerificationCodeUrl}?email=${encodeURIComponent(email)}`
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

  const verifyCode = async (email, verificationCode) => {
    const response = await fetch(
      `${verifyVerificationCode}?email=${encodeURIComponent(email)}&code=${encodeURIComponent(verificationCode)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.ok;
  };

  const loginUser = async () => {
    try {
      setLoading(true);

      const isVerified = await verifyCode(email, verificationCode);

      const params = new URLSearchParams(window.location.search);
      let extensionId = params.get('extensionId');

      if(!extensionId){
        extensionId = localStorage.getItem('sc-extensionId')
      }


      if (isVerified) {
        try {
          await createUser(email);
          localStorage.setItem('sc-user', email);
          localStorage.setItem('sc-extensionId', extensionId);
          navigate("/extension-settings", { state: { email: email } });
        } catch (error) {
          console.error("Error creating user:", error);
        }
      } else {
        console.error("OTP verification failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

    const createUser = async (email) => {
    try {
      const response = await fetch(createUserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
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
