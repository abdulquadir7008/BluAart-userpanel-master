
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


import React, { useEffect, useState } from 'react';
import {
    
    useUpcomingBidsQuery,
    useArtistBasedBidsMutation,
    useBidInterestMutation, useArtistBasedBidInterestMutation
} from '../../../service/Apilist'
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import adBanner from "../../../assets/auction/ad-banner.png";
import adLogo from "../../../assets/auction/ad-logo.png";
import adTimer from "../../../assets/auction/ad-timer.png";

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
function AuctionDetails() {

    const [show, setShow] = useState(false);
    const [showTime, setShowTime] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [page, setPage] = useState(1)
    const getallauctions = useUpcomingBidsQuery();
    const [getAllArtistAuction, resGetAllArtistAuction] = useArtistBasedBidsMutation();
    const [bidIntrestAPI, resBidIntrestAPI] = useBidInterestMutation();
    const [bidArtistIntrestAPI, resArtistBidIntrestAPI] = useArtistBasedBidInterestMutation();
    const [auctionList, setauctionList] = useState([])
    const [artistAuctionList, setartistAuctionList] = useState([])
    const [popupState, setpopupState] = useState({})
    const [artistDetailsState, setartistDetailsState] = useState()
    useEffect(() => {
        if (getallauctions?.status === 'fulfilled') {
            setauctionList(getallauctions?.data?.data);
        }
    }, [getallauctions])
    const [endTime, setEndTime] = useState(new Date()); // Set your desired end time here
    const [currentTime, setCurrentTime] = useState(new Date());
    useEffect(() => {
        if (resGetAllArtistAuction?.status === 'fulfilled') {
            setartistAuctionList(resGetAllArtistAuction?.data?.data);

            let lastindex = resGetAllArtistAuction?.data?.data?.length - 1;

            setEndTime(new Date(resGetAllArtistAuction?.data?.data[lastindex]?.ItemInfo?.EndDateTimeUtcBID));
            setartistDetailsState(resGetAllArtistAuction?.data?.data[0]?.UserInfo);
            setShowTime(true)
        }
    }, [resGetAllArtistAuction])
    let parms = useParams();
    useEffect(() => {
        getAllArtistAuction({
            AuthorId: parms.id
        })
    }, [])
    const [totalSeconds, setTotalSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setTotalSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const showModalPopup = (item) => {
        setpopupState(item)
        handleShow()

    }
    const intrestSchema = Yup.object().shape({
        Email: Yup.string().email('Invalid email').required('Email is required'),
    });
    let detailsFormik = useFormik({
        initialValues: {
            Email: ""
        },
        validationSchema: intrestSchema,
        onSubmit: values => {
            bidIntrestAPI({
                ItemId: popupState?.ItemInfo?._id,
                Email: values.Email,
                UserId: ""
            }).then((res) => {
                if (res?.data?.status) {
                    showToast(res.data?.data)
                } else {
                    showErroToast(res.data?.data)
                }
                handleClose()
            })
        }
    })
    useEffect(() => {
        if (resArtistBidIntrestAPI?.status === 'fulfilled') {
            if (resGetAllArtistAuction?.data?.status) {
                showToast(resGetAllArtistAuction?.data?.message)
            } else {
                showErroToast(resGetAllArtistAuction?.data?.message)
            }
        }
    }, [resArtistBidIntrestAPI])


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const formatTime = (timeDiff) => {
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        return ({
            days,
            hours,
            minutes,
            seconds
        });

    };
    const timeDiff = endTime - currentTime;
    const formattedTime = formatTime(timeDiff);
    return (
        <>
            <section>
                <div className='news-banner-section'>
                    <img className='block-chain-img' src={adBanner} />
                </div>
            </section>
            <section className='news-section'>
                <div className="ad-top-r-section">
                    <div className='timer-div d-flex justify-content-end' style={{ display : showTime ? "block" : "none" }}>
                        <div className='days timer-div-sec'>
                            <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.days.toString().padStart(2, '0') : '00'}</h1>
                            <h3 className='timer-text'>Days</h3>
                        </div>
                        &nbsp;
                        &nbsp;
                        <div className='hour timer-div-sec'>
                            <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.hours.toString().padStart(2, '0') : '00'}</h1>
                            <h3 className='timer-text'>Hours</h3>
                        </div>
                        &nbsp;
                        <h3 className='timer-spliter'>:</h3>
                        &nbsp;
                        <div className='minutes timer-div-sec'>
                            <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.minutes.toString().padStart(2, '0') : '00'}</h1>
                            <h3 className='timer-text'>Minutes</h3>
                        </div>
                        &nbsp;
                        <h3 className='timer-spliter'>:</h3>
                        &nbsp;
                        <div className='seconds timer-div-sec'>
                            <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.seconds.toString().padStart(2, '0') : '00'}</h1>
                            <h3 className='timer-text'>Seconds</h3>
                        </div>
                        &nbsp;
                    </div>
                </div>
                <Container className=''>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="news-middle-section">
                                <div className='auction-btn-c'>
                                    <img className='ad-logo-img' src={adLogo} />
                                </div>
                                <p className='logo-para'>BluAart and Gallery g Collaborate Once Again</p>
                            </div>
                        </div>
                    </div>
                </Container>

                <Container className=''>
                    <div className='row'>
                        <div className='col-lg-12'>
                            
                            <div className="auction-one-left ad-one-left">
                                <div className="news-top-l">
                                    <div className='row'>
                                        <div className='col-lg-2'>
                                            <img className='auction-user-img' src={artistDetailsState?.ProfilePicture} />
                                        </div>
                                        <div className='col-lg-10'>
                                            <div className='al-main'>
                                                <h6>Artist</h6>
                                                <h3>{artistDetailsState?.ProfileName}</h3>
                                                <h5>{artistDetailsState?.Country}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='auction-date'>
                                    <div className='auction-button'>

                                        <button onClick={() => bidArtistIntrestAPI({ AuthorId: parms.id })} className='btn btn-purple'>Interested</button>
                                    </div>
                                    <div className='cat-head text-center mt-5'>
                                        <h2 className='text-green'>catalogue</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-12'>
                            <div className='auction-tab-section ad-catelogue'>
                                <div className='row'>
                                    {artistAuctionList?.length > 0 && artistAuctionList.map((item, index) => {
                                        let Cname = index % 3;
                                        return (
                                            <>
                                                {
                                                    (() => {
                                                        switch (Cname) {
                                                            case 0:
                                                                return <div className='col-lg-4 pt-5'>
                                                                    <div className='auction-one-right auction-tab-imaging'>
                                                                        <img className='auction-user-img3' src={item?.ItemInfo?.Thumb} />
                                                                        <div className='auction-r-value'>
                                                                            <div className="news-middle-section">
                                                                                <div className='News-button-sec2'>
                                                                                    <h3 className='text-yellow'>{item?.ItemInfo?.Title}</h3>
                                                                                    <p>
                                                                                        {item?.ItemInfo?.Description}
                                                                                    </p>
                                                                                    
                                                                                    <Button variant="primary" onClick={() => showModalPopup(item)} className='btn btn-purple'>
                                                                                        View Details
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            case 1:
                                                                return <div className='col-lg-4'>
                                                                    <div className='auction-one-right auction-tab-imaging'>
                                                                        <img className='auction-user-img3' src={item?.ItemInfo?.Thumb} />
                                                                        <div className='auction-r-value'>
                                                                            <div className="news-middle-section">
                                                                                <div className='News-button-sec'>
                                                                                    <h3 className='text-yellow'>{item?.ItemInfo?.Title}</h3>
                                                                                    <p>
                                                                                        {item?.ItemInfo?.Description}
                                                                                    </p>
                                                                                    
                                                                                    <Button variant="primary" onClick={handleShow} className='btn btn-purple'>
                                                                                        View Details
                                                                                    </Button>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            case 2:
                                                                return <div className='col-lg-4 pt-5'>
                                                                    <div className='auction-one-right auction-tab-imaging'>
                                                                        <img className='auction-user-img3' src={item?.ItemInfo?.Thumb} />
                                                                        <div className='auction-r-value'>
                                                                            <div className="news-middle-section">
                                                                                <div className='News-button-sec'>
                                                                                    <h3 className='text-yellow'>{item?.ItemInfo?.Title}</h3>
                                                                                    <p>
                                                                                        {item?.ItemInfo?.Description}
                                                                                    </p>
                                                                                    
                                                                                    <Button variant="primary" onClick={handleShow} className='btn btn-purple'>
                                                                                        View Details
                                                                                    </Button>

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        }
                                                    })()
                                                }
                                            </>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <Modal show={show} onHide={handleClose} className='auction-tabb2'>
                <Modal.Body className='popup-body'>
                    <div className='popup-middle'>
                        <div className='row'>
                            <div className='col-lg-4'>
                                <img className='auction-user-img3' src={popupState?.ItemInfo?.Thumb} />
                            </div>
                            <div className='col-lg-8'>
                                <form onSubmit={detailsFormik.handleSubmit}>
                                    <div className='value-pop-r'>
                                        <input type='text' name='Email' onChange={detailsFormik.handleChange} value={detailsFormik.values.Email} placeholder='Enter your Email Address' /><br />
                                        <button type='submit' className='btn btn-green'>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={handleClose} className='btn-close-auction'>
                        X
                    </Button>
                </Modal.Body>
            </Modal>


        </>
    );
}

export default AuctionDetails;
