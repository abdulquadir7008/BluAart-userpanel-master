import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container } from 'react-bootstrap';
import NewsbannerOne from "../../../assets/news-banner.png";
import olyvia from "../../../assets/olyvia.png";
import olyviathumbnail from "../../../assets/Olyvia-thumbnail.png";
import Carousel from "react-multi-carousel";
import { useGetLandingPageQuery, useGetNewsListQuery, useGetNewsInfoMutation } from "../../../service/Apilist";
import { Link, useNavigate, useParams } from 'react-router-dom';
import "react-multi-carousel/lib/styles.css";
import LoadingModal from '../../Loader/Loading';
import CryptoJS from 'crypto-js';

function News(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    let navigate = useNavigate()
    const navigatetoPage = (pageName) => {
        navigate(`/${pageName}`);
    }
    const getlaningpage = useGetLandingPageQuery();
    const [getnewsAPI, resgetnewsAPI] = useGetNewsInfoMutation();
    const getNewsList = useGetNewsListQuery();
    const [landpageState, setLandpageState] = useState();
    const [artistState, setartistState] = useState([]);
    const [getnewsState, setgetnewsState] = useState([]);
    const [authorState, setauthorState] = useState([]);
    const [newsState, setnewsState] = useState([]);
    useEffect(() => {
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
            setartistState(getlaningpage.data?.artistinfo);
        }
    }, [getlaningpage])
    useEffect(() => {
        if (getNewsList.status === "fulfilled") {
            setnewsState(getNewsList.data?.info);
        }
    }, [getNewsList])
    let parms = useParams();
    const decryptedItemIdBytes = CryptoJS.AES.decrypt(parms.id, process.env.REACT_APP_SECRET_PASS);
    const decryptedItemIdString = decryptedItemIdBytes.toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        getnewsAPI({
            NewsId: encodeURIComponent(decryptedItemIdString)
        })
    }, [])
    useEffect(() => {
        if (resgetnewsAPI.status === "fulfilled") {
            setgetnewsState(resgetnewsAPI.data?.info[0]?.NewsInfo);
            setauthorState(resgetnewsAPI.data?.info[0]?.UserInfo);
        }
    }, [resgetnewsAPI])
    const responsiveNews = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 4
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    const navLink = (id) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        navigate(`/single-artist/${id}`)
    }
    const SvideoRef = useRef(null);
    const unmuteVideo = () => {
        if (SvideoRef.current) {
            SvideoRef.current.muted = false;
            document.getElementById('sunmute').style.display = 'none';
            document.getElementById('smute').style.display = 'inline';
        }
    };
    const muteVideo = () => {
        if (SvideoRef.current) {
            SvideoRef.current.muted = true;
            document.getElementById('smute').style.display = 'none';
            document.getElementById('sunmute').style.display = 'inline';
        }
    };
    const RenderMedia = () => {
        let bannerImage = landpageState?.Section3Image;
        let mediaFile = bannerImage?.split(".")?.pop();
        switch (mediaFile) {
            case "mp4":
                return <video id='video' ref={SvideoRef} style={{ width: "100%", height: "700px" }} autoPlay loop muted={true} src={bannerImage} ></video>
            default:
                return <img style={{ width: "100%", height: "700px" }} src={bannerImage} className="img-responsive" />;
        }
    }
    const ButtonShow = () => {
        let bannerImage = landpageState?.Section3Image;
        let mediaFile = bannerImage?.split(".")?.pop();
        switch (mediaFile) {
            case "mp4":
                return (
                    <>
                        <button className='btn unmute' id='sunmute' onClick={unmuteVideo}><i className="fas fa-volume-mute"></i></button>
                        <button className='btn mute' id='smute' style={{ display: "none" }} onClick={muteVideo}><i className="fas fa-volume-up"></i></button>
                    </>
                );
            default:
                return null;
        }
    }
    const newsGet = (id) => {
        getnewsAPI({
            NewsId: id
        })
    }
    return (
        <>
            {resgetnewsAPI.isLoading ? <LoadingModal /> : null}
            <section>
                <div className='news-banner-section'>
                    <img className='block-chain-img' src={NewsbannerOne} />
                </div>

            </section>
            <section className='news-section'>
                <Container className=''>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="news-middle-section">
                                <div className="news-top-r">
                                    <h1>{authorState?.Name}<br />
                                        <img className='block-chain-img' src={authorState?.Image} />
                                    </h1>
                                </div>
                                <div className="news-top-l">
                                    <h2>{getnewsState?.Title}</h2>
                                </div>
                                <div className='news-content' dangerouslySetInnerHTML={{ __html: getnewsState?.Content }}>

                                </div>

                                <div className='News-button-sec'>
                                    <Button variant="primary" onClick={handleShow}>
                                        About The Author
                                    </Button>

                                    <Modal show={show} onHide={handleClose}>
                                        
                                        <Modal.Body className='popup-body'>
                                            <div className='popup-middle'>
                                                <div className='pop-img'>
                                                    <img className='' src={authorState?.Image} />
                                                </div>
                                                <h1>{authorState?.Name}</h1>
                                                <div dangerouslySetInnerHTML={{ __html: authorState?.Content }}></div>
                                            </div>
                                        </Modal.Body>
                                       
                                    </Modal>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6'>
                            <div className="">

                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className=''>

                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <section className='section-ms-main'>
                <br />
                <h3 className='text-center'>News Information</h3><br />
                <Container fluid className='section-ms-inn'>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <Carousel
                                swipeable={false}
                                draggable={false}

                                infinite={true}
                                autoPlaySpeed={1000}
                                keyBoardControl={true}
                                customTransition="all .5"
                                transitionDuration={500}
                                containerClass="carousel-container"
                                removeArrowOnDeviceType={["tablet", "mobile"]}
                                dotListClass="custom-dot-list-style"
                                itemClass="carousel-item-padding-40-px"
                                responsive={responsiveNews}>
                                {newsState.length > 0 && newsState.map((news, index) => {
                                    const encryptedItemId = CryptoJS.AES.encrypt(news._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                                    const decryptedItemIdBytes = CryptoJS.AES.decrypt(news?._id, process.env.REACT_APP_SECRET_PASS);
                                    const decryptedItemIdString = decryptedItemIdBytes.toString(CryptoJS.enc.Utf8);
                                    return (
                                        <div className='img-sec-ms'>
                                            <img className='block-chain-img' src={news?.Image} />
                                            <Link onClick={() => newsGet(news?._id)} to={`/news/${encodeURIComponent(encryptedItemId)}`} className="info-hover">
                                                <h3>{news?.Title}</h3>
                                                <p>ART MARKET</p>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </Carousel>
                        </div>
                    </div>
                </Container>
            </section>
           
        </>
    );
}

export default News;