/*global chrome*/
import React, { useState, useEffect } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import useSyncedCampaigns from './GetCampaignsHook';
import { useNavigate } from 'react-router-dom';
import { applyImpactAffiliateLink, applyRakutenDeepLink, applyAwinDeepLink, applyCJDeepLink } from '../../../api/deeplinks';
import { ensureHttps } from '../../../utils/helpers';

const CampaginsDataTable = () => {
  const { data: campaignData, loading, error } = useSyncedCampaigns();

  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [userSettings, setUserSettings] = useState();
  const [deepLinkCampaign, setDeepLinkCampaign] = useState(null);
  const [extensionId, setExtensionId] = useState();
  const navigate = useNavigate();

  const getShippingDetails = (terms) => {
    const term = terms.find(term => term.title.includes('Ships') || term.title === 'Ships to' || term.title === 'Ships in');
    return term ? term.details : '';
  };

  useEffect(() => {
    if (campaignData) {
      const transformedData = campaignData.map(item => ({
        ...item,
        campaignName: item.campaignName.toUpperCase(),
      }));
      setFilteredData(
        transformedData.filter(item =>
          item.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          getShippingDetails(item.terms).toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.categories && item.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())))
        )
      );
    }
  }, [searchTerm, campaignData]);

  useEffect(() => {
    const userSettings = localStorage.getItem('sc-userSettings');
    if (userSettings) setUserSettings(JSON.parse(userSettings));
  }, [navigate]);

  useEffect(() => {
    const extentionIdFromStorage = localStorage.getItem('sc-extensionId');
    if (extentionIdFromStorage) setExtensionId(extentionIdFromStorage);
  }, []);

  if (loading) {
    return (<p>Loading..</p>);
  }

  if (error) {
    return (<p>Something went wrong...{JSON.stringify(error)}</p>);
  }

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aVal = a[sortConfig.key]?.toUpperCase() || '';
      const bVal = b[sortConfig.key]?.toUpperCase() || '';

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };

  const hanldeCreateAffiliateLink = async (campaign) => {
    setDeepLinkCampaign(campaign);

    if (!userSettings) {
      navigate('/login');
      return;
    }

    let redirectionLink = '';
    if (campaign.provider === "Impact") {
      redirectionLink = await applyImpactAffiliateLink(campaign, userSettings);
    } else if (campaign.provider === "Rakuten") {
      redirectionLink = await applyRakutenDeepLink(campaign, userSettings);
    } else if (campaign.provider === "Awin") {
      const awinResponse = await applyAwinDeepLink(campaign, userSettings);
      redirectionLink = awinResponse?.trackingLink;
    } else if (campaign.provider === "CJ") {
      const cjResponse = await applyCJDeepLink(campaign, userSettings);
      redirectionLink = cjResponse?.trackingLink;
    }

    if (extensionId) {
      chrome.runtime.sendMessage(extensionId, { action: "userSettingsFromMerchant", data: null }, (response) => {
        console.log("Response from extension:", response);
      });
    }

    window.open(ensureHttps(redirectionLink), '_blank');
    setDeepLinkCampaign(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Merchants</h2>
      
      <input
        type="text"
        placeholder="Search merchant..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border border-gray-300 rounded w-full"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100">
              <th
                onClick={() => requestSort('campaignName')}
                className="p-4 text-left cursor-pointer flex items-center space-x-1"
              >
                <span>Name</span>
                {getSortIcon('campaignName')}
              </th>
              <th className="p-4 text-left">Logo</th>
              <th
                onClick={() => requestSort('defaultPayoutRate')}
                className="p-4 text-left cursor-pointer flex items-center space-x-1"
              >
                <span>%</span>
                {getSortIcon('defaultPayoutRate')}
              </th>
              <th className="p-4 text-left">Ships to</th>
              <th className="p-4 text-left">Categories</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className="border-t cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out" onClick={() => hanldeCreateAffiliateLink(item)}>
                {deepLinkCampaign && deepLinkCampaign?.campaignID === item.campaignID ? (
                  <td className='p-4' colSpan="5">Applying....</td>
                ) : (
                  <>
                    <td className="p-4 whitespace-nowrap">
                      {item.campaignName}
                    </td>
                    <td className="p-4">
                      <img
                        src={item.campaignLogoURI}
                        alt={`${item.campaignName} logo`}
                        className="w-16 h-16 object-contain"
                      />
                    </td>
                    <td className="p-4 whitespace-nowrap">{item.defaultPayoutRate}%</td>
                    <td className="p-4">{getShippingDetails(item.terms)}</td>
                    <td className="p-4">{item.categories ? item.categories.join(', ') : ''}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaginsDataTable;
