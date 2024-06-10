import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import LoadingScreen from '../../Loader/LoadingScreen';
import React, { useEffect, useState } from 'react';
import {
    useUpcomingBidsQuery,
    useOnGoingBidsQuery,
    useBidInterestMutation,
    usePastBidsQuery,
    useAboutusPageInfoQuery,
    useGetLandingPageQuery
} from '../../../service/Apilist'
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Banner from "../../Homepage/Banner";
function About(props) {

    const aboutUsInfo = useAboutusPageInfoQuery();
    const [aboutUsPageState, setAboutUsPageState] = useState()
    const [aboutUsModalState, setAboutUsModalState] = useState({})
    const [aboutUsPageTeamState, setAboutUsPageTeamState] = useState([])
    const [apiLoading, setAPILoading] = useState(false);
    useEffect(() => {
        setAPILoading(true)
        if (aboutUsInfo?.status === 'fulfilled') {
            setAboutUsPageState(aboutUsInfo?.data?.info[0]);
            setAboutUsPageTeamState(aboutUsInfo?.data?.teaminfo);
            setAPILoading(false);
        }
    }, [aboutUsInfo])

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
    const getallupcommingauctions = useUpcomingBidsQuery();
    const getallOngoingauctions = useOnGoingBidsQuery();
    const getPastAuction = usePastBidsQuery();
    const [bidIntrestAPI, resBidIntrestAPI] = useBidInterestMutation();
    const [auctionUpcommingList, setauctionUpcommingList] = useState([]);
    const [pastAuctionList, setpastAuctionList] = useState([]);
    const [auctionOngoingList, setauctionOngoingList] = useState([])
    useEffect(() => {
        if (getallupcommingauctions?.status === 'fulfilled') {
            setauctionUpcommingList(getallupcommingauctions?.data?.data);
        }
    }, [getallupcommingauctions])
    useEffect(() => {
        if (getPastAuction?.status === 'fulfilled') {
            setpastAuctionList(getPastAuction?.data?.data);
        }
    }, [getPastAuction])
    useEffect(() => {
        if (getallOngoingauctions?.status === 'fulfilled') {
            setauctionOngoingList(getallOngoingauctions?.data?.data);
        }
    }, [getallOngoingauctions])
    const [popupState, setpopupState] = useState({})



    const [isVisible, setIsVisible] = useState(0);

    useEffect(() => {
        setIsVisible(0);
    }, []);

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
    const aboutTitle = (id) => {
        setAboutUsModalState(id);
        handleShow()
    }
    const getlaningpage = useGetLandingPageQuery();
    const [landpageState, setLandpageState] = useState();
    useEffect(() => {
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
        }
    }, [getlaningpage])
    return (
        <>
            <div className='landing-banner-ps'>
                <Banner banerimage={landpageState?.Section1Image} />
            </div>
            <section className='news-section abt-main-box'>
                <Container className=''>
                    <h3 className='abt-head my-3'>About Us</h3>
                    <div className=''>
                        <div className='row abt-middle-cont'>
                            <div className='col-lg-6'>
                                <div className='abt-middle-content' dangerouslySetInnerHTML={{ __html: aboutUsPageState?.Section1Text }}>

                                </div>
                            </div>
                            <div className='col-lg-6'>
                                <div className='abt-banner-r2'>
                                    <img className='' height="300px" width="300px" src={aboutUsPageState?.Section1Image} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <section className='about-team-main'>
                <Container fluid className='pos-rel'>
                    <h3 className='abt-head my-3'>About Us</h3>
                    <div className='row'>
                        {aboutUsPageTeamState?.length > 0 && aboutUsPageTeamState.map((team, index) => (
                            <>{index < 5 ?
                                <div className='col-lg-2'>
                                    <div className='about-us-team'>
                                        <div className="image-container">
                                            <img src={team?.Image} className="collectionOne" />
                                            <div className="image-overlay">
                                                <div className='abut-hover'>{team?.Name}<br />
                                                    <p className="image-text">{team?.Position}</p>
                                                    <Button variant="primary" onClick={() => aboutTitle(team)} className='btn btn-white'>
                                                        About
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                : null}
                            </>
                        ))}
                    </div>
                </Container>
            </section>
            <section className='news-section abt-main-box'>
                <Container className=''>
                    <h3 className='abt-head my-3'>{aboutUsPageState?.Section3Title}</h3>
                    <div className=''>
                        <div className='row abt-middle-cont' dangerouslySetInnerHTML={{ __html: aboutUsPageState?.Section3Content }}>
                        </div>
                    </div>
                </Container>
            </section>
            <Modal show={show} onHide={handleClose} className='auction-tabb3'>
                <Modal.Body className='popup-body'>
                    <div className='popup-middle'>
                        <div className='row'>
                            <div className='col-lg-8'>
                                <div className='value-pop-r'>
                                    <h1>{aboutUsModalState?.Name}</h1>
                                    <h5>{aboutUsModalState?.Position}</h5>
                                    <p dangerouslySetInnerHTML={{ __html: aboutUsModalState?.Info }}>
                                    </p>

                                    <div className='pop-smediaa'>
                                        <a target='_blank' href={aboutUsModalState?.Instagram}><i className="fa-brands fa-instagram"></i></a>
                                        <a target='_blank' href={aboutUsModalState?.Linkedin}><i className="fa-brands fa-linkedin"></i></a>
                                        <a target='_blank' href={aboutUsModalState?.Facebook}><i className="fa-brands fa-facebook"></i></a>
                                    </div>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <img className='auction-user-img3' src={aboutUsModalState?.Image} />
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={handleClose} className='btn-close-auction'>
                        X
                    </Button>
                </Modal.Body>
            </Modal>

            {apiLoading ? <LoadingScreen/> : null}

        </>
    );
}

export default About; 