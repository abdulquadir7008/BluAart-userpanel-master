import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import "react-multi-carousel/lib/styles.css";
import { useGetLandingPageQuery, useGetPageInfoMutation } from "../../../service/Apilist";

import Flag1 from "../../../assets/flag.png";

import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';

function Privacy() {

   

    


   
    
    const [getPageinfoAPI, resGetPageinfoAPI] = useGetPageInfoMutation();
    const [privacyState, setprivacyState] = useState("");
    const getlaningpage = useGetLandingPageQuery();
    
    const [landpageState, setLandpageState] = useState();
    const [artistState, setartistState] = useState([]);
    
    useEffect(() => {
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
            setartistState(getlaningpage.data?.artistinfo);
        }
    }, [getlaningpage])
    useEffect(() => {
        if (resGetPageinfoAPI.status === "fulfilled") {
            setprivacyState(resGetPageinfoAPI?.data?.info)
        }
    }, [resGetPageinfoAPI])
    useEffect(() => {
        getPageinfoAPI({
            Page: "Privacy"
        })
    }, [])


   
    

    return (
        <>

            <section>
                <div className='heading-section-ms support-search'>
                    <div className='row'>
                        <div className='col-lg-8'>
                            <div className='search-bar-l'>
                                <input type='text' name='' placeholder='Search our help center' value='' />
                                <a href=" "><i className="fa-regular fa-magnifying-glass"></i></a>
                            </div>
                        </div>
                        <div className='col-lg-4'>
                            <div className='search-bar-r'>
                                <a href=' '>BluAart Support</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='news-section support-box'>
                <Container fluid className=''>
                    <div className='row'>
                        <div className='col-lg-4 sbl'>
                            <div className="news-middle-section support-box-l">
                                <h2>Categories</h2>
                                <ul>
                                    <li><a href=' ' className='active'>Artist Guidance</a></li>
                                    <li><a href=' ' className=''>Selling artwork on BluAart</a></li>
                                    <li><a href=' ' className=''>Getting started on BluAart</a></li>
                                    <li><a href=' ' className=''>NFT Art Auction</a></li>
                                    <li><a href=' ' className=''>BluAart tech for art authentication</a></li>
                                    <li><a href=' ' className=''>Buying art on BluAart</a></li>
                                    <li><a href=' ' className=''>Managing Returns</a></li>
                                    <li><a href=' ' className=''>Getting started on an Artist</a></li>
                                    <li><a href=' ' className=''>NFT & ART</a></li>
                                    <li><a href=' ' className=''>FAQ</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-lg-8 sbr'>
                            <div className='support-box-r'>
                                <Accordion>
                                    <AccordionItem>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <img className='flaging-img' src={Flag1} alt='flag' />What is NFC Tag?
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                            <p>
                                                NFC stands for Near Field Communication. Like Bluetooth and WiFi, it's a wireless radio communications standard.....
                                            </p>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                    <AccordionItem>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <img className='flaging-img' src={Flag1}  alt='flag'/>What can you do with the blockchain account?
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                            <p>
                                                What can you do with the blockchain account
                                            </p>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                    <AccordionItem>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <img className='flaging-img' src={Flag1}  alt='flag'/>Safeguard your Blockchain Account
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                            <p>
                                                Safeguard your Blockchain Account
                                            </p>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                    <AccordionItem>
                                        <AccordionItemHeading>
                                            <AccordionItemButton>
                                                <img className='flaging-img' src={Flag1} alt='flag' />Why Blockchain?
                                            </AccordionItemButton>
                                        </AccordionItemHeading>
                                        <AccordionItemPanel>
                                            <p>
                                                Why Blockchain
                                            </p>
                                        </AccordionItemPanel>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

        </>

    );

}

export default Privacy;