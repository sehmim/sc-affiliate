import React, { useState } from 'react';
import { Nav, Container } from 'react-bootstrap';
import EditableTable from './EditableTable';
import CampaignsTable from './CampaignsTable';
import TrackingLinksTable from './Tables/TrackingLinksTable';
import FeaturedCampaigns from './Tables/FeaturedCampaigns';

// Dummy components for the 4 options
const Charities = () => (<div><h4 className="m-4">Charities</h4><EditableTable /></div>);
const ImpactCampaigns = () => (<div><h4 className="m-4">Impact Campaigns/Brands</h4><CampaignsTable /></div>);

const NavigationComponent = () => {
  // State to track the selected option
  const [selectedOption, setSelectedOption] = useState('option1');

  // Function to render the selected component
  const renderSelectedComponent = () => {
    switch (selectedOption) {
      case 'option1':
        return <Charities />;
      case 'option2':
        return <ImpactCampaigns />;
      case 'option3':
        return <TrackingLinksTable />;
      case 'option4':
        return <FeaturedCampaigns />;
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
            Tracking Links
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="option4" active={selectedOption === 'option4'}>
            Featured Campaigns
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
