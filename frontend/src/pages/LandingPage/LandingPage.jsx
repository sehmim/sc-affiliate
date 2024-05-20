import React from "react";
import useContentfulAds from "../../hooks/useContentfulAds";
import "./landingPage.css";
import NavigationBar from "../base_layouts/navigation_bar/NavigationBar";
import Footer from "../base_layouts/footer/Footer";

const LandingPage = () => {
    const { ads: contentfulAds, loading } = useContentfulAds();

    console.log("loading ->", loading);
    console.log("contentfulAds ->", contentfulAds);

    if (loading) {
        return (
            <div className='font-lato'>
                <div className='mt-20 flex landingpage-body'>
                    <div>LOADING...</div>
                </div>
            </div>
        );
    }

    return (
        <div className='font-lato'>
            <NavigationBar />
            <div className="scroll_snap">
                {contentfulAds.map(ad => (
                    <div key={ad.id} className="ad-container">
                        <h2>{ad.campaignName}</h2>
                        <p>{ad.description}</p>
                        <img src={`https:${ad.asset.fields.file.url}`} alt={ad.name} />
                        <a className="view-ad-button" href={ad.trackingLink} target="_blank" rel="noopener noreferrer">View Ad</a>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default LandingPage;
