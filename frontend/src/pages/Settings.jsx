import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { firestore, auth } from "../utils/firebase";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { BiChevronLeft } from "react-icons/bi";

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        alert("please log in first!");
        navigate("/login");
      } else {
        // console.log("user = ", user);
        setUser(user.toJSON());

        if (user.displayName) {
          let displayNameArr = user.displayName.split("~");
          if (displayNameArr[0]) {
            setFirstName(displayNameArr[0]);
          }
          if (displayNameArr[1]) {
            setSecondName(displayNameArr[1]);
          }
        }
      }
    });
  }, []);
  // console.log("user = ", user?.displayName);

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    console.log("currentUser111 = ", currentUser);
    if (firstName || secondName) {
      let displayNameArr = currentUser.displayName.split("~");
      // 更新用户的元信息
      updateProfile(currentUser, {
        displayName: `${firstName}~${secondName}`,
      })
        .then(() => {
          // 更新成功
          console.log("用户元信息已成功更新");
          message.success("User basic information updated successfully!");
        })
        .catch((error) => {
          // 更新失败
          console.error("更新用户元信息时出错：", error);
        });
    }
    if (password) {
      if (!oldPassword) {
        message.error("Please enter the original password!");
        return;
      }
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        oldPassword
      );
      reauthenticateWithCredential(currentUser, credential)
        .then(() => {
          // 用户已经重新验证，现在可以执行需要验证身份的操作
          // 例如：修改密码，更改邮箱地址，删除帐户等
          updatePassword(currentUser, password)
            .then(() => {
              message.success(
                "Password modification successful, please log in again!"
              );
              navigate("/login");
            })
            .catch((error) => {
              console.log("error = ", error.message);
              message.error(error.message);
            });
        })
        .catch((error) => {
          // 验证失败，处理错误
          console.error("重新验证用户时出错：", error);
          message.error(error.message);
        });
    }
  };

  return (
    <div className="font-lato w-full h-screen flex justify-center items-center">
      <header className="fixed top-0 z-10 w-full h-16 px-5 py-3 flex items-center border-b-2 border-deep-purple shadow shadow-royal-purple">
        <Link to="/profile">
          <BiChevronLeft className="text-4xl inline-block cursor-pointer text-pink-empahsis" />
          <span className="inline-block cursor-pointer">Back</span>
        </Link>
      </header>
      <div className="flex flex-col items-center gap-5 border border-deep-purple py-5 rounded-lg bg-white shadow-xl w-9/12">
        <h1 className="font-montserrat text-3xl text-deep-purple">
          USER SETTINGS
        </h1>
        <div className="w-9/12 flex flex-col gap-2">
          {/* <div className="flex flex-row justify-around items-center">
            <div className=" w-20 h-20 bg-royal-purple rounded-full"></div>
            <button className="bg-deep-purple text-white p-2 rounded-md font-montserrat">
              Upload
            </button>
          </div> */}
          <label htmlFor="firstname" className="text-deep-purple">
            First Name
          </label>
          <input
            className="text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple"
            type="text"
            id="firstname"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
          ></input>
          <label htmlFor="lastname" className="text-deep-purple">
            Last Name
          </label>
          <input
            className="text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple"
            type="text"
            id="lastname"
            value={secondName}
            onChange={(e) => {
              setSecondName(e.target.value);
            }}
          ></input>
          <label htmlFor="oldPassword" className="text-deep-purple">
            Old Password
          </label>
          <input
            className="text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple"
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
          ></input>
          <label htmlFor="password" className="text-deep-purple">
            Password
          </label>
          <input
            className="text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple"
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        <button
          onClick={handleSave}
          className="w-9/12 bg-deep-purple text-white text-xl py-2 rounded-md font-montserrat"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Settings;
