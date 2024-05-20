import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BiChevronLeft, BiChevronRight, BiWallet } from 'react-icons/bi';
import { AiOutlineSetting } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Profile = () => {
    const navigate = useNavigate();
    const logoutHandle = () => {
        localStorage.clear();
        navigate('/login');
    };
    return (
        <div className='font-lato'>
            <Header />
            <div className='h-screen w-full flex flex-col items-center justify-center gap-10'>
                <div className='flex flex-row items-center gap-5 w-10/12'>
                    <div className='w-24 h-24 rounded-full bg-royal-purple'></div>
                    <div className=''>
                        <h1 className='text-3xl text-deep-purple font-montserrat'>NAME</h1>
                        <div className='flex gap-5'>
                            <div>Team</div>
                            <div>Total Spent</div>
                        </div>
                    </div>
                </div>
                <div className='w-10/12'>
                <h1 className='font-montserrat text-xl mb-5'>My Account</h1>
                <div>
                    <Link to='/settings' className='text-left w-full flex flex-row justify-between items-center py-2 border-b'>
                        <AiOutlineSetting className='text-2xl' />
                        <div className='w-9/12 flex flex-col'>
                            <h2 className='font-semibold'>User Settings</h2>
                            <p className=''>Edit your personal details </p>
                        </div>
                        <BiChevronRight className='text-2xl' />
                    </Link>

                    {/* logout */}
                   
                </div> 
                <button onClick={logoutHandle} className='my-10 w-full bg-deep-purple text-white text-xl py-2 rounded-md font-montserrat'>
                        Log Out
                </button>
            </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Profile;