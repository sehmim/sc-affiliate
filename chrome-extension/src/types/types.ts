export interface UserSettings {
  firstName: string;
  lastName: string;
  selectedCharityObject: Campaign;
  email: string;
}

export interface BrandInfo {
  allowedBrand: string | null;
  allowedSubDomain: string | null;
}

export interface Campaign {
  country: string;
  provinceTerritoryOutsideOfCanada: string;
  address: string;
  city: string;
  postalCode: string;
  isActive: boolean;
  registrationNumber: string;
  typeOfQualifiedDone: string;
  category: string;
  effectiveDateOfStatus: string;
  charityType: string;
  status: string;
  organizationName: string;
  logo: string;
  terms?: Term[];
  defaultPayoutRate?: string;
}

interface Term {
  details: string;
  title: string;
}


export interface AllowedCampaign {
  campaignName: string;
  campaignID: number;
  campaignLogoURI: string;
  defaultPayoutRate: string;
  advertiserURL: string;
  subDomains: string[];
  provider: string;
  isActive: boolean;
  isFeatured: boolean;
  terms: Term[];
}

interface Term {
  details: string;
  title: string;
}