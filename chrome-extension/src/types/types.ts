export interface UserSettings {
  firstName: string;
  lastName: string;
  selectedCharityObject: Campaign;
  email: string;
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
  terms?: object[];
  defaultPayoutRate?: string;
}

export interface BrandInfo {
  allowedBrand: string | null;
  allowedSubDomain: string | null;
}