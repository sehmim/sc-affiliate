import React, { useState, useEffect } from "react";
import { message, Avatar, Empty } from "antd";
import {BiChevronLeft} from 'react-icons/bi'
import {HiOutlineMailOpen} from 'react-icons/hi'
import {GrCopy} from 'react-icons/gr'
import group from "../img/group-2.jpg";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { firestore, auth } from "../utils/firebase";

const Invite = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || localStorage.getItem('groupCode') ;
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

  const copyToClipboard = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textarea);
    message.success('Copy Success!');
    return successful;
  };
  return (
    <div className='font-lato'>
        <header className='fixed top-0 z-10 w-full h-16 px-5 py-3 flex items-center border-b-2 border-deep-purple shadow shadow-royal-purple'>
            <Link to={`/groupresult?id=${id}`}>
                <BiChevronLeft className='text-4xl inline-block cursor-pointer text-pink-empahsis'/>
                <span className='inline-block cursor-pointer'>Back</span>
            </Link>
        </header>
        <div className='flex flex-col justify-center items-center h-screen w-full gap-5'>
            <div className='flex flex-col justify-center items-center gap-2 w-3/4'>
              <img className='w-ful' src={group} alt="" />
              <h1 className='text-3xl font-montserrat rounded-md text-black'>Team Join Code</h1>
              <h1 className='text-3xl font-montserrat text-deep-purple '>{ id }</h1>
            </div>
            <div className='w-3/4 flex flex-col justify-center items-center py-5 rounded-md border shadow-xl'>
              <HiOutlineMailOpen className='text-8xl'/>
              <h1 className='text-xl font-bold'>Email</h1>
              <p className='text-sm my-2'>Send an invitation to someone</p>
              <button className='bg-deep-purple w-10/12 py-1 rounded-md text-white font-montserrat'>Send Email</button>
            </div>
            <div className='w-3/4 flex flex-col justify-center items-center py-5 rounded-md border shadow-xl'>
              <GrCopy className='text-7xl text-deep-purple'/>
              <h1 className='text-xl font-bold'>Share Link</h1>
              <p className='text-sm my-2'>Send an invitation to someone</p>
              <button onClick={() => {
              copyToClipboard(
                `${
                  window.location.protocol + window.location.host
                }/joinGroup?id=${id}`
              );
            }} className='bg-deep-purple w-10/12 py-1 rounded-md text-white font-montserrat'>Copy Link</button>
            </div>
        </div>
    </div>
  )
}

export default Invite