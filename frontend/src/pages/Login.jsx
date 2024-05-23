import React from "react";
import Header from "../components/Header";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"; // Import auth methods from Firebase
import { message } from "antd";
import firebase from "../utils/firebase";
import "./styles.css";

const Login = () => {
  // Initialize Firebase auth instance
  const auth = getAuth();

  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      // Sign in with email and password using Firebase auth instance
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/creategroup");
      localStorage.setItem("user", JSON.stringify(email));
      message.success("Success");
      // Redirect or show success message
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle error
      message.error("Failed to sign in");
    }
  };

  return (
    <div className="font-lato" style={{ width: "100%" }}>
      <Header />
      <div
        className="mt-40 flex flex-col items-center gap-2 border border-deep-purple py-5 rounded-lg bg-white shadow-xl"
        style={{ maxWidth: "1200px", margin: "0 auto", marginTop: "160px" }}
      >
        <h1 className="font-montserrat text-3xl text-deep-purple">LOGIN</h1>
        <p className="text-xl">Welcome to SponsorCircle</p>
        <div className="mt-5 flex flex-col w-9/12 gap-2">
          <label htmlFor="email" className="text-deep-purple">
            Email
          </label>
          <input
            style={{ color: "black" }}
            onChange={(e) => setEmail(e.target.value)}
            className="text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple"
            type="text"
            id="email"
          ></input>
          <label htmlFor="email" className="text-deep-purple">
            Password
          </label>
          <input
            style={{ color: "black" }}
            onChange={(e) => setPassword(e.target.value)}
            className="text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple"
            type="password"
            id="password"
          ></input>
        </div>
        <a className="text-grey" href="">
          Forgot Password?
        </a>
        <button
          className="my-2 w-3/12 bg-deep-purple text-white text-xl py-2 rounded-md font-montserrat"
          onClick={handleLogin}
        >
          Sign In
        </button>
        <div className="flex flex-col w-3/12 gap-2 justify-center">
          <button className="flex flex-row gap-5 align-center border-2 py-2 px-2 rounded-md border-blue">
            <FcGoogle className="text-3xl" />
            <p className="text-lg text-blue">Sign In with Google</p>
          </button>
        </div>
        <p className="text-grey">
          New to SponsorCircle?
          <a className="pl-2 text-deep-purple" href="/register">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
