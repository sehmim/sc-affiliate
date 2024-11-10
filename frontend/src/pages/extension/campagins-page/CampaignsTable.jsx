import React, { useState, useEffect } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import useSyncedCampaigns from './GetCampaignsHook';
import { useNavigate } from 'react-router-dom';
import { applyImpactAffiliateLink, applyRakutenDeepLink, applyAwinDeepLink, applyCJDeepLink } from '../../../api/deeplinks';
import { ensureHttps } from '../../../utils/helpers';


/*global chrome*/
// function getDataFromStorage() {
//     return new Promise((resolve, reject) => {
//         chrome.storage.local.get("userSettings", function(data) {
//             if (chrome.runtime.lastError) {
//                 reject(new Error(chrome.runtime.lastError));
//             } else {
//                 resolve(data.userSettings);
//             }
//         });
//     });
// }

const CampaginsDataTable = () => {
  const { data: campaignData, loading, error } = useSyncedCampaigns();

  const [filteredData, setFilteredData] = useState(campaignData ?? []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [userSettings, setUserSettings] = useState();
  const navigate = useNavigate();

  // Get "Ships to" or "Ships in" details from terms
  const getShippingDetails = (terms) => {
    const term = terms.find(term => term.title === 'Ships to' || term.title === 'Ships in');
    return term ? term.details : '';
  };

  // Handle search across campaignName and details
  useEffect(() => {
    if(campaignData){
        setFilteredData(
        campaignData.filter(item =>
            item.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getShippingDetails(item.terms).toLowerCase().includes(searchTerm.toLowerCase())
        )
        );
    }
  }, [searchTerm, campaignData]);

  useEffect(()=> {
    const userSettings = localStorage.getItem('sc-userSettings');
    if(!userSettings){
        alert('Please select a charity first');
        navigate('/extension-settings');
    } else {
        setUserSettings(JSON.parse(userSettings));
    }

  }, [])


  if(loading){
    return (<p>Loading..</p>)
  }

  if(error){
    return (<p>Something went wrong...{JSON.stringify(error)}</p>)
  }

  // Sorting function
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key) {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Toggle sorting direction
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Icon for sorting direction
  const getSortIcon = (column) => {
    if (sortConfig.key === column) {
      return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
    }
    return <FaSort />;
  };


  const hanldeCreateAffiliateLink = async (campaign) => {
    if (campaign.provider === "Impact") {
        const redirectionLink = await applyImpactAffiliateLink(campaign, userSettings);

        console.log('asdasd -->', redirectionLink);
        window.open(ensureHttps(redirectionLink), '_blank');
    } 

    if (campaign.provider === "Rakuten"){
        const redirectionLink = await applyRakutenDeepLink(campaign, userSettings)
        window.open(ensureHttps(redirectionLink), '_blank');
    } 

    if (campaign.provider === "Awin"){
        const redirectionLink = await applyAwinDeepLink(campaign, userSettings)
        window.open(ensureHttps(redirectionLink), '_blank');
    }

    if (campaign.provider === "CJ"){
        const redirectionLink = await applyCJDeepLink(campaign, userSettings)
        window.open(ensureHttps(redirectionLink), '_blank');
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Campaigns</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search campaigns or details..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-4 border border-gray-300 rounded w-full"
      />

      {/* Data Table */}
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
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index} className="border-t cursor-pointer hover:shadow-lg transition-shadow duration-300 ease-in-out" onClick={() => hanldeCreateAffiliateLink(item)}>
                    <td className="p-4 whitespace-nowrap">{item.campaignName}</td>
                    <td className="p-4">
                    <img
                        src={item.campaignLogoURI}
                        alt={`${item.campaignName} logo`}
                        className="w-16 h-16 object-contain"
                    />
                    </td>
                    <td className="p-4 whitespace-nowrap">{item.defaultPayoutRate}%</td>
                    <td className="p-4">{getShippingDetails(item.terms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaginsDataTable;
