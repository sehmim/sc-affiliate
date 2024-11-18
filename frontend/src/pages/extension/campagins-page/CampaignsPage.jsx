import React from 'react'
import ExtensionNavbar from '../ExtensionNavbar'
// import AdsCarousel from './AdsCarousel';
import CampaginsDataTable from './CampaignsTable';

export default function CampaignsPage() {
    

    return (
        <>
            <ExtensionNavbar />
            <div className='m-20'> 
                <Header />
                {/* <AdsCarousel /> */}
                <CampaginsDataTable />
            </div>
        </>
    )
}


const Header = () => {
  return (
    <div className="mx-24 flex justify-around items-center">
      <div>
        <h1 className="text-2xl font-bold">More Merchants</h1>
        <h3 className="text-lg text-gray-600">Explore from all the merchants</h3>
      </div>
      <div>
        <img 
          src="https://i.imgur.com/BO1v7ec.png" 
          alt="happy face" 
          className="w-52"
        />
      </div>
    </div>
  );
};
