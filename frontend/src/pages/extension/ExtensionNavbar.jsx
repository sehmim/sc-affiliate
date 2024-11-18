import React from "react";
import { useNavigate } from "react-router-dom";
import { sendMessageToExtension } from "./ExtensionSettingsPage";

export default function ExtensionNavbar(){
  const navigate = useNavigate();

  const handleLogout = () => {
    const extensinoId = localStorage.getItem("sc-extensionId");
    sendMessageToExtension(null, extensinoId);
    localStorage.removeItem("sc-user");
    localStorage.setItem("sc-userSettings");

    navigate(`/onboard?extensinoId=${extensinoId}`);
  };

  return (
    <header style={{ position: 'fixed' }} className="top-0 z-10 bg-white w-full h-20 px-5 py-3 flex justify-between items-center shadow">
      <div className="d-flex justify-content-between w-100 items-center">
        <a href="/extension-settings">
          <img className="w-60" src={"https://i.imgur.com/UItnKy8.png"} alt="logo" />
        </a>
        <div className="flex items-center">
          <span onClick={() => navigate('/merchants')} className="mr-4 p-3 cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out">Merchants</span>
          <span onClick={() => navigate('/extension-settings')} className="mr-4 p-3 cursor-pointer hover:shadow-md transition-shadow duration-300 ease-in-out">Settings</span>
          <button onClick={handleLogout} type="button" className="btn btn-dark fw-bold">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};
