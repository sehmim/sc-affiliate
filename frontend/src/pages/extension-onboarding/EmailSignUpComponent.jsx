import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { firestore, auth } from '../../utils/firebase';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions


const EmailSignUpComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await addDoc(collection(firestore, 'users'), {
        uid: user.uid,
        email: user.email,
      });
      
      localStorage.setItem('sc-email', email);
      navigation('/extension-settings');
    } catch (error) {
      console.error('Error signing up:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='onboarding-page-container'>
      <div className='body-conatiner' style={{ maxWidth: '450px' }}>
        <div className='fs-1 fw-bold text-center pt-5'>
          Email Sign Up
        </div>
        <div className="text-center text-dark font-inter font-weight-light fs-6 text-muted pt-4">
          Please share the verification code sent to user@example.com. If email does not appear please check your spam folder.
        </div>

        <div className='p-3 w-full'>
          <label className='pb-2'>Email:</label> <br />
          <input
            className='form-control w-full'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type='text'
            placeholder='user@example.com'
            id="lord-king-shadid"
          />
        </div>
        <div className='p-3 w-full'>
          <label className='pb-2'>Password: </label> <br />
          <input
            className='form-control w-full'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type='password'
            placeholder=''
          />
        </div>

        <button
          disabled={loading}
          onClick={handleSignUp}
          type="button"
          className="btn btn-dark btn-lg fw-bold"
          style={{ width: '320px' }}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default EmailSignUpComponent;
