import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import { List, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { FiSettings, FiInfo } from "react-icons/fi";

import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firestore, auth } from "../utils/firebase";

const GroupList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [form] = Form.useForm();
  const [curItem, setCurItem] = useState(null);
  console.log("user = ", user);
  const getMyGroups = async () => {
    try {
      const collectionGroups = collection(firestore, "groups");
      const q = query(collectionGroups);
      const querySnapshot = await getDocs(q);
      let listData = [];
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (d) => {
          //   console.log("doc = ", d);
          let item = {
            ...d.data(),
            id: d.id,
          };
          listData.push(item);
        });
      }
      let newData = [];
      listData.forEach((v) => {
        if (v.leader.uid == user.uid) {
          newData.push(v);
        } else {
          v.members.forEach((ele) => {
            if (ele.uid == user.uid) {
              newData.push(v);
            }
          });
        }
      });
      console.log("newData = ", newData);
      setData(newData);
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
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      getMyGroups();
    }
  }, [user]);

  return (
    <div className="font-lato">
      <Header />
      <div className="px-8 pt-24 ">
        <h1 className="text-center text-4xl font-bold pb-6">My Groups</h1>
        <Modal
          title="Set Fundraising Information"
          open={isModalOpen}
          footer={null}
          onOk={() => {}}
          onCancel={() => {
            setIsModalOpen(false);
          }}
        >
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            onFinish={async (data) => {
              try {
                const docRef = doc(firestore, "groups", curItem.id);
                await updateDoc(docRef, {
                  ...data,
                  createdAt: serverTimestamp(),
                });
                message.success("Successfully set!");
                getMyGroups();
                setIsModalOpen(false);
              } catch (error) {
                console.log("error = ", error);
              }
            }}
            autoComplete="off"
          >
            <Form.Item
              label="Fundraising Amount"
              name="money"
              rules={[
                {
                  required: true,
                  message: "Please enter the fundraising amount!",
                },
              ]}
            >
              <InputNumber
                style={{
                  width: "100%",
                }}
                min={1}
                addonAfter="$"
              />
            </Form.Item>

            <Form.Item
              label="Description"
              name="desc"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter a description of the fundraising project!",
                },
              ]}
            >
              <Input.TextArea placeholder="" />
            </Form.Item>
            <div>
              <button className="bg-deep-purple w-full py-1 rounded-md text-white font-montserrat">
                Submit
              </button>
            </div>
          </Form>
        </Modal>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => {
            let actions = [];
            if (item.leader.uid == user.uid) {
              actions = [
                <FiSettings
                  onClick={() => {
                    setIsModalOpen(true);
                    setCurItem(item);
                    form.setFieldsValue({
                      desc: item.desc || "",
                      money: item.money || "",
                    });
                  }}
                  className="text-lg text-deep-purple"
                  key="1"
                />,
                <FiInfo
                  onClick={() => {
                    navigate(`/groupresult?id=${item.inviteCode}`);
                  }}
                  className="text-lg text-deep-purple"
                  key="2"
                />,
              ];
            } else {
              actions = [
                <FiSettings className="text-lg text-gray disabled" key="1" />,
                <FiInfo
                  onClick={() => {
                    navigate(`/groupresult?id=${item.inviteCode}`);
                  }}
                  className="text-lg text-deep-purple"
                  key="2"
                />,
              ];
            }

            return (
              <List.Item actions={actions}>
                <List.Item.Meta
                  title={<div className="font-bold">{item.teamName}</div>}
                  description={`${item.members.length + 1} people`}
                />
                <div
                  className="text-red text-lg"
                  style={{
                    color: "red",
                  }}
                >
                  {item.money ? `${item.money} $` : ""}
                </div>
              </List.Item>
            );
          }}
        />
      </div>
      <Navbar />
    </div>
  );
};

export default GroupList;
