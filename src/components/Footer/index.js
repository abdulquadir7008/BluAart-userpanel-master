import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logoGray from "../../assets/logo-grey.png";
import "../../styles/registerFooter.css";
import facebookFooter from "../../assets/facebook.png";
import TwitterFooter from "../../assets/Twitter.png";
import LinkedInFooter from "../../assets/LinkedIn.png";
import InstagramFooter from "../../assets/Instagram.png";
import blockInformationOne from "../../assets/block-information-1.png";
import blockInformationTwo from "../../assets/block-information-2.png";
import blockInformationThree from "../../assets/block-information-3.png";
import blockInformationFour from "../../assets/block-information-4.png";
function Footer(props) {
    return (
        <>
            <section className='footer-main-one'>
                <Container className='section-four'>
                    <div className='row'>
                        <div className='col-lg-12 '>
                            <br />
                            <br />
                            <br />
                            <div className='row'>
                                <div className='col-lg-3'>
                                    <h4 className='block-chain-information'>Safe <br />payment</h4>
                                    <br />
                                    <div className='d-flex justify-content-center'>
                                        <img className='block-chain-img' src={blockInformationOne} />
                                    </div>
                                </div>
                                <div className='col-lg-3'>
                                    <h4 className='block-chain-information'>Worldwide<br /> shipping</h4>
                                    <br />
                                    <div className='d-flex justify-content-center'>
                                        <img className='block-chain-img' src={blockInformationTwo} />
                                    </div>
                                </div>
                                <div className='col-lg-3'>
                                    <h4 className='block-chain-information'>Authenticated<br /> certification</h4>
                                    <br />
                                    <div className='d-flex justify-content-center'>
                                        <img className='block-chain-img' src={blockInformationThree} />
                                    </div>
                                </div>
                                <div className='col-lg-3'>
                                    <h4 className='block-chain-information'>Blockchain <br /> technology</h4>
                                    <br />
                                    <div className='d-flex justify-content-center'>
                                        <img className='block-chain-img' src={blockInformationFour} />
                                    </div>
                                </div>
                            </div>
                            <br />
                            <br />
                            <br />
                        </div>
                    </div>
                </Container>
            </section>
            <section className='footer-one'>
                <Container fluid className=''>
                    <div className='updated-footer'>
                        <div className='row'>
                            <div className='col-lg-12 col-md-12'>
                                <div className='row'>
                                    <div className='col-lg-4 col-md-12'>
                                        <div className='footer-links'>
                                            <Link to="/about-us">ABOUT US</Link>
                                            <br />
                                            <Link to="/events">Events</Link>
                                            <br />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-12'>
                                        <div className='footer-links'>
                                            <Link to="/features">Blog</Link>
                                            <br />
                                            <Link to="/terms">TERMS & CONDITIONS</Link>
                                            <br />
                                        </div>
                                    </div>
                                    <div className='col-lg-4 col-md-12'>
                                        <div className='footer-links'>
                                            <Link to="/privacy">PRIVACY POLICY</Link>
                                            <br />
                                            <Link to="/support">Support</Link>
                                            <br />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </Container>
            </section>
            <section className='footer-two'>
                <Container fluid className=''>
                    <div className='bottom-logo footer'>
                        <div className='row'>
                            <div className='col-lg-5'>
                                <img className='footer-logo img-responsive' style={{ width: "100%", height: "auto" }} src={logoGray} />
                            </div>
                            <div className='col-lg-3'>
                            </div>
                            <div className='col-lg-4'>
                                <div className='social-media-section d-flex .align-items-center'>
                                    <div className=''>
                                        <h2 className='text-center footer-social-media-links'>FOLLOW US</h2>
                                        <br />
                                        <div className='d-flex justify-content-center'>
                                            <a target="_blank" href={props.socialLinks?.Facebook} ><img src={facebookFooter} /></a>
                                            <a target="_blank" href={props.socialLinks?.Twitter}> <img src={TwitterFooter} /></a>
                                            <a target="_blank" href={props.socialLinks?.Instagram}><img src={InstagramFooter} /></a>
                                            <a target="_blank" href={props.socialLinks?.Linkedin}><img src={LinkedInFooter} /></a>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}

export default Footer