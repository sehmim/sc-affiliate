import React from 'react'
import {AiOutlineSearch} from 'react-icons/ai';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
      <Header/>
      <div className='flex flex-col my-20 items-center w-full font-lato'>
        <div className='w-9/12 h-10  relative flex items-center'>
          <input className='w-full h-full px-5 border-2 border-deep-purple rounded-md' type="text" placeholder='Search here'/>
          <AiOutlineSearch className='absolute text-2xl right-5'/>
        </div> 
        <div className='flex items-center justify-center mt-4 border-2 border-deep-purple rounded-lg w-11/12 h-48'>Promotion</div>
        <div className='w-11/12'>
            <h1 className='text-xl mt-4 font-montserrat'>Heading 1</h1>
            <div className='flex relative mt-2'>
              <div className='w-full h-full no-scrollbar overflow-x-scroll whitespace-nowrap overflow-hidden'>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
              </div> 
            </div>
        </div>
        <div className='w-11/12'>
            <h1 className='text-xl mt-4 font-montserrat'>Heading 1</h1>
            <div className='flex relative mt-2'>
              <div className='w-full h-full no-scrollbar overflow-x-scroll whitespace-nowrap overflow-hidden'>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
              </div> 
            </div>
        </div>
        <div className='w-11/12'>
            <h1 className='text-xl mt-4 font-montserrat'>Heading 1</h1>
            <div className='flex relative mt-2'>
              <div className='w-full h-full no-scrollbar overflow-x-scroll whitespace-nowrap overflow-hidden'>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
              </div> 
            </div>
        </div>
        <div className='w-11/12'>
            <h1 className='text-xl mt-4 font-montserrat'>Heading 1</h1>
            <div className='flex relative mt-2'>
              <div className='w-full h-full no-scrollbar overflow-x-scroll whitespace-nowrap overflow-hidden'>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
              </div> 
            </div>
        </div>
        <div className='w-11/12'>
            <h1 className='text-xl mt-4 font-montserrat'>Heading 1</h1>
            <div className='flex relative mt-2'>
              <div className='w-full h-full no-scrollbar overflow-x-scroll whitespace-nowrap overflow-hidden'>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
                <div className='inline-block m-2'>
                  <div className=' w-28 h-28 bg-royal-purple rounded-full'></div>
                  <p className='text-center'>p</p>
                </div>
              </div> 
            </div>
        </div>
    </div>
    <Navbar/>
    </div>
    
  )
}

export default Home