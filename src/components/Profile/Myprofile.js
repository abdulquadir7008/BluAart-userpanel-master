import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import "../../styles/Artist.css";
import { Link } from 'react-router-dom';
import {
    useAuthorItemlistQuery,
    useOwnedItemlistQuery,
    useGetProfileInfoQuery,
    useAddEditBioMutation,
    useGetBioQuery,
    useCommonImageUploadMutation,
    useAddExhibitionMutation,
    useGetExhibitionsQuery,
    useDeleteExhibitionMutation,
    
    useEditExhibitionMutation,
    useAddMediaPublicationsMutation,
    useGetMediaPublicationsQuery,
    useDeleteMediaPublicationsMutation,
    useEditMediaPublicationsMutation,
    useAddTestimonialMutation,
    useEditTestimonialMutation,
    useDeleteTestimonialMutation,
    useGetTestimonialsQuery,
    useEnableDisable2FAMutation
} from "../../service/Apilist";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';


function Myprofile() {
    const [artist, setArtist] = useState(1);
    const [authorList, setauthorList] = useState([]);
    const [ownedList, setownedList] = useState([]);
    const [exibitionState, setexibitionState] = useState([]);
    const [MediaPublicationsState, setMediaPublicationsState] = useState([]);
    const [testimonialsState, settestimonialsState] = useState([]);
    const authoritemList = useAuthorItemlistQuery();
    const OwnedItemlist = useOwnedItemlistQuery();
    const profileInfo = useGetProfileInfoQuery();
    const [addEditAPI, resAddEditAPI] = useAddEditBioMutation();
    const exibitionGetAPI = useGetExhibitionsQuery();
    const MediaPublicationsGetAPI = useGetMediaPublicationsQuery();
    const testimonialsGetAPI = useGetTestimonialsQuery();
    const [addExhibitionAPI, resaddExhibitionAPI] = useAddExhibitionMutation();
    const [editExhibitionAPI, reseditExhibitionAPI] = useEditExhibitionMutation();
    const [editMediaAPI, reseditMediaAPI] = useEditMediaPublicationsMutation();
    const [deleteExhibitionAPI, resdeleteExhibitionAPI] = useDeleteExhibitionMutation();
    const [deleteMediaAPI, resdeleteMediaAPI] = useDeleteMediaPublicationsMutation();
    const [addCommonImageAPI, resaddCommonImageAPI] = useCommonImageUploadMutation();
    const [addMediaPublicationsAPI, resAddMediaPublicationsAPI] = useAddMediaPublicationsMutation();
    const [deleteTestimonialsAPI, resdeleteTestimonialsAPI] = useDeleteTestimonialMutation();
    const [addTestimonialsAPI, resAddTestimonialsAPI] = useAddTestimonialMutation();
    const [editTestimonialsAPI, resEditTestimonialsAPI] = useEditTestimonialMutation();
    const [enable2FAAPI, resenable2FAAPI] = useEnableDisable2FAMutation();
    const getBioAPI = useGetBioQuery();
    const [profileState, setprofileState] = useState({});
    const [isOn, setIsOn] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);


    const handleClick = () => {
        enable2FAAPI({
            Enable2FA: !isOn
        }).then((res) => {
            if (res.data.status) {
                showToast(res.data.message)
                profileInfo.refetch()
            } else {
                showErroToast(res.data.message)
            }
        })
    };
    useEffect(() => {
        if (OwnedItemlist?.status === "fulfilled") {
            setownedList(OwnedItemlist?.data?.data);
        }
    }, [OwnedItemlist])
    useEffect(() => {
        if (authoritemList?.status === "fulfilled") {
            setauthorList(authoritemList?.data?.data);
        }
    }, [authoritemList])
    useEffect(() => {
        setApiLoading(true)
        if (profileInfo?.status === "fulfilled") {
            if (profileInfo?.data?.info) {
                setprofileState(profileInfo?.data?.info[0]);
                setIsOn(profileInfo?.data?.info[0]?.Enable2FA)
                setApiLoading(false)
            }
        }
    }, [profileInfo])
    const ArtistBio = () => {
        return (
            <div className='artistContainer' >
                <Container className='artist-section'>
                    <div className='row artist' >
                        {authorList?.length > 0 && authorList.map((ownerItem, index) => {
                            let Cname = index % 3;
                            const encryptedItemId = CryptoJS.AES.encrypt(ownerItem.ItemInfo?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                            return (
                                <>
                                    {
                                        (() => {
                                            switch (Cname) {
                                                case 0:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                                            <div className=" image-container">
                                                                <img src={ownerItem?.ItemInfo?.Thumb} className="collectionOne" alt='owned-item-img'></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{ownerItem?.ItemInfo?.Title}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                case 1:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                                            <div className=" image-container image-container-artistTwo">
                                                                <img width="100%" height="540px" src={ownerItem?.ItemInfo?.Thumb} className="" alt='owned-item-img'></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{ownerItem?.ItemInfo?.Title}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                case 2:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/art/${encodeURIComponent(encryptedItemId)}`} >
                                                            <div className=" image-container">
                                                                <img src={ownerItem?.ItemInfo?.Thumb} className="collectionThree" alt='owned-item-img'></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{ownerItem?.ItemInfo?.Title}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                            }
                                        })()}
                                </>
                            );
                        })}
                    </div>
                </Container>
            </div>
        )
    }

    const ArtistArt = () => {
        return (
            <div className='artistContainer' >
                <Container className='artist-section'>
                    <div className='row artist' >
                        {ownedList?.length > 0 && ownedList.map((ownerItem, index) => {
                            let Cname = index % 3;
                            const encryptedItemInfo = CryptoJS.AES.encrypt(ownerItem.ItemInfo?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                            return (
                                <>
                                    {
                                        (() => {
                                            switch (Cname) {
                                                case 0:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/art/${encodeURIComponent(encryptedItemInfo)}`}>
                                                            <div className=" image-container">
                                                                <img src={ownerItem?.ItemInfo?.Thumb} className="collectionOne" alt='owned-item-img'></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{ownerItem?.ItemInfo?.Title}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                case 1:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/art/${encodeURIComponent(encryptedItemInfo)}`}>
                                                            <div className=" image-container image-container-artistTwo">
                                                                <img width="100%" height="540px" src={ownerItem?.ItemInfo?.Thumb} className="" alt='owned-item-img'></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{ownerItem?.ItemInfo?.Title}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                case 2:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/art/${encodeURIComponent(encryptedItemInfo)}`} >
                                                            <div className=" image-container">
                                                                <img src={ownerItem?.ItemInfo?.Thumb} className="collectionThree" alt='owned-item-img'></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{ownerItem?.ItemInfo?.Title}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                            }
                                        })()}
                                </>
                            );
                        })}
                    </div>
                </Container>
            </div>
        )
    }
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const BioSchema = Yup.object().shape({
        Overview: Yup.string()
            .min(100, 'Overview must be atleast 100 letters')
            .required('Overview is required'),
        Inspired: Yup.string()
            .min(10, 'Inspired By must be atleast 10 letters')
            .max(50, 'Inspired By must be minimum 50 letters')
    });
    const formik = useFormik({
        initialValues: {
            Overview: "",
            Inspired: ""
        },
        validationSchema: BioSchema,
        onSubmit: values => {
            addEditAPI(values).then((res) => {
                if (res.data.status) {
                    showToast(res.data.message)
                } else {
                    showErroToast(res.data.message)
                }
            })
        }
    });
    useEffect(() => {
        if (getBioAPI?.status === "fulfilled") {
            formik.setValues({
                Overview: getBioAPI.data?.info?.Overview,
                Inspired: getBioAPI.data?.info?.Inspired
            })
        }
    }, [getBioAPI])

    const BioAddEdit = () => {
        return (
            <div className='container'>
                <form onSubmit={formik.handleSubmit}>
                    <h6>OVERVIEW</h6>
                    <textarea name='Overview' onChange={formik.handleChange} type="text" value={formik.values.Overview} rows={3} cols={50} />
                    <div className='errors'>{formik.errors.Overview}</div>
                    <br />
                    <br />
                    <h6>INSPIRED BY</h6>
                    <input name='Inspired' onChange={formik.handleChange} value={formik.values.Inspired} />
                    <div className='errors'>{formik.errors.Inspired}</div>
                    <br />
                    <br />
                    <button type='submit' className='btn btn-primary'>Update</button>
                </form>
            </div>
        );
    }
    const [show, setShow] = useState(false);
    const [eventsLoading, setEventsLoading] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [showEdit, setShowEdit] = useState(false);
    const handleEditClose = () => setShowEdit(false);
    const handleEditShow = () => setShowEdit(true);
    const eventSchema = Yup.object().shape({
        Title: Yup.string()
            .min(5, 'Title must be atleast 5 letters')
            .max(20, 'Title  must be minimum 20 letters')
            .required('Title is required'),
        Type: Yup.string()
            .min(4, 'Type  must be atleast 10 letters')
            .max(50, 'Type  must be minimum 50 letters')
            .required('Type  is required'),
        Year: Yup.string()
            .min(4, 'Year  must be atleast 10 letters')
            .max(50, 'Year  must be minimum 50 letters')
            .required('Year  is required'),
        Institude: Yup.string()
            .min(4, 'Institute  must be atleast 10 letters')
            .max(50, 'Institute  must be minimum 50 letters')
            .required('Institute  is required'),
        Location: Yup.string()
            .min(4, 'Location  must be atleast 10 letters')
            .max(50, 'Location  must be minimum 50 letters')
            .required('Location  is required'),
        Image: Yup.mixed().required('Please select a file').test('fileSize', 'File size is too large', (value) => {
            return value && value.size <= 10485760; // 10MB
        }).test('fileType', 'Unsupported file format', (value) => {
            return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
        }),
    });
    const eventsFormik = useFormik({
        initialValues: {
            Title: "",
            Type: "",
            Year: 0,
            Institude: "",
            Location: "",
            Image: null
        },
        validationSchema: eventSchema,
        onSubmit: values => {
            setEventsLoading(true)
            let formdata = new FormData();
            formdata.append('Type', 'Exhibition');
            formdata.append('Image', values.Image);
            addCommonImageAPI(formdata).then((res) => {
                if (res.data.status) {
                    let Exibitionvalue = values;
                    Exibitionvalue.Image = res.data?.Image;
                    addExhibitionAPI(Exibitionvalue).then((res) => {
                        if (res.data.status) {
                            showToast(res.data.message);
                            handleClose();
                            setEventsLoading(false)
                        } else {
                            showErroToast(res.data.message);
                            setEventsLoading(false)
                        }
                    })
                } else {
                    showErroToast(res.data.message);
                    setEventsLoading(false)
                }
            })
        }
    });
    useEffect(() => {
        if (exibitionGetAPI?.status === "fulfilled") {
            setexibitionState(exibitionGetAPI.data.info)
        }
    }, [exibitionGetAPI])
    const deleteExhibition = (id) => {
        deleteExhibitionAPI({
            Id: id
        }).then((res) => {
            if (res.data.status) {
                showToast(res.data.message)
                exibitionGetAPI.refetch()
            } else {
                showErroToast(res.data.message)
            }
        })
    }
    const eventEditSchema = Yup.object().shape({
        Title: Yup.string()
            .min(5, 'Title must be atleast 5 letters')
            .max(20, 'Title  must be minimum 20 letters')
            .required('Title is required'),
        Type: Yup.string()
            .min(4, 'Type  must be atleast 10 letters')
            .max(50, 'Type  must be minimum 50 letters')
            .required('Type  is required'),
        Year: Yup.string()
            .min(4, 'Year  must be atleast 10 letters')
            .max(50, 'Year  must be minimum 50 letters')
            .required('Year  is required'),
        Institude: Yup.string()
            .min(4, 'Institute  must be atleast 10 letters')
            .max(50, 'Institute  must be minimum 50 letters')
            .required('Institute  is required'),
        Location: Yup.string()
            .min(4, 'Location  must be atleast 10 letters')
            .max(50, 'Location  must be minimum 50 letters')
            .required('Location  is required'),
        Image: Yup.mixed().test('fileSize', 'File size is too large', (value) => {
            if (value !== undefined) {
                return value && value.size <= 10485760; // 10MB
            } else {
                return true;
            }
        }).test('fileType', 'Unsupported file format', (value) => {
            if (value !== undefined) {
                return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            } else {
                return true;
            }
        }),
    });
    const eventsEditFormik = useFormik({
        initialValues: {
            Id: "",
            Title: "",
            Type: "",
            Year: 0,
            Institude: "",
            Location: "",
            Image: null
        },
        validationSchema: eventEditSchema,
        onSubmit: values => {
            if (values.Image === undefined) {
                let Exibitionvalue = values;
                delete Exibitionvalue.Image;
                editExhibitionAPI(Exibitionvalue).then((res) => {
                    if (res.data.status) {
                        showToast(res.data.message);
                        handleClose();
                    } else {
                        showErroToast(res.data.message);
                    }
                    handleEditClose();
                    exibitionGetAPI.refetch()
                })
            } else {
                let formdata = new FormData();
                formdata.append('Type', 'Exhibition');
                formdata.append('Image', values.Image);
                addCommonImageAPI(formdata).then((res) => {
                    if (res.data.status) {
                        let Exibitionvalue = values;
                        Exibitionvalue.Image = res.data?.Image;
                        editExhibitionAPI(Exibitionvalue).then((res) => {
                            if (res.data.status) {
                                showToast(res.data.message);
                                handleClose();
                            } else {
                                showErroToast(res.data.message);
                            }
                            handleEditClose();
                            exibitionGetAPI.refetch()
                        })
                    } else {
                        showErroToast(res.data.message);
                    }
                })
            }

        }
    });
    const getOncExibition = (index) => {
        let editExibitionValue = exibitionState[index]
        eventsEditFormik.setValues({
            Title: editExibitionValue.Title,
            Type: editExibitionValue.Type,
            Year: editExibitionValue.Year,
            Institude: editExibitionValue.Institude,
            Location: editExibitionValue.Location,
            Id: editExibitionValue._id
        })
        handleEditShow()
    }
    const Events = () => {
        return (
            <div className='container events'>
                <div className='d-flex justify-content-end'>
                    <button className='btn btn-secondary' onClick={handleShow}>Add Events</button>
                </div>
                <br />
                {exibitionState.length > 0 && exibitionState.map((exipition, index) => (
                    <Container key={index} className='section-four'>
                        <div className='d-flex justify-content-end'>
                            <button className='btn' onClick={() => { getOncExibition(index) }}><i className='fa fa-edit'></i></button>
                            <button className='btn' onClick={() => deleteExhibition(exipition?._id)}><i className='fa fa-trash'></i></button>
                        </div>
                        <div className='row artistEvent'>
                            <div className='col-lg-6'>
                                <p className='artistEventTitle'>{exipition?.Title}</p>
                                <p className='artistEventPara'>{exipition?.Type}</p>
                                <img src={exipition?.Image} className="artistEventImage" alt="image"></img>
                            </div>
                            <div className='col-lg-6'>
                                <p className='artistEventPara2'>{exipition?.Year} {exipition?.Institude}, {exipition?.Location}</p>
                            </div>
                        </div>
                    </Container>
                ))}

                <Modal className='events-modal' show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Events</Modal.Title>
                        <button type="button" className="btn" aria-label="Close" onClick={handleClose}>X</button>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={eventsFormik.handleSubmit}>
                            <h6>Title</h6>
                            <input name='Title' onChange={eventsFormik.handleChange} type="text" value={eventsFormik.values.Title} />
                            <div className='errors'>{eventsFormik.errors.Title}</div>
                            <br />

                            <h6>Type</h6>
                            <input name='Type' onChange={eventsFormik.handleChange} value={eventsFormik.values.Type} />
                            <div className='errors'>{eventsFormik.errors.Type}</div>
                            <br />

                            <h6>Year</h6>
                            <input name='Year' onChange={eventsFormik.handleChange} value={eventsFormik.values.Year} />
                            <div className='errors'>{eventsFormik.errors.Year}</div>
                            <br />

                            <h6>Institute</h6>
                            <input name='Institude' onChange={eventsFormik.handleChange} value={eventsFormik.values.Institude} />
                            <div className='errors'>{eventsFormik.errors.Institude}</div>
                            <br />

                            <h6>Location</h6>
                            <input name='Location' onChange={eventsFormik.handleChange} value={eventsFormik.values.Location} />
                            <div className='errors'>{eventsFormik.errors.Location}</div>
                            <br />

                            <h6>Image</h6>
                            <input type='file' name='Image' onChange={(e) => {
                                eventsFormik.setFieldValue('Image', e.target.files[0])
                            }} />
                            <div className='errors'>{eventsFormik.errors.Image}</div>
                            <br />

                            <button type='submit' disabled={eventsLoading} className='btn btn-primary'>Update</button>
                        </form>
                    </Modal.Body>

                </Modal>
                <Modal className='events-modal' show={showEdit} onHide={handleEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Events</Modal.Title>
                        <button type="button" className="btn" aria-label="Close" onClick={handleEditClose}>X</button>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={eventsEditFormik.handleSubmit}>
                            <h6>Title</h6>
                            <input name='Title' onChange={eventsEditFormik.handleChange} type="text" value={eventsEditFormik.values.Title} />
                            <div className='errors'>{eventsEditFormik.errors.Title}</div>
                            <br />

                            <h6>Type</h6>
                            <input name='Type' onChange={eventsEditFormik.handleChange} value={eventsEditFormik.values.Type} />
                            <div className='errors'>{eventsEditFormik.errors.Type}</div>
                            <br />

                            <h6>Year</h6>
                            <input name='Year' onChange={eventsEditFormik.handleChange} value={eventsEditFormik.values.Year} />
                            <div className='errors'>{eventsEditFormik.errors.Year}</div>
                            <br />

                            <h6>Institute</h6>
                            <input name='Institude' onChange={eventsEditFormik.handleChange} value={eventsEditFormik.values.Institude} />
                            <div className='errors'>{eventsEditFormik.errors.Institude}</div>
                            <br />

                            <h6>Location</h6>
                            <input name='Location' onChange={eventsEditFormik.handleChange} value={eventsEditFormik.values.Location} />
                            <div className='errors'>{eventsEditFormik.errors.Location}</div>
                            <br />

                            <h6>Image</h6>
                            <input type='file' name='Image' onChange={(e) => {
                                eventsEditFormik.setFieldValue('Image', e.target.files[0])
                            }} />
                            <div className='errors'>{eventsEditFormik.errors.Image}</div>
                            <br />

                            <button type='submit' disabled={reseditExhibitionAPI?.isLoading || resaddCommonImageAPI?.isLoading} className='btn btn-primary'>Update</button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>

        );
    }
    const [showMedia, setShowMedia] = useState(false);
    const handleMediaClose = () => setShowMedia(false);
    const handleMediaShow = () => setShowMedia(true);
    const [showMediaEdit, setShowMediaEdit] = useState(false);
    const handleMediaEditClose = () => setShowMediaEdit(false);
    const handleMediaEditShow = () => setShowMediaEdit(true);
    const mediaSchema = Yup.object().shape({
        Title: Yup.string()
            .min(4, 'Title must be atleast 4 letters')
            .max(50, 'Title  must be minimum 50 letters')
            .required('Title is required'),
        Type: Yup.string()
            .min(4, 'Type  must be atleast 4 letters')
            .max(50, 'Type  must be minimum 50 letters')
            .required('Type  is required'),
        Year: Yup.string()
            .min(4, 'Year  must be atleast 4 letters')
            .max(50, 'Year  must be minimum 50 letters')
            .required('Year  is required'),
        Author: Yup.string()
            .min(4, 'Author  must be atleast 4 letters')
            .max(50, 'Author  must be minimum 50 letters')
            .required('Author  is required'),
        Published: Yup.string()
            .min(4, 'Published  must be atleast 4 letters')
            .max(50, 'Published  must be minimum 50 letters')
            .required('Published  is required'),
        Description: Yup.string()
            .min(100, 'Published  must be atleast 100 letters')

            .required('Published  is required'),
        Link: Yup.string()
            .matches(
                /^(https?:\/\/|www\.)/,
                'Enter correct url!'
            )
            .required('Link URL is required'),
        Image: Yup.mixed().required('Please select a file').test('fileSize', 'File size is too large', (value) => {
            return value && value.size <= 10485760; // 10MB
        }).test('fileType', 'Unsupported file format', (value) => {
            return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
        }),
    });
    const mediaFormik = useFormik({
        initialValues: {
            Title: "",
            Type: "",
            Year: 0,
            Author: "",
            Published: "",
            Link: "",
            Description: "",
            Image: null
        },
        validationSchema: mediaSchema,
        onSubmit: values => {
            let formdata = new FormData();
            formdata.append('Type', 'Media');
            formdata.append('Image', values.Image);
            addCommonImageAPI(formdata).then((res) => {
                if (res.data.status) {
                    let meidaValue = values;
                    meidaValue.Image = res.data?.Image;
                    addMediaPublicationsAPI(meidaValue).then((res) => {
                        if (res.data.status) {
                            showToast(res.data.message);
                            handleMediaClose();
                        } else {
                            showErroToast(res.data.message);
                        }
                        MediaPublicationsGetAPI.refetch();
                    })
                } else {
                    showErroToast(res.data.message);
                }
            })
        }
    });
    useEffect(() => {
        if (MediaPublicationsGetAPI?.status === "fulfilled") {
            setMediaPublicationsState(MediaPublicationsGetAPI.data.info)
        }
    }, [MediaPublicationsGetAPI]);
    const MediaEditSchema = Yup.object().shape({
        Title: Yup.string()
            .min(4, 'Title must be atleast 4 letters')
            .max(50, 'Title  must be minimum 50 letters')
            .required('Title is required'),
        Type: Yup.string()
            .min(4, 'Type  must be atleast 4 letters')
            .max(50, 'Type  must be minimum 50 letters')
            .required('Type  is required'),
        Year: Yup.string()
            .min(4, 'Year  must be atleast 4 letters')
            .max(50, 'Year  must be minimum 50 letters')
            .required('Year  is required'),
        Author: Yup.string()
            .min(4, 'Author  must be atleast 4 letters')
            .max(50, 'Author  must be minimum 50 letters')
            .required('Author  is required'),
        Published: Yup.string()
            .min(4, 'Published  must be atleast 4 letters')
            .max(50, 'Published  must be minimum 50 letters')
            .required('Published  is required'),
        Description: Yup.string()
            .min(100, 'Published  must be atleast 100 letters')

            .required('Published  is required'),
        Link: Yup.string()
            .matches(
                /^(https?:\/\/|www\.)/,
                'Enter correct url!'
            )
            .required('Link URL is required'),
        Image: Yup.mixed().test('fileSize', 'File size is too large', (value) => {
            if (value !== undefined) {
                return value && value.size <= 10485760; // 10MB
            } else {
                return true;
            }
        }).test('fileType', 'Unsupported file format', (value) => {
            if (value !== undefined) {
                return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            } else {
                return true;
            }
        }),
    });
    const MediaEditFormik = useFormik({
        initialValues: {
            Id: "",
            Title: "",
            Type: "",
            Year: 0,
            Author: "",
            Published: "",
            Link: "",
            Description: "",
            Image: null
        },
        validationSchema: MediaEditSchema,
        onSubmit: values => {
            if (values.Image === undefined) {
                let Exibitionvalue = values;
                delete Exibitionvalue.Image;
                editMediaAPI(Exibitionvalue).then((res) => {
                    if (res.data.status) {
                        showToast(res.data.message);

                    } else {
                        showErroToast(res.data.message);
                    }
                    handleMediaEditClose();
                    MediaPublicationsGetAPI.refetch()
                })
            } else {
                let formdata = new FormData();
                formdata.append('Type', 'Media');
                formdata.append('Image', values.Image);
                addCommonImageAPI(formdata).then((res) => {
                    if (res.data.status) {
                        let Exibitionvalue = values;
                        Exibitionvalue.Image = res.data?.Image;
                        editMediaAPI(Exibitionvalue).then((res) => {
                            if (res.data.status) {
                                showToast(res.data.message);

                            } else {
                                showErroToast(res.data.message);
                            }
                            handleMediaEditClose();
                            MediaPublicationsGetAPI.refetch()
                        })
                    } else {
                        showErroToast(res.data.message);
                    }
                })
            }

        }
    });
    const getOneMedia = (index) => {
        let editMediaPublicationsValue = MediaPublicationsState[index];
        MediaEditFormik.setValues({
            Title: editMediaPublicationsValue.Title,
            Type: editMediaPublicationsValue.Type,
            Year: editMediaPublicationsValue.Year,
            Author: editMediaPublicationsValue.Author,
            Published: editMediaPublicationsValue.Published,
            Link: editMediaPublicationsValue.Link,
            Id: editMediaPublicationsValue._id,
            Description: editMediaPublicationsValue.Description
        });
        handleMediaEditShow()
    }
    const deleteMedia = (id) => {
        deleteMediaAPI({
            Id: id
        }).then((res) => {
            if (res.data.status) {
                showToast(res.data.message)
                MediaPublicationsGetAPI.refetch()
            } else {
                showErroToast(res.data.message)
            }
        })
    }
    const Media = () => {
        return (
            <div className='container events'>
                <div className='d-flex justify-content-end'>
                    <button className='btn btn-secondary' onClick={handleMediaShow}>Add Media</button>
                </div>
                <br />
                {MediaPublicationsState.length > 0 && MediaPublicationsState.map((media, index) => (
                    <>
                        <Container key={index} className='section-four'>
                            <div className='row'>
                                <div className='d-flex justify-content-end'>
                                    <button className='btn' onClick={() => { getOneMedia(index) }}><i className='fa fa-edit'></i></button>
                                    <button className='btn' onClick={() => deleteMedia(media?._id)}><i className='fa fa-trash'></i></button>
                                </div>
                                <div className='col-lg-4 artistMediaImage'
                                    style={{ backgroundImage: `url(${media?.Image})` }}
                                >
                                    <p>{media?.Type}</p>
                                </div>
                                <div className='col-lg-8'>
                                    <p className='artistMediaContent'>{media?.Title}</p>
                                    <p className='artistMediaContentTwo'>{media?.Description}</p>
                                </div>
                            </div>
                        </Container>
                        <br />
                    </>
                ))}

                <Modal className='events-modal' show={showMedia} onHide={handleMediaClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Media</Modal.Title>
                        <button type="button" className="btn" aria-label="Close" onClick={handleMediaClose}>X</button>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={mediaFormik.handleSubmit}>
                            <h6>Title</h6>
                            <input name='Title' onChange={mediaFormik.handleChange} type="text" value={mediaFormik.values.Title} />
                            <div className='errors'>{mediaFormik.errors.Title}</div>
                            <br />

                            <h6>Type</h6>
                            <input name='Type' onChange={mediaFormik.handleChange} value={mediaFormik.values.Type} />
                            <div className='errors'>{mediaFormik.errors.Type}</div>
                            <br />

                            <h6>Year</h6>
                            <input name='Year' onChange={mediaFormik.handleChange} value={mediaFormik.values.Year} />
                            <div className='errors'>{mediaFormik.errors.Year}</div>
                            <br />

                            <h6>Author</h6>
                            <input name='Author' onChange={mediaFormik.handleChange} value={mediaFormik.values.Author} />
                            <div className='errors'>{mediaFormik.errors.Author}</div>
                            <br />

                            <h6>Published</h6>
                            <input name='Published' onChange={mediaFormik.handleChange} value={mediaFormik.values.Published} />
                            <div className='errors'>{mediaFormik.errors.Published}</div>
                            <br />
                            <h6>Description</h6>
                            <textarea name='Description' onChange={mediaFormik.handleChange} value={mediaFormik.values.Description} />
                            <div className='errors'>{mediaFormik.errors.Description}</div>
                            <br />
                            <h6>Link</h6>
                            <input name='Link' onChange={mediaFormik.handleChange} value={mediaFormik.values.Link} />
                            <div className='errors'>{mediaFormik.errors.Link}</div>
                            <br />

                            <h6>Image</h6>
                            <input type='file' name='Image' onChange={(e) => {
                                mediaFormik.setFieldValue('Image', e.target.files[0])
                            }} />
                            <div className='errors'>{mediaFormik.errors.Image}</div>
                            <br />

                            <button type='submit' disabled={resAddMediaPublicationsAPI.isLoading || resaddCommonImageAPI.isLoading} className='btn btn-primary'>Update</button>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal className='events-modal' show={showMediaEdit} onHide={handleMediaEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Media</Modal.Title>
                        <button type="button" className="btn" aria-label="Close" onClick={handleMediaEditClose}>X</button>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={MediaEditFormik.handleSubmit}>
                            <h6>Title</h6>
                            <input name='Title' onChange={MediaEditFormik.handleChange} type="text" value={MediaEditFormik.values.Title} />
                            <div className='errors'>{MediaEditFormik.errors.Title}</div>
                            <br />

                            <h6>Type</h6>
                            <input name='Type' onChange={MediaEditFormik.handleChange} value={MediaEditFormik.values.Type} />
                            <div className='errors'>{MediaEditFormik.errors.Type}</div>
                            <br />

                            <h6>Year</h6>
                            <input name='Year' onChange={MediaEditFormik.handleChange} value={MediaEditFormik.values.Year} />
                            <div className='errors'>{MediaEditFormik.errors.Year}</div>
                            <br />

                            <h6>Author</h6>
                            <input name='Author' onChange={MediaEditFormik.handleChange} value={MediaEditFormik.values.Author} />
                            <div className='errors'>{MediaEditFormik.errors.Author}</div>
                            <br />

                            <h6>Published</h6>
                            <input name='Published' onChange={MediaEditFormik.handleChange} value={MediaEditFormik.values.Published} />
                            <div className='errors'>{MediaEditFormik.errors.Published}</div>
                            <br />
                            <h6>Description</h6>
                            <textarea name='Description' onChange={MediaEditFormik.handleChange} value={MediaEditFormik.values.Description} />
                            <div className='errors'>{MediaEditFormik.errors.Description}</div>
                            <br />
                            <h6>Link</h6>
                            <input name='Link' onChange={MediaEditFormik.handleChange} value={MediaEditFormik.values.Link} />
                            <div className='errors'>{MediaEditFormik.errors.Link}</div>
                            <br />

                            <h6>Image</h6>
                            <input type='file' name='Image' onChange={(e) => {
                                MediaEditFormik.setFieldValue('Image', e.target.files[0])
                            }} />
                            <div className='errors'>{MediaEditFormik.errors.Image}</div>
                            <br />

                            <button type='submit' disabled={reseditExhibitionAPI?.isLoading || resaddCommonImageAPI?.isLoading} className='btn btn-primary'>Update</button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
    const [showTestimonials, setShowTestimonials] = useState(false);
    const handleTestimonialsClose = () => setShowTestimonials(false);
    const handleTestimonialsShow = () => setShowTestimonials(true);
    const [showTestimonialsEdit, setShowTestimonialsEdit] = useState(false);
    const handleTestimonialsEditClose = () => setShowTestimonialsEdit(false);
    const handleTestimonialsEditShow = () => setShowTestimonialsEdit(true);
    const TestimonialsSchema = Yup.object().shape({
        Provider: Yup.string()
            .min(4, 'Provider must be atleast 4 letters')
            .max(50, 'Provider  must be minimum 50 letters')
            .required('Provider is required'),
        Description: Yup.string()
            .min(4, 'Description  must be atleast 4 letters')
            .min(20, 'Description  must be atleast 20 letters')
            .required('Published  is required'),
    });
    const testimonialsFormik = useFormik({
        initialValues: {
            Provider: "",
            Description: "",
        },
        validationSchema: TestimonialsSchema,
        onSubmit: values => {
            addTestimonialsAPI(values).then((res) => {
                if (res.data.status) {
                    showToast(res.data.message);
                    handleTestimonialsClose();
                } else {
                    showErroToast(res.data.message);
                }
                testimonialsGetAPI.refetch();
            })
        }
    });
    useEffect(() => {
        if (testimonialsGetAPI?.status === "fulfilled") {
            settestimonialsState(testimonialsGetAPI.data.info)
        }
    }, [testimonialsGetAPI]);
    const testimonialsEditSchema = Yup.object().shape({
        Provider: Yup.string()
            .min(4, 'Provider must be atleast 4 letters')
            .max(50, 'Provider  must be minimum 50 letters')
            .required('Provider is required'),
        Description: Yup.string()
            .min(4, 'Description  must be atleast 4 letters')
            .min(20, 'Description  must be atleast 20 letters')
            .required('Description  is required'),
    });
    const testimonialsEditFormik = useFormik({
        initialValues: {
            Id: "",
            Provider: "",
            Description: "",
        },
        validationSchema: testimonialsEditSchema,
        onSubmit: values => {
            editTestimonialsAPI(values).then((res) => {
                if (res.data.status) {
                    showToast(res.data.message);

                } else {
                    showErroToast(res.data.message);
                }
                handleTestimonialsEditClose();
                testimonialsGetAPI.refetch()
            })
        }
    });
    const getOnetestimonial = (index) => {
        let edittestimonialsStateValue = testimonialsState[index];
        testimonialsEditFormik.setValues({
            Provider: edittestimonialsStateValue.Provider,
            Id: edittestimonialsStateValue._id,
            Description: edittestimonialsStateValue.Description
        });
        handleTestimonialsEditShow()
    }
    const deleteTestimonial = (id) => {
        deleteTestimonialsAPI({
            Id: id
        }).then((res) => {
            if (res.data.status) {
                showToast(res.data.message)
                testimonialsGetAPI.refetch()
            } else {
                showErroToast(res.data.message)
            }
        })
    }
    const Testimonials = () => {
        return (
            <div className='container events'>
                <div className='d-flex justify-content-end'>
                    <button className='btn btn-secondary' onClick={handleTestimonialsShow}>Add Testimonials</button>
                </div>
                <br />
                {testimonialsState.length > 0 && testimonialsState.map((testimonial, index) => (
                    <>
                        <Container key={index} className='section-four'>
                            <div className='row'>
                                <div className='d-flex justify-content-end'>
                                    <button className='btn' onClick={() => { getOnetestimonial(index) }}><i className='fa fa-edit'></i></button>
                                    <button className='btn' onClick={() => deleteTestimonial(testimonial?._id)}><i className='fa fa-trash'></i></button>
                                </div>
                                <div className='col-lg-12'>
                                    <p className='artistMediaContent'>{testimonial?.Provider}</p>
                                    <p className='artistMediaContentTwo'>{testimonial?.Description}</p>
                                </div>
                            </div>
                        </Container>
                        <br />
                    </>
                ))}

                <Modal className='events-modal' show={showTestimonials} onHide={handleTestimonialsClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Testimonials</Modal.Title>
                        <button type="button" className="btn" aria-label="Close" onClick={handleTestimonialsClose}>X</button>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={testimonialsFormik.handleSubmit}>
                            <h6>Provider</h6>
                            <input name='Provider' onChange={testimonialsFormik.handleChange} type="text" value={testimonialsFormik.values.Provider} />
                            <div className='errors'>{testimonialsFormik.errors.Provider}</div>
                            <br />
                            <h6>Description</h6>
                            <textarea name='Description' onChange={testimonialsFormik.handleChange} value={testimonialsFormik.values.Description} />
                            <div className='errors'>{testimonialsFormik.errors.Description}</div>
                            <br />
                            <button type='submit' disabled={resAddTestimonialsAPI.isLoading} className='btn btn-primary'>Update</button>
                        </form>
                    </Modal.Body>

                </Modal>
                <Modal className='events-modal' show={showTestimonialsEdit} onHide={handleTestimonialsEditClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Testimonials</Modal.Title>
                        <button type="button" className="btn" aria-label="Close" onClick={handleTestimonialsEditClose}>X</button>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={testimonialsEditFormik.handleSubmit}>
                            <h6>Provider</h6>
                            <input name='Provider' onChange={testimonialsEditFormik.handleChange} type="text" value={testimonialsEditFormik.values.Provider} />
                            <div className='errors'>{testimonialsEditFormik.errors.Provider}</div>
                            <br />
                            <h6>Description</h6>
                            <textarea name='Description' onChange={testimonialsEditFormik.handleChange} value={testimonialsEditFormik.values.Description} />
                            <div className='errors'>{testimonialsEditFormik.errors.Description}</div>
                            <br />
                            <button type='submit' disabled={resEditTestimonialsAPI?.isLoading} className='btn btn-primary'>Update</button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }

    const buttonStyle = {
        height: '40px',
        borderRadius: '20px',
        fontSize: '16px',
        color: '#fff',
        cursor: 'pointer',
        backgroundColor: isOn ? '#ff6347' : '#32cd32',
    };
    return (
        <>
            <Container fluid className='artistUserImage no-padding'>
                <video loop className='profile-cover-video' autoPlay muted src={profileState?.CoverVideo}></video>
                <div className='profile-info-section'>
                    <div className='row d-flex align-items-center justify-content-center artistUserImageContent'>
                        <div className='col-lg-4 d-flex align-items-center justify-content-center'>
                            <img src={profileState?.ProfilePicture} width="200px" height="250px" className="artistPerson" alt="img"></img>
                        </div>
                        <div className='col-lg-8'>
                            <div className='d-flex justify-content-end'>
                                <Link to="/myprofile/edit" className='btn btn-secondary'>Edit Profile</Link>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                <Link to="/myprofile/address" className='btn btn-secondary'>Edit Address</Link>
                            </div>
                            <br />
                            <br />
                            <div className='artistBorder'>
                                <p>{sessionStorage.getItem('role')}</p>
                            </div>
                            <div className='artistContent'>
                                <p className='artistContentTitle'>{profileState?.ProfileName}</p>
                            </div>
                            <div className='d-flex enable2fa-section'>
                                <button style={buttonStyle} onClick={handleClick}>
                                    {isOn ? 'Disable 2FA' : 'Enable 2FA'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <div >
                <ul className='artistNav'>
                    <li id='1' value="1" className={artist === 1 ? "active" : null} onClick={(e) => setArtist(e.target.value)}>Collected</li>
                    {sessionStorage.getItem('role') !== "Buyer" ? <li id='2' value="2" className={artist === 2 ? "active" : null} onClick={(e) => setArtist(e.target.value)} >My items</li> : null}
                    <li id='3' value="3" className={artist === 3 ? "active" : null} onClick={(e) => setArtist(e.target.value)}>Bio</li>
                    <li id='4' value="4" className={artist === 4 ? "active" : null} onClick={(e) => setArtist(e.target.value)}>Events</li>
                    <li id='5' value="5" className={artist === 5 ? "active" : null} onClick={(e) => setArtist(e.target.value)}>Media</li>
                    <li id='6' value="6" className={artist === 6 ? "active" : null} onClick={(e) => setArtist(e.target.value)}>Testimonials</li>
                </ul>
            </div>
            {artist === 1 ? <ArtistArt></ArtistArt> : null}
            {artist === 2 ? <ArtistBio></ArtistBio> : null}
            {artist === 3 ? BioAddEdit() : null}
            {artist === 4 ? Events() : null}
            {artist === 5 ? Media() : null}
            {artist === 6 ? Testimonials() : null}

            {apiLoading ? <LoadingScreen/> : null}

        </>
    )
}

export default Myprofile;