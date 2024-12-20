/*global chrome*/
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { defaultCharitiesUrl, getUserByEmailUrl, updateUserUrl } from "../../api/env";
import ExtensionNavbar from "./ExtensionNavbar";

const getUserByEmail = async (email) => {
  if (!email) {
    throw new Error("NO EMAIL PROVIDED");
  }
  try {
    // URL-encode the email to handle special characters like +
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(`${getUserByEmailUrl}?email=${encodedEmail}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

const getDefaultCharities = async () => {
  try {
    const response = await fetch(`${defaultCharitiesUrl}?`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

async function updateUser(email, updates) {
  try {
    const response = await fetch(updateUserUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, ...updates }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${errorText}`);
    }

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error('Failed to update user:', error.message);
  }
}

export function sendMessageToExtension(data, extensinoId) {
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(extensinoId, { action: "sendData", data: data }, (response) => {
      console.log("Response from extension:", response);
    });

    chrome.runtime.sendMessage(extensinoId, { action: "userSettings", data }, (response) => {
      console.log("Response from extension:", response);
    });

    chrome.runtime.sendMessage(extensinoId, { action: "userSettingsFromPopup", data: null }, (response) => {
      console.log("Response from extension:", response);
    });

    chrome.runtime.sendMessage(extensinoId, { action: "userSettingsFromGoogleSearch", data: null }, (response) => {
      console.log("Response from extension:", response);
    });

    chrome.runtime.sendMessage(extensinoId, { action: "userSettingsFromMerchant", data: null }, (response) => {
      console.log("Response from extension:", response);
    });
    
  } else {
    console.log("Chrome extension not detected.");
  }
}

const DEFAULT_CHARITY = {
  address: "PO BOX 1055 STN MAIN",
  category: "0001",
  charityType: "Relief of Poverty",
  city: "Barrie",
  country: "CA",
  effectiveDateOfStatus: "",
  isActive: true,
  logo: "https://i.imgur.com/JGT9FfJ.png",
  organizationName: "The Busby Centre",
  postalCode: "L4M 5E1",
  provinceTerritoryOutsideOfCanada: "ON",
  registrationNumber: "892557752RR0001",
  sanctionDesignation: "0001",
  status: "Registered",
  typeOfQualifiedDone: "Charity",
};

export default function ExtensionSettings(props) {
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [defaultCharities, setDefaultCharities] = useState([]);
  const [extensinoIdLocal, setExtensinoIdLocal] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //TODO: Replace the following line with the line after
  // when the email is passed from the previous page
  const [email, setEmail] = useState(null);


  useEffect(() => {
    if (location.state?.lastLoggedIn) {
      const updateLastLoggedIn = async () => {
        if (!location.state?.email ) return; // If email is not provided, exit

        await updateUser(location.state?.email, { lastLoggedIn: new Date() });
      };
      updateLastLoggedIn();
    }
  }, [location.state?.lastLoggedIn, location.state?.email ])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const savedEmail = location.state?.email || localStorage.getItem("sc-user");
        const userData = await getUserByEmail(savedEmail);
        const fetchedCharities = await getDefaultCharities();
        setDefaultCharities(fetchedCharities);
        setFirstName(userData?.firstName);
        setLastName(userData?.lastName);
        setSelectedCharity(
          userData?.selectedCharityObject?.organizationName || DEFAULT_CHARITY.organizationName,
        );
        setEmail(userData?.email);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    let selectedCharityObject;

    console.log('charity changed', selectedCharityObject)

    selectedCharity &&
      defaultCharities &&
      defaultCharities.map(({ data: charity }) => {
        if (charity?.organizationName === selectedCharity) {
          selectedCharityObject = charity;
        }
      });

    const updates = {
      firstName,
      lastName, 
      selectedCharityObject,
      email,
    };


    const extensinoId = localStorage.getItem("sc-extensionId");
    setExtensinoIdLocal(extensinoId);

    localStorage.setItem("sc-userSettings", JSON.stringify(updates));

    extensinoId && sendMessageToExtension({ ...updates }, extensinoId);
  }, [selectedCharity, defaultCharities, firstName, lastName, email]);

  const handleSave = async () => {
    let selectedCharityObject;

    defaultCharities.map(({ data: charity }) => {
      if (charity?.organizationName === selectedCharity) {
        selectedCharityObject = charity;
      }
    });

    const updates = {
      firstName,
      lastName,
      selectedCharityObject,
      email,
    };

    try {
      setLoading(true);
      extensinoIdLocal && sendMessageToExtension({ ...updates }, extensinoIdLocal);
      await updateUser(email, updates);
      console.log("User Updated");
      setLoading(false);
      // window.open("https://sponsorcircle.com/welcomeshop/", "_blank");
    } catch (error) {
      console.log("ERROR", error);
      setLoading(false);
    }
  };

  const handleUpdateCharity = async (organizationName) => {

    let selectedCharityObject;

    defaultCharities.forEach(({ data: charity }) => {
      if (charity.organizationName === organizationName) {
        selectedCharityObject = charity;
      }
    });

    const updates = {
      firstName,
      lastName,
      selectedCharityObject,
      email,
    };


    try {
      extensinoIdLocal && sendMessageToExtension({ ...updates }, extensinoIdLocal);
      setSelectedCharity(organizationName);
      await updateUser(email, updates);
      console.log("User Updated");
    } catch (error) {
      console.log("ERROR", error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ExtensionNavbar />
      <div style={{ width: "1180px", margin: "auto", marginTop: '20px' }} className="h-full">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="fs-1 fw-bold pt-5">Your Settings</div>
            <div
              style={{
                textAlign: "center",
                color: "black",
                fontSize: 18,
                fontFamily: "Inter",
                fontWeight: "400",
                wordWrap: "break-word",
              }}
            >
              Add your profiles’s information and select a charity of your choice.{" "}
            </div>
          </div>
          <div>
            <img style={{ width: "200px", position: 'relative', top: '70px' }} src="https://i.imgur.com/BO1v7ec.png" alt="heart" />
          </div>
        </div>

        <div className="d-flex flex-column">
          <div className="d-flex mb-3" style={{ gap: "100px" }}>
            <div className="w-full">
              <div
                style={{
                  color: "#927FC5",
                  fontSize: 24,
                  fontFamily: "Inter",
                  fontWeight: "500",
                }}
              >
                First Name:
              </div>
              <TextField
                id="standard-basic"
                variant="standard"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                sx={{ width: "100%" }}
              />
            </div>
            <div className="w-full">
              <div
                style={{
                  color: "#927FC5",
                  fontSize: 24,
                  fontFamily: "Inter",
                  fontWeight: "500",
                }}
              >
                Last Name:
              </div>
              <TextField
                id="standard-basic"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                variant="standard"
                sx={{ width: "100%" }}
              />
            </div>
          </div>
          <div className="mb-3">
            <div
              style={{
                color: "#927FC5",
                fontSize: 24,
                fontFamily: "Inter",
                fontWeight: "500",
              }}
            >
              Email:
            </div>
            <TextField
              id="standard-basic"
              variant="standard"
              value={email}
              disabled={true}
              sx={{ width: "100%" }}
            />
          </div>
          <div className="mb-4">
            <div
              style={{
                color: "#927FC5",
                fontSize: 24,
                fontFamily: "Inter",
                fontWeight: "500",
              }}
            >
              Choose your Charity:
            </div>
            <TextField
              select
              defaultValue={DEFAULT_CHARITY.organizationName}
              onChange={(event) => handleUpdateCharity(event.target.value)}
              value={selectedCharity}
              variant="standard"
              placeholder="Search for a charity"
              sx={{ width: "100%" }}
            >
              {defaultCharities &&
              defaultCharities
                .filter(({ data: defaultCharity }) => defaultCharity.isActive) // Filter out inactive charities
                .sort((a, b) => {
                  const nameA = a.data.organizationName.toLowerCase();
                  const nameB = b.data.organizationName.toLowerCase();
                  return nameA.localeCompare(nameB); // Alphabetical sort
                })
                .map(({ data: defaultCharity }) => (
                  <MenuItem key={defaultCharity.id} value={defaultCharity.organizationName}>
                    {defaultCharity.organizationName}
                  </MenuItem>
                ))}
            </TextField>
          </div>
        </div>

        <div>
          <h6 className="mt-3 italic">Don't see your charity? <a rel="noreferrer" target="_blank" href="https://sponsorcircle.com/shopforgood/" >Let us know</a> and we'll reach out to them!</h6>
          <hr></hr>
          
          <h4 className="mt-4 mb-2">Don’t have a charity in mind? Explore some charities below:</h4>
          <a className="d-flex justify-content-left mb-4 text-decoration-none" href="https://sponsorcircle.com/welcomeshop/" target="_blank" style={{ textAlign: "center", marginTop: "20px" }} rel="noreferrer">
          <button
            disabled={!selectedCharity || firstName === ""}
            style={{ width: "295px", height: "56px", borderRadius: 16 }}
            onClick={handleSave}
            type="button"
            className="btn btn-dark fw-bold mb-3"
          >
            Save
          </button>
        </a>

          <div className="d-flex flex-wrap justify-content-space-between mt-3" style={{ gap: 12 }}>
            {defaultCharities &&
              defaultCharities
                .filter(({ data: defaultCharity }) => defaultCharity.isActive) // Filter out inactive charities
                .sort((a, b) => {
                  const nameA = a.data.organizationName.toLowerCase();
                  const nameB = b.data.organizationName.toLowerCase();
                  return nameA.localeCompare(nameB); // Alphabetical sort
                })
              .map(({ data: defaultCharity }) => {

                return (
                  defaultCharity?.isActive && (
                    <div
                      onClick={()=> handleUpdateCharity(defaultCharity.organizationName)}
                      key={defaultCharity.id}
                      style={{
                        border: `${defaultCharity.organizationName === selectedCharity ? '2px solid blue' : '1px solid'}`,
                        width: "340px",
                        height: "148px",
                        borderRadius: "15px",
                        padding: "12px",
                        boxSizing: "border-box",
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        className="container-row w-full"
                        style={{ flexDirection: "row", display: "flex" }}
                      >
                        <img
                          className="Rectangle22 w-[66.28px] h-[75px] bg-grey rounded-lg"
                          src={defaultCharity.logo}
                        />
                        <div
                          style={{
                            flexDirection: "column",
                            display: "flex",
                            alignItems: "flex-start",
                          }}
                          className="w-full p-1"
                        >
                          <div className="CharityName w-5/6 text-black text-lg font-bold font-['Inter'] truncate">
                            {defaultCharity.organizationName}
                          </div>
                          <div className="truncate text-start Ein123456789 w-full text-sm font-semibold font-['Inter']">
                            EIN: {defaultCharity.registrationNumber}
                          </div>
                          <div className="truncate text-start CityProvince w-full text-black text-sm font-semibold font-['Inter']">
                            {defaultCharity?.city}, {defaultCharity?.country}
                          </div>
                        </div>
                      </div>
                      <div className="text w-[fit-content] text-black text-sm font-light font-['Inter']">
                        <div>Type: {defaultCharity.typeOfQualifiedDone}</div>
                        <div>status: {defaultCharity.status}</div>
                      </div>
                    </div>
                  )
                );
              })}
          </div>
        </div>

        {
          !extensinoIdLocal && 
          (
            <div>
              <hr></hr>
              <DownloadExtensionPrompt />
            </div>
          )
        }
      </div>
    </>
  );
}


const DownloadExtensionPrompt = () => {
  return (
    <a
      href="https://chromewebstore.google.com/detail/shop-for-good/pifflcabiijbniniffeakhadehjilibi"
      target="_blank"
      rel="noopener noreferrer"
      className="flex justify-center items-center pt-4 bg-gray-100 cursor-pointer no-underline mb-5"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-lg w-full">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Get Our Google Chrome Extension
        </h2>

        {/* Logos with "+" in the center */}
        <div className="flex justify-center items-center space-x-4 mb-6">
          {/* Extension Logo from public folder */}
          <img
            src="/logo_3.png"
            alt="Extension Logo"
            className="w-24 h-24 object-contain"
          />
          <span className="text-3xl font-bold text-gray-800">+</span>
          {/* Google Chrome Logo */}
          <img
            src="https://www.google.com/chrome/static/images/chrome-logo-m100.svg"
            alt="Google Chrome"
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Text */}
        <p className="text-gray-600">
          Add our extension to your Google Chrome browser for a better experience!
        </p>
      </div>
    </a>
  );
};