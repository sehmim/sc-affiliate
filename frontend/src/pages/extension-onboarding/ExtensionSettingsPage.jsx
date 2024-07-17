    /*global chrome*/
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import { defaultCharitiesUrl, getUserByEmailUrl, updateUserUrl } from "./EmailVerificationComponent";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem('sc-user', null);
    navigate('/onboard');
  }

  return (
  <header className="top-0 z-10 bg-white w-full h-20 px-5 py-3 flex justify-between items-center shadow">
    <div className="d-flex justify-content-between w-100">
      <a href="/extension-settings">
        <img
          className="w-60"
          src={"https://i.imgur.com/UItnKy8.png"}
          alt="logo"
        />
      </a>
      <div>
        <span className="mr-4">Settings</span>
        <button
          onClick={handleLogout}
          type="button"
          className="btn btn-dark fw-bold"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
  )
};

const EXTENSION_ID = 'peghdomcocfapnefecheageicmcjheke';

const getUserByEmail = async (email) => {
  if(!email){
    throw new Error("NO EMAIL PROVIDED")
  }
  try {
    const response = await fetch(`${getUserByEmailUrl}?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

const getDefaultCharities = async () => {
    try {
    const response = await fetch(`${defaultCharitiesUrl}?`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

  const updateUser = async (email, updates) => {
    try {
      const response = await fetch(updateUserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, updates }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.status;

    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

function sendMessageToExtension(data, extensinoId) {
  
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
    chrome.runtime.sendMessage(
      extensinoId, 
      { action: "sendData", data: data },
      (response) => {
        console.log("Response from extension:", response);
      }
    );
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
  typeOfQualifiedDone: "Charity"
};

export default function ExtensionSettings(props) {
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [defaultCharities, setDefaultCharities] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //TODO: Replace the following line with the line after
  // when the email is passed from the previous page
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const savedEmail = location.state?.email || localStorage.getItem('sc-user');
        const userData = await getUserByEmail(savedEmail);
        const fetchedCharities = await getDefaultCharities();
        setDefaultCharities(fetchedCharities);
        setFirstName(userData?.firstName);
        setLastName(userData?.lastName);
        setSelectedCharity(userData?.selectedCharityObject?.organizationName || DEFAULT_CHARITY.organizationName);
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

    selectedCharity && defaultCharities && defaultCharities.map(({ data: charity }) => {
      if(charity?.organizationName === selectedCharity){
        selectedCharityObject = charity;
      }
    })

    const updates = {
      firstName, lastName, selectedCharityObject, email
    }

    console.log("UPDATES: ", updates)

    const extensinoId = localStorage.getItem('sc-extensionId');

    sendMessageToExtension({...updates}, extensinoId);
  }, [selectedCharity, defaultCharities])

  const handleSave = async () => {

    let selectedCharityObject;

    defaultCharities.map(({ data: charity }) => {
      if(charity?.organizationName === selectedCharity){
        selectedCharityObject = charity;
      }
    })

    const updates = {
      firstName, lastName, selectedCharityObject, email
    }

    console.log("UPDATES: ", updates)
    const extensinoId = localStorage.getItem('sc-extensionId');

    try {
      setLoading(true);
      sendMessageToExtension({...updates}, extensinoId);
      await updateUser(email, updates)
      console.log("User Updated")
      setLoading(false);
      window.open('https://sponsorcircle.com/shopforgood/', '_blank');
    } catch (error) {
      console.log("ERROR", error)
      setLoading(false);
    }
  }

  if(loading){
    return (<div>Loading...</div>)
  }

  return (
    <>
      <Navbar />
      <div
        style={{ width: "1180px", margin: "auto" }}
        className="h-full mt-20 p-10"
      >
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
              Add your profiles’s information and select a charity of your
              choice.{" "}
            </div>
          </div>
          <div>
            <img
              style={{ width: "200px" }}
              src="https://i.imgur.com/BO1v7ec.png"
              alt="heart"
            />
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
          <div className="mb-10">
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
          <div className="mb-10" style={{ marginTop: "40px" }}>
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
              onChange={(event) => setSelectedCharity(event.target.value)}
              value={selectedCharity}
              variant="standard"
              placeholder="Search for a charity"
              sx={{ width: "100%" }}
            >
              {
                defaultCharities && defaultCharities.map(({data: defaultCharity}) => {
                  return(
                    defaultCharity.isActive &&
                    <MenuItem  key={1} value={defaultCharity.organizationName}>
                      {defaultCharity.organizationName}
                    </MenuItem>
                  )
                })
              }
            </TextField>
          </div>
        </div>

        <div>
          <div>Don’t have a charity in mind? Explore some charities below.</div>
          <div
            className="d-flex justify-content-space-between mt-3"
            style={{ gap: 12 }}
          >
            {
              defaultCharities && defaultCharities.map(({data: defaultCharity}) => {
                return (
                  defaultCharity?.isActive && 
                <div
                  style={{
                    border: "1px solid",
                    width: "340px",
                    height: "148px",
                    borderRadius: "15px",
                    padding: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="container-row w-full"
                    style={{ flexDirection: "row", display: "flex" }}
                  >
                    <img className="Rectangle22 w-[66.28px] h-[75px] bg-grey rounded-lg" src={defaultCharity.logo} />
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
              })
            }
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            style={{ width: "295px", height: "56px", borderRadius: 16 }}
            onClick={handleSave}
            type="button"
            className="btn btn-dark fw-bold mt-3"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
