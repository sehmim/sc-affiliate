import {
	getLatestEntry
} from "../../utils/firestoreWrapper";
import {
	getNonZeroPayoutCampaigns,
	sortByIsFeatured
} from "../admin/helper";
import {
	ImpactCampaign
} from '../admin/types';

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
    terms: {
        title: string,
        details: string,
    }[]
	isDeepLinkEnabled?: boolean
}

export enum CampaignsProvider {
	Rakuten = "Rakuten",
		Impact = "Impact",
		Awin = "Awin",
		Custom = "Custom"
}


export async function aggregateCamapigns(): Promise < Campaign[] > {
	const {
		campaigns: impactCampaigns
	} = await getLatestEntry('impactCampaignsSynced');
	const {
		campaigns: rakutenCampaigns
	} = await getLatestEntry('rakutenCampaigns');
	const {
		campaigns: awinCampaigns
	} = await getLatestEntry('awinCampaigns');

	const mappedCampains = mapToCampaigns(impactCampaigns, rakutenCampaigns, awinCampaigns)
	const validCampaigns = getNonZeroPayoutCampaigns(mappedCampains);

	return sortByIsFeatured(validCampaigns);
}


function mapToCampaigns(impactCampagins: ImpactCampaign[], rakutenCampaigns: Campaign[], awinCampaigns: Campaign[]): Campaign[] {
	let mappedImpactCampaigns: Campaign[] = [];

	let invalidBrands: any[] = []; // FOR DEBUGGING 

	impactCampagins.forEach((impactCampaign) => {
		const validUrl = fixUrl(impactCampaign.advertiserURL);

		if (!validUrl) {
			invalidBrands.push(impactCampaign)
			return;
		}


		if (validUrl && impactCampaign.isActive) {
			mappedImpactCampaigns.push({
				campaignName: impactCampaign.campaignName,
				campaignID: impactCampaign.campaignID,
				campaignLogoURI: impactCampaign.campaignLogoURI,
				defaultPayoutRate: impactCampaign.defaultPayoutRate,
				advertiserURL: validUrl,
				subDomains: impactCampaign.subDomains,
				provider: CampaignsProvider.Impact,
				isActive: impactCampaign.isActive,
				isFeatured: !!impactCampaign.isFeatured,
				terms: impactCampaign.terms,
				isDeepLinkEnabled: impactCampaign?.isDeepLinkEnabled
			})
		}
	})



	let mappedRakutenCampaigns: Campaign[] = [];
	rakutenCampaigns.forEach((rakutenCampaign) => {

		const validUrl = fixUrl(rakutenCampaign.advertiserURL);

		if (!validUrl) {
			invalidBrands.push(rakutenCampaign)
			return;
		}

		if (validUrl && rakutenCampaign.isActive) {
			mappedRakutenCampaigns.push({
				campaignName: rakutenCampaign.campaignName,
				campaignID: rakutenCampaign.campaignID,
				campaignLogoURI: rakutenCampaign.campaignLogoURI,
				defaultPayoutRate: rakutenCampaign.defaultPayoutRate,
				advertiserURL: validUrl,
				subDomains: rakutenCampaign.subDomains,
				provider: CampaignsProvider.Rakuten,
				isActive: rakutenCampaign.isActive,
				isFeatured: !!rakutenCampaign.isFeatured,
				terms: rakutenCampaign.terms
			})
		}
	})


	let mappedAwinCamapigns: Campaign[] = [];

	awinCampaigns.forEach((awinCampaign) => {
		const validUrl = fixUrl(awinCampaign.advertiserURL);

		if (!validUrl) {
			invalidBrands.push(awinCampaign)
			return;
		}

		if (validUrl && awinCampaign.isActive) {
			mappedAwinCamapigns.push({
				campaignName: awinCampaign.campaignName,
				campaignID: awinCampaign.campaignID,
				campaignLogoURI: awinCampaign.campaignLogoURI,
				defaultPayoutRate: awinCampaign.defaultPayoutRate,
				advertiserURL: validUrl,
				subDomains: awinCampaign.subDomains,
				provider: CampaignsProvider.Awin,
				isActive: awinCampaign.isActive,
				isFeatured: !!awinCampaign.isFeatured,
				terms: awinCampaign.terms
			})	
		}
	})

	return [...mappedImpactCampaigns, ...mappedRakutenCampaigns, ...mappedAwinCamapigns]
}


function fixUrl(url: string) {
    try {
        // Decode URL to handle any encoded characters
        let decodedUrl = decodeURIComponent(url);

        // If the URL doesn't start with http or https, assume https
        if (!/^https?:\/\//i.test(decodedUrl)) {
            decodedUrl = 'https://' + decodedUrl;
        }

        // Create a URL object to check if it's valid after potential fixes
        const urlObject = new URL(decodedUrl);

        // Return the fixed, valid URL as a string
        return urlObject.href;
    } catch (e) {
        // Return null if the URL cannot be fixed
        return null;
    }
}