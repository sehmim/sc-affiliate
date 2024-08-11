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
    advertiserURL: string;
    subDomains: string[];
    deals: NormalizedDeal[]
    isActive: boolean;
};


export type NormalizedDeal = {
    discountType: string;
    discountPercentage: number;
}


export type RawDeal = {
  Id: string;
  Name: string;
  Description: string;
  CampaignId: string;
  State: "ACTIVE" | "INACTIVE" | "EXPIRED" | "PENDING"; // Assuming potential states
  Type: string;
  Scope: string;
  Public: "TRUE" | "FALSE"; // Assuming it's a boolean represented as a string
  Products: any[]; // Assuming it's an array of products, replace `any` with a more specific type if known
  Categories: string | string[]; // Assuming it could be a comma-separated string or an array
  DiscountType: string;
  DiscountAmount: string;
  DiscountCurrency: string;
  DiscountPercent: string;
  DiscountMaximumPercent: string;
  DiscountPercentRangeStart: string;
  DiscountPercentRangeEnd: string;
  Gift: string;
  RebateAmount: string;
  RebateCurrency: string;
  DefaultPromoCode: string;
  MinimumPurchaseAmount: string;
  MinimumPurchaseAmountCurrency: string;
  MaximumSavingsAmount: string;
  MaximumSavingsCurrency: string;
  BogoBuyQuantity: string;
  BogoBuyScope: string;
  BogoBuyName: string;
  BogoBuyImageUrl: string;
  BogoGetQuantity: string;
  BogoGetScope: string;
  BogoGetDiscountType: string;
  BogoGetName: string;
  BogoGetImageUrl: string;
  BogoGetDiscountAmount: string;
  BogoGetDiscountCurrency: string;
  BogoGetDiscountPercent: string;
  PurchaseLimitQuantity: string;
  StartDate: string;
  EndDate: string;
  DateCreated: string; // ISO 8601 date string
  DateLastUpdated: string; // ISO 8601 date string
  Uri: string;
};
