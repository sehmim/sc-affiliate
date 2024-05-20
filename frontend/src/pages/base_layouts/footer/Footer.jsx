import React from 'react';
import './Footer.css'; // Import CSS file for styling
import logo from '../../../spc_logo.png'
const Footer = () => {
    return (<>
        <footer>
            <div className="footer-container">
                <div className="footer-section">
                    <img className="footer_logo" src={logo} alt="Sponsor Circle Logo" />
                    <div className="social-media-icons">
                        <a href="https://www.facebook.com/sponsorcircle"><i className="fab fa-facebook"></i></a>
                        <a href="https://www.twitter.com/sponsorcircle"><i className="fab fa-twitter"></i></a>
                        <a href="https://www.instagram.com/sponsorcircle/"><i className="fab fa-instagram"></i></a>
                        <a href="https://www.linkedin.com/company/sponsor-circle"><i className="fab fa-linkedin"></i></a>
                    </div>
                    <a href="/articles" className="button button-cta">GET NEWS</a>
                </div>


                <div className="footer-section">
                    <strong>Our Mission</strong>
                    <div><a href="https://sponsorcircle.com/aboutus">About Us</a></div>
                    <div><a href="/accounts">Pricing</a></div>


                    <strong>Find New Partners</strong>
                    <div><a href="/articles">Sponsorship News</a></div>
                    <div><a href="https://sponsorcircle.com/learning">Learning Resources</a></div>
                    <div><a href="https://sponsorcircle.com/webinars">Virtual Coffee Series</a></div>
                </div>


                <div className="footer-section">
                    <div>
                        <strong>Contact Us</strong>
                        <div><a href="mailto:info@sponsorcircle.com">info@sponsorcircle.com</a></div>
                        <div><a href="https://sponsorcircle.com/jobs">Jobs</a></div>
                        <div><a href="https://sponsorcircle.com/client-stories">Success Stories</a></div>
                        <div><a href="/assets/terms.pdf">Terms of Service</a></div>
                    </div>

                </div>
            </div>

        </footer>
    <p className='rights'>© 2024 Sponsor Circle</p>
        </>
    );
}

export default Footer;
