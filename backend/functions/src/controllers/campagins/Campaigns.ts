import { getLatestEntry } from "../../utils/firestoreWrapper";
import { getNonZeroPayoutCampaigns, sortByIsFeatured } from "../admin/helper";
import { ImpactCampaign } from '../admin/types';

export interface Campaign {
    campaignName: string,
    campaignID: string,
    campaignLogoURI: string,
    defaultPayoutRate: string,
    advertiserURL: string,
    subDomains: string[],
    provider: CampaignsProvider,
    isActive: boolean,
    isFeatured: boolean,
    terms: string[]
}

export enum CampaignsProvider {
    Rakuten = "Rakuten",
    Impact = "Impact",
    Custom = "Custom"
}


export async function aggregateCamapigns(): Promise<Campaign[]> {
    const {campaigns: impactCampaigns} = await getLatestEntry('impactCampaignsSynced');
    const {campaigns: rakutenCampaigns} = await getLatestEntry('rakutenCampaigns');

    const mappedCampains = mapToCampaigns(impactCampaigns, rakutenCampaigns)
    const validCampaigns = getNonZeroPayoutCampaigns(mappedCampains);

    return sortByIsFeatured(validCampaigns);
}


function mapToCampaigns(impactCampagins: ImpactCampaign[], rakutenCampaigns: Campaign[], customCampaigns?: any): Campaign[]{
    const mappedImpactCampaigns = impactCampagins.map((impactCampaign) => ({
        campaignName: impactCampaign.campaignName,
        campaignID: impactCampaign.campaignID,
        campaignLogoURI: impactCampaign.campaignLogoURI,
        defaultPayoutRate: impactCampaign.defaultPayoutRate,
        advertiserURL: impactCampaign.advertiserURL,
        subDomains: impactCampaign.subDomains,
        provider: CampaignsProvider.Impact,
        isActive: impactCampaign.isActive,
        isFeatured: !!impactCampaign.isFeatured,
        terms: impactCampaign.terms
    }))

    const mappedRakutenCampaigns = rakutenCampaigns.map((rakutenCampaign) => ({
        campaignName: rakutenCampaign.campaignName,
        campaignID: rakutenCampaign.campaignID,
        campaignLogoURI: rakutenCampaign.campaignLogoURI,
        defaultPayoutRate: rakutenCampaign.defaultPayoutRate,
        advertiserURL: rakutenCampaign.advertiserURL,
        subDomains: rakutenCampaign.subDomains,
        provider: CampaignsProvider.Rakuten,
        isActive: rakutenCampaign.isActive,
        isFeatured: !!rakutenCampaign.isFeatured,
        terms: rakutenCampaign.terms
    }))

    return [...mappedImpactCampaigns, ...mappedRakutenCampaigns]
}