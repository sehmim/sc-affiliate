import React, { useState } from 'react';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
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
import ExtensionUsers from './users/ExtensionUsers';

const Charities = () => (<div><h4>Charities</h4><EditableTable /></div>);

const NavigationComponent = () => {
  const [selectedComponent, setSelectedComponent] = useState(<Charities />);
  const [dropdownText, setDropdownText] = useState({
    charities: 'Charities',
    impact: 'Impact',
    rakuten: 'Rakuten',
    awin: 'Awin',
    cj: 'CJ',
    users: 'Users',
    active: 'Active Campaigns',
    featured: 'Featured Campaigns',
  });

  const handleSelect = (component, key, text) => {
    setSelectedComponent(component);
    setDropdownText((prev) => ({ ...prev, [key]: text }));
  };

  return (
    <div className="m-5">
      {/* Main Dropdown Navigation */}
      <div className="d-flex gap-3 mb-4">
        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.charities}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<Charities />, 'charities', 'Charities')}>
              Charities
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.impact}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<ImpactCampaigns />, 'impact', 'Impact Campaigns')}>
              Impact Campaigns
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect(<TrackingLinksTable />, 'impact', 'Impact Tracking Links')}>
              Impact Tracking Links
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.rakuten}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<RakutenCampaigns />, 'rakuten', 'Rakuten Campaigns')}>
              Rakuten Campaigns
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect(<RakutenTrackingLinks />, 'rakuten', 'Rakuten Tracking Links')}>
              Rakuten Tracking Links
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.awin}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<AwinCampaigns />, 'awin', 'Awin Campaigns')}>
              Awin Campaigns
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect(<AwinTrackingLinks />, 'awin', 'Awin Tracking Links')}>
              Awin Tracking Links
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.cj}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<CjCampaigns />, 'cj', 'CJ Campaigns')}>
              CJ Campaigns
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleSelect(<CjTrackingLinks />, 'cj', 'CJ Tracking Links')}>
              CJ Tracking Links
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.active}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<ActiveCampaigns />, 'active', 'Active Campaigns')}>
              Active Campaigns
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.featured}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<FeaturedCampaigns />, 'featured', 'Featured Campaigns')}>
              Featured Campaigns
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown as={ButtonGroup}>
          <Dropdown.Toggle variant="primary">{dropdownText.users}</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleSelect(<ExtensionUsers />, 'users', 'Users')}>
              Users
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Display the selected component */}
      <div className="mt-4">{selectedComponent}</div>
    </div>
  );
};

export default NavigationComponent;
