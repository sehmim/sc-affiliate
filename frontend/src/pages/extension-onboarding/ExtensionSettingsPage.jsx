import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const Navbar = () => (
  <header className="top-0 z-10 bg-white w-full h-20 px-5 py-3 flex justify-between items-center shadow">
    <div className="d-flex justify-content-between w-100">
      <a href="/">
        <img
          className="w-60"
          src={"https://i.imgur.com/UItnKy8.png"}
          alt="logo"
        />
      </a>
      <div>
        <span className="mr-4">Settings</span>
        <button
          onClick={() => {}}
          type="button"
          className="btn btn-dark fw-bold"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);

export default function ExtensionSettings(props) {
  const location = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedCharity, setSelectedCharity] = useState(null);
  //TODO: Replace the following line with the line after
  // when the email is passed from the previous page
  //const email = location.state.email;
  const email = "";

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
              //onChange={(e) => setEmail(e.target.value)}
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
              defaultValue={null}
              onChange={(event) => setSelectedCharity(event.target.value)}
              value={selectedCharity}
              variant="standard"
              placeholder="Search for a charity"
              sx={{ width: "100%" }}
            >
              <MenuItem key={1} value={1}>
                Charity 1
              </MenuItem>
              <MenuItem key={2} value={2}>
                Charity 2
              </MenuItem>
            </TextField>
          </div>
        </div>

        <div>
          <div>Don’t have a charity in mind? Explore some charities below.</div>
          <div
            className="d-flex justify-content-space-between mt-3"
            style={{ gap: 12 }}
          >
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
                className="container-row"
                style={{ flexDirection: "row", display: "flex" }}
              >
                <div className="Rectangle22 w-[66.28px] h-[75px] bg-grey rounded-lg" />
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="CharityName w-[121.18px] text-center text-black text-lg font-bold font-['Inter']">
                    Charity Name
                  </div>
                  <div className="Ein123456789 w-[106.16px] text-center text-sm font-semibold font-['Inter']">
                    EIN: 123456789
                  </div>
                  <div className="CityProvince w-[94.14px] text-center text-black text-sm font-semibold font-['Inter']">
                    City, Province
                  </div>
                </div>
              </div>
              <div className="text w-[fit-content] text-black text-sm font-light font-['Inter']">
                Lorem ipsum dolor sit amet consectetur. Adipiscing sit sed non
                enim sollicitudin mi viverra.
              </div>
            </div>
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
                className="container-row"
                style={{ flexDirection: "row", display: "flex" }}
              >
                <div className="Rectangle22 w-[66.28px] h-[75px] bg-grey rounded-lg" />
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="CharityName w-[121.18px] text-center text-black text-lg font-bold font-['Inter']">
                    Charity Name
                  </div>
                  <div className="Ein123456789 w-[106.16px] text-center text-sm font-semibold font-['Inter']">
                    EIN: 123456789
                  </div>
                  <div className="CityProvince w-[94.14px] text-center text-black text-sm font-semibold font-['Inter']">
                    City, Province
                  </div>
                </div>
              </div>
              <div className="text w-[fit-content] text-black text-sm font-light font-['Inter']">
                Lorem ipsum dolor sit amet consectetur. Adipiscing sit sed non
                enim sollicitudin mi viverra.
              </div>
            </div>
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
                className="container-row"
                style={{ flexDirection: "row", display: "flex" }}
              >
                <div className="Rectangle22 w-[66.28px] h-[75px] bg-grey rounded-lg" />
                <div
                  style={{
                    flexDirection: "column",
                    display: "flex",
                    alignItems: "flex-start",
                  }}
                >
                  <div className="CharityName w-[121.18px] text-center text-black text-lg font-bold font-['Inter']">
                    Charity Name
                  </div>
                  <div className="Ein123456789 w-[106.16px] text-center text-sm font-semibold font-['Inter']">
                    EIN: 123456789
                  </div>
                  <div className="CityProvince w-[94.14px] text-center text-black text-sm font-semibold font-['Inter']">
                    City, Province
                  </div>
                </div>
              </div>
              <div className="text w-[fit-content] text-black text-sm font-light font-['Inter']">
                Lorem ipsum dolor sit amet consectetur. Adipiscing sit sed non
                enim sollicitudin mi viverra.
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <button
            style={{ width: "295px", height: "56px", borderRadius: 16 }}
            onClick={() => {}}
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
