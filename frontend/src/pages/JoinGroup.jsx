import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { BiChevronRight } from "react-icons/bi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  List,
  Button,
  Modal,
  Avatar,
  Input,
  InputNumber,
  message,
  Space,
} from "antd";
import { BsPeopleFill, BsPersonFillAdd } from "react-icons/bs";
import { BiHistory } from "react-icons/bi";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  getDocs,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { firestore, auth } from "../utils/firebase";
import group from "../img/group-2.jpg";

const JoinGroup = () => {
  const navigate = useNavigate();
  const [detail, setDetail] = useState({});
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  console.log("user = ", user)
  //   console.log('secondsToDays() = ', secondsToDays(1697708380))
  const getDetail = async () => {
    try {
      const collectionGroups = collection(firestore, "groups");
      const q = query(collectionGroups, where("inviteCode", "==", id));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        message.error("Invitation code group that does not exist!");
        return;
      }
      querySnapshot.forEach(async (d) => {
        let item = {
          ...d.data(),
          id: d.id,
        };
        console.log("item = ", item);
        setDetail(item);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("please log in first!");
        navigate("/login");
      } else {
        // console.log("user = ", user);
        setUser(user.toJSON());
        getDetail();
      }
    });
  }, []);
  const handleJoin = async () => {
    try {
      const collectionGroups = collection(firestore, "groups");
      const q = query(collectionGroups, where("inviteCode", "==", id));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        message.error("Invitation code group that does not exist!");
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
          return;
        }
        if (!item.members) {
          item.members = [];
        }
        for (let i = 0; i < item.members.length; i++) {
          let v = item.members[i];
          if (v.uid == user.uid) {
            message.error("You have joined the group!");
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
        message.success("Joined successfully!");
        navigate(`/member?id=${id}`);
        console.log("item = ", item);
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="font-lato">
      <Header />

      <div className="px-8 flex flex-col h-screen items-center justify-center">
        <div className="flex flex-col gap-2">
          <h1
            style={{
              textAlign: "center",
            }}
            className="text-4xl font-montserrat font-bold"
          >
            {detail?.teamName} ({id})
          </h1>
          <p
            style={{
              textAlign: "center",
            }}
            className="text-grey"
          >
            This is a group invitation link, clicking Join Now means you will
            join the group
          </p>
        </div>
        <img className="w-ful" src={group} alt="" />
        <div className="flex flex-row items-center justify-center gap-5 mt-10">
          <button
            onClick={handleJoin}
            className="px-4 py-1 rounded-md text-white font-montserrat bg-deep-purple"
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroup;
