import React from 'react';
import logo from '../img/sponsor-circle-purple-transparent.png';

const Header = () => {
  return (
    <header className='fixed top-0 z-10 bg-white w-full h-16 px-5 py-3 flex justify-between items-center border-b-2 border-deep-purple shadow shadow-royal-purple'>
        <a className='h-full' href='/'><img className='h-full' src={logo} alt="logo" /></a>
    </header>
        
  )
}

export default Header