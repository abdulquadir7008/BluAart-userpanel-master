import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import "../../styles/profile.css";
import Accordion from 'react-bootstrap/Accordion';

import socialArrow from "../../assets/social-arrow.png"
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import {
    useGetArtistCategoriesQuery, useGetProfileInfoQuery, useGetArtistMediumQuery,
    useGetArtistLabelsQuery
} from '../../service/Apilist'
function ProfileEdit() {
    
    const [apiLoading, setAPILoading] = useState(false);
    const [artistCategoryState, resartistCategoryState] = useState([]);
    const [artistLabelState, resartistLabelState] = useState([]);
    const [artistMediumState, resartistMediumState] = useState([]);
    
    
    const [profileState, setprofileState] = useState({});
    const [selectedArtworkImage, setSelectedArtworkImage] = useState('');

    
    const videoRef = useRef(null);
    let navigate = useNavigate();
   
    const getStyles = useGetArtistCategoriesQuery()
    const getArtistMedium = useGetArtistMediumQuery()
    const profileInfo = useGetProfileInfoQuery();
    const artistLabel = useGetArtistLabelsQuery();
    useEffect(() => {
        if (getStyles?.status === 'fulfilled') {
            resartistCategoryState(getStyles?.data?.data);
        }
    }, [getStyles])
    useEffect(() => {
        if (artistLabel?.status === 'fulfilled') {
            resartistLabelState(artistLabel?.data?.data);
        }
    }, [artistLabel])
    useEffect(() => {
        if (getArtistMedium?.status === 'fulfilled') {
            resartistMediumState(getArtistMedium?.data?.data);
        }
    }, [getArtistMedium])
    const [styleCheckboxState, setStyleCheckboxState] = useState([]);
    const [mediumCheckboxState, setmediumCheckboxState] = useState([]);
    const ProfileUpdateSchema = Yup.object().shape({
        Profilename: Yup.string()
            .min(4, 'Profilename must be atleast four letters')
            .max(50, 'Profilename must be minimum 50 letters')
            .required('Profilename is required'),
        coverVideo: Yup.mixed().test(
            'fileFormat',
            'Only the following formats are accepted: .mp4',
            (value) => {

                if (!value) return true;
                return ['video/mp4'].includes(value.type);
            },
        ),
        ProfileImage: Yup.mixed()
            .test(
                'fileFormat',
                'Only the following formats are accepted: .jpeg, .jpg and png',
                (value) => {
                    if (!value) return true;
                    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
                },
            ),
        ArtWork: Yup.mixed()
            .nullable()
            .test(
                'fileFormat',
                'Only the following formats are accepted: .jpeg, .jpg and png',
                (value) => {
                    if (!value) return true;
                    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
                },
            ),
        UrlLink: Yup.array().of(
            Yup.string()
        ),
        styles: Yup.array().of(
            Yup.string()
        ),
        Label: Yup.string().test(
            'Artist lable',
            'Label is required',
            (value) => {
                if (sessionStorage.getItem('role') === "Artist") {
                    if (!value){
                        return false
                    }else{
                        return true;
                    }
                } else {
                    if (!value) return true;
                }
            },),
        Medium: Yup.array().of(
            Yup.string()
        )
    });
    const updateProfile = async (formdata) => {
        const response = axios.post(`${process.env.REACT_APP_API_URL}/UpdateProfilemedia`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
            }
        })
        response.then(res => {
            setAPILoading(false)
            if (res?.data?.status) {
                profileInfo.refetch();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                showToast(res.data.message);
                navigate("/myprofile");
            } else {
                showErroToast(res?.error?.data?.message);
            }
        }).catch(error => {
            setAPILoading(false)
            showErroToast(error?.response?.data?.message);
            if (error?.response?.data?.message === "Invalid Token or Token Expired") {
                navigate("/myprofile");
            }
        })
    }

    const formik = useFormik({
        initialValues: {
            Profilename: '',
            Label: "",
            coverVideo: null,
            ProfileImage: null,
            ArtWork: null,
            UrlLink: [],
            styles: [],
            Medium: [],
        },
        validationSchema: ProfileUpdateSchema,
        onSubmit: values => {
            setAPILoading(true)
            let formdata = new FormData();
            formdata.append("profileName", values.Profilename);
            if (values.ProfileImage !== undefined) {
                formdata.append("ProfileImage", values.ProfileImage);
            }
            if (values.coverVideo !== undefined) {
                formdata.append("coverVideo", values.coverVideo);
            }
            if (values.ArtWork !== undefined) {
                formdata.append("ArtWork", values.ArtWork);
            }
            if(sessionStorage.getItem('role') === "Artist"){
                formdata.append('Label',values.Label)
            }
            formdata.append("UrlLink", values.UrlLink);
            formdata.append("styles", styleCheckboxState);
            formdata.append("Medium", mediumCheckboxState);
            updateProfile(formdata);
        },
    });

    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(error => {
            });
    };

    const styleCheckbox = (value, checked) => {
        if (checked) {
            setStyleCheckboxState([...styleCheckboxState, value]);
        } else {
            setStyleCheckboxState(styleCheckboxState.filter((element) => element !== value));
        }
    };

    const mediumCheckbox = (value, checked) => {
        if (checked) {
            setmediumCheckboxState([...mediumCheckboxState, value]);
        } else {
            setmediumCheckboxState(mediumCheckboxState.filter(item => item !== value));
        }
    };
    const [image, setImage] = useState(null);
    const [cropper, setCropper] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedFile, setCroppedFile] = useState(null);
    const onSelectFile = (event) => {
        let file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.addEventListener("load", () => {
            setImage(reader.result)
        })
    }
    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const getCroppedImg = (imageSrc, croppedAreaPixels) => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const image = new Image();
            image.src = imageSrc;
            image.onload = () => {
                canvas.width = croppedAreaPixels.width;
                canvas.height = croppedAreaPixels.height;

                ctx.drawImage(
                    image,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0
                    ,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height
                );

                canvas.toBlob(() => {
                    resolve(canvas.toDataURL('image/png'));
                }, 'image/png');
            };

            image.onerror = (error) => {
                reject(error);
            };
        });
    };
    
    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            
            setCroppedFile(croppedImage);
            fetch(croppedImage)
                .then(res => res.blob())
                .then(blob => {
                    let name = blob.type.split('/')[1]
                    const file = new File([blob], "File name." + name, { type: blob.type });
                    formik.setFieldValue('ProfileImage', file);
                })
            setImage(null);
        } catch (error) {
        }
    };
    useEffect(() => {
        if (profileInfo?.status === "fulfilled") {
            if (profileInfo?.data?.info) {
                setprofileState(profileInfo?.data?.info[0]);

                formik.setValues({
                    Profilename: profileInfo?.data?.info[0].ProfileName,
                    UrlLink: profileInfo.data?.info[0].UrlLink.length > 0 ? profileInfo.data?.info[0].UrlLink[0].split(',') : [],
                    Label:profileInfo.data?.info[0]?.Label
                })
                setStyleCheckboxState(profileInfo.data?.info[0].Styles);
                setmediumCheckboxState(profileInfo.data?.info[0].Medium);
            }
        }
    }, [profileInfo])
    
    useEffect(() => {
        if (profileState?.ArtWork) {
            setSelectedArtworkImage(profileState.ArtWork);
        }
    }, [profileState?.ArtWork]);

    const handleArtworkImageChange = (e) => {
        formik.setFieldValue('ArtWork', e.currentTarget.files[0]);
        // Update the selected image state
        setSelectedArtworkImage(URL.createObjectURL(e.currentTarget.files[0]));
    };

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className='profile-update'>
                    <div className='upload-banner-input update video-container'>
                        <video className='banner-cover-video' autoPlay loop muted src={profileState.CoverVideo} ></video>
                        <center>
                            <div className="overlay-div">
                                <h1>UPLOAD COVER VIDEO &nbsp; {sessionStorage.getItem('registerRole') === 'Buyer' ? "(Optional)" : null }</h1>
                                <p>W 1440 X H 507</p>
                                <input name='coverVideo' onChange={(e) => {
                                    formik.setFieldValue('coverVideo', e.currentTarget.files[0])
                                }} type="file" id="file-input" />
                                <label htmlFor="file-input" className="custom-file-upload">
                                </label>
                                <div className='errors' >{formik.errors.coverVideo}</div>
                            </div>
                        </center>
                        

                    </div>
                    <div className='upload-profile-input'>
                        <center>
                            <div className='upload-profile-section' style={{ background: croppedFile ? `url(${croppedFile})` : `url(${profileState.ProfilePicture})` }}>
                                <div className='upload-section'>
                                    <h1>UPLOAD PROFILE PICTURE &nbsp; {sessionStorage.getItem('registerRole') === 'Buyer' ? "(Optional)" : null }</h1>
                                    <input name='ProfileImage' onChange={onSelectFile} type="file" id="file-input-profile" />
                                    <label htmlFor="file-input-profile" className="custom-file-upload-profile">
                                    </label>
                                    <div onClick={startCamera} className='profile-camera-icon'>
                                    </div>
                                </div>
                            </div>
                            <div className='errors' style={{ textAlign: "center" }} >{formik.errors.ProfileImage}</div>

                            {image !== null ? <div className="crop-container"> <Cropper onInitialized={(instance) => {
                                setCropper(instance);
                            }} image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={handleCropComplete} /> </div> : null}

                            {image !== null ? <div className="controls">
                                <input type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => {
                                        setZoom(e.target.value)
                                    }}
                                    className="range-input"
                                />
                                <br />
                                <button type='button' className='croper-crop-image btn btn-primary' onClick={() => handleCropSave()}>Save Crop</button>
                            </div> : null}
                            <Container fluid className='profile-form-section'>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <p>Creating a detailed profile, including details of your artistic career, gives the collector a better perspective of your art, history and pricing and increases the chances of closing a sale. Please follow through the tabs to complete your profile. You can save and come back anytime to edit or add information.</p>
                                    </div>
                                </div>
                                <div className='col-lg-6' >
                                    <h1 className='profile-form-title'>Add your Full Name & Alias Name</h1>
                                    <div className='profile-form'>
                                        <div className="form-group">
                                            <label htmlFor="inputName">Full Name</label>
                                            <input name='Profilename' onChange={formik.handleChange} value={formik.values.Profilename} type="text" className="form-control" id="inputName" />
                                        </div>
                                        <div className='errors'>{formik.errors.Profilename}</div>
                                    </div>
                                </div>
                                <br />
                                {sessionStorage.getItem('role') === "Artist" && <div className='col-lg-6' >
                                    <h1 className='profile-form-title'>Add your Label</h1>
                                    <div className='profile-form'>
                                        <div className="form-group">
                                            <label htmlFor="inputName">Label</label>
                                            <select onChange={formik.handleChange} className='form-control' name='Label'>
                                                <option>----</option>
                                                {artistLabelState?.length > 0 && artistLabelState?.map((label) => (
                                                    <option selected={formik.values.Label === label?._id} value={label?._id}>{label?.Title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='errors'>{formik.errors.Label}</div>
                                    </div>
                                </div>}

                            </Container>
                            {sessionStorage.getItem("registerRole") !== "Buyer" &&
                                <>
                                    <Container className='profile-style-section'>
                                        <div className='col-lg-12'>
                                            <p>Select the Style best describing your art. You can choose maximum five
                                                Styles. If your Style is not among the options,
                                                choose the nearest option and drop us an email. Click to Mail</p>
                                        </div>
                                        <div className='col-lg-4'>
                                            <Accordion >
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>Styles</Accordion.Header>
                                                    <Accordion.Body>
                                                        <ul className='profile-ul-tag'>
                                                            {artistCategoryState?.length > 0 && artistCategoryState?.map((category) => (
                                                                <li className='profile-style-options'>
                                                                    <label id='painting'>{category?.Title}</label>
                                                                    <input checked={styleCheckboxState.includes(Number(category?._id))} onChange={(e) => {
                                                                        styleCheckbox(Number(category?._id), e.target.checked);
                                                                    }
                                                                    } htmlFor="painting" type="checkbox" />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </div>
                                    </Container>
                                    <Container className='profile-style-section'>
                                        <div className='col-lg-12'>
                                            <p>Select your preferred Art Medium. You can choose up to three Media.
                                                If the Medium you are looking for is not available, drop us an email.
                                                Click to Mail</p>
                                        </div>
                                        <div className='col-lg-4'>
                                            <Accordion >
                                                <Accordion.Item eventKey="0">
                                                    <Accordion.Header>Medium</Accordion.Header>
                                                    <Accordion.Body>
                                                        <ul className='profile-ul-tag'>
                                                            {artistMediumState.length > 0 && artistMediumState.map((medium) => (
                                                                <li className='profile-style-options'>
                                                                    <label id='abstract'>{medium.Title}</label>
                                                                    <input checked={mediumCheckboxState.includes(Number(medium._id))} onClick={(e) => {
                                                                        mediumCheckbox(Number(medium._id), e.target.checked)
                                                                    }}
                                                                        htmlFor="abstract" type="checkbox" />
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </div>
                                    </Container>
                                    <Container className='profile-style-section'>
                                        <div className='col-lg-8'>
                                            <p>Upload any one Artwork Image, representing your
                                                most preferred style of work</p>
                                        </div>
                                        <div className='col-lg-4 offset-lg-2'>
                                            <div className="artWork-file-input" 
                                             style={{
                                                width: '197px', height: '196px',
                                                  background: selectedArtworkImage !== "" ? `url(${selectedArtworkImage})` : `url(${profileState?.ArtWork})`
                                            }}
                                            >
                                            <input name='ArtWork' 
                                                            onChange={handleArtworkImageChange}

                                            
                                             type="file" id="file-input-ArtWork" />
                                            <label htmlFor="file-input-ArtWork" 
                                            className="custom-file-upload-profile"
                                            >
                                            </label>
                                            </div>
                                        </div>
                                    </Container>
                                </>
                            }
                            <Container className='social-media-section'>
                                <div className='col-lg-8'>
                                    <p>Add your Personal Website and Social Media links (URL).</p>
                                </div>
                                <div className='col-lg-6'>
                                    <div className='d-flex social-input'>
                                        <img src={socialArrow} alt='social-icon'/>
                                        <input name='UrlLink[0]' onChange={formik.handleChange} value={formik.values.UrlLink[0]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon' />
                                        <input name='UrlLink[1]' onChange={formik.handleChange} value={formik.values.UrlLink[1]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon' />
                                        <input name='UrlLink[2]' onChange={formik.handleChange} value={formik.values.UrlLink[2]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon' />
                                        <input name='UrlLink[3]' onChange={formik.handleChange} value={formik.values.UrlLink[3]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon' />
                                        <input name='UrlLink[4]' onChange={formik.handleChange} value={formik.values.UrlLink[4]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon' />
                                        <input name='UrlLink[5]' onChange={formik.handleChange} value={formik.values.UrlLink[5]} type="text" />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center'>

                                    {apiLoading ? <button className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button> :
                                        <button type='submit' className="submit btn btn-primary">Update</button>}
                                </div>
                            </Container>
                        </center>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ProfileEdit;