import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import firebase from '../utils/firebase';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { message } from 'antd';

const Register = () => {
  const auth = getAuth(firebase);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const subHandle = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        navigate('/login');
        message.success('Success');
      })
      .catch((error) => {
        message.error(error.message);
      });
  };
  
  return (
    <div className='font-lato'>
      <Header />
      <div className='mt-40 flex flex-col items-center gap-2 border bg-white py-5 mx-5 rounded-lg'>
        <h1 className='font-montserrat text-3xl text-deep-purple'>REGISTER</h1>
        <p className='text-xl'>Welcome to SponsorCircle</p>
        <div className='mt-5 flex flex-col w-9/12 gap-2'>
          <label htmlFor="fname" className='text-deep-purple'>First Name</label>
          <input className='text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple' type="text" id='fname'></input>
          <label htmlFor="lname" className='text-deep-purple'>Last Name</label>
          <input className='text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple' type="text" id='lname'></input>
          <label htmlFor="fname" className='text-deep-purple'>Email</label>
          <input onChange={(e) => setEmail(e.target.value)} className='text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple' type="text" id='email'></input>
          <label htmlFor="fname" className='text-deep-purple'>Password</label>
          <input onChange={(e) => setPassword(e.target.value)} className='text-xl p-2 border-b-2 border-grey outline-none focus:border-deep-purple' type="password" id='password'></input>
        </div>
        <p className='text-grey'>Already have an account?<a className='pl-2 text-deep-purple' href="/login">Sign In</a></p>
        <button className='my-2 w-9/12 bg-deep-purple text-white text-xl py-2 rounded-md font-montserrat' onClick={subHandle}>Register</button>
      </div>

    </div>
  );
};

export default Register;
