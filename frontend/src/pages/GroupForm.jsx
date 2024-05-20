import React, { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../utils/firebase";
import { getAuth } from "firebase/auth";
const auth = getAuth();

const GroupForm = () => {

  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [num, setNum] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const generateInviteCode = (inputString, length = 6) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let hash = 0;

    for (let i = 0; i < inputString.length; i++) {
      const char = inputString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
    }
    let inviteCode = "";
    while (inviteCode.length < length) {
      const index = Math.abs(hash % characters.length);
      inviteCode += characters.charAt(index);
      hash = Math.floor(hash / characters.length);
    }

    return inviteCode;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    // console.log("teamName = ", teamName);
    // console.log("num = ", num);
    // console.log("role = ", role);
    if (!teamName) {
      message.error("Please enter Team name!");
      return;
    }
    if (!num) {
      message.error("Please enter Number of mebers!");
      return;
    }
    // if (!role) {
    //   message.error("Please select Your role!");
    //   return;
    // }
    setLoading(true);
    try {
      const resData = await addDoc(collection(firestore, "groups"), {
        num,
        leader: {
          email: auth.currentUser.email,
          name: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL,
          uid: auth.currentUser.uid
        },
        teamName,
        members: []
      });
      let inviteCode = generateInviteCode(resData.id);
      const docRef = doc(firestore, "groups", resData.id);
      await updateDoc(docRef, {
        inviteCode,
      });
      message.success("Created successfully!");
      setLoading(false);
      localStorage.setItem('groupCode', inviteCode);
      navigate(`/member?id=${inviteCode}`);
    } catch (err) {
      setLoading(false);
      message.error("Service error!");
      console.log(err);
    }
  };

  return (
    <div className="font-lato">
      <Header />
      <div className="flex flex-col h-screen items-center justify-center">
        <form className="border border-deep-purple bg-white shadow-xl w-9/12 flex flex-col items-center gap-2 py-5 rounded-md">
          <h1 className="text-xl">
            Create Your Group
          </h1>
          <div className='w-10/12'>
            <label htmlFor="teamname" className="text-deep-purple">
              Team name
            </label>
            <input
              className="w-full py-2 px-2 border-b-2 focus:border-deep-purple outline-none"
              type="text"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
              }}
              id="teamname"
            ></input>
          </div>
          <div className='w-10/12'>
            <label htmlFor="number" className="text-deep-purple">
            Number of mebers
          </label>
          <input
            className="w-full py-2 px-2 border-b-2 focus:border-deep-purple outline-none"
            type="text"
            value={num}
            onChange={(e) => {
              setNum(e.target.value);
            }}
            id="number"
          ></input>
          </div>
          {/* <div className='w-10/12'>
            <label htmlFor="role" className="text-deep-purple">
            Your Role
          </label>
          <select
            className="w-full py-2 px-2 border-b-2 focus:border-deep-purple outline-none"
            name="role"
            id="role"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
            }}
          >
            <option
              className="w-10/12"
              value=""
              disabled
              selected
              hidden
            ></option>
            <option value="leader">Leader</option>
            <option value="member">Member</option>
          </select>
          </div> */}
          
          <button
            disabled={loading}
            onClick={handleCreate}
            className="py-2 w-10/12 bg-deep-purple text-white rounded-md font-montserrat"
          >
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupForm;
