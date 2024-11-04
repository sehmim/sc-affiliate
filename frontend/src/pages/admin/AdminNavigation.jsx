import React, { useState } from 'react';
import { Nav, Container } from 'react-bootstrap';
import EditableTable from './EditableTable';
import TrackingLinksTable from './Tables/TrackingLinksTable';
import FeaturedCampaigns from './Tables/FeaturedCampaigns';
import RakutenCampaigns from './Tables/RakutenCampaigns';
import RakutenTrackingLinks from './Tables/RakutenTrackingLinks';
import ImpactCampaigns from './Tables/ImpactCampaigns';
import ActiveCampaigns from './Tables/ActiveCampagins';
import AwinCampaigns from './awin/AwinCampaigns';
import AwinTrackingLinks from './awin/AwinTrackingLinks';
import CjCampaigns from './cj/CjCampagins';
import CjTrackingLinks from './cj/CjTrackingLinks';

// Dummy components for the 4 options
const Charities = () => (<div><h4>Charities</h4><EditableTable /></div>);
const ImpactCampaignsWrapper = () => (<div><h4 className="m-4">Impact Campaigns/Brands</h4><ImpactCampaigns /></div>);

const NavigationComponent = () => {
  // State to track the selected option
  const [selectedOption, setSelectedOption] = useState('option1');

  // Function to render the selected component
  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'option1':
        return <Charities />;
      case 'option2':
        return <ImpactCampaignsWrapper />;
      case 'option3':
        return <TrackingLinksTable />;
      case 'option4':
        return <FeaturedCampaigns />;
      case 'option5': 
        return <RakutenCampaigns />;
      case 'option6': 
        return <RakutenTrackingLinks />;
      case 'option7':
        return <ActiveCampaigns />;
      case 'option8':
        return <AwinCampaigns />;
      case 'option9':
        return <AwinTrackingLinks />;
      case 'option10':
        return <CjCampaigns />;
      case 'option11':
        return <CjTrackingLinks />;
      default:
        return null;
    }
  };

  return (
    <div className='m-5'>
      {/* Navigation Bar */}
      <Nav variant="pills" activeKey={selectedOption} onSelect={(selectedKey) => setSelectedOption(selectedKey)}>
        <Nav.Item>
          <Nav.Link eventKey="option1" active={selectedOption === 'option1'}>
            Charities
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option2" active={selectedOption === 'option2'}>
            Impact Campaigns
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option3" active={selectedOption === 'option3'}>
            Impact Tracking Links
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option4" active={selectedOption === 'option4'}>
            Featured Campaigns
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option5" active={selectedOption === 'option5'}>
            Rakuten Campaigns
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option6" active={selectedOption === 'option6'}>
            Rakuten Tracking Links
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option7" active={selectedOption === 'option7'}>
            Active Campaigns
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option8" active={selectedOption === 'option8'}>
            Awin Campaigns
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option9" active={selectedOption === 'option9'}>
            Awin Tracking Links
          </Nav.Link>
        </Nav.Item>
                <Nav.Item>
          <Nav.Link eventKey="option10" active={selectedOption === 'option10'}>
            CJ Campaigns
          </Nav.Link>
        </Nav.Item>
                <Nav.Item>
          <Nav.Link eventKey="option11" active={selectedOption === 'option11'}>
            CJ Tracking Links
          </Nav.Link>
        </Nav.Item>
      </Nav>
      

      {/* Display the selected component */}
      <div className="mt-4">
        {renderSelectedComponent()}
      </div>
    </div>
  );
};

export default NavigationComponent;
