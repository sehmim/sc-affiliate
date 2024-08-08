// import { db } from '../index';
import { onRequest } from 'firebase-functions/v2/https';
import { fetchCampainDeals } from '../services/impact';
// import { NormalizedCampaign } from '../services/types';

interface RawCampaignData {
  AdvertiserId: string[];
  AdvertiserName: string[];
  AdvertiserUrl: string[];
  CampaignId: string[];
  CampaignName: string[];
  CampaignUrl: string[];
  CampaignDescription: string[];
  ShippingRegions: {
    ShippingRegion: string[];
  }[];
  CampaignLogoUri: string[];
  PublicTermsUri: string[];
  ContractStatus: string[];
  ContractUri: string[];
  TrackingLink: string[];
  AllowsDeeplinking: string[];
  DeeplinkDomains: {
    DeeplinkDomain: string[];
  }[];
  Uri: string[];
}

export const populateCampaignData = onRequest(async (req, res) => {
  // const batch = db.batch();
  // const collectionRef = db.collection('impactCampaigns');

  // CAMPAIGNS.forEach(campaign => {
  //   const docRef = collectionRef.doc();
  //   batch.set(docRef, { ...campaign, isActive: true });
  // });

  // const impactCampaigns = await fetchCampaignsData();

  // console.log('impactCampaigns ->', impactCampaigns);
  
  // await batch.commit();
  // console.log('Campaign data populated successfully');

  // res.send(impactCampaigns?.ImpactRadiusResponse?.Campaigns[0].Campaign);
  res.send(normalizeCampaigns(CAMPAIGNS_API))
});

// const normalizedDeals = () => {

// }

const normalizeCampaigns = async (rawCampaigns: RawCampaignData[]) => {
  const data = rawCampaigns.map(async (rawCampaign: RawCampaignData) => {

    const deals = await getDeals(rawCampaign.CampaignId[0]);
    // const discountInfo = {  
    //   discountPercentage: 0,
    //   discountType: "Net Sales Amount",
    // }

    // TODO: GET SUBDMOAINS
    const subDomains: string[] = []

    return {
      campaignID: rawCampaign.CampaignId,
      campaignName: rawCampaign.CampaignName,
      campaignLogoURI: rawCampaign.CampaignLogoUri,
      deals,
      subDomains: subDomains,
      // ...discountInfo,
    }
  })


  return data;
}

const getDeals = async (campaignId: string) => {
      const rawDeals = await fetchCampainDeals(campaignId);
    
    const deals = rawDeals.ImpactRadiusResponse.Deals[0]?.Deal;

    let normalizedDeals: any[] = [];

    if (deals) {
      deals.map((deal: any) => {
        const isActiveDeal = deal.State[0] !== 'EXPPIRED';

        if (isActiveDeal && deal?.DiscountPercent[0] !== '') {
          normalizedDeals.push({
            discountType: deal.DiscountType[0],
            discountPercentage: deal.DiscountPercent[0]
          }) 
        }
      })
    }

    return normalizedDeals;
}
// const CAMPAIGNS = [
//   {
//     "advertiserID": 419062,
//     "advertiserName": "adidas Australia",
//     "advertiserURL": "https://www.adidas.com.au",
//     "advertiserCategory": "Sports Apparel & Accessories",
//     "campaignID": 7362,
//     "campaignName": "adidas Australia",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/7362.gif",
//     "activeDate": "Mar 4, 2024 16:46",
//     "insertionOrderName": "New Public IO 5%",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://adidas-australia.pxf.io/c/4797259/408139/7362",
//     "allowsDeepLinking": true,
//     "payout": "You earn 5% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 45 day(s) after the end of the month",
//     "discountPercentage": 5,
//     "discountType": "Net Sales Amount",
//     "subDomains": ["https://adidas-australia.pxf.io"],
//   },
//   {
//     "advertiserID": 2583300,
//     "advertiserName": "Anthology Brands",
//     "advertiserURL": "https://anthologybrands.com",
//     "advertiserCategory": "First Aid & pharmacy",
//     "campaignID": 12752,
//     "campaignName": "Pure Hemp Botanicals",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12752.gif",
//     "activeDate": "Apr 9, 2024 15:35",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://pure-hemp-botanical.pxf.io/c/4797259/954928/12752",
//     "allowsDeepLinking": true,
//     "payout": "You earn 60% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 90 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 1 month(s) and 1 day(s) after the end of the month",
//     "discountPercentage": 60,
//     "discountType": "Net Sales Amount",
//     "subDomains": ["https://purehempbotanicals.com"]
//   },
//   {
//     "advertiserID": 1719590,
//     "advertiserName": "Decathlon Canada",
//     "advertiserURL": "https://www.decathlon.ca",
//     "advertiserCategory": "Sports Apparel & Accessories",
//     "campaignID": 10224,
//     "campaignName": "Decathlon Canada",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/10224.gif",
//     "activeDate": "Sep 19, 2023 16:48",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://decathlon-canada.mkr3.net/c/4797259/642729/10224",
//     "allowsDeepLinking": true,
//     "payout": "You earn 3% of Net Sales Amount\nYou earn 3% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action\nReferrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 2 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 2 month(s) and 0 day(s) after the end of the month",
//     "discountPercentage": 3,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 1912000,
//     "advertiserName": "Easyship",
//     "advertiserURL": "https://www.easyship.com/",
//     "advertiserCategory": "B2B",
//     "campaignID": 10435,
//     "campaignName": "Easyship Ambassador Program",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/10435.gif",
//     "activeDate": "Sep 14, 2023 21:58",
//     "insertionOrderName": "Easyship Standard",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://easyship.ilbqy6.net/c/4797259/666308/10435",
//     "allowsDeepLinking": true,
//     "payout": "Company Created > You earn $0.00 (Flat Fee per lead)\nYou earn 2.5% of Net Sales Amount\nYou earn 100% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in the same day are locked 0 day(s) later\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//     "discountPercentage": 2.5,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 1398261,
//     "advertiserName": "Fanatics",
//     "advertiserURL": "https://www.fanatics.com",
//     "advertiserCategory": "Sports Apparel & Accessories",
//     "campaignID": 9663,
//     "campaignName": "Fanatics (Global)",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/9663.gif",
//     "activeDate": "Sep 18, 2023 10:13",
//     "insertionOrderName": "Affinity 6%",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://fanatics.93n6tx.net/c/4797259/586570/9663",
//     "allowsDeepLinking": true,
//     "payout": "You earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount\nYou earn 6% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action\nReferrals are only considered for credit if they occur within 7 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month\nAll actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//     "discountPercentage": 6,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 1217827,
//     "advertiserName": "IMPACT",
//     "advertiserURL": "https://www.impact.com",
//     "advertiserCategory": "B2B",
//     "campaignID": 10925,
//     "campaignName": "Impact.com Referral Partner Program",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/10925.gif",
//     "activeDate": "Nov 28, 2023 16:34",
//     "insertionOrderName": "12% Preferred Partner Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://impact-referral-partnerships.sjv.io/c/4797259/749356/10925",
//     "allowsDeepLinking": true,
//     "payout": "You earn 12% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 180 day(s) of the action",
//     "actionLocking": "Actions are locked 15 day(s) after they are approved by advertiser. If actions are not locked after 13 month(s), they are rejected.",
//     "discountPercentage": 12,
//     "discountType": "Net Sales Amount",
//     "subDomains": ["https://go.impact.com"]
//   },
//   {
//     "advertiserID": 2588106,
//     "advertiserName": "International Open Academy",
//     "advertiserURL": "https://internationalopenacademy.com",
//     "advertiserCategory": "Winter",
//     "campaignID": 16668,
//     "campaignName": "Eventtrix",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/16668.gif",
//     "activeDate": "Apr 23, 2024 14:44",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Expired",
//     "trackingLink": "https://eventtrix.pxf.io/c/4797259/1398875/16668",
//     "allowsDeepLinking": true,
//     "payout": "You earn 20% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 20 day(s) after the end of the month",
//     "discountPercentage": 20,
//     "discountType": "Net Sales Amount",
//     "subDomains": ["https://eventtrix.com"]
//   },
//   {
//     "advertiserID": 2463760,
//     "advertiserName": "InVideo",
//     "advertiserURL": "https://www.invideo.io",
//     "advertiserCategory": "Images",
//     "campaignID": 12258,
//     "campaignName": "InVideo",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12258.gif",
//     "activeDate": "Apr 10, 2024 12:00",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://invideo.sjv.io/c/4797259/883681/12258",
//     "allowsDeepLinking": true,
//     "payout": "Sign-up > You earn $0.00 (Flat Fee per lead)\nYou earn 25% of Net Sales Amount\nYou earn 50% of Net Sales Amount\ninVideo AI - Sign-up > You earn $0.00 (Flat Fee per lead)\nYou earn 25% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 120 day(s) of the action\nReferrals are only considered for credit if they occur within 120 day(s) of the action\nReferrals are only considered for credit if they occur within 30 day(s) of the action\nReferrals are only considered for credit if they occur within 120 day(s) of the action\nReferrals are only considered for credit if they occur within 120 day(s) of the action",
//     "actionLocking": "All actions happening in the same day are locked 30 day(s) later\nAll actions happening in the same day are locked 30 day(s) later\nAll actions happening in the same day are locked 27 day(s) later\nAll actions happening in the same day are locked 27 day(s) later\nAll actions happening in the same day are locked 27 day(s) later",
//     "discountPercentage": 25,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 3017626,
//     "advertiserName": "LivWell Nutrition",
//     "advertiserURL": "https://livwellnutrition.com",
//     "advertiserCategory": "Diet & Nutrition",
//     "campaignID": 14558,
//     "campaignName": "LivWell Nutrition",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/14558.gif",
//     "activeDate": "Apr 9, 2024 15:45",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://livwellnutrition.pxf.io/c/4797259/1151622/14558",
//     "allowsDeepLinking": true,
//     "payout": "You earn 12% of Net Sales Amount",
//     "performanceBonus": "If monthly sales reach $10,000.00, payout rate will be 15% for subsequent action sales",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
//     "discountPercentage": 12,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 4253690,
//     "advertiserName": "Lumiere Affiliate marketing",
//     "advertiserURL": "https://lumierehairs.com",
//     "advertiserCategory": "Women's Apparel",
//     "campaignID": 19594,
//     "campaignName": "Lumiere Affiliate marketing",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/19594.gif",
//     "activeDate": "Apr 9, 2024 15:43",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://lumiereaffiliatemarketing.sjv.io/c/4797259/1688218/19594",
//     "allowsDeepLinking": true,
//     "payout": "You earn 10% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
//     "discountPercentage": 10,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 1274595,
//     "advertiserName": "Mark's - Lequipeur",
//     "advertiserURL": "https://www.marks.com",
//     "advertiserCategory": "Women's Apparel",
//     "campaignID": 8679,
//     "campaignName": "Mark's",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/8679.gif",
//     "activeDate": "Sep 19, 2023 11:45",
//     "insertionOrderName": "Mark's - 4% Baseline Commission Offer",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://marks.r37x9j.net/c/4797259/505590/8679",
//     "allowsDeepLinking": true,
//     "payout": "You earn 4% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 1 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 2 month(s) and 10 day(s) after the end of the month",
//     "discountPercentage": 4,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 48706,
//     "advertiserName": "Moosejaw.com",
//     "advertiserURL": "https://www.moosejaw.com/",
//     "advertiserCategory": "Sports Apparel & Accessories",
//     "campaignID": 1676,
//     "campaignName": "Moosejaw.com",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/1676.gif",
//     "activeDate": "Sep 18, 2023 15:47",
//     "insertionOrderName": "Public IO",
//     "insertionOrderStatus": "Expired",
//     "trackingLink": "https://moosejaw.pvxt.net/c/4797259/185854/1676",
//     "allowsDeepLinking": true,
//     "payout": "You earn 6% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 15 day(s) of the action",
//     "actionLocking": "All actions happening in the same day are locked 30 day(s) later",
//     "discountPercentage": 6,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 3274582,
//     "advertiserName": "Packed with Purpose",
//     "advertiserURL": "https://packedwithpurpose.gifts",
//     "advertiserCategory": "B2B",
//     "campaignID": 15751,
//     "campaignName": "Packed with Purpose",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/15751.gif",
//     "activeDate": "Apr 9, 2024 15:44",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://packedwithpurpose.pxf.io/c/4797259/1283558/15751",
//     "allowsDeepLinking": true,
//     "payout": "B2B Closed Won Deal > You earn $4.00 (Flat Fee per sale)\nYou earn 8% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action\nReferrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month\nAll actions happening in a given month are locked 27 day(s) after the end of the month",
//     "discountPercentage": 8,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 2551659,
//     "advertiserName": "Peakstar Technologies Inc.",
//     "advertiserURL": "https://atlasvpn.com",
//     "advertiserCategory": "",
//     "campaignID": 12618,
//     "campaignName": "Atlas VPN",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12618.gif",
//     "activeDate": "Apr 9, 2024 15:35",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Expired",
//     "trackingLink": "https://atlasvpn.sjv.io/c/4797259/928109/12618",
//     "allowsDeepLinking": false,
//     "payout": "You earn 60% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//     "discountPercentage": 60,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 2642689,
//     "advertiserName": "Pro Hockey Life",
//     "advertiserURL": "https://www.prohockeylife.com/",
//     "advertiserCategory": "Sports Apparel & Accessories",
//     "campaignID": 12925,
//     "campaignName": "Pro Hockey Life",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12925.gif",
//     "activeDate": "Sep 18, 2023 10:34",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://prohockeylife.pxf.io/c/4797259/979143/12925",
//     "allowsDeepLinking": true,
//     "payout": "You earn 4% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 5 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 3 month(s) and 0 day(s) after the end of the month",
//     "discountPercentage": 4,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 3930596,
//     "advertiserName": "Springfree Limited Partnership",
//     "advertiserURL": "https://www.springfreetrampoline.com",
//     "advertiserCategory": "Outdoors & Recreation",
//     "campaignID": 20835,
//     "campaignName": "Springfree Trampoline - CA",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/20835.gif",
//     "activeDate": "Sep 20, 2023 13:28",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://springfree-trampolineca.pxf.io/c/4797259/1769243/20835",
//     "allowsDeepLinking": true,
//     "payout": "You earn 7% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
//     "discountPercentage": 7,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   // Dublicating cocoandeve to support .ca
//   {
//     "advertiserID": 3663611,
//     "advertiserName": "Supernova Pte Ltd Canada",
//     "advertiserURL": "https://www.ca.cocoandeve.com",
//     "advertiserCategory": "Cosmetics & Skin Care",
//     "campaignID": 17345,
//     "campaignName": "Coco&Eve",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/17345.gif",
//     "activeDate": "Apr 9, 2024 15:51",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://coco-and-eve.sjv.io/c/4797259/1467633/17345",
//     "allowsDeepLinking": true,
//     "payout": "You earn 2% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
//     "discountPercentage": 2,
//     "discountType": "Net Sales Amount",
//     "subDomains": ["https://us.cocoandeve.com", "https://cocoandeve.com"]
//   },
//   {
//     "advertiserID": 3705465,
//     "advertiserName": "Supernova Pte Ltd - SS Canada",
//     "advertiserURL": "https://www.ca.sandandsky.com",
//     "advertiserCategory": "Cosmetics & Skin Care",
//     "campaignID": 17524,
//     "campaignName": "Sand&Sky",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/17524.gif",
//     "activeDate": "Apr 9, 2024 15:51",
//     "insertionOrderName": "Public Terms 2%",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://sand-and-sky.sjv.io/c/4797259/1485463/17524",
//     "allowsDeepLinking": true,
//     "payout": "You earn 2% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
//     "discountPercentage": 2,
//     "discountType": "Net Sales Amount",
//     "subDomains": ["https://sandandsky.com"]
//   },
//   {
//     "advertiserID": 3938277,
//     "advertiserName": "The Curiosity Box",
//     "advertiserURL": "https://www.curiositybox.com/",
//     "advertiserCategory": "Learning",
//     "campaignID": 18310,
//     "campaignName": "The Curiosity Box",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/18310.gif",
//     "activeDate": "Apr 9, 2024 15:45",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://the-curiosity-box.pxf.io/c/4797259/1575826/18310",
//     "allowsDeepLinking": true,
//     "payout": "You earn 20% of Net Sales Amount",
//     "performanceBonus": "If number of monthly actions reaches 2,147,483,647, payout rate will be 0% for subsequent actions",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//     "discountPercentage": 20,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   {
//     "advertiserID": 4819836,
//     "advertiserName": "VAVA INTERNATIONAL INC.",
//     "advertiserURL": "https://www.ravpower.com",
//     "advertiserCategory": "Food & Drink",
//     "campaignID": 21553,
//     "campaignName": "ParisRhone",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/21553.gif",
//     "activeDate": "Apr 9, 2024 15:46",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://parisrhonecom.sjv.io/c/4797259/1811170/21553",
//     "allowsDeepLinking": true,
//     "payout": "You earn 8% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 27 day(s) after the end of the month",
//     "discountPercentage": 8,
//     "discountType": "Net Sales Amount",
//     "subDomains": ["https://parisrhone.com"]
//   },
//   {
//     "advertiserID": 2495728,
//     "advertiserName": "Wish",
//     "advertiserURL": "https://wish.com",
//     "advertiserCategory": "Handmade Goods",
//     "campaignID": 12396,
//     "campaignName": "Wish",
//     "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/12396.gif",
//     "activeDate": "Jan 4, 2024 04:39",
//     "insertionOrderName": "Public Terms",
//     "insertionOrderStatus": "Active",
//     "trackingLink": "https://wish.pxf.io/c/4797259/899103/12396",
//     "allowsDeepLinking": true,
//     "payout": "You earn 6% of Net Sales Amount",
//     "performanceBonus": "N/a",
//     "clickReferralPeriod": "Referrals are only considered for credit if they occur within 30 day(s) of the action",
//     "actionLocking": "All actions happening in a given month are locked 2 month(s) and 15 day(s) after the end of the month",
//     "discountPercentage": 6,
//     "discountType": "Net Sales Amount",
//     "subDomains": []
//   },
//   // COUPONED WEBSITES: 
//   {
//     "discountPercentage": 20,
//     "advertiserName": 'lacoutts.com',
//     "campaignLogoURI": 'https://i.imgur.com/FOe5vMf.png',
//     "advertiserURL": 'https://lacoutts.com',
//     "subDomains": [],
//     "discountType": "Coupon",
//     "trackingLink": "https://lacoutts.com?sc-coupon=activated&couponCode=LaCouttsSC20&discountPercentage=20",
//     "couponCode": "LaCouttsSC20",
//   },
//   {
//     "discountPercentage": 10,
//     "advertiserName": 'softstrokessilk.com',
//     "campaignLogoURI": '',
//     "advertiserURL": 'https://www.softstrokessilk.com',
//     "subDomains": [],
//     "discountType": "Coupon",
//     "trackingLink": "https://softstrokessilk.com?sc-coupon=activated&couponCode=LOVESILK&discountPercentage=10",
//     "couponCode": "LOVESILK",
//   }
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Transportation",
//   //   "campaignID": 4704,
//   //   "campaignName": "United Airlines MileagePlus - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4704.gif",
//   //   "activeDate": "Apr 9, 2024 15:48",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://united.elfm.net/c/4797259/302886/4704",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://buymiles.mileageplus.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Transportation",
//   //   "campaignID": 4705,
//   //   "campaignName": "Southwest Airlines Rapid Rewards - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4705.gif",
//   //   "activeDate": "Mar 4, 2024 16:45",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://swa.eyjo.net/c/4797259/302888/4705",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://www.southwest.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Transportation",
//   //   "campaignID": 4707,
//   //   "campaignName": "Alaska Airlines Mileage Plan - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4707.gif",
//   //   "activeDate": "Apr 9, 2024 15:48",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://alaska.gqco.net/c/4797259/302892/4707",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://storefront.points.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Accommodations",
//   //   "campaignID": 4797,
//   //   "campaignName": "IHG Rewards Club - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4797.gif",
//   //   "activeDate": "Mar 4, 2024 16:45",
//   //   "insertionOrderName": "Public Term",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://ihg.hmxg.net/c/4797259/310617/4797",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://storefront.points.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Accommodations",
//   //   "campaignID": 4823,
//   //   "campaignName": "Hilton Honors Rewards - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4823.gif",
//   //   "activeDate": "Mar 4, 2024 16:46",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://hilton.ijrn.net/c/4797259/314255/4823",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://www.hilton.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Accommodations",
//   //   "campaignID": 4882,
//   //   "campaignName": "World of Hyatt - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4882.gif",
//   //   "activeDate": "Apr 9, 2024 15:48",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://hyatt.jewn.net/c/4797259/319067/4882",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://storefront.points.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Transportation",
//   //   "campaignID": 4883,
//   //   "campaignName": "JetBlue TrueBlue - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4883.gif",
//   //   "activeDate": "Apr 9, 2024 15:51",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://jetblue.jyeh.net/c/4797259/319069/4883",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://www.jetblue.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Transportation",
//   //   "campaignID": 4885,
//   //   "campaignName": "Choice Privileges - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4885.gif",
//   //   "activeDate": "Apr 9, 2024 15:48",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://choice.mtko.net/c/4797259/319073/4885",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 15 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://storefront.points.com"] 
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Transportation",
//   //   "campaignID": 4926,
//   //   "campaignName": "Air France KLM Flying Blue - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4926.gif",
//   //   "activeDate": "Apr 9, 2024 15:48",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://afklm.tcux.net/c/4797259/321349/4926",
//   //   "allowsDeepLinking": false,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://www.flyingblue.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Accommodations",
//   //   "campaignID": 4937,
//   //   "campaignName": "Marriott Bonvoy - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/4937.gif",
//   //   "activeDate": "Mar 4, 2024 16:45",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://marriott.pxf.io/c/4797259/321373/4937",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 7 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://buy.points.com"]
//   // },
//   // {
//   //   "advertiserID": 298281,
//   //   "advertiserName": "Points",
//   //   "advertiserURL": "http://www.points.com",
//   //   "advertiserCategory": "Transportation",
//   //   "campaignID": 5123,
//   //   "campaignName": "Copa Airlines ConnectMiles - Points.com",
//   //   "campaignLogoURI": "https://cdn2.impact.com/display-logo-via-campaign/5123.gif",
//   //   "activeDate": "Apr 9, 2024 15:50",
//   //   "insertionOrderName": "Public Terms",
//   //   "insertionOrderStatus": "Active",
//   //   "trackingLink": "https://copa.sjv.io/c/4797259/343960/5123",
//   //   "allowsDeepLinking": true,
//   //   "payout": "You earn 2.5% of Net Sales Amount",
//   //   "performanceBonus": "N/a",
//   //   "clickReferralPeriod": "Referrals are only considered for credit if they occur within 15 day(s) of the action",
//   //   "actionLocking": "All actions happening in a given month are locked 1 month(s) and 0 day(s) after the end of the month",
//   //   "discountPercentage": 2.5,
//   //   "discountType": "Net Sales Amount",
//   //   "subDomains": ["https://storefront.points.com/"]
//   // },
// ]

const CAMPAIGNS_API = [
    {
        "AdvertiserId": ["48706"],
        "AdvertiserName": [
            "Moosejaw.com"
        ],
        "AdvertiserUrl": [
            "https://www.moosejaw.com/"
        ],
        "CampaignId": [
            "1676"
        ],
        "CampaignName": [
            "Moosejaw.com"
        ],
        "CampaignUrl": [
            "https://www.moosejaw.com"
        ],
        "CampaignDescription": [
            "Moosejaw - one of the fastest-growing outdoor retailers in the country - offers mid to high-end mountain apparel and outdoor equipment. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "MARSHALLISLANDS",
                    "ISRAEL",
                    "FRANCE",
                    "ECUADOR",
                    "REUNION",
                    "ANTIGUABARBUDA",
                    "GREENLAND",
                    "ALBANIA",
                    "CONGO",
                    "SEYCHELLES",
                    "PORTUGAL",
                    "SAINTHELENA",
                    "TUNISIA",
                    "YEMEN",
                    "SANMARINO",
                    "GUADELOUPE",
                    "CUBA",
                    "BRAZIL",
                    "ALGERIA",
                    "THAILAND",
                    "MADAGASCAR",
                    "MALI",
                    "KIRIBATI",
                    "ARUBA",
                    "LAOS",
                    "MOLDOVA",
                    "ZIMBABWE",
                    "BARBADOS",
                    "SENEGAL",
                    "TAJIKISTAN",
                    "MAURITIUS",
                    "NORFOLKISLAND",
                    "LUXEMBOURG",
                    "DIJIBOUTI",
                    "WESTERNSAHARA",
                    "IVORYCOAST",
                    "VATICAN",
                    "ZAMBIA",
                    "ELSALVADOR",
                    "SWITZERLAND",
                    "MONTSERRAT",
                    "NETHERLANDSANTILLES",
                    "JORDAN",
                    "MALDIVES",
                    "LESOTHO",
                    "SAINTLUCIA",
                    "PAPUANEWGUINEA",
                    "MAURITANIA",
                    "BURKINAFASO",
                    "ANGUILLA",
                    "GUINEABISSAU",
                    "LIBYA",
                    "KENYA",
                    "SYRIA",
                    "GABON",
                    "NORTHERNMARIANAISLANDS",
                    "ANTARCTICA",
                    "TOGO",
                    "SAOTOME",
                    "TURKEY",
                    "MOROCCO",
                    "NORTHKOREA",
                    "MARTINIQUE",
                    "GRENADA",
                    "FRENCHSOUTHERNTERRITORIES",
                    "TRINIDADTOBAGO",
                    "UK",
                    "KYRGYZSTAN",
                    "TIMOR",
                    "COMOROS",
                    "HONGKONG",
                    "NAMIBIA",
                    "BAHAMAS",
                    "BAHRAIN",
                    "SOLOMONISLANDS",
                    "US",
                    "BOTSWANA",
                    "AUSTRALIA",
                    "BELIZE",
                    "GEORGIA",
                    "COOKISLANDS",
                    "ITALY",
                    "NAURU",
                    "SURINAME",
                    "CHRISTMASISLAND",
                    "OMAN",
                    "BURUNDI",
                    "JAMAICA",
                    "NIGERIA",
                    "GUATEMALA",
                    "CZECHREPUBLIC",
                    "SOMALIA",
                    "SAUDIARABIA",
                    "LICHTENSTEIN",
                    "CANADA",
                    "LIBERIA",
                    "VIETNAM",
                    "TAIWAN",
                    "SLOVAKIA",
                    "NEWCALEDONIA",
                    "TOKELAU",
                    "FALKLANDISLANDS",
                    "BERMUDA",
                    "BRUNEIDARUSSALAM",
                    "USVIRGINISLANDS",
                    "SIERRALEONE",
                    "SAINTVINCENTGRENADINES",
                    "PERU",
                    "MACEDONIA",
                    "UZBEKISTAN",
                    "CHINA",
                    "ETHIOPIA",
                    "BHUTAN",
                    "CROATIA",
                    "MAYOTTE",
                    "HAITI",
                    "ERITREA",
                    "YOGOSLAVIA",
                    "KAZAKHSTAN",
                    "COSTARICA",
                    "MONTENEGRO",
                    "CYPRUS",
                    "SAINTPIERREMIQUELON",
                    "RUSSIA",
                    "TANZANIA",
                    "ANDORRA",
                    "COCOSISLANDS",
                    "WALLISFUTUNA",
                    "BOSNIAHERZEGOVINA",
                    "KUWAIT",
                    "AUSTRIA",
                    "BRITISHVIRGINISLANDS",
                    "NEPAL",
                    "CAPVERDE",
                    "MYANMAR",
                    "BENIN",
                    "CENTRALAFRICANREPUBLIC",
                    "NICARAGUA",
                    "SPAIN",
                    "BELARUS",
                    "BULGARIA",
                    "PUERTORICO",
                    "VANUATU",
                    "PAKISTAN",
                    "DOMINICA",
                    "CHILE",
                    "CAMBODIA",
                    "DEMOCRATICREPUBLICCONGO",
                    "IRAN",
                    "UAE",
                    "GIBRALTAR",
                    "GHANA",
                    "HUNGARY",
                    "IRAQ",
                    "ICELAND",
                    "AMERICANSAMOA",
                    "INDIA",
                    "TURKMENISTAN",
                    "ARGENTINA",
                    "UKRAINE",
                    "GUYANA",
                    "CHAD",
                    "TUVALU",
                    "SVALBARDJANMAYEN",
                    "ROMANIA",
                    "ANGOLA",
                    "NEWZEALAND",
                    "BOLIVIA",
                    "SWEDEN",
                    "SAMOA",
                    "FIJI",
                    "LATVIA",
                    "PALAU",
                    "SINGAPORE",
                    "POLAND",
                    "HONDURAS",
                    "FRENCHPOLYNESIA",
                    "DENMARK",
                    "SOUTHAFRICA",
                    "LITHUANIA",
                    "SUDAN",
                    "ARMENIA",
                    "SLOVENIA",
                    "MALAWI",
                    "TONGA",
                    "BELGIUM",
                    "AZERBAIJAN",
                    "PALESTINIANTERRITORY",
                    "EQUATORIALGUINEA",
                    "PHILIPPINES",
                    "GUINEA",
                    "SOUTHKOREA",
                    "GUERNSEY",
                    "FAROEISLANDS",
                    "GREECE",
                    "FINLAND",
                    "IRELAND",
                    "INDONESIA",
                    "SRILANKA",
                    "PITCAIRN",
                    "MALAYSIA",
                    "DOMINICANREPUBLIC",
                    "GAMBIA",
                    "SAINTKITTSNEVIS",
                    "MOZAMBIQUE",
                    "NIUE",
                    "TURKSCAICOSISLANDS",
                    "BRITISHINDIANOCEANTERRITORY",
                    "AFGHANISTAN",
                    "GUAM",
                    "PANAMA",
                    "MACAO",
                    "CAYMANISLANDS",
                    "SWAZILAND",
                    "URUGUAY",
                    "GERMANY",
                    "EGYPT",
                    "VENEZUELA",
                    "JAPAN",
                    "QATAR",
                    "MONACO",
                    "NORWAY",
                    "ESTONIA",
                    "CAMEROON",
                    "BANGLADESH",
                    "LEBANON",
                    "UGANDA",
                    "MEXICO",
                    "FRENCHGUIANA",
                    "MICRONESIA",
                    "PARAGUAY",
                    "COLOMBIA",
                    "NIGER",
                    "RWANDA",
                    "NETHERLANDS",
                    "MALTA",
                    "MONGOLIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/1676/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/1676/PublicTerms"
        ],
        "ContractStatus": [
            "Expired"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/1676/Contracts/Active"
        ],
        "TrackingLink": [
            ""
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "moosejaw.com",
                    " classic.avantlink.com",
                    " qa.moosejaw.com",
                    " staging.moosejaw.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/1676"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4704"
        ],
        "CampaignName": [
            "United Airlines MileagePlus - Points.com"
        ],
        "CampaignUrl": [
            "http://www.points.com"
        ],
        "CampaignDescription": [
            "United Airlines' frequent flyer program partners with Points to sell MileagePlus miles to its members, whether they need more to book an award flight or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy miles."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4704/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4704/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4704/Contracts/Active"
        ],
        "TrackingLink": [
            "https://united.elfm.net/c/4797259/302886/4704"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    ".points.",
                    "mileageplus.com",
                    "unitedmileageplus.com",
                    "united.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4704"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4705"
        ],
        "CampaignName": [
            "Southwest Airlines Rapid Rewards - Points.com"
        ],
        "CampaignUrl": [
            "http://www.points.com"
        ],
        "CampaignDescription": [
            "Southwest Airlines' frequent flyer program partners with Points to sell Rapid Rewards points to its members, whether they need more to book an award flight or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4705/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4705/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4705/Contracts/Active"
        ],
        "TrackingLink": [
            "https://swa.eyjo.net/c/4797259/302888/4705"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    ".points.",
                    "southwest.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4705"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4707"
        ],
        "CampaignName": [
            "Alaska Airlines Mileage Plan - Points.com"
        ],
        "CampaignUrl": [
            "http://www.points.com"
        ],
        "CampaignDescription": [
            "Alaska Airlines' frequent flyer program partners with Points to sell Mileage Plan miles to its members, whether they need more to book an award flight or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy miles."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4707/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4707/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4707/Contracts/Active"
        ],
        "TrackingLink": [
            "https://alaska.gqco.net/c/4797259/302892/4707"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    ".points."
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4707"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4797"
        ],
        "CampaignName": [
            "IHG Rewards Club - Points.com"
        ],
        "CampaignUrl": [
            "http://www.points.com"
        ],
        "CampaignDescription": [
            "IHG Rewards Club program partners with Points to sell IHG reward points to its members, whether they need more to book a hotel room or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy miles."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4797/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4797/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4797/Contracts/Active"
        ],
        "TrackingLink": [
            "https://ihg.hmxg.net/c/4797259/310617/4797"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "points.com",
                    "*.points.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4797"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4823"
        ],
        "CampaignName": [
            "Hilton Honors Rewards - Points.com"
        ],
        "CampaignUrl": [
            "http://www.points.com"
        ],
        "CampaignDescription": [
            "Hilton Honors program partners with Points to sell Honors points to its members, whether they need more to book a hotel room or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy points."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4823/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4823/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4823/Contracts/Active"
        ],
        "TrackingLink": [
            "https://hilton.ijrn.net/c/4797259/314255/4823"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    ".points."
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4823"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4882"
        ],
        "CampaignName": [
            "World of Hyatt - Points.com"
        ],
        "CampaignUrl": [
            ""
        ],
        "CampaignDescription": [
            "World of Hyatt program partners with Points to sell Hyatt reward points to its members, whether they need more to book a hotel room or are stocking up for future use. Frequent bonus/discount offers add incentive to buy points.\r\n        "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4882/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4882/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4882/Contracts/Active"
        ],
        "TrackingLink": [
            "https://hyatt.jewn.net/c/4797259/319067/4882"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "*points.com",
                    "storefront.points.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4882"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4883"
        ],
        "CampaignName": [
            "JetBlue TrueBlue - Points.com"
        ],
        "CampaignUrl": [
            "http://points.com"
        ],
        "CampaignDescription": [
            "JetBlue TrueBlue program partners with Points to sell TrueBlue points to its members, whether they need more to book an award flight or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy miles."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4883/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4883/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4883/Contracts/Active"
        ],
        "TrackingLink": [
            "https://jetblue.jyeh.net/c/4797259/319069/4883"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "points.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4883"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4885"
        ],
        "CampaignName": [
            "Choice Privileges - Points.com"
        ],
        "CampaignUrl": [
            "http://points.com"
        ],
        "CampaignDescription": [
            "Choice Privileges program partners with Points to sell loyalty points to its members, whether they need more to book a hotel or are stocking up for future bookings"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4885/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4885/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4885/Contracts/Active"
        ],
        "TrackingLink": [
            "https://choice.mtko.net/c/4797259/319073/4885"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "points.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4885"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4926"
        ],
        "CampaignName": [
            "Air France KLM Flying Blue - Points.com"
        ],
        "CampaignUrl": [
            "http://points.com"
        ],
        "CampaignDescription": [
            "Air France KLM FlyingBlue partners with Points to sell FlyingBlue points to its members, whether they need more to book an award flight or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy miles."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4926/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4926/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4926/Contracts/Active"
        ],
        "TrackingLink": [
            "https://afklm.tcux.net/c/4797259/321349/4926"
        ],
        "AllowsDeeplinking": [
            "false"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "points.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4926"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "4937"
        ],
        "CampaignName": [
            "Marriott Bonvoy - Points.com"
        ],
        "CampaignUrl": [
            "http://points.com"
        ],
        "CampaignDescription": [
            "Marriott Bonvoy partners with Points to sell its reward points to members. whether they need more to book a hotel or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy points."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4937/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4937/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4937/Contracts/Active"
        ],
        "TrackingLink": [
            "https://marriott.pxf.io/c/4797259/321373/4937"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "points.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/4937"
        ]
    },
    {
        "AdvertiserId": [
            "298281"
        ],
        "AdvertiserName": [
            "Points"
        ],
        "AdvertiserUrl": [
            "http://www.points.com"
        ],
        "CampaignId": [
            "5123"
        ],
        "CampaignName": [
            "Copa Airlines ConnectMiles - Points.com"
        ],
        "CampaignUrl": [
            "https://www.copaair.com/en/web/us/connectmiles/about-connectmiles"
        ],
        "CampaignDescription": [
            "Copa Airlines' ConnectMiles program partners with Points to sell ConnectMiles points to its members, whether they need more to book an award flight or are stocking up for future trips. Frequent bonus/discount offers add incentive to buy."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    ""
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/5123/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/5123/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/5123/Contracts/Active"
        ],
        "TrackingLink": [
            "https://copa.sjv.io/c/4797259/343960/5123"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "points.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/5123"
        ]
    },
    {
        "AdvertiserId": [
            "419062"
        ],
        "AdvertiserName": [
            "adidas Australia"
        ],
        "AdvertiserUrl": [
            "http://www.adidas.com.au"
        ],
        "CampaignId": [
            "7362"
        ],
        "CampaignName": [
            "adidas Australia "
        ],
        "CampaignUrl": [
            "http://www.adidas.com.au/"
        ],
        "CampaignDescription": [
            "The adidas Sports range is driven by the needs of athletes and offers unparalleled performance.\r\n        \r\n        adidas Originals' timeless designs define today's streetwear scene. Embody style with an athletic edge with their line of sneakers and apparel."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/7362/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/7362/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/7362/Contracts/Active"
        ],
        "TrackingLink": [
            "https://adidas-australia.pxf.io/c/4797259/408139/7362"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "*.adidas.*",
                    "*.doubleclick.*"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/7362"
        ]
    },
    {
        "AdvertiserId": [
            "1217827"
        ],
        "AdvertiserName": [
            "IMPACT"
        ],
        "AdvertiserUrl": [
            "http://www.impact.com"
        ],
        "CampaignId": [
            "10925"
        ],
        "CampaignName": [
            "Impact.com Referral Partner Program"
        ],
        "CampaignUrl": [
            "http://impact.com"
        ],
        "CampaignDescription": [
            "The Impact.com Partnership Cloud is the world's leading platform for partnership automation. Introduce us to your relevant audience or customers and earn a percentage of the annual contract value if they result in a signed contract."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "UK",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10925/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10925/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10925/Contracts/Active"
        ],
        "TrackingLink": [
            "https://impact-referral-partnerships.sjv.io/c/4797259/749356/10925"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "app.impact.com",
                    "go.impact.com*",
                    "get.impact.com*",
                    "www.impact.com*",
                    "www.accelerationpartners.com",
                    "www.allinclusivemarketing.com",
                    "www.dmipartners.com",
                    "www.forwardpmx.com",
                    "gen3marketing.com",
                    "growthops.com.au",
                    "www.iprospect.com",
                    "lt.partners",
                    "marketforceagency.com",
                    "www.navigatedigital.com",
                    "www.neomediaworld.com",
                    "opmpros.com",
                    "www.optimus-pm.com",
                    "partnercentric.com",
                    "www.performcb.com",
                    "www.performics.com",
                    "www.riseinteractive.com",
                    "www.scaledigital.co",
                    "www.silverbean.com",
                    "streamline-marketing.com",
                    "syyco.co.uk",
                    "www.wpromote.com",
                    "www.360i.com",
                    "www.iaffiliatemanagement.com",
                    "affiliatemanager.com",
                    "within.co",
                    "www.archercom.com",
                    "bluemoondigital.co",
                    "bvacommerce.com",
                    "matterkind.com",
                    "www.digitalriver.com",
                    "www.eboveandbeyond.com",
                    "www.groupm.com",
                    "houseofkaizen.com",
                    "www.intertwineinteractive.com",
                    "www.lqdigital.com",
                    "www.mindshareworld.com",
                    "ovative.com",
                    "www.partnercommerce.com",
                    "roeye.com",
                    "www.publicissapient.com",
                    "tinuiti.com",
                    "www.twentysixdigital.com",
                    "www.grovia.io*",
                    "member-stage6.impactradius.net/signup/brand-signup.ihtml?edition=starter"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10925"
        ]
    },
    {
        "AdvertiserId": [
            "1217855"
        ],
        "AdvertiserName": [
            "LightInTheBoxLimited"
        ],
        "AdvertiserUrl": [
            "http://www.eechic.com"
        ],
        "CampaignId": [
            "17020"
        ],
        "CampaignName": [
            "Printrendy"
        ],
        "CampaignUrl": [
            "https://printrendy.com"
        ],
        "CampaignDescription": [
            "Printrendy.com is an online store inspired by the belief that the best men's clothing should be accessible to everyone. At Printrendy.com, you will find variety of products offered at incredible prices and high-performance designs."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "SWEDEN",
                    "AUSTRALIA",
                    "CANADA",
                    "GERMANY",
                    "UK",
                    "ITALY",
                    "SWITZERLAND",
                    "FRANCE",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17020/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17020/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17020/Contracts/Active"
        ],
        "TrackingLink": [
            "https://printrendy.pxf.io/c/4797259/1432688/17020"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "printrendy.com",
                    "*.printrendy.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17020"
        ]
    },
    {
        "AdvertiserId": [
            "1274595"
        ],
        "AdvertiserName": [
            "Mark's - Lequipeur"
        ],
        "AdvertiserUrl": [
            "https://www.marks.com"
        ],
        "CampaignId": [
            "8679"
        ],
        "CampaignName": [
            "Mark's"
        ],
        "CampaignUrl": [
            "https://www.marks.com/"
        ],
        "CampaignDescription": [
            "Our team has been providing Canadians with clothing, shoes, and accessories. Now called Mark's, we continue specializing in casual clothing, jeans, work apparel, scrubs and accessories. We’re committed to providing Canadians with the best products."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "CANADA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/8679/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/8679/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/8679/Contracts/Active"
        ],
        "TrackingLink": [
            "https://marks.r37x9j.net/c/4797259/505590/8679"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "marks.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/8679"
        ]
    },
    {
        "AdvertiserId": [
            "1398261"
        ],
        "AdvertiserName": [
            "Fanatics"
        ],
        "AdvertiserUrl": [
            "http://www.fanatics.com"
        ],
        "CampaignId": [
            "9663"
        ],
        "CampaignName": [
            "Fanatics (Global)"
        ],
        "CampaignUrl": [
            "http://www.fanatics.com"
        ],
        "CampaignDescription": [
            "Fanatics.com sells officially-licensed merchandise for NCAA, NFL, MLB, NBA, NHL, MLS, UEFA, NASCAR and more. We have a huge selection of jerseys, shirts, hats, collectibles, memorabilia, and more as We offer over 500,000 items from all the top brands"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "GERMANY",
                    "UK",
                    "FRANCE",
                    "US",
                    "MEXICO"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/9663/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/9663/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/9663/Contracts/Active"
        ],
        "TrackingLink": [
            "https://fanatics.93n6tx.net/c/4797259/586570/9663"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "fanatics.com",
                    "fanatics-intl.com*",
                    "fanatics.ca",
                    "*.fanatics.ca",
                    "*.fanatics.*",
                    "fanatics.co.uk*",
                    "fanatics.de*",
                    "fanatics.es*",
                    "fanatics.fr*",
                    "fanatics.it*",
                    "fanatics.mx*"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/9663"
        ]
    },
    {
        "AdvertiserId": [
            "1719590"
        ],
        "AdvertiserName": [
            "Decathlon Canada"
        ],
        "AdvertiserUrl": [
            "http://www.decathlon.ca"
        ],
        "CampaignId": [
            "10224"
        ],
        "CampaignName": [
            "Decathlon Canada"
        ],
        "CampaignUrl": [
            "http://www.decathlon.ca/"
        ],
        "CampaignDescription": [
            "Decathlon Canada is the global leader in sports-retail and wants to be your trusted partner in sports. With over 25,000 different products across 65 sports, we are committed to making sports accessible to all Canadians."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "CANADA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10224/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10224/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10224/Contracts/Active"
        ],
        "TrackingLink": [
            "https://decathlon-canada.mkr3.net/c/4797259/642729/10224"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "decathlon.ca",
                    "decathlon.net"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10224"
        ]
    },
    {
        "AdvertiserId": [
            "1912000"
        ],
        "AdvertiserName": [
            "Easyship"
        ],
        "AdvertiserUrl": [
            "https://www.easyship.com/"
        ],
        "CampaignId": [
            "10435"
        ],
        "CampaignName": [
            "Easyship Ambassador Program"
        ],
        "CampaignUrl": [
            "http://www.easyship.com"
        ],
        "CampaignDescription": [
            "Easyship is an All in One Shipping Platform trusted by 100k+ businesses to enable cross border shipping; making it simpler, more cost-effective & seamless. Print labels, issue returns, share tracking info & automate taxes & duties in seconds.\r\n        "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "PORTUGAL",
                    "FINLAND",
                    "AUSTRALIA",
                    "CANADA",
                    "IRELAND",
                    "MALAYSIA",
                    "CHINA",
                    "NORWAY",
                    "ITALY",
                    "NORTHKOREA",
                    "BELGIUM",
                    "SINGAPORE",
                    "FRANCE",
                    "AUSTRIA",
                    "DENMARK",
                    "MEXICO",
                    "GERMANY",
                    "UK",
                    "JAPAN",
                    "NETHERLANDS",
                    "NEWZEALAND",
                    "US",
                    "INDIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10435/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10435/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10435/Contracts/Active"
        ],
        "TrackingLink": [
            "https://easyship.ilbqy6.net/c/4797259/666308/10435"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "www.easyship.com",
                    "app.easyship.com",
                    "try.easyship.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/10435"
        ]
    },
    {
        "AdvertiserId": [
            "2463760"
        ],
        "AdvertiserName": [
            "InVideo"
        ],
        "AdvertiserUrl": [
            "http://www.invideo.io"
        ],
        "CampaignId": [
            "12258"
        ],
        "CampaignName": [
            "InVideo"
        ],
        "CampaignUrl": [
            "http://invideo.io"
        ],
        "CampaignDescription": [
            "InVideo helps you to transform your content into great videos. We serve media companies, small businesses, and brands to expand audience engagement through the power of video content. InVideo is ideal for marketers, publishers, and professionals."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "MARSHALLISLANDS",
                    "ISRAEL",
                    "FRANCE",
                    "ECUADOR",
                    "REUNION",
                    "ANTIGUABARBUDA",
                    "GREENLAND",
                    "ALBANIA",
                    "CONGO",
                    "SEYCHELLES",
                    "PORTUGAL",
                    "SAINTHELENA",
                    "TUNISIA",
                    "YEMEN",
                    "SANMARINO",
                    "GUADELOUPE",
                    "CUBA",
                    "BRAZIL",
                    "ALGERIA",
                    "THAILAND",
                    "MADAGASCAR",
                    "MALI",
                    "KIRIBATI",
                    "ARUBA",
                    "LAOS",
                    "MOLDOVA",
                    "ZIMBABWE",
                    "BARBADOS",
                    "SENEGAL",
                    "TAJIKISTAN",
                    "MAURITIUS",
                    "NORFOLKISLAND",
                    "LUXEMBOURG",
                    "DIJIBOUTI",
                    "WESTERNSAHARA",
                    "IVORYCOAST",
                    "VATICAN",
                    "ZAMBIA",
                    "ELSALVADOR",
                    "SWITZERLAND",
                    "MONTSERRAT",
                    "NETHERLANDSANTILLES",
                    "JORDAN",
                    "MALDIVES",
                    "LESOTHO",
                    "SAINTLUCIA",
                    "PAPUANEWGUINEA",
                    "MAURITANIA",
                    "BURKINAFASO",
                    "ANGUILLA",
                    "GUINEABISSAU",
                    "LIBYA",
                    "KENYA",
                    "SYRIA",
                    "GABON",
                    "NORTHERNMARIANAISLANDS",
                    "ANTARCTICA",
                    "TOGO",
                    "SAOTOME",
                    "TURKEY",
                    "MOROCCO",
                    "NORTHKOREA",
                    "MARTINIQUE",
                    "GRENADA",
                    "FRENCHSOUTHERNTERRITORIES",
                    "TRINIDADTOBAGO",
                    "UK",
                    "KYRGYZSTAN",
                    "TIMOR",
                    "COMOROS",
                    "HONGKONG",
                    "NAMIBIA",
                    "BAHAMAS",
                    "BAHRAIN",
                    "SOLOMONISLANDS",
                    "US",
                    "BOTSWANA",
                    "AUSTRALIA",
                    "BELIZE",
                    "GEORGIA",
                    "COOKISLANDS",
                    "ITALY",
                    "NAURU",
                    "SURINAME",
                    "CHRISTMASISLAND",
                    "OMAN",
                    "BURUNDI",
                    "JAMAICA",
                    "NIGERIA",
                    "GUATEMALA",
                    "CZECHREPUBLIC",
                    "SOMALIA",
                    "SAUDIARABIA",
                    "LICHTENSTEIN",
                    "CANADA",
                    "LIBERIA",
                    "VIETNAM",
                    "TAIWAN",
                    "SLOVAKIA",
                    "NEWCALEDONIA",
                    "TOKELAU",
                    "FALKLANDISLANDS",
                    "BERMUDA",
                    "BRUNEIDARUSSALAM",
                    "USVIRGINISLANDS",
                    "SIERRALEONE",
                    "SAINTVINCENTGRENADINES",
                    "PERU",
                    "MACEDONIA",
                    "UZBEKISTAN",
                    "CHINA",
                    "ETHIOPIA",
                    "BHUTAN",
                    "CROATIA",
                    "MAYOTTE",
                    "HAITI",
                    "ERITREA",
                    "YOGOSLAVIA",
                    "KAZAKHSTAN",
                    "COSTARICA",
                    "MONTENEGRO",
                    "CYPRUS",
                    "SAINTPIERREMIQUELON",
                    "RUSSIA",
                    "TANZANIA",
                    "ANDORRA",
                    "COCOSISLANDS",
                    "WALLISFUTUNA",
                    "BOSNIAHERZEGOVINA",
                    "KUWAIT",
                    "AUSTRIA",
                    "BRITISHVIRGINISLANDS",
                    "NEPAL",
                    "CAPVERDE",
                    "MYANMAR",
                    "BENIN",
                    "CENTRALAFRICANREPUBLIC",
                    "NICARAGUA",
                    "SPAIN",
                    "BELARUS",
                    "BULGARIA",
                    "PUERTORICO",
                    "VANUATU",
                    "PAKISTAN",
                    "DOMINICA",
                    "CHILE",
                    "CAMBODIA",
                    "DEMOCRATICREPUBLICCONGO",
                    "IRAN",
                    "UAE",
                    "GIBRALTAR",
                    "GHANA",
                    "HUNGARY",
                    "IRAQ",
                    "ICELAND",
                    "AMERICANSAMOA",
                    "INDIA",
                    "TURKMENISTAN",
                    "ARGENTINA",
                    "UKRAINE",
                    "GUYANA",
                    "CHAD",
                    "TUVALU",
                    "SVALBARDJANMAYEN",
                    "ROMANIA",
                    "ANGOLA",
                    "NEWZEALAND",
                    "BOLIVIA",
                    "SWEDEN",
                    "SAMOA",
                    "FIJI",
                    "LATVIA",
                    "PALAU",
                    "SINGAPORE",
                    "POLAND",
                    "HONDURAS",
                    "FRENCHPOLYNESIA",
                    "DENMARK",
                    "SOUTHAFRICA",
                    "LITHUANIA",
                    "SUDAN",
                    "ARMENIA",
                    "SLOVENIA",
                    "MALAWI",
                    "TONGA",
                    "BELGIUM",
                    "AZERBAIJAN",
                    "PALESTINIANTERRITORY",
                    "EQUATORIALGUINEA",
                    "PHILIPPINES",
                    "GUINEA",
                    "SOUTHKOREA",
                    "GUERNSEY",
                    "FAROEISLANDS",
                    "GREECE",
                    "FINLAND",
                    "IRELAND",
                    "INDONESIA",
                    "SRILANKA",
                    "PITCAIRN",
                    "MALAYSIA",
                    "DOMINICANREPUBLIC",
                    "GAMBIA",
                    "SAINTKITTSNEVIS",
                    "MOZAMBIQUE",
                    "NIUE",
                    "TURKSCAICOSISLANDS",
                    "BRITISHINDIANOCEANTERRITORY",
                    "AFGHANISTAN",
                    "GUAM",
                    "PANAMA",
                    "MACAO",
                    "CAYMANISLANDS",
                    "SWAZILAND",
                    "URUGUAY",
                    "GERMANY",
                    "EGYPT",
                    "VENEZUELA",
                    "JAPAN",
                    "QATAR",
                    "MONACO",
                    "NORWAY",
                    "ESTONIA",
                    "CAMEROON",
                    "BANGLADESH",
                    "LEBANON",
                    "UGANDA",
                    "MEXICO",
                    "FRENCHGUIANA",
                    "MICRONESIA",
                    "PARAGUAY",
                    "COLOMBIA",
                    "NIGER",
                    "RWANDA",
                    "NETHERLANDS",
                    "MALTA",
                    "MONGOLIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12258/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12258/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12258/Contracts/Active"
        ],
        "TrackingLink": [
            "https://invideo.sjv.io/c/4797259/883681/12258"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "invideo.io",
                    "*.invideo.io",
                    " filmr-affiliate.onelink.me"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12258"
        ]
    },
    {
        "AdvertiserId": [
            "2495728"
        ],
        "AdvertiserName": [
            "Wish"
        ],
        "AdvertiserUrl": [
            "http://wish.com"
        ],
        "CampaignId": [
            "12396"
        ],
        "CampaignName": [
            "Wish"
        ],
        "CampaignUrl": [
            "http://wish.com"
        ],
        "CampaignDescription": [
            "Wish is an online e-commerce platform that facilitates transactions between sellers and buyers. Wish is Shopping Made Fun. Shop millions of quality products at deep, deep discounts!"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "SWEDEN",
                    "SOUTHAFRICA",
                    "CANADA",
                    "GERMANY",
                    "NORWAY",
                    "ITALY",
                    "SWITZERLAND",
                    "NETHERLANDS",
                    "FRANCE",
                    "US",
                    "AUSTRIA",
                    "DENMARK"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12396/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12396/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12396/Contracts/Active"
        ],
        "TrackingLink": [
            "https://wish.pxf.io/c/4797259/899103/12396"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "wish.com",
                    "*.wish.com",
                    "myshopify.com",
                    "*.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12396"
        ]
    },
    {
        "AdvertiserId": [
            "2551659"
        ],
        "AdvertiserName": [
            "Peakstar Technologies Inc."
        ],
        "AdvertiserUrl": [
            "http://atlasvpn.com"
        ],
        "CampaignId": [
            "12618"
        ],
        "CampaignName": [
            "Atlas VPN (closing)"
        ],
        "CampaignUrl": [
            "http://atlasvpn.com"
        ],
        "CampaignDescription": [
            "A trusted and promising free VPN provider, that encourages security, anonymity and internet freedom.\r\n        Why to work with us: \r\n        - high commissions;\r\n        - good CR and approval rate;\r\n        - variety of marketing assets;\r\n        - dedicated account manager. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "MARSHALLISLANDS",
                    "ISRAEL",
                    "FRANCE",
                    "ECUADOR",
                    "REUNION",
                    "ANTIGUABARBUDA",
                    "GREENLAND",
                    "ALBANIA",
                    "CONGO",
                    "SEYCHELLES",
                    "PORTUGAL",
                    "SAINTHELENA",
                    "TUNISIA",
                    "YEMEN",
                    "SANMARINO",
                    "GUADELOUPE",
                    "CUBA",
                    "BRAZIL",
                    "ALGERIA",
                    "THAILAND",
                    "MADAGASCAR",
                    "MALI",
                    "KIRIBATI",
                    "ARUBA",
                    "LAOS",
                    "MOLDOVA",
                    "ZIMBABWE",
                    "BARBADOS",
                    "SENEGAL",
                    "TAJIKISTAN",
                    "MAURITIUS",
                    "NORFOLKISLAND",
                    "LUXEMBOURG",
                    "DIJIBOUTI",
                    "WESTERNSAHARA",
                    "IVORYCOAST",
                    "VATICAN",
                    "ZAMBIA",
                    "ELSALVADOR",
                    "SWITZERLAND",
                    "MONTSERRAT",
                    "NETHERLANDSANTILLES",
                    "JORDAN",
                    "MALDIVES",
                    "LESOTHO",
                    "SAINTLUCIA",
                    "PAPUANEWGUINEA",
                    "MAURITANIA",
                    "BURKINAFASO",
                    "ANGUILLA",
                    "GUINEABISSAU",
                    "LIBYA",
                    "KENYA",
                    "SYRIA",
                    "GABON",
                    "NORTHERNMARIANAISLANDS",
                    "ANTARCTICA",
                    "TOGO",
                    "SAOTOME",
                    "TURKEY",
                    "MOROCCO",
                    "NORTHKOREA",
                    "MARTINIQUE",
                    "GRENADA",
                    "FRENCHSOUTHERNTERRITORIES",
                    "TRINIDADTOBAGO",
                    "UK",
                    "KYRGYZSTAN",
                    "TIMOR",
                    "COMOROS",
                    "HONGKONG",
                    "NAMIBIA",
                    "BAHAMAS",
                    "BAHRAIN",
                    "SOLOMONISLANDS",
                    "US",
                    "BOTSWANA",
                    "AUSTRALIA",
                    "BELIZE",
                    "GEORGIA",
                    "COOKISLANDS",
                    "ITALY",
                    "NAURU",
                    "SURINAME",
                    "CHRISTMASISLAND",
                    "OMAN",
                    "BURUNDI",
                    "JAMAICA",
                    "NIGERIA",
                    "GUATEMALA",
                    "CZECHREPUBLIC",
                    "SOMALIA",
                    "SAUDIARABIA",
                    "LICHTENSTEIN",
                    "CANADA",
                    "LIBERIA",
                    "VIETNAM",
                    "TAIWAN",
                    "SLOVAKIA",
                    "NEWCALEDONIA",
                    "TOKELAU",
                    "FALKLANDISLANDS",
                    "BERMUDA",
                    "BRUNEIDARUSSALAM",
                    "USVIRGINISLANDS",
                    "SIERRALEONE",
                    "SAINTVINCENTGRENADINES",
                    "PERU",
                    "MACEDONIA",
                    "UZBEKISTAN",
                    "ETHIOPIA",
                    "BHUTAN",
                    "CROATIA",
                    "MAYOTTE",
                    "HAITI",
                    "ERITREA",
                    "YOGOSLAVIA",
                    "KAZAKHSTAN",
                    "COSTARICA",
                    "MONTENEGRO",
                    "CYPRUS",
                    "SAINTPIERREMIQUELON",
                    "RUSSIA",
                    "TANZANIA",
                    "ANDORRA",
                    "COCOSISLANDS",
                    "WALLISFUTUNA",
                    "BOSNIAHERZEGOVINA",
                    "KUWAIT",
                    "AUSTRIA",
                    "BRITISHVIRGINISLANDS",
                    "NEPAL",
                    "CAPVERDE",
                    "MYANMAR",
                    "BENIN",
                    "CENTRALAFRICANREPUBLIC",
                    "NICARAGUA",
                    "SPAIN",
                    "BELARUS",
                    "BULGARIA",
                    "PUERTORICO",
                    "VANUATU",
                    "PAKISTAN",
                    "DOMINICA",
                    "CHILE",
                    "CAMBODIA",
                    "DEMOCRATICREPUBLICCONGO",
                    "IRAN",
                    "UAE",
                    "GIBRALTAR",
                    "GHANA",
                    "HUNGARY",
                    "IRAQ",
                    "ICELAND",
                    "AMERICANSAMOA",
                    "INDIA",
                    "TURKMENISTAN",
                    "ARGENTINA",
                    "UKRAINE",
                    "GUYANA",
                    "CHAD",
                    "TUVALU",
                    "SVALBARDJANMAYEN",
                    "ROMANIA",
                    "ANGOLA",
                    "NEWZEALAND",
                    "BOLIVIA",
                    "SWEDEN",
                    "SAMOA",
                    "FIJI",
                    "LATVIA",
                    "PALAU",
                    "SINGAPORE",
                    "POLAND",
                    "HONDURAS",
                    "FRENCHPOLYNESIA",
                    "DENMARK",
                    "SOUTHAFRICA",
                    "LITHUANIA",
                    "SUDAN",
                    "ARMENIA",
                    "SLOVENIA",
                    "MALAWI",
                    "TONGA",
                    "BELGIUM",
                    "AZERBAIJAN",
                    "PALESTINIANTERRITORY",
                    "EQUATORIALGUINEA",
                    "PHILIPPINES",
                    "GUINEA",
                    "SOUTHKOREA",
                    "GUERNSEY",
                    "FAROEISLANDS",
                    "GREECE",
                    "FINLAND",
                    "IRELAND",
                    "INDONESIA",
                    "SRILANKA",
                    "PITCAIRN",
                    "MALAYSIA",
                    "DOMINICANREPUBLIC",
                    "GAMBIA",
                    "SAINTKITTSNEVIS",
                    "MOZAMBIQUE",
                    "NIUE",
                    "TURKSCAICOSISLANDS",
                    "BRITISHINDIANOCEANTERRITORY",
                    "AFGHANISTAN",
                    "GUAM",
                    "PANAMA",
                    "MACAO",
                    "CAYMANISLANDS",
                    "SWAZILAND",
                    "URUGUAY",
                    "GERMANY",
                    "EGYPT",
                    "VENEZUELA",
                    "JAPAN",
                    "QATAR",
                    "MONACO",
                    "NORWAY",
                    "ESTONIA",
                    "CAMEROON",
                    "BANGLADESH",
                    "LEBANON",
                    "UGANDA",
                    "MEXICO",
                    "FRENCHGUIANA",
                    "MICRONESIA",
                    "PARAGUAY",
                    "COLOMBIA",
                    "NIGER",
                    "RWANDA",
                    "NETHERLANDS",
                    "MALTA",
                    "MONGOLIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12618/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12618/PublicTerms"
        ],
        "ContractStatus": [
            "Expired"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12618/Contracts/Active"
        ],
        "TrackingLink": [
            ""
        ],
        "AllowsDeeplinking": [
            "false"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "atlasvpn.com",
                    "*.atlasvpn.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12618"
        ]
    },
    {
        "AdvertiserId": [
            "2583300"
        ],
        "AdvertiserName": [
            "Anthology Brands"
        ],
        "AdvertiserUrl": [
            "http://anthologybrands.com"
        ],
        "CampaignId": [
            "12752"
        ],
        "CampaignName": [
            "Pure Hemp Botanicals"
        ],
        "CampaignUrl": [
            "http://purehempbotanicals.com"
        ],
        "CampaignDescription": [
            "Pure Hemp Botanicals has been crafting Pure CBD products since 2015. Our growing customer base eludes to our quality of product and customer service. \r\n        Full Spectrum Tinctures, Broad Spectrum Tinctures, Vegan Softgels, Incredible Body Care lotions! "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12752/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12752/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12752/Contracts/Active"
        ],
        "TrackingLink": [
            "https://pure-hemp-botanical.pxf.io/c/4797259/954928/12752"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "purehempbotanicals.com",
                    "*.purehempbotanicals.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12752"
        ]
    },
    {
        "AdvertiserId": [
            "2583300"
        ],
        "AdvertiserName": [
            "Anthology Brands"
        ],
        "AdvertiserUrl": [
            "http://anthologybrands.com"
        ],
        "CampaignId": [
            "12753"
        ],
        "CampaignName": [
            "Strainz"
        ],
        "CampaignUrl": [
            "http://strainz.com/about-strainz/"
        ],
        "CampaignDescription": [
            "Since 2013 Strainz has been crafting incredible quality CBD products that are distributed offline and online. The Strainz story is one that all affiliates seek, news coverage from CNN, Dateline NBC and much more. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12753/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12753/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12753/Contracts/Active"
        ],
        "TrackingLink": [
            "https://strainz.sjv.io/c/4797259/954930/12753"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "Strainz.com",
                    "*.Strainz.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12753"
        ]
    },
    {
        "AdvertiserId": [
            "2588106"
        ],
        "AdvertiserName": [
            "International Open Academy"
        ],
        "AdvertiserUrl": [
            "http://internationalopenacademy.com"
        ],
        "CampaignId": [
            "16668"
        ],
        "CampaignName": [
            "Eventtrix"
        ],
        "CampaignUrl": [
            "http://eventtrix.com/"
        ],
        "CampaignDescription": [
            "This is Eventtrix - an expert in hospitality, business, and event management with a library of 30+ accredited courses across a range of industries. We support learners by providing professional educational content with marketable qualifications."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "ISRAEL",
                    "FRANCE",
                    "AUSTRIA",
                    "BRITISHVIRGINISLANDS",
                    "NEPAL",
                    "CAPVERDE",
                    "ECUADOR",
                    "NICARAGUA",
                    "GREENLAND",
                    "SPAIN",
                    "SEYCHELLES",
                    "PORTUGAL",
                    "BULGARIA",
                    "PUERTORICO",
                    "DOMINICA",
                    "TUNISIA",
                    "CHILE",
                    "SANMARINO",
                    "CUBA",
                    "BRAZIL",
                    "THAILAND",
                    "UAE",
                    "GIBRALTAR",
                    "HUNGARY",
                    "ICELAND",
                    "MOLDOVA",
                    "INDIA",
                    "AMERICANSAMOA",
                    "BARBADOS",
                    "MAURITIUS",
                    "ARGENTINA",
                    "LUXEMBOURG",
                    "UKRAINE",
                    "ELSALVADOR",
                    "SWITZERLAND",
                    "MONTSERRAT",
                    "ROMANIA",
                    "NEWZEALAND",
                    "BOLIVIA",
                    "SWEDEN",
                    "FIJI",
                    "MALDIVES",
                    "SINGAPORE",
                    "POLAND",
                    "HONDURAS",
                    "DENMARK",
                    "FRENCHPOLYNESIA",
                    "SOUTHAFRICA",
                    "LITHUANIA",
                    "KENYA",
                    "SAOTOME",
                    "TURKEY",
                    "MOROCCO",
                    "SLOVENIA",
                    "NORTHKOREA",
                    "BELGIUM",
                    "EQUATORIALGUINEA",
                    "PHILIPPINES",
                    "MARTINIQUE",
                    "FRENCHSOUTHERNTERRITORIES",
                    "UK",
                    "HONGKONG",
                    "BAHAMAS",
                    "SOUTHKOREA",
                    "US",
                    "GREECE",
                    "FINLAND",
                    "AUSTRALIA",
                    "IRELAND",
                    "INDONESIA",
                    "GEORGIA",
                    "DOMINICANREPUBLIC",
                    "ITALY",
                    "JAMAICA",
                    "BRITISHINDIANOCEANTERRITORY",
                    "GUATEMALA",
                    "CZECHREPUBLIC",
                    "CANADA",
                    "SLOVAKIA",
                    "URUGUAY",
                    "GERMANY",
                    "EGYPT",
                    "USVIRGINISLANDS",
                    "VENEZUELA",
                    "JAPAN",
                    "PERU",
                    "QATAR",
                    "MONACO",
                    "CHINA",
                    "NORWAY",
                    "ESTONIA",
                    "CROATIA",
                    "MEXICO",
                    "FRENCHGUIANA",
                    "YOGOSLAVIA",
                    "PARAGUAY",
                    "COLOMBIA",
                    "COSTARICA",
                    "MONTENEGRO",
                    "CYPRUS",
                    "TANZANIA",
                    "ANDORRA",
                    "NETHERLANDS",
                    "MONGOLIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16668/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16668/PublicTerms"
        ],
        "ContractStatus": [
            "Expired"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16668/Contracts/Active"
        ],
        "TrackingLink": [
            ""
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "eventtrix.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16668"
        ]
    },
    {
        "AdvertiserId": [
            "2642689"
        ],
        "AdvertiserName": [
            "Pro Hockey Life"
        ],
        "AdvertiserUrl": [
            "https://www.prohockeylife.com/"
        ],
        "CampaignId": [
            "12925"
        ],
        "CampaignName": [
            "Pro Hockey Life"
        ],
        "CampaignUrl": [
            "http://www.prohockeylife.com/"
        ],
        "CampaignDescription": [
            "Pro Hockey Life is Canada's #1 Hockey specialty retailer with 16 locations across Canada!"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "CANADA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12925/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12925/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12925/Contracts/Active"
        ],
        "TrackingLink": [
            "https://prohockeylife.pxf.io/c/4797259/979143/12925"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "prohockeylife.com",
                    " *.prohockeylife.com",
                    " prohockeylife.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/12925"
        ]
    },
    {
        "AdvertiserId": [
            "2801211"
        ],
        "AdvertiserName": [
            "BellelilyUS"
        ],
        "AdvertiserUrl": [
            "https://www.bellelily.com"
        ],
        "CampaignId": [
            "13662"
        ],
        "CampaignName": [
            "Bellelily"
        ],
        "CampaignUrl": [
            "http://www.bellelily.com/"
        ],
        "CampaignDescription": [
            "Our Service\r\n        * 20% commission for 15 days on all sales\r\n        * Tracking days: 30 return days\r\n        * Creatives: latest promotion, coupons, deals, banners, text links etc\r\n        * Insight: periodical newsletters \r\n        * Datafeed: regularly updated & free to use"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "MARSHALLISLANDS",
                    "ISRAEL",
                    "FRANCE",
                    "ECUADOR",
                    "REUNION",
                    "ANTIGUABARBUDA",
                    "GREENLAND",
                    "ALBANIA",
                    "CONGO",
                    "SEYCHELLES",
                    "PORTUGAL",
                    "SAINTHELENA",
                    "TUNISIA",
                    "YEMEN",
                    "SANMARINO",
                    "GUADELOUPE",
                    "CUBA",
                    "BRAZIL",
                    "ALGERIA",
                    "THAILAND",
                    "MADAGASCAR",
                    "MALI",
                    "KIRIBATI",
                    "ARUBA",
                    "LAOS",
                    "MOLDOVA",
                    "ZIMBABWE",
                    "BARBADOS",
                    "SENEGAL",
                    "TAJIKISTAN",
                    "MAURITIUS",
                    "NORFOLKISLAND",
                    "LUXEMBOURG",
                    "DIJIBOUTI",
                    "WESTERNSAHARA",
                    "IVORYCOAST",
                    "VATICAN",
                    "ZAMBIA",
                    "ELSALVADOR",
                    "SWITZERLAND",
                    "MONTSERRAT",
                    "NETHERLANDSANTILLES",
                    "JORDAN",
                    "MALDIVES",
                    "LESOTHO",
                    "SAINTLUCIA",
                    "PAPUANEWGUINEA",
                    "MAURITANIA",
                    "BURKINAFASO",
                    "ANGUILLA",
                    "GUINEABISSAU",
                    "LIBYA",
                    "KENYA",
                    "SYRIA",
                    "GABON",
                    "NORTHERNMARIANAISLANDS",
                    "ANTARCTICA",
                    "TOGO",
                    "SAOTOME",
                    "TURKEY",
                    "MOROCCO",
                    "NORTHKOREA",
                    "MARTINIQUE",
                    "GRENADA",
                    "FRENCHSOUTHERNTERRITORIES",
                    "TRINIDADTOBAGO",
                    "UK",
                    "KYRGYZSTAN",
                    "TIMOR",
                    "COMOROS",
                    "HONGKONG",
                    "NAMIBIA",
                    "BAHAMAS",
                    "BAHRAIN",
                    "SOLOMONISLANDS",
                    "US",
                    "BOTSWANA",
                    "AUSTRALIA",
                    "BELIZE",
                    "GEORGIA",
                    "COOKISLANDS",
                    "ITALY",
                    "NAURU",
                    "SURINAME",
                    "CHRISTMASISLAND",
                    "OMAN",
                    "BURUNDI",
                    "JAMAICA",
                    "NIGERIA",
                    "GUATEMALA",
                    "CZECHREPUBLIC",
                    "SOMALIA",
                    "SAUDIARABIA",
                    "LICHTENSTEIN",
                    "CANADA",
                    "LIBERIA",
                    "VIETNAM",
                    "TAIWAN",
                    "SLOVAKIA",
                    "NEWCALEDONIA",
                    "TOKELAU",
                    "FALKLANDISLANDS",
                    "BERMUDA",
                    "BRUNEIDARUSSALAM",
                    "USVIRGINISLANDS",
                    "SIERRALEONE",
                    "SAINTVINCENTGRENADINES",
                    "PERU",
                    "MACEDONIA",
                    "UZBEKISTAN",
                    "CHINA",
                    "ETHIOPIA",
                    "BHUTAN",
                    "CROATIA",
                    "MAYOTTE",
                    "HAITI",
                    "ERITREA",
                    "YOGOSLAVIA",
                    "KAZAKHSTAN",
                    "COSTARICA",
                    "MONTENEGRO",
                    "CYPRUS",
                    "SAINTPIERREMIQUELON",
                    "RUSSIA",
                    "TANZANIA",
                    "ANDORRA",
                    "COCOSISLANDS",
                    "WALLISFUTUNA",
                    "BOSNIAHERZEGOVINA",
                    "KUWAIT",
                    "AUSTRIA",
                    "BRITISHVIRGINISLANDS",
                    "NEPAL",
                    "CAPVERDE",
                    "MYANMAR",
                    "BENIN",
                    "CENTRALAFRICANREPUBLIC",
                    "NICARAGUA",
                    "SPAIN",
                    "BELARUS",
                    "BULGARIA",
                    "PUERTORICO",
                    "VANUATU",
                    "PAKISTAN",
                    "DOMINICA",
                    "CHILE",
                    "CAMBODIA",
                    "DEMOCRATICREPUBLICCONGO",
                    "IRAN",
                    "UAE",
                    "GIBRALTAR",
                    "GHANA",
                    "HUNGARY",
                    "IRAQ",
                    "ICELAND",
                    "AMERICANSAMOA",
                    "INDIA",
                    "TURKMENISTAN",
                    "ARGENTINA",
                    "UKRAINE",
                    "GUYANA",
                    "CHAD",
                    "TUVALU",
                    "SVALBARDJANMAYEN",
                    "ROMANIA",
                    "ANGOLA",
                    "NEWZEALAND",
                    "BOLIVIA",
                    "SWEDEN",
                    "SAMOA",
                    "FIJI",
                    "LATVIA",
                    "PALAU",
                    "SINGAPORE",
                    "POLAND",
                    "HONDURAS",
                    "FRENCHPOLYNESIA",
                    "DENMARK",
                    "SOUTHAFRICA",
                    "LITHUANIA",
                    "SUDAN",
                    "ARMENIA",
                    "SLOVENIA",
                    "MALAWI",
                    "TONGA",
                    "BELGIUM",
                    "AZERBAIJAN",
                    "PALESTINIANTERRITORY",
                    "EQUATORIALGUINEA",
                    "PHILIPPINES",
                    "GUINEA",
                    "SOUTHKOREA",
                    "GUERNSEY",
                    "FAROEISLANDS",
                    "GREECE",
                    "FINLAND",
                    "IRELAND",
                    "INDONESIA",
                    "SRILANKA",
                    "PITCAIRN",
                    "MALAYSIA",
                    "DOMINICANREPUBLIC",
                    "GAMBIA",
                    "SAINTKITTSNEVIS",
                    "MOZAMBIQUE",
                    "NIUE",
                    "TURKSCAICOSISLANDS",
                    "BRITISHINDIANOCEANTERRITORY",
                    "AFGHANISTAN",
                    "GUAM",
                    "PANAMA",
                    "MACAO",
                    "CAYMANISLANDS",
                    "SWAZILAND",
                    "URUGUAY",
                    "GERMANY",
                    "EGYPT",
                    "VENEZUELA",
                    "JAPAN",
                    "QATAR",
                    "MONACO",
                    "NORWAY",
                    "ESTONIA",
                    "CAMEROON",
                    "BANGLADESH",
                    "LEBANON",
                    "UGANDA",
                    "MEXICO",
                    "FRENCHGUIANA",
                    "MICRONESIA",
                    "PARAGUAY",
                    "COLOMBIA",
                    "NIGER",
                    "RWANDA",
                    "NETHERLANDS",
                    "MALTA",
                    "MONGOLIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/13662/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/13662/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/13662/Contracts/Active"
        ],
        "TrackingLink": [
            "https://bellelily.pxf.io/c/4797259/1063766/13662"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "bellelily.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/13662"
        ]
    },
    {
        "AdvertiserId": [
            "3017626"
        ],
        "AdvertiserName": [
            "LivWell Nutrition"
        ],
        "AdvertiserUrl": [
            "http://livwellnutrition.com"
        ],
        "CampaignId": [
            "14558"
        ],
        "CampaignName": [
            "LivWell Nutrition"
        ],
        "CampaignUrl": [
            "http://livwellnutrition.com"
        ],
        "CampaignDescription": [
            "LivWell Nutrition crafts the finest organic vegan protein powders. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "CANADA",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/14558/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/14558/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/14558/Contracts/Active"
        ],
        "TrackingLink": [
            "https://livwellnutrition.pxf.io/c/4797259/1151622/14558"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "livwellnutrition.com",
                    "*.livwellnutrition.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/14558"
        ]
    },
    {
        "AdvertiserId": [
            "3120104"
        ],
        "AdvertiserName": [
            "HongKong FuJinAn Trading Co.,Limited"
        ],
        "AdvertiserUrl": [
            "https://www.lilysilk.com/"
        ],
        "CampaignId": [
            "15016"
        ],
        "CampaignName": [
            "LILYSILK"
        ],
        "CampaignUrl": [
            "http://www.lilysilk.com/us/"
        ],
        "CampaignDescription": [
            "We are a global silk and cashmere brand with OEKO-TEX Standard 100 (Fabric & Buttons) international certification, established in 2010.We want to inspire people to live a better life and more sustainable lifestyle."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "FINLAND",
                    "AUSTRALIA",
                    "JORDAN",
                    "CANADA",
                    "IRELAND",
                    "TAIWAN",
                    "NORWAY",
                    "ITALY",
                    "FRANCE",
                    "DENMARK",
                    "GERMANY",
                    "UK",
                    "HONGKONG",
                    "SWITZERLAND",
                    "NETHERLANDS",
                    "NEWZEALAND",
                    "US",
                    "SPAIN"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15016/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15016/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15016/Contracts/Active"
        ],
        "TrackingLink": [
            "https://lilysilk.sjv.io/c/4797259/1203117/15016"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "lilysilk.com",
                    " *.lilysilk.com",
                    " lilysilk.se",
                    "*.lilysilk.se",
                    "lilysilk.jp",
                    "*.lilysilk.jp"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15016"
        ]
    },
    {
        "AdvertiserId": [
            "3184871"
        ],
        "AdvertiserName": [
            "EPP TIMES"
        ],
        "AdvertiserUrl": [
            "https://www.buybestgear.com"
        ],
        "CampaignId": [
            "16384"
        ],
        "CampaignName": [
            "Ursime"
        ],
        "CampaignUrl": [
            "http://ursime.com/"
        ],
        "CampaignDescription": [
            "URSIME is an international one-stop online shop for high-end, affordable, designable fashion lifestyles. URSIME mainly targets the United States, Europe, Australia along with other markets. Our philosophy is everyone can enjoy the beauty of fashion. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "GERMANY",
                    "UK",
                    "FRANCE",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16384/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16384/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16384/Contracts/Active"
        ],
        "TrackingLink": [
            "https://ursime.pxf.io/c/4797259/1361811/16384"
        ],
        "AllowsDeeplinking": [
            "false"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "ursime.com",
                    "*.ursime.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16384"
        ]
    },
    {
        "AdvertiserId": [
            "3274582"
        ],
        "AdvertiserName": [
            "Packed with Purpose"
        ],
        "AdvertiserUrl": [
            "http://packedwithpurpose.gifts"
        ],
        "CampaignId": [
            "15751"
        ],
        "CampaignName": [
            "Packed with Purpose"
        ],
        "CampaignUrl": [
            "http://packedwithpurpose.gifts"
        ],
        "CampaignDescription": [
            "We are a Woman-Owned business that embeds social and environmental impact into the everyday act of gift giving. Our gifts source products from 140+ purpose-driven organizations that have positively impacted nearly 1.5 million lives."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "MARSHALLISLANDS",
                    "ISRAEL",
                    "FRANCE",
                    "ECUADOR",
                    "REUNION",
                    "ANTIGUABARBUDA",
                    "GREENLAND",
                    "ALBANIA",
                    "CONGO",
                    "SEYCHELLES",
                    "PORTUGAL",
                    "SAINTHELENA",
                    "TUNISIA",
                    "YEMEN",
                    "SANMARINO",
                    "GUADELOUPE",
                    "CUBA",
                    "BRAZIL",
                    "ALGERIA",
                    "THAILAND",
                    "MADAGASCAR",
                    "MALI",
                    "KIRIBATI",
                    "ARUBA",
                    "LAOS",
                    "MOLDOVA",
                    "ZIMBABWE",
                    "BARBADOS",
                    "SENEGAL",
                    "TAJIKISTAN",
                    "MAURITIUS",
                    "NORFOLKISLAND",
                    "LUXEMBOURG",
                    "DIJIBOUTI",
                    "WESTERNSAHARA",
                    "IVORYCOAST",
                    "VATICAN",
                    "ZAMBIA",
                    "ELSALVADOR",
                    "SWITZERLAND",
                    "MONTSERRAT",
                    "NETHERLANDSANTILLES",
                    "JORDAN",
                    "MALDIVES",
                    "LESOTHO",
                    "SAINTLUCIA",
                    "PAPUANEWGUINEA",
                    "MAURITANIA",
                    "BURKINAFASO",
                    "ANGUILLA",
                    "GUINEABISSAU",
                    "LIBYA",
                    "KENYA",
                    "SYRIA",
                    "GABON",
                    "NORTHERNMARIANAISLANDS",
                    "ANTARCTICA",
                    "TOGO",
                    "SAOTOME",
                    "TURKEY",
                    "MOROCCO",
                    "NORTHKOREA",
                    "MARTINIQUE",
                    "GRENADA",
                    "FRENCHSOUTHERNTERRITORIES",
                    "TRINIDADTOBAGO",
                    "UK",
                    "KYRGYZSTAN",
                    "TIMOR",
                    "COMOROS",
                    "HONGKONG",
                    "NAMIBIA",
                    "BAHAMAS",
                    "BAHRAIN",
                    "SOLOMONISLANDS",
                    "US",
                    "BOTSWANA",
                    "AUSTRALIA",
                    "BELIZE",
                    "GEORGIA",
                    "COOKISLANDS",
                    "ITALY",
                    "NAURU",
                    "SURINAME",
                    "CHRISTMASISLAND",
                    "OMAN",
                    "BURUNDI",
                    "JAMAICA",
                    "NIGERIA",
                    "GUATEMALA",
                    "CZECHREPUBLIC",
                    "SOMALIA",
                    "SAUDIARABIA",
                    "LICHTENSTEIN",
                    "CANADA",
                    "LIBERIA",
                    "VIETNAM",
                    "TAIWAN",
                    "SLOVAKIA",
                    "NEWCALEDONIA",
                    "TOKELAU",
                    "FALKLANDISLANDS",
                    "BERMUDA",
                    "BRUNEIDARUSSALAM",
                    "USVIRGINISLANDS",
                    "SIERRALEONE",
                    "SAINTVINCENTGRENADINES",
                    "PERU",
                    "MACEDONIA",
                    "UZBEKISTAN",
                    "CHINA",
                    "ETHIOPIA",
                    "BHUTAN",
                    "CROATIA",
                    "MAYOTTE",
                    "HAITI",
                    "ERITREA",
                    "YOGOSLAVIA",
                    "KAZAKHSTAN",
                    "COSTARICA",
                    "MONTENEGRO",
                    "CYPRUS",
                    "SAINTPIERREMIQUELON",
                    "TANZANIA",
                    "ANDORRA",
                    "COCOSISLANDS",
                    "WALLISFUTUNA",
                    "BOSNIAHERZEGOVINA",
                    "KUWAIT",
                    "AUSTRIA",
                    "BRITISHVIRGINISLANDS",
                    "NEPAL",
                    "CAPVERDE",
                    "MYANMAR",
                    "BENIN",
                    "CENTRALAFRICANREPUBLIC",
                    "NICARAGUA",
                    "SPAIN",
                    "BELARUS",
                    "BULGARIA",
                    "PUERTORICO",
                    "VANUATU",
                    "PAKISTAN",
                    "DOMINICA",
                    "CHILE",
                    "CAMBODIA",
                    "DEMOCRATICREPUBLICCONGO",
                    "IRAN",
                    "UAE",
                    "GIBRALTAR",
                    "GHANA",
                    "HUNGARY",
                    "IRAQ",
                    "ICELAND",
                    "AMERICANSAMOA",
                    "INDIA",
                    "TURKMENISTAN",
                    "ARGENTINA",
                    "UKRAINE",
                    "GUYANA",
                    "CHAD",
                    "TUVALU",
                    "SVALBARDJANMAYEN",
                    "ROMANIA",
                    "ANGOLA",
                    "NEWZEALAND",
                    "BOLIVIA",
                    "SWEDEN",
                    "SAMOA",
                    "FIJI",
                    "LATVIA",
                    "PALAU",
                    "SINGAPORE",
                    "POLAND",
                    "HONDURAS",
                    "FRENCHPOLYNESIA",
                    "DENMARK",
                    "SOUTHAFRICA",
                    "LITHUANIA",
                    "SUDAN",
                    "ARMENIA",
                    "SLOVENIA",
                    "MALAWI",
                    "TONGA",
                    "BELGIUM",
                    "AZERBAIJAN",
                    "PALESTINIANTERRITORY",
                    "EQUATORIALGUINEA",
                    "PHILIPPINES",
                    "GUINEA",
                    "SOUTHKOREA",
                    "GUERNSEY",
                    "FAROEISLANDS",
                    "GREECE",
                    "FINLAND",
                    "IRELAND",
                    "INDONESIA",
                    "SRILANKA",
                    "PITCAIRN",
                    "MALAYSIA",
                    "DOMINICANREPUBLIC",
                    "GAMBIA",
                    "SAINTKITTSNEVIS",
                    "MOZAMBIQUE",
                    "NIUE",
                    "TURKSCAICOSISLANDS",
                    "BRITISHINDIANOCEANTERRITORY",
                    "AFGHANISTAN",
                    "GUAM",
                    "PANAMA",
                    "MACAO",
                    "CAYMANISLANDS",
                    "SWAZILAND",
                    "URUGUAY",
                    "GERMANY",
                    "EGYPT",
                    "VENEZUELA",
                    "JAPAN",
                    "QATAR",
                    "MONACO",
                    "NORWAY",
                    "ESTONIA",
                    "CAMEROON",
                    "BANGLADESH",
                    "LEBANON",
                    "UGANDA",
                    "MEXICO",
                    "FRENCHGUIANA",
                    "MICRONESIA",
                    "PARAGUAY",
                    "COLOMBIA",
                    "NIGER",
                    "RWANDA",
                    "NETHERLANDS",
                    "MALTA",
                    "MONGOLIA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15751/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15751/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15751/Contracts/Active"
        ],
        "TrackingLink": [
            "https://packedwithpurpose.pxf.io/c/4797259/1283558/15751"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "packedwithpurpose.gifts",
                    "*.packedwithpurpose.gifts",
                    "shop.packedwithpurpose.gifts"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/15751"
        ]
    },
    {
        "AdvertiserId": [
            "3563408"
        ],
        "AdvertiserName": [
            "TRENDS FURNITURE INC"
        ],
        "AdvertiserUrl": [
            "http://25home.com/"
        ],
        "CampaignId": [
            "16836"
        ],
        "CampaignName": [
            "25home.com"
        ],
        "CampaignUrl": [
            "https://25home.com"
        ],
        "CampaignDescription": [
            "Basic commission rate of 6-12% (depending on the quality of your media)\r\n        Up to 16% commission rate based on your performance\r\n        $400 or above *Monthly Conversion Bonuses based on your performance\r\n        45 days tracking period"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16836/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16836/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16836/Contracts/Active"
        ],
        "TrackingLink": [
            "https://25home.pxf.io/c/4797259/1414515/16836"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "25home.com",
                    "*.25home.com",
                    "25home.myshopify.com",
                    "25home.pxf.io"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/16836"
        ]
    },
    {
        "AdvertiserId": [
            "3663611"
        ],
        "AdvertiserName": [
            "Supernova Pte Ltd"
        ],
        "AdvertiserUrl": [
            "http://us.cocoandeve.com"
        ],
        "CampaignId": [
            "17345"
        ],
        "CampaignName": [
            "Coco&Eve"
        ],
        "CampaignUrl": [
            "https://www.cocoandeve.com"
        ],
        "CampaignDescription": [
            "We offer free products and an attractive commission structure. GET COMMISSION ON SALES and in on the action, by hyping up, reviewing, and telling the world about our multi-award-winning, sell-out products that have taken social media by storm."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "GERMANY",
                    "UK",
                    "MALAYSIA",
                    "SINGAPORE",
                    "FRANCE",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17345/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17345/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17345/Contracts/Active"
        ],
        "TrackingLink": [
            "https://coco-and-eve.sjv.io/c/4797259/1467633/17345"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "cocoandeve.com",
                    "*.cocoandeve.com",
                    "dev-cocoandeve.myshopify.com",
                    "us.cocoandeve.com",
                    "uk.cocoandeve.com",
                    "ca.cocoandeve.com",
                    "au.cocoandeve.com",
                    "eu.cocoandeve.com",
                    "de.cocoandeve.com",
                    "fr.cocoandeve.com",
                    "my.cocoandeve.com",
                    "int.cocoandeve.com",
                    "*.us.cocoandeve.com",
                    "*.uk.cocoandeve.com",
                    "*.ca.cocoandeve.com",
                    "*.au.cocoandeve.com",
                    "*.eu.cocoandeve.com",
                    "*.de.cocoandeve.com",
                    "*.fr.cocoandeve.com",
                    "*.my.cocoandeve.com",
                    "*.int.cocoandeve.com",
                    "my-cocoandeve.myshopify.com",
                    "*.my-cocoandeve.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17345"
        ]
    },
    {
        "AdvertiserId": [
            "3705465"
        ],
        "AdvertiserName": [
            "Supernova Pte Ltd - SS"
        ],
        "AdvertiserUrl": [
            "http://www.sandandsky.com"
        ],
        "CampaignId": [
            "17524"
        ],
        "CampaignName": [
            "Sand&Sky"
        ],
        "CampaignUrl": [
            "https://www.sandandsky.com"
        ],
        "CampaignDescription": [
            "We offer free products and an attractive commission structure. Sign up, share the glow, and watch the $$$ roll in while the no-worries skincare moments roll on."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "GERMANY",
                    "UK",
                    "MALAYSIA",
                    "SINGAPORE",
                    "FRANCE",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17524/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17524/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17524/Contracts/Active"
        ],
        "TrackingLink": [
            "https://sand-and-sky.sjv.io/c/4797259/1485463/17524"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "www.sandandsky.com",
                    "sandandsky.com",
                    "*.sandandsky.com",
                    "sandandsky.com",
                    "us.sandandsky.com",
                    "uk.sandandsky.com",
                    "au.sandandsky.com",
                    "ca.sandandsky.com",
                    "eu.sandandsky.com",
                    "my.sandandsky.com",
                    "int.sandandsky.com",
                    "*.sandandsky.com",
                    "*.us.sandandsky.com",
                    "*.uk.sandandsky.com",
                    "*.au.sandandsky.com",
                    "*.ca.sandandsky.com",
                    "*.eu.sandandsky.com",
                    "*.my.sandandsky.com",
                    "*.int.sandandsky.com",
                    "dev-sandandsky.myshopify.com",
                    "*.dev-sandandsky.myshopify.com",
                    "sandandsky.myshopify.com",
                    "*.sandandsky.myshopify.com",
                    "int-sandandsky.myshopify.com",
                    "*.int-sandandsky.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/17524"
        ]
    },
    {
        "AdvertiserId": [
            "3870586"
        ],
        "AdvertiserName": [
            "eBrands Global Oy"
        ],
        "AdvertiserUrl": [
            "http://www.ebrands.com/"
        ],
        "CampaignId": [
            "18086"
        ],
        "CampaignName": [
            "Happy Sinks Affiliate Program"
        ],
        "CampaignUrl": [
            "https://happy-sinks.com/"
        ],
        "CampaignDescription": [
            "HAPPY SiNKS is fighting for happiness and sustainability in homecare by creating sustainable, surprising and super-useful products for cleaning and organising in the kitchen."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "SWEDEN",
                    "FINLAND",
                    "GERMANY",
                    "UK",
                    "NORWAY",
                    "BELGIUM",
                    "SWITZERLAND",
                    "US",
                    "DENMARK"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18086/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18086/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18086/Contracts/Active"
        ],
        "TrackingLink": [
            "https://happy-sinks-eu.sjv.io/c/4797259/1549971/18086"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "happy-sinks.com",
                    "*.happy-sinks.com",
                    "magisso-shop.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18086"
        ]
    },
    {
        "AdvertiserId": [
            "3870586"
        ],
        "AdvertiserName": [
            "eBrands Global Oy"
        ],
        "AdvertiserUrl": [
            "http://www.ebrands.com/"
        ],
        "CampaignId": [
            "18359"
        ],
        "CampaignName": [
            "Big Bat Box"
        ],
        "CampaignUrl": [
            "https://www.bigbatbox.com/"
        ],
        "CampaignDescription": [
            "Big Bat Box lets you bring the outdoors to you. Our goal is to help anyone make a yard where they can have a piece of the wilderness right outside of their backdoor. Our range of bat boxes helps bats have a safe place for rest"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18359/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18359/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18359/Contracts/Active"
        ],
        "TrackingLink": [
            "https://big-bat-box.pxf.io/c/4797259/1582173/18359"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "bigbatbox.com",
                    "*.bigbatbox.com",
                    "loulux.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18359"
        ]
    },
    {
        "AdvertiserId": [
            "3870586"
        ],
        "AdvertiserName": [
            "eBrands Global Oy"
        ],
        "AdvertiserUrl": [
            "http://www.ebrands.com/"
        ],
        "CampaignId": [
            "24275"
        ],
        "CampaignName": [
            "Lux"
        ],
        "CampaignUrl": [
            "http://luxsports.co/"
        ],
        "CampaignDescription": [
            "World's #1 grip socks. Initially developed for football but these can also be used for running, tennis, rugby, yoga, gym, and many other sports. The grip on the socks means that your foot doesn't slide in the shoe which gives you more power to run"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "FINLAND"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24275/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24275/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24275/Contracts/Active"
        ],
        "TrackingLink": [
            "https://lux.sjv.io/c/4797259/1980001/24275"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "luxsports.co",
                    "*luxsports.co",
                    "luxsportstestsite.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24275"
        ]
    },
    {
        "AdvertiserId": [
            "3870586"
        ],
        "AdvertiserName": [
            "eBrands Global Oy"
        ],
        "AdvertiserUrl": [
            "http://www.ebrands.com/"
        ],
        "CampaignId": [
            "24279"
        ],
        "CampaignName": [
            "Baby Sunnies"
        ],
        "CampaignUrl": [
            "http://babysunnies.com/"
        ],
        "CampaignDescription": [
            "Sunglasses for babies and toddlers. Our sunglasses are 100% protective against UVA and UVB rays, they have polarized lenses and the silicone frame allows little ones to bend it many directions without breaking"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "GERMANY",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24279/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24279/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24279/Contracts/Active"
        ],
        "TrackingLink": [
            "https://babysunnies.pxf.io/c/4797259/1980009/24279"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "babysunnies.com",
                    "*babysunnies.com",
                    "babysunniesus.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/24279"
        ]
    },
    {
        "AdvertiserId": [
            "3930596"
        ],
        "AdvertiserName": [
            "Springfree Limited Partnership"
        ],
        "AdvertiserUrl": [
            "http://www.springfreetrampoline.com"
        ],
        "CampaignId": [
            "18258"
        ],
        "CampaignName": [
            "Springfree Trampoline"
        ],
        "CampaignUrl": [
            "https://www.springfreetrampoline.com"
        ],
        "CampaignDescription": [
            "We build the Springfree Trampoline because we believe backyards should be a place for safe play. Springfree’s innovative design is the world’s safest, highest quality and longest lasting trampoline supported by a full 10-year warranty."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "NEWZEALAND",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18258/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18258/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18258/Contracts/Active"
        ],
        "TrackingLink": [
            "https://springfree-trampoline.pxf.io/c/4797259/1569543/18258"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "springfreetrampoline.com",
                    "springfreetrampoline.com.au",
                    "springfreetrampoline.co.uk"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18258"
        ]
    },
    {
        "AdvertiserId": [
            "3930596"
        ],
        "AdvertiserName": [
            "Springfree Limited Partnership"
        ],
        "AdvertiserUrl": [
            "http://www.springfreetrampoline.com"
        ],
        "CampaignId": [
            "20835"
        ],
        "CampaignName": [
            "Springfree Trampoline - CA"
        ],
        "CampaignUrl": [
            "https://www.springfreetrampoline.ca/"
        ],
        "CampaignDescription": [
            "Springfree Trampoline is committed to designing the safest trampoline on the market. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "CANADA"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/20835/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/20835/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/20835/Contracts/Active"
        ],
        "TrackingLink": [
            "https://springfree-trampolineca.pxf.io/c/4797259/1769243/20835"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "springfreetrampoline.ca",
                    "*.springfreetrampoline.ca"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/20835"
        ]
    },
    {
        "AdvertiserId": [
            "3938277"
        ],
        "AdvertiserName": [
            "The Curiosity Box"
        ],
        "AdvertiserUrl": [
            "http://www.curiositybox.com/"
        ],
        "CampaignId": [
            "18310"
        ],
        "CampaignName": [
            "The Curiosity Box"
        ],
        "CampaignUrl": [
            "https://www.curiositybox.com/"
        ],
        "CampaignDescription": [
            "The Curiosity Box is a quarterly STEM subscription box featuring viral physics toys, puzzles, and custom T-shirts, books, and more that provide science and math enthusiasts young and old with a gateway into next-level knowledge."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "UK",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18310/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18310/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18310/Contracts/Active"
        ],
        "TrackingLink": [
            "https://the-curiosity-box.pxf.io/c/4797259/1575826/18310"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "curiositybox.com",
                    "*.curiositybox.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18310"
        ]
    },
    {
        "AdvertiserId": [
            "3985319"
        ],
        "AdvertiserName": [
            "Snorkel Mart"
        ],
        "AdvertiserUrl": [
            "http://snorkel-mart.com"
        ],
        "CampaignId": [
            "18456"
        ],
        "CampaignName": [
            "Snorkel Mart"
        ],
        "CampaignUrl": [
            "https://snorkel-mart.com"
        ],
        "CampaignDescription": [
            "Snorkel Mart is excited to partner with you to help us grow! We want to bring the beauty of the underwater world to everybody we can while helping them save money by securing their gear prior to vacation. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18456/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18456/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18456/Contracts/Active"
        ],
        "TrackingLink": [
            "https://snorkel-mart.sjv.io/c/4797259/1591569/18456"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "snorkel-mart.com",
                    "*.snorkel-mart.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/18456"
        ]
    },
    {
        "AdvertiserId": [
            "4253690"
        ],
        "AdvertiserName": [
            "Lumiere Affiliate marketing"
        ],
        "AdvertiserUrl": [
            "http://lumierehairs.com"
        ],
        "CampaignId": [
            "19594"
        ],
        "CampaignName": [
            "Lumiere Affiliate marketing"
        ],
        "CampaignUrl": [
            "https://lumierehairs.com"
        ],
        "CampaignDescription": [
            "Lumiere Hair is one of the top hair brands, determined to research and develop unique and top-quality human hairs and ensure that they can last for many years. Our mission is to bring beauty and superb services to customers around the world."
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "AUSTRALIA",
                    "CANADA",
                    "GERMANY",
                    "UK",
                    "FRANCE",
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/19594/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/19594/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/19594/Contracts/Active"
        ],
        "TrackingLink": [
            "https://lumiereaffiliatemarketing.sjv.io/c/4797259/1688218/19594"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "lumierehairs.com",
                    "*.lumierehairs.com",
                    "lumiere-hair.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/19594"
        ]
    },
    {
        "AdvertiserId": [
            "4819836"
        ],
        "AdvertiserName": [
            "VAVA INTERNATIONAL INC."
        ],
        "AdvertiserUrl": [
            "http://www.ravpower.com"
        ],
        "CampaignId": [
            "21553"
        ],
        "CampaignName": [
            "ParisRhone"
        ],
        "CampaignUrl": [
            "http://parisrhone.com"
        ],
        "CampaignDescription": [
            "Paris Rhône products are sold in more than 30 countries in Europe, North America, the Middle East, and the Asia Pacific,.The main products include household and industrial vacuum cleaners, polishers, and coffee grinders. With the same grinding system"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21553/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21553/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21553/Contracts/Active"
        ],
        "TrackingLink": [
            "https://parisrhonecom.sjv.io/c/4797259/1811170/21553"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "parisrhone.com",
                    "*.parisrhone.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21553"
        ]
    },
    {
        "AdvertiserId": [
            "4839241"
        ],
        "AdvertiserName": [
            "Free Rein"
        ],
        "AdvertiserUrl": [
            "http://freereincoffee.com"
        ],
        "CampaignId": [
            "21559"
        ],
        "CampaignName": [
            "Free Rein"
        ],
        "CampaignUrl": [
            "http://freereincoffee.com"
        ],
        "CampaignDescription": [
            "Born from the cowboy tradition of dreaming big and working hard, our coffee is slow-roasted in small batches for bold flavors that go down smooth. So whatever your day holds, you can #getupandgetafterit"
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21559/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21559/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21559/Contracts/Active"
        ],
        "TrackingLink": [
            "https://freerein.sjv.io/c/4797259/1811834/21559"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "freereincoffee.com",
                    "*.freereincoffee.com",
                    "freereincoffee.myshopify.com",
                    "*.freereincoffee.myshopify.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/21559"
        ]
    },
    {
        "AdvertiserId": [
            "5052024"
        ],
        "AdvertiserName": [
            "Blanka"
        ],
        "AdvertiserUrl": [
            "http://blankabrand.com"
        ],
        "CampaignId": [
            "22804"
        ],
        "CampaignName": [
            "Blanka "
        ],
        "CampaignUrl": [
            "http://blankabrand.com?utm_source=referral&utm_campaign=affiliate"
        ],
        "CampaignDescription": [
            "Blanka is a tech platform that enables anyone to create the branded beauty product line of their dreams in minutes. This one-stop SaaS solution provides payouts on recurring monthly or annual revenue, with a very dedicated customer base. "
        ],
        "ShippingRegions": [
            {
                "ShippingRegion": [
                    "US"
                ]
            }
        ],
        "CampaignLogoUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/22804/Logo"
        ],
        "PublicTermsUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/22804/PublicTerms"
        ],
        "ContractStatus": [
            "Active"
        ],
        "ContractUri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/22804/Contracts/Active"
        ],
        "TrackingLink": [
            "https://blanka.sjv.io/c/4797259/1904411/22804"
        ],
        "AllowsDeeplinking": [
            "true"
        ],
        "DeeplinkDomains": [
            {
                "DeeplinkDomain": [
                    "blankabrand.com",
                    "*.blankabrand.com"
                ]
            }
        ],
        "Uri": [
            "/Mediapartners/IRgfAdY3yEcQ4797259PDyMUK3Q2pC64r1/Campaigns/22804"
        ]
    }
]