import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import "react-multi-carousel/lib/styles.css";
import { useGetLandingPageQuery, useGetNewsListQuery, useGetPageInfoMutation, useNotificationsMutation } from "../../../service/Apilist";
import Image1 from "../../../assets/img1.png";
import Image2 from "../../../assets/img2.png";
import Image3 from "../../../assets/img3.png";
import Image4 from "../../../assets/img4.png";
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import LazyLoad from 'react-lazyload';
import { socket } from "../../../socket";
import LoadingScreen from '../../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';


function Privacy() {
    const [getNotification, resGetNotification] = useNotificationsMutation();
    const [notifyList, setNotifyList] = useState([]);
    const [notifyListInitial, setNotifyListInitial] = useState([]);
    
    const [apiLoading, setAPILoading] = useState(false);

    useEffect(() => {
        getNotification({

        })
    }, [])
    useEffect(() => {
        setAPILoading(true)
        if (resGetNotification?.status === 'fulfilled') {
            let getNotificationList = resGetNotification?.data?.info;
            
            setNotifyListInitial(getNotificationList);
            setNotifyList(getNotificationList);
            setAPILoading(false)
            socket.emit('GetNotifyCount', {
                UserId: sessionStorage.getItem('UserId')
            })
        }
    }, [resGetNotification])
   

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
                        <div className='col-lg-12'>
                            <h3>Notification</h3>
                        </div>
                    </div>
                </div>
            </section>
            <section className='news-section support-box'>
                <Container fluid className=''>
                    <div className='row'>
                        <div className='col-lg-12 sbr'>
                            <div className='support-box-r'>
                                <Accordion>
                                    {notifyList?.length > 0 && notifyList?.map((notify, index) => {
                                        const encryptedItemInfo = CryptoJS.AES.encrypt(notify?.ItemId.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                                        return (
                                            <LazyLoad
                                                offset={100}
                                                once
                                            >
                                                <AccordionItem>
                                                    <AccordionItemHeading>
                                                        <AccordionItemButton>
                                                            {notify?.Type}
                                                        </AccordionItemButton>
                                                    </AccordionItemHeading>
                                                    <AccordionItemPanel>
                                                        {notify?.Type === 'Gift NFT Published' ? <div className=' justify-content-start'>
                                                            <Link to={`/giftart/${encodeURIComponent(encryptedItemInfo)}`}><img width='40px' height='40px' src={notify?.ItemImage} />&nbsp;{notify?.ItemName}</Link>&nbsp;&nbsp;&nbsp;
                                                            <p>Gift chain : {notify?.Currency}</p>

                                                        </div> : <div className=' justify-content-start'>
                                                            <Link to={`/art/${encodeURIComponent(encryptedItemInfo)}`}><img width='40px' height='40px' src={notify?.ItemImage} />&nbsp;{notify?.ItemName}</Link>&nbsp;&nbsp;&nbsp;
                                                            <p>Artwork Price :  {notify?.Price}&nbsp;{notify?.Currency}</p>
                                                            {notify?.Edition ? <p>Artwork Edition : #{notify?.Edition}</p> : null}
                                                        </div>}
                                                    </AccordionItemPanel>
                                                </AccordionItem>
                                            </LazyLoad>
                                        )
                                    })}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            {apiLoading ? <LoadingScreen /> : null}
        </>

    );

}

export default Privacy;