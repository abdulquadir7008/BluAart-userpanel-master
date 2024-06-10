import React, { useEffect, useRef, useState } from 'react';
import Banner from "./Banner";
import { Container } from 'react-bootstrap';
import { useGetLandingPageQuery, useGetNewsListQuery } from "../../service/Apilist";
import { Link, useNavigate } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';

function Homepage() {

    let navigate = useNavigate()
    const navigatetoPage = (pageName) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        navigate(`/${pageName}`);
    }
    const getlaningpage = useGetLandingPageQuery();
    const getNewsList = useGetNewsListQuery();
    const [landpageState, setLandpageState] = useState();
    const [artistState, setartistState] = useState([]);
    const [newsState, setnewsState] = useState([]);
    const [apiLoading, setAPILoading] = useState(false);

    useEffect(() => {
        setAPILoading(true)
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
            setartistState(getlaningpage.data?.artistinfo);
            setAPILoading(false);
        }
    }, [getlaningpage])
    useEffect(() => {
        setAPILoading(true)
        if (getNewsList.status === "fulfilled") {
            setnewsState(getNewsList.data?.info);
            setAPILoading(false);
        }
    }, [getNewsList])
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
        navigate(`/artist-label/${id}`)
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
    return (
        <>
            <div className='landing-banner-ps'>
                <Banner banerimage={landpageState?.Section1Image} />
            </div>
            <section className='section-two-main'>
                <Container className='section-two'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <div className="section-two-left">
                                <h1><span>{landpageState?.Section2Text}</span> {landpageState?.Section2Title}</h1>
                                <p dangerouslySetInnerHTML={{ __html: landpageState?.Section2Description }}></p>
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className='image-section'>
                                <img className='image-one img-responsive' src={landpageState?.Section2Images?.Image1} />
                                <img className='image-two img-responsive' src={landpageState?.Section2Images?.Image2} />
                                <img className='image-three img-responsive' src={landpageState?.Section2Images?.Image3} />
                                <img className='image-four img-responsive' src={landpageState?.Section2Images?.Image4} />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <section className='section-three-main'>
                <Container className='section-three'>
                    <div className='row no-padding s-three-main'>
                        <div className='col-lg-6'>
                            <div className='featuring-sec-l'>
                                <div className='section-two'>
                                    <h1><span>{landpageState?.Section3Text}</span><br />{landpageState?.Section3Title}</h1>
                                    <p dangerouslySetInnerHTML={{ __html: landpageState?.Section3Description }}></p>
                                    <div className='explore-content'>
                                        <p className='explore'>Explore more</p>
                                        <button onClick={() => navigatetoPage('artProducts')} className='collectionsBtn'>ART PRODUCTS</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
                <Container fluid className='section-three'>
                    <div className='row no-padding s-three-main'>
                        <div className='col-lg-6'>

                        </div>
                        <div className='col-lg-6 no-padding landing-banner-ps2'>
                            <RenderMedia />
                            <ButtonShow />
                        </div>
                    </div>
                </Container>
            </section>
            <Container fluid className='section-four'>
                <div className='row'>
                    {artistState?.length > 0 && artistState.map((artist, index) => {
                        const encryptedItemId = CryptoJS.AES.encrypt(artist?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                        if (index === 0) {
                            return <div className='col-lg-4 imageOne no-padding' style={{ background: `url(${artist?.ProfilePicture})`, backgroundPosition: "center" }}>
                                <div className='explorecontent'>
                                    <button onClick={() => navLink(encodeURIComponent(encryptedItemId))} className='ArtistBtnOne'>{artist?.Label}</button>
                                </div>
                                <p className='Feature'>Featuring <br /> <span>{artist.ProfileName}</span><br /> </p>
                            </div>
                        } else if (index === 1) {
                            return <div className='col-lg-4 imageOne no-padding' style={{ background: `url(${artist?.ProfilePicture})`, backgroundPosition: "center" }}>
                                <div className='explorecontent'>
                                    <button onClick={() => navLink(encodeURIComponent(encryptedItemId))} className='ArtistBtnTwo'>{artist?.Label}</button>
                                </div>
                                <p className='Feature'>Featuring <br /> <span>{artist.ProfileName}</span><br /> </p>
                            </div>
                        } else {
                            return <div className='col-lg-4 imageOne no-padding' style={{ background: `url(${artist?.ProfilePicture})`, backgroundPosition: "center" }}>
                                <div className='explorecontent'>
                                    <button onClick={() => navLink(encodeURIComponent(encryptedItemId))} className='ArtistBtnThree'>{artist?.Label}</button>
                                </div>
                                <p className='Feature'>Featuring <br /> <span>{artist.ProfileName}</span><br /> </p>
                            </div>
                        }
                    })}
                </div>

            </Container>

            <section className='section-ms-main'>
                <br />
                <h3 className='text-center'>Information</h3><br />
                <Container fluid className='section-ms-inn no-padding'>
                    <div className='row'>
                        <div className='col-lg-12 no-padding'>
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

                                    return (
                                        <div className='img-sec-ms'>
                                            <img className='block-chain-img' src={news?.Image} />
                                            <Link to={`/news/${encodeURIComponent(encryptedItemId)}`} className="info-hover">
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

            {apiLoading ? <LoadingScreen text={"Please wait..."} /> : null}
        </>
    );
}

export default Homepage;