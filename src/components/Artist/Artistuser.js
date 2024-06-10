import React, { useEffect, useState } from 'react'
import Banner from "../Artist/Banner"
import { Container } from 'react-bootstrap';
import "../../styles/Artist.css";
import { Link, useParams } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { useGetArtistInfoMutation } from "../../service/Apilist";
import CryptoJS from 'crypto-js';


function ArtistUser() {
    let parms = useParams();
    const [artist, setArtist] = useState(1)
    const [artistListAPI, resArtistAPI] = useGetArtistInfoMutation();
    const [artistDeatils, setArtistDetails] = useState();
    const [artworkList, setArtworkList] = useState([]);
    const [artistInfo, setartistInfo] = useState();
    const [apiLoading, setAPILoading] = useState(false);

    const decryptedItemIdBytes = CryptoJS.AES.decrypt(parms.id, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        artistListAPI({
            UserId: decodeURIComponent(decryptedItemIdBytes)
        })
    }, [parms?.id])
    useEffect(() => {
        setAPILoading(true)
        if (resArtistAPI?.status === "fulfilled") {
            if (resArtistAPI?.data?.status) {
                setArtworkList(resArtistAPI?.data?.itemdata)
                setartistInfo(resArtistAPI?.data?.userdata[0]);
                setAPILoading(false)
            }
        }
    }, [resArtistAPI?.status])
    const ArtistBio = () => {
        return (
            <Container className='section-four'>
                <div className='row' >
                    <p className='artistBioTitle'>OVERVIEW</p>
                    <p className='artistTitlePara'>{artistInfo?.UserInfo?.BioInfo?.Overview}</p>
                </div>
                <div className='row artistBio'>
                    <p className='artistBioTitle'>INSPIRED BY</p>
                    <p className='artistTitlePara' >{artistInfo?.UserInfo?.BioInfo?.Inspired}</p>
                </div>
            </Container>
        )
    }

    const ArtistEvents = () => {
        return (
            <>
                {artistInfo?.UserInfo?.EventInfo?.length > 0 && artistInfo?.UserInfo?.EventInfo.map((event, index) => (
                    <Container className='section-four'>
                        <div className='row artistEvent'>
                            <div className='col-lg-6'>
                                <p className='artistEventTitle'>{event?.Title}</p>
                                <p className='artistEventPara'>{event?.Type}</p>
                                <img src={event?.Image} className="artistEventImage" alt="image"></img>
                            </div>
                            <div className='col-lg-6'>
                                <p className='artistEventPara2'>{event?.Year} {event?.Institude}, {event?.Location}</p>
                            </div>
                        </div>
                    </Container>
                ))}
            </>

        )

    }

    const ArtistMedia = () => {
        return (
            <>
                {artistInfo?.UserInfo?.MediaInfo?.length > 0 && artistInfo?.UserInfo?.MediaInfo.map((media, index) => (
                    <Container className='section-four'>
                        <div className='row'>

                            <div className='col-lg-4 artistMediaImage' style={{ backgroundImage: `url(${media?.Image})` }}>
                                <p>{media?.Type}</p>
                            </div>
                            <div className='col-lg-8'>
                                <p className='artistMediaContent'>{media?.Title}</p>
                                <p className='artistMediaContentTwo'>{media?.Description}</p>
                            </div>
                        </div>
                    </Container>
                ))}

            </>

        )
    }

    const Testimonials = () => {
        return (
            <>
                {artistInfo?.UserInfo?.TestimonialInfo?.length > 0 && artistInfo?.UserInfo?.TestimonialInfo?.map((testimonial, index) => (
                    <>
                        <Container key={index} className='section-four'>
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <p className='artistMediaContent'>{testimonial?.Provider}</p>
                                    <p className='artistMediaContentTwo'>{testimonial?.Description}</p>
                                </div>
                            </div>
                        </Container>
                        <br />
                    </>
                ))}
            </>
        )
    }


    const ArtistArt = () => {
        return (
            <Container>
                <div className='artistContainer' >
                    <Container className='section-four'>
                        <div className='row artist' >
                            {artworkList?.length > 0 && artworkList.map((item, index) => {
                                let Cname = index % 3;
                                const encryptedItemId = CryptoJS.AES.encrypt(JSON.stringify(item?._id), process.env.REACT_APP_SECRET_PASS).toString();
                                return (
                                    <>
                                        {
                                            (() => {
                                                switch (Cname) {
                                                    case 0:
                                                        return <div key={index} className='col-lg-4'>
                                                            <LazyLoad>
                                                                <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                                                    <div className="image-container">
                                                                        <img src={item?.Thumb} className="artistOne"></img>
                                                                        <div className="image-overlay">
                                                                            <p className="image-text">{item?.Title}</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </LazyLoad>
                                                        </div>
                                                    case 1:
                                                        return <div key={index} className='col-lg-4'>
                                                            <LazyLoad>
                                                                <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                                                    <div className="image-container">
                                                                        <img src={item?.Thumb} className="artistTwo"></img>
                                                                        <div className="image-overlay">
                                                                            <p className="image-text">{item?.Title}</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </LazyLoad>
                                                        </div>
                                                    case 2:
                                                        return <div key={index} className='col-lg-4'>
                                                            <LazyLoad>
                                                                <Link to={`/art/${encodeURIComponent(encryptedItemId)}`} >
                                                                    <div className="image-container">
                                                                        <img src={item?.Thumb} className="artistThree"></img>
                                                                        <div className="image-overlay">
                                                                            <p className="image-text">{item?.Title}</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            </LazyLoad>
                                                        </div>
                                                }
                                            })()}
                                    </>
                                );
                            })}
                        </div>
                    </Container>
                </div>
            </Container>
        )
    }
    return (
        <div>
            <Container fluid className='artistUserImage'>
                <div className='container'>
                    <div className='row d-flex align-items-center justify-content-center artistUserImageContent'>
                        <div className='col-lg-4 d-flex align-items-center justify-content-center'>
                            <img style={{ margin: "10px" }} src={artistInfo?.UserInfo?.ProfilePicture} className="artistPerson" width="200px" height="250px" alt="img"></img>
                        </div>
                        <div className='col-lg-8'>
                            <div className='artistBorder'>
                                <p>{artistInfo?.UserInfo?.Role}</p>
                            </div>
                            <div className='artistContent'>
                                <p className='artistContentTitle'>{artistInfo?.UserInfo?.ProfileName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <div >
                <ul className='artistNav'>
                    <li className={artist === 1 ? "active" : null} id='1' value="1" onClick={(e) => setArtist(e.target.value)}>ARTWORKS</li>
                    <li className={artist === 2 ? "active" : null} id='2' value="2" onClick={(e) => setArtist(e.target.value)} >BIO</li>
                    <li className={artist === 3 ? "active" : null} id='3' value="3" onClick={(e) => setArtist(e.target.value)} >EVENTS</li>
                    <li className={artist === 4 ? "active" : null} id='4' value="4" onClick={(e) => setArtist(e.target.value)}>MEDIA</li>
                    <li className={artist === 5 ? "active" : null} id='5' value="5" onClick={(e) => setArtist(e.target.value)}>TESTIMONIALS</li>
                </ul>
            </div>
            {artist === 1 ? <ArtistArt></ArtistArt> : null}
            {artist === 2 ? <ArtistBio></ArtistBio> : null}
            {artist === 3 ? <ArtistEvents></ArtistEvents> : null}
            {artist === 4 ? <ArtistMedia></ArtistMedia> : null}
            {artist === 5 ? <Testimonials /> : null}
        </div>
    )
}

export default ArtistUser;