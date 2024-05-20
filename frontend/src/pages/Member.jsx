import React, { useState, useEffect } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { message, Avatar, Empty } from "antd";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../utils/firebase";

const Member = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState({
    leader: {},
    members: []
  });
  const [user, setUser] = useState(null);
  const id = searchParams.get("id");
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
  const getDetail = async () => {
    try {
      const collectionGroups = collection(firestore, "groups");
      const q = query(
        collectionGroups,
        where("inviteCode", "==", searchParams.get("id") || localStorage.getItem('groupCode'))
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        message.error("Group does not exist!");
        return;
      }
      querySnapshot.forEach(async (d) => {
        let item = {
          ...d.data(),
          id: d.id,
        };
        // item.members.unshift(item.leader);
        console.log("item ===>", item)
        setDetail(item);
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDetail();
  }, []);
  console.log("detail = ", detail);

  const handleRemove = async (index) => {
    console.log("index = ", index)
    try {
      console.log("detail = ", detail);
      let deepDetail = { ...detail };
      let members = [...detail?.members] || [];
      let optRes = members.splice(index - 1, 1);
      console.log("optRes = ", optRes)
      console.log("members = ", members)
      deepDetail.members = members;
      const docRef = doc(firestore, "groups", detail.id);
      console.log("members = ", members)
      await updateDoc(docRef, {
        members,
      });
      console.log("deepDetail = ", deepDetail)
      setDetail(deepDetail);
      message.success("Successfully removed!");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="font-lato">
      <header className="fixed top-0 z-10 bg-white w-full h-16 px-5 py-3 flex items-center border-b-2 border-deep-purple shadow shadow-royal-purple">
        <div className="">
          <Link to="/groupresult">
            <BiChevronLeft className="text-4xl inline-block cursor-pointer text-pink-empahsis" />
            <span className="inline-block cursor-pointer">Back</span>
          </Link>
        </div>
      </header>
      <div className="mt-20 px-8 pb-10">
        <h1 className="text-3xl text-deep-purple font-montserrat">
          {detail.teamName}
        </h1>
        <Link to="/invite">
          <button className="mt-5 py-2 bg-deep-purple rounded-md px-5 text-lg text-white font-montserrat">
            Invite Member
          </button>{" "}
        </Link>
      </div>
      <div>Group Name: { detail.teamName }</div>
      <div>Number of Members: { detail.members.length }</div>

      <div className="mt-10 flex justify-center">
        <div className="w-10/12 border border-deep-purple shadow-xl rounded-lg">
          <h2 className="w-full h-10 px-5 flex items-center rounded-t text-xl">
            Active Member
          </h2>
          {detail.leader.uid && [detail.leader, ...detail.members].map((item, index) => {
            return (
              <div
                key={index}
                className="flex item justify-between items-center py-2 px-4"
              >
                {/* <div className="h-10 w-10 rounded-full bg-deep-purple">

                </div> */}
                <Avatar
                  style={{
                    backgroundColor: "purple",
                    verticalAlign: "middle",
                  }}
                  size="large"
                  gap={4}
                >
                  {item.email}
                </Avatar>
                <div>
                  <div>{item.email}</div>
                  <div>{index == 0 && detail.leader.uid == item.uid ? "Leader" : "Member"}</div>
                </div>

                <div>
                  {/* <FiMoreVertical className="text-3xl" /> */}
                  {index !== 0 && user.uid == detail.leader.uid && (
                    <FiTrash2
                      onClick={() => {
                        handleRemove(index);
                      }}
                      className="text-3xl"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Member;
