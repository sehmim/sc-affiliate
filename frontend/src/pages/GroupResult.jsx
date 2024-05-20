import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { BiChevronRight } from "react-icons/bi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { List, Button, Modal, Avatar, Input, InputNumber, message } from "antd";
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
import ProgressBar from "@ramonak/react-progress-bar";

const GroupResult = () => {
  const navigate = useNavigate();
  const [money, setMoney] = useState("");
  const [detail, setDetail] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || localStorage.getItem('groupCode');
  const secondsToDays = (timestamp) => {
    const milliseconds = timestamp * 1000;
    const date = new Date(milliseconds);
    const today = new Date();
    const timeDiff = Math.abs(today - date);
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff;
  };
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
  let total = 0;
  detail?.records?.forEach((v) => {
    total += Number(v.money);
  });
  //   console.log("total = ", total);

  return (
    <div className="font-lato">
      <Header />
      <Modal
        title="Donation Records"
        open={isModalOpen}
        footer={null}
        onOk={() => {}}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={detail?.records}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      backgroundColor: "purple",
                      verticalAlign: "middle",
                    }}
                  >
                    {item?.user?.email}
                  </Avatar>
                }
                title={<div className="font-bold">{item?.user?.email}</div>}
                // description={index + 1}
              />
              <div
                className="text-red text-lg"
                style={{
                  color: "red",
                }}
              >
                {item.money}$
              </div>
            </List.Item>
          )}
        />
      </Modal>


      <div>
        Team Name: {detail.teamName}
      </div>
      <div className="px-8 flex flex-col h-screen items-center justify-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-montserrat font-bold">{detail?.teamName}</h1>
          <p className="text-grey">
            Funds will be collected to purchase equipment, costumes and
            uniforms.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                flex: 1,
                marginRight: 10,
              }}
            >
              <ProgressBar
                completed={detail.money ? (total / detail.money).toFixed(2) * 100 : 0}
                bgColor="#6e38f8"
              />
            </div>
            <BiHistory
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="text-2xl text-deep-purple"
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p className="text-royal-purple font-bold text-4xl">
              $ {detail?.money || 0}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                onChange={(e) => setMoney(e.target.value)}
                style={{
                  width: 50,
                }}
                className="text-xl border-b-2 border-grey outline-none focus:border-deep-purple"
                type="number"
                value={money}
              ></input>
              <span
                style={{
                  marginRight: 5,
                }}
              >
                $
              </span>
              <button
                style={{
                  background: "#6e38f8",
                }}
                onClick={async () => {
                  if (!money) {
                    message.error("Please enter the donation amount!");
                    return;
                  }
                  let records = [];
                  if (detail.records) {
                    records = [...detail.records];
                  }
                  records.push({
                    money,
                    user: {
                      email: user.email || "",
                      displayName: user.displayName || "",
                      photoURL: user.photoURL || "",
                      uid: user.uid,
                      phoneNumber: user.phoneNumber || "",
                    },
                  });
                  const docRef = doc(firestore, "groups", detail.id);
                  await updateDoc(docRef, {
                    records,
                  });
                  message.success("Donation successful!");
                  setMoney("");
                  getDetail();
                }}
                className="px-2 py-1 rounded-md text-white font-montserrat"
              >
                Donate
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-5 mt-10">
          <div className="flex flex-col border-2 border-deep-purple rounded-md p-4">
            <p>Days Remaining</p>
            <h1 className="text-center text-4xl font-bold">
              {secondsToDays(detail?.createdAt?.seconds) || 0}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="font-semibold text-xl">Group Setting</h1>
            <Link
              to={`/member?id=${id}`}
              className="flex flex-row gap-2 items-center justify-between border-t border-grey"
            >
              <BsPeopleFill className="text-2xl" />
              <h1 className="text-lg">Members</h1>
              <BiChevronRight className="text-2xl" />
            </Link>
            <Link
              to={`/invite?id=${id}`}
              className="flex flex-row gap-2 items-center justify-between border-t border-grey"
            >
              <BsPersonFillAdd className="text-2xl" />
              <h1 className="text-lg">Invite</h1>
              <BiChevronRight className="text-2xl" />
            </Link>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default GroupResult;
