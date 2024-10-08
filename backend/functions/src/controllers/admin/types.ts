export type ImpactCampaign = {
  defaultPayoutRate: string;
  insertionOrderStatus: string;
  campaignID: string;
  subDomains: string[];
  activeDate: string;
  campaignLogoURI: string;
  advertiserURL: string;
  isFeatured?: boolean;
  isActive: boolean;
  campaignName: string;
  advertiserName: string;
  terms: {
    title: string;
    details: string;
  }[]
  isDeepLinkEnabled?: boolean
};