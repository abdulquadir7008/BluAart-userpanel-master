import React, { useState, useRef, useEffect } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "react-multi-carousel/lib/styles.css";
import { useGetLandingPageQuery, useGetNewsListQuery, useGetPageInfoMutation } from "../../../service/Apilist";
import Image1 from "../../../assets/img1.png";
import Image2 from "../../../assets/img2.png";
import Image3 from "../../../assets/img3.png";
import Image4 from "../../../assets/img4.png";
import LoadingScreen from '../../Loader/LoadingScreen';
import {
    useFeaturesPageInfoQuery
} from '../../../service/Apilist';
import Banner from "../../Homepage/Banner";
function Features(props) {
    const features = useFeaturesPageInfoQuery();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    let navigate = useNavigate()
    const navigatetoPage = (pageName) => {
        navigate(`/${pageName}`);
    }
    const [getPageinfoAPI, resGetPageinfoAPI] = useGetPageInfoMutation();
    const [privacyState, setprivacyState] = useState("");
    const getlaningpage = useGetLandingPageQuery();
    const getNewsList = useGetNewsListQuery();
    const [landpageState, setLandpageState] = useState();
    const [artistState, setartistState] = useState([]);
    const [featuresList, setFeaturesList] = useState([]);
    const [newsState, setnewsState] = useState([
        { image1: Image1 },
        { image1: Image2 },
        { image1: Image3 },
        { image1: Image4 },
    ]);
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
        if (features.status === "fulfilled") {
            if (features?.data?.status) {
                setFeaturesList(features?.data?.info);
            }
        }
    }, [features])
    useEffect(() => {
        setAPILoading(true);
        if (resGetPageinfoAPI.status === "fulfilled") {
            setprivacyState(resGetPageinfoAPI?.data?.info)
            setAPILoading(false);
        }
    }, [resGetPageinfoAPI])
    useEffect(() => {
        getPageinfoAPI({
            Page: "Privacy"
        })
    }, [])

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

    const [modalImage, setModalImage] = useState("")
    const [modalName, setModalName] = useState("")
    const [modalDescritpion, setmodalDescritpion] = useState("")
    const openModal = (data) => {
        setModalImage(data?.Image);
        setModalName(data?.Name);
        setmodalDescritpion(data?.Info)
        setShow(true);
    }

    useEffect(() => {
        setAPILoading(true);
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
            setAPILoading(false);
        }
    }, [getlaningpage])
    return (
        <>
            <div className='landing-banner-ps'>
                <Banner banerimage={landpageState?.Section1Image} />
            </div>
            <section className='news-section abt-main-box'>
                <Container className=''>
                    <h3 className='abt-head mt-3 mb-5'>Features & Editorials</h3>
                    <br />
                    <br />
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='row'>
                                {featuresList?.length > 0 && featuresList?.map((features, index) => {

                                    let Cname = index % 3;
                                    return (
                                        <>
                                            {
                                                (() => {
                                                    switch (Cname) {
                                                        case 0:
                                                            return <div className='col-lg-4 '>
                                                                <a className='' onClick={() => openModal({ Name: features?.Name, Image: features?.Image, Info: features?.Info })}>
                                                                    <div className="collectionTwo image-container">
                                                                        <img src={features?.Image} className="artistOne" />
                                                                        <div className="image-overlay">
                                                                            <div>{features?.Name}<br />
                                                                                <p className="image-text">{features?.PublishDate}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        case 1:
                                                            return <div className='col-lg-4 '>
                                                                <a className='' onClick={() => openModal({ Name: features?.Name, Image: features?.Image, Info: features?.Info })}>
                                                                    <div className="image-container image-container-artistTwo">
                                                                        <img height="100%" src={features?.Image} className="artistTwo" />
                                                                        <div className="image-overlay">
                                                                            <div>{features?.Name}<br />
                                                                                <p className="image-text">{features?.PublishDate}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        case 2:
                                                            return <div className='col-lg-4 '>
                                                                <a className='' onClick={() => openModal({ Name: features?.Name, Image: features?.Image, Info: features?.Info })}>
                                                                    <div className="collectionTwo image-container">
                                                                        <img src={features?.Image} className="artistOne" />
                                                                        <div className="image-overlay">
                                                                            <div>{features?.Name}<br />
                                                                                <p className="image-text">{features?.PublishDate}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                    }
                                                })()}
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {apiLoading ? <LoadingScreen text={"Please wait..."} /> : null}


            <Modal show={show} onHide={handleClose} className='auction-tabb3'>
                <Modal.Body className='popup-body'>
                    <div className='popup-middle'>
                        <div className='row'>
                            <div className='col-lg-8'>
                                <div className='value-pop-r'>
                                    <h1>{modalName}</h1>
                                    <div dangerouslySetInnerHTML={{ __html: modalDescritpion }}>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <img className='auction-user-img3' src={modalImage} />
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

export default Features;