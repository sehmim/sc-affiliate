type ShippingRegion = {
    ShippingRegion: string[];
};

type DeeplinkDomain = {
    DeeplinkDomain: string[];
};

export type ImpactCampaignData = {
    AdvertiserId: string[];
    AdvertiserName: string[];
    AdvertiserUrl: string[];
    CampaignId: string[];
    CampaignName: string[];
    CampaignUrl: string[];
    CampaignDescription: string[];
    ShippingRegions: ShippingRegion[];
    CampaignLogoUri: string[];
    PublicTermsUri: string[];
    ContractStatus: string[];
    ContractUri: string[];
    TrackingLink: string[];
    AllowsDeeplinking: string[];
    DeeplinkDomains: DeeplinkDomain[];
    Uri: string[];
};

export type NormalizedCampaign = {
    campaignID: string;
    advertiserName: string;
    campaignName: string;
    campaignLogoURI: string;
    activeDate: string;
    insertionOrderStatus: string;
    payout: string;
    discountPercentage: number;
    discountType: string;
    advertiserURL: string;
    subDomains: string[];
};
