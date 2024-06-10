import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    useBidInterestMutation,
} from '../../../service/Apilist'
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Banner from './Banner';
import { socket } from "../../../socket";
import CryptoJS from 'crypto-js';


function Auction(props) {
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showPast, setShowPast] = useState(false);

    const handlePastClose = () => setShowPast(false);
    const handlePastShow = () => setShowPast(true);

    const [page, setPage] = useState(1)

    const [bidIntrestAPI, resBidIntrestAPI] = useBidInterestMutation();
    const [auctionTypeList, setauctionTypeList] = useState([]);
    const [auctionTypeState, setauctionTypeState] = useState('');
    const [auctionUpcommingList, setauctionUpcommingList] = useState([]);
    const [pastAuctionList, setpastAuctionList] = useState([]);
    const [auctionOngoingList, setauctionOngoingList] = useState([])
    const liveAuctionClieck = useRef(null)
    const [endTime, setEndTime] = useState(new Date()); // Set your desired end time here
    useEffect(() => {
        socket.on("GetOnGoingAuctions", (data) => {
            setauctionOngoingList(data?.data);
            setauctionTypeList(data?.data)
            setEndTime(new Date(data?.data[0]?.ItemInfo?.EndDateTimeUtcBID));
            if (localStorage.getItem('onPage') === 'live') {
                setauctionTypeList(data?.data);
            }
            setShowTime(true)
        })
        socket.on("GetFutureAuctions", (data) => {
            setauctionUpcommingList(data?.data);
            if (localStorage.getItem('onPage') === 'upcomming') {
                setauctionTypeList(data?.data);
            }
        })
        socket.on("GetPastAuctions", (data) => {
            setpastAuctionList(data?.data);
            if (localStorage.getItem('onPage') === 'past') {
                setauctionTypeList(data?.data);
            }
        })
    }, [])

    useEffect(() => {
        setauctionTypeState('live');
    }, [])


    const [popupState, setpopupState] = useState({})

    const [isVisible, setIsVisible] = useState(0);
    useEffect(() => {
        setIsVisible(0);
        socket.emit('pageOnStatus', {});
        return () => {
            socket.emit('pageOffStatus', {});
        };
    }, []);

    const showModalPastPopup = (item) => {
        setpopupState(item)
        handlePastShow()
    }
    const intrestSchema = Yup.object().shape({
        Email: Yup.string().email('Invalid email').required('Email is required'),
    });
    let upcomingFormik = useFormik({
        initialValues: {
            Email: "",
            ItemId: popupState?.ItemInfo?._id
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

    let pastFormik = useFormik
        ({
            initialValues: {
                Email: "",
                ItemId: popupState?.ItemInfo?._id
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
                    handlePastClose()
                })
            }
        })

    

    let navigate = useNavigate()
    const routePage = (id) => {
        navigate(`/art/${id}`)
        window.scrollTo(0, 0); // Scroll to the top of the page
    }
    const [showTime, setShowTime] = useState(false);
    const auctionType = (type) => {
        if (type === 'upcomming') {
            setShowTime(false)
            setauctionTypeState('upcomming');
            localStorage.setItem('onPage', 'upcomming');
            setIsVisible(0)
            socket.emit('GetFutureAuctions', {})
        } else if (type === 'live') {
            setShowTime(true)
            setauctionTypeState('live');
            setIsVisible(0)
            localStorage.setItem('onPage', 'live');
            socket.emit('GetOnGoingAuctions', {})
        } else {
            setShowTime(false)
            setauctionTypeState('past');
            setIsVisible(0)
            localStorage.setItem('onPage', 'past');
            socket.emit('GetPastAuctions', {})
        }
    }
    useEffect(() => {
        socket.emit('GetOnGoingAuctions', {})
    }, [])
    const [currentTime, setCurrentTime] = useState(new Date());
    const [totalSeconds, setTotalSeconds] = useState(0);
    useEffect(() => {

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    const formatTime = (timeDiff, type) => {
        if (timeDiff < 0) {
          
        }
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
            <div className='landing-banner-ps'>
                <Banner banerimage={props?.bannerState?.AuctionBannerImage}></Banner>
            </div>
            <section className='news-section'>
                <Container className=''>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="news-middle-section">
                                <div className='auction-btn-c'>
                                    <button className='btn btn-green'>Auctions</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
                <br />
                <Container className='' fluid>
                    <div className='row'>
                        <div className='col-3'>
                            <button ref={liveAuctionClieck} className={auctionTypeState === 'live' ? 'auction-type active' : 'auction-type'}
                                onClick={() => auctionType('live')}
                            >Live Auctions</button>
                            <br />
                            <button className={auctionTypeState === 'upcomming' ? 'auction-type active' : 'auction-type'} onClick={() => auctionType('upcomming')}>Upcoming Auctions</button>
                            <br />
                            <button className={auctionTypeState === 'past' ? 'auction-type active' : 'auction-type'} onClick={() => auctionType('past')}>Past Auction</button>
                        </div>
                        <div className="col-9 slide-container">
                            {auctionTypeList?.length > 0 && auctionTypeList.map((item, index) => {
                                const encryptedItemId = CryptoJS.AES.encrypt(item?.UserInfo?.Id.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                                return <div className={`slide-item ${isVisible === index ? 'slide-from-bottom show' : 'slide-from-bottom hide'}`}>
                                    <div className='row'>
                                        <div className='col-lg-8'>
                                            <div className="auction-one-left-index">
                                                <div className="ad-top-r-section" style={{ display: showTime ? "block" : "none" }}>
                                                    {showTime && auctionTypeState !== 'past' && (
                                                        <div className='timer-div d-flex justify-content-end' >
                                                            <div className='days timer-div-sec'>
                                                                <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.days.toString().padStart(2, '0') : '00'}</h1>
                                                                <h3 className='timer-text'>DD</h3>
                                                            </div>
                                                            &nbsp;

                                                            &nbsp;
                                                            <div className='hour timer-div-sec'>
                                                                <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.hours.toString().padStart(2, '0') : '00'}</h1>
                                                                <h3 className='timer-text'>HH</h3>
                                                            </div>
                                                            &nbsp;
                                                            <h3 className='timer-spliter'>:</h3>
                                                            &nbsp;
                                                            <div className='minutes timer-div-sec'>
                                                                <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.minutes.toString().padStart(2, '0') : '00'}</h1>
                                                                <h3 className='timer-text'>MM</h3>
                                                            </div>
                                                            &nbsp;
                                                            <h3 className='timer-spliter'>:</h3>
                                                            &nbsp;
                                                            <div className='seconds timer-div-sec'>
                                                                <h1 className='timer-digit' >{timeDiff > 0 ? formattedTime.seconds.toString().padStart(2, '0') : '00'}</h1>
                                                                <h3 className='timer-text'>SS</h3>
                                                            </div>
                                                            &nbsp;
                                                        </div>)}
                                                </div>
                                                <div className="news-top-l">
                                                    <div className='row'>
                                                        <div className='col-lg-2'>
                                                            <img className='auction-user-img' src={item?.UserInfo?.ProfilePicture} />
                                                        </div>
                                                        <div className='col-lg-10'>
                                                            <div className='al-main'>
                                                                <h6>Artist</h6>
                                                                <h3>{item?.UserInfo?.UserName}</h3>
                                                                <h5>{item?.UserInfo?.Country}</h5>
                                                                <h2>{item?.ItemInfo?.Title}</h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='auction-date'>
                                                    <div className='auction-button'>
                                                        <Link to={`/auction/${encodeURIComponent(encryptedItemId)}`} className='btn btn-purple'>VIEW  CATALOGUE</Link>
                                                        {auctionTypeState === "upcomming" ? <button className='btn btn-purple' onClick={() => showModalPastPopup(item)} >Interested</button> : null}
                                                    </div>
                                                    {auctionTypeState === "upcomming" ? <div className='auction-button2'>
                                                        <h4>Auction Date</h4>
                                                        <p>{new Date(item?.ItemInfo?.StartDateTimeUtcBID).toLocaleString()}</p>
                                                    </div> : null}
                                                </div>
                                            </div>
                                        </div>
                                       
                                    </div>
                                </div>
                            })}
                        </div>

                        <div className='col-lg-12'>
                            <div className='auction-tab-section'>



                                <div className='row'>
                                    {auctionTypeList?.length > 0 && auctionTypeList.map((item, index) => {
                                        const encryptedItemId = CryptoJS.AES.encrypt(item?.ItemInfo?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

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
                                                                                <div className='News-button-sec'>
                                                                                    <h3>{item?.ItemInfo?.Title}</h3>
                                                                                    <p>
                                                                                        {item?.ItemInfo?.Description}
                                                                                    </p>
                                                                                    <Button variant="primary" onClick={() => routePage(encodeURIComponent(encryptedItemId))}>
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
                                                                                    <h3>{item?.ItemInfo?.Title}</h3>
                                                                                    <p>
                                                                                        {item?.ItemInfo?.Description}
                                                                                    </p>
                                                                                    <Button variant="primary" onClick={() => routePage(encodeURIComponent(encryptedItemId))}>
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
                                                                                    <h3>{item?.ItemInfo?.Title}</h3>
                                                                                    <p>
                                                                                        {item?.ItemInfo?.Description}
                                                                                    </p>
                                                                                    <Button variant="primary" onClick={() => routePage(encodeURIComponent(encryptedItemId))}>
                                                                                        View Details
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                        }
                                                    })()}
                                            </>
                                        )
                                    })}

                                </div>

                                
                                <Modal show={show} onHide={handleClose} className='auction-tabb'>
                                    <Modal.Body className='popup-body'>
                                        <div className='popup-middle'>
                                            <div className='row'>
                                                <div className='col-lg-4'>
                                                    <img className='auction-user-img3' src={popupState?.ItemInfo?.Thumb} />
                                                </div>
                                                <div className='col-lg-8'>
                                                    <form onSubmit={upcomingFormik.handleSubmit}>
                                                        <div className='value-pop-r'>
                                                            <div>
                                                                <input type='text' name='Email' onChange={upcomingFormik.handleChange} value={upcomingFormik.values.Email} placeholder='Enter your Email Address' /><br />
                                                                <div className="errors" style={{ textAlign: "center" }}>{upcomingFormik.errors.Email}</div>
                                                            </div>
                                                            <br />
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
                                <Modal show={showPast} onHide={handlePastClose} className='auction-tabb'>
                                    <Modal.Body className='popup-body'>
                                        <div className='popup-middle'>
                                            <div className='row'>
                                                <div className='col-lg-4'>
                                                    <img className='auction-user-img3' src={popupState?.ItemInfo?.Thumb} />
                                                </div>
                                                <div className='col-lg-8'>
                                                    <form onSubmit={pastFormik.handleSubmit}>
                                                        <div className='value-pop-r'>
                                                            <input type='text' name='Email' onChange={pastFormik.handleChange} value={pastFormik.values.Email} placeholder='Enter your Email Address' /><br />
                                                            <br />
                                                            <button type='submit' className='btn btn-green'>Submit</button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="secondary" onClick={handlePastClose} className='btn-close-auction'>
                                            X
                                        </Button>
                                    </Modal.Body>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
}

export default Auction