import { useState, useEffect } from 'react';
import { createClient } from 'contentful';
import { ConentfulData } from "../pages/LandingPage/Data";


const useContentfulAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = createClient({
      space:  process.env.REACT_APP_CONTENTFUL_SPACE_ID,
      accessToken:  process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN
    });

    const fetchAds = async () => {
      try {
        setLoading(true);
        // const response = await client.getEntries({ content_type: 'impactAffiliateAd' });

        let normalizedAds = [];
        // response.items?.map((ads) => {
        //     normalizedAds.push(ads.fields);
        // })
        setAds(ConentfulData);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ads from Contentful:', error);
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return { ads, loading };
};

export default useContentfulAds;
