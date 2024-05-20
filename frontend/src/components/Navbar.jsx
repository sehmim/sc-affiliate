import React from 'react';
import {GoHome} from 'react-icons/go';
import {BsPerson} from 'react-icons/bs';
import {BsPeople} from 'react-icons/bs';
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { Link } from 'react-router-dom';


const Navbar = () => {
  return (
    <nav className='fixed bottom-0 bg-white flex justify-around items-center w-full h-14 px-6 border-t-2 border-deep-purple shadow shadow-royal-purple'>
        <Link to='/'><GoHome className='text-3xl text-deep-purple'/></Link>
        <Link to='/'><AiOutlineShoppingCart className='text-3xl text-deep-purple'/></Link> 
        <Link to='/groupresult'><BsPeople className='text-3xl text-deep-purple'/></Link>
        <Link to='/profile'><BsPerson className='text-3xl text-deep-purple'/></Link>
    </nav>
  )
}

export default Navbar