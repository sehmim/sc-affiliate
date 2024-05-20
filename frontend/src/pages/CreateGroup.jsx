import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import man from '../img/man.jpg'
import group from '../img/group-2.jpg'
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore, auth } from "../utils/firebase";

const CreateTeam = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("please log in first!");
        navigate("/login");
      } else {
        console.log("user = ", user);
        setUser(user.toJSON());
      }
    });
  }, []);

  const handleJoin = async () => {
    if (!inviteCode) {
      message.error("Please enter inviteCode");
      return;
    }
    setLoading(true);
    // inviteCode
    try {
      const collectionGroups = collection(firestore, "groups");
      const q = query(collectionGroups, where("inviteCode", "==", inviteCode));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        message.error("Invitation code group that does not exist!");
        setLoading(false);
        return;
      }
      querySnapshot.forEach(async (d) => {
        console.log("doc = ", d);
        let item = {
          ...d.data(),
          id: d.id,
        };
        if (user.uid == item?.leader?.uid) {
          message.error("You have joined the group!");
          setLoading(false);
          return;
        }
        if (!item.members) {
          item.members = [];
        }
        for (let i = 0; i < item.members.length; i++) {
          let v = item.members[i];
          if (v.uid == user.uid) {
            message.error("You have joined the group!");
            setLoading(false);
            return;
          }
        }
        console.log("user = ", user);
        item.members.push({
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          uid: user.uid,
          phoneNumber: user.phoneNumber || "",
        });
        const docRef = doc(firestore, "groups", d.id);
        await updateDoc(docRef, {
          members: item.members,
        });
        setLoading(false);
        message.success("Joined successfully!");
        navigate(`/member?id=${inviteCode}`);
        console.log("item = ", item);
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="font-lato">
      <Header />
      <div className='flex flex-col h-screen justify-center gap-5'>
          <div className='flex flex-col items-center'>
              <div className='py-5 flex flex-col items-center gap-2 w-9/12 border shadow-xl rounded-md border-deep-purple'>
                <img src={group} alt="" className='w-3/4'/>           
                <p className='px-5 text-xl text-center'>Create a group so that others can join you</p>
                <Link to='/groupform' className='w-10/12'><button className='p-2 w-full bg-deep-purple text-white rounded-md font-montserrat'>Create Group</button></Link>
              </div>
          </div>
        <div className='flex flex-col items-center'>
           <div className='py-5 flex flex-col items-center gap-2 w-9/12 border shadow-xl rounded-md border-deep-purple '>
              <img src={man} alt="" className='w-1/2'/>  
                <p className='px-5 text-xl text-center'>Already have a group?</p>
                <p className='px-5 text-xl text-center'>Join now</p>
                <div className='w-10/12 flex flex-row gap-2 justify-between'>
                  <input value={inviteCode} onChange={(e) => {setInviteCode(e.target.value);}} className='w-9/12 p-2 border rounded-md' type="text" placeholder='Enter your code'></input>
                  <button disabled={loading} onClick={handleJoin} className='w-3/12 bg-deep-purple text-white rounded-md font-montserrat'>{loading ? "Joining..." : "Join"}</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
