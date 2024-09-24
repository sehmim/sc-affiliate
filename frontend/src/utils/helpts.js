export function reorderCampaigns(campaigns) {
  // Separate the active and inactive campaigns
  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.isActive && parseFloat(campaign.defaultPayoutRate) > 0
  );

  const inactiveCampaigns = campaigns.filter(
    (campaign) => !campaign.isActive || parseFloat(campaign.defaultPayoutRate) === 0
  );

  // Combine active campaigns at the top followed by inactive campaigns
  const sortedCampaigns = [...activeCampaigns, ...inactiveCampaigns];

  return {
    campaigns: sortedCampaigns,
    numberOfInactiveCampaigns: inactiveCampaigns.length,
    numberOfActiveCampaigns: activeCampaigns.length,
  };
}