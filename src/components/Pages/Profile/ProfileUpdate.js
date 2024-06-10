import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import "../../../styles/profile.css";
import Accordion from 'react-bootstrap/Accordion';

import socialArrow from "../../../assets/social-arrow.png"
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import { useGetArtistCategoriesQuery, useGetArtistLabelsQuery, useGetArtistMediumQuery } from '../../../service/Apilist'
function ProfileUpdate(props) {
    const storedData = sessionStorage.getItem("registerToken");
    const [apiLoading, setAPILoading] = useState(false);
    const [artistCategoryState, resartistCategoryState] = useState([]);
    const [artistLabelState, resartistLabelState] = useState([]);
    const [artistMediumState, resartistMediumState] = useState([]);
    const artistLabel = useGetArtistLabelsQuery();
    const getArtistMedium = useGetArtistMediumQuery()
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
   
    const videoRef = useRef(null);
    let navigate = useNavigate();
    function goBack() {
        navigate("/")
    }
    const getStyles = useGetArtistCategoriesQuery()
    useEffect(() => {
        if (getStyles?.status === 'fulfilled') {
            resartistCategoryState(getStyles?.data?.data);
        }
    }, [getStyles])
    const [styleCheckboxState, setStyleCheckboxState] = useState([]);
    const [mediumCheckboxState, setmediumCheckboxState] = useState([]);
    const ProfileUpdateSchema = Yup.object().shape({
        Profilename: Yup.string()
            .min(4, 'Profilename must be atleast four letters')
            .max(50, 'Profilename must be minimum 50 letters')
            .required('Profilename is required'),
        coverVideo: Yup.mixed().test(
            'required',
            'Cover video is required', (value) => {
                if (!value) {
                    if (sessionStorage.getItem("registerRole") === 'Buyer') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            })
            .test(
                'fileFormat',
                'Only the following formats are accepted: .mp4',
                (value) => {
                    if (!value && sessionStorage.getItem("registerRole") === 'Buyer') {
                        return true;
                    } else {
                        if (!value) return true;
                        return ['video/mp4'].includes(value.type);
                    }

                }
            ),
        ProfileImage: Yup.mixed().test(
            'required',
            'Profile pic is required', (value) => {
                if (!value) {

                    if (sessionStorage.getItem('registerRole') === 'Buyer') {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }).test(
                'fileFormat',
                'Only the following formats are accepted: .jpeg, .jpg and png',
                (value) => {
                    if (!value && sessionStorage.getItem('registerRole') === 'Buyer') {
                        return true;
                    } else {
                        if (!value) return true;
                        return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
                    }
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
                if (sessionStorage.getItem('registerRole') === "Artist") {
                    if (!value) {
                        return false
                    } else {
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
        const response = axios.post(`${process.env.REACT_APP_API_URL}/UpdateRegisterProfilemedia`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        response.then(res => {
            setAPILoading(false)
            console.log("profiletest")
            if (res?.data?.status) {
                showToast(res?.data?.message);
                props.registerSteps(Number(1));
                setTimeout(() => {
                    window.location.replace("/login")
                }, 1500);
            } else {
                showErroToast(res?.error?.data?.message);
            }
        }).catch(error => {
            setAPILoading(false)
            showErroToast(error?.response?.data?.message);
            if (error?.response?.data?.message === "Invalid Token or Token Expired") {
                window.location.replace("/login")
            }
        })
    }

    const formik = useFormik({
        initialValues: {
            Profilename: '',
            Label: "",
            coverVideo: "",
            ProfileImage: "",
            ArtWork: null,
            UrlLink: [],
            styles: [],
            Medium: [],
        },
        validationSchema: ProfileUpdateSchema,
        onSubmit: values => {
            setAPILoading(true)
            let formdata = new FormData();
            if (sessionStorage.getItem('registerRole') === "Artist") {
                formdata.append('Label', values.Label)
            }
            formdata.append("profileName", values.Profilename);
            formdata.append("coverVideo", values.coverVideo);
            formdata.append("ProfileImage", values.ProfileImage);
            formdata.append("Auth", storedData);
            formdata.append("UrlLink", values.UrlLink);
            formdata.append("styles", styleCheckboxState);
            formdata.append("Medium", mediumCheckboxState);
            formdata.append("ArtWork", values.ArtWork);
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
            let updatedArray = styleCheckboxState.filter(item => item !== value);
            setStyleCheckboxState(updatedArray);
        }
    };
    const mediumCheckbox = (value, checked) => {
        if (checked) {
            setmediumCheckboxState([...mediumCheckboxState, value]);
        } else {
            let updatedArray = mediumCheckboxState.filter(item => item !== value);
            setmediumCheckboxState(updatedArray);
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
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.addEventListener("load", () => {
                setImage(reader.result)
            })
        }else{
            showErroToast("Please select image file")
        }
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
   

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
                <div className='profile-update'>
                    <div className='upload-banner-input'>
                        <center>
                            <h1>UPLOAD COVER VIDEO &nbsp; {sessionStorage.getItem('registerRole') === 'Buyer' ? "(Optional)" : null}</h1>
                            <p>W 1440 X H 507</p>
                            <input name='coverVideo' onChange={(e) => {
                                formik.setFieldValue('coverVideo', e.currentTarget.files[0])
                            }} type="file" id="file-input" />
                            <label htmlFor="file-input" className="custom-file-upload">
                            </label>
                            <div className='errors' >{formik.errors.coverVideo}</div>
                        </center>
                    </div>
                    <div className='upload-profile-input'>
                        <center>
                            <div className='upload-profile-section' style={{ background: croppedFile ? `url(${croppedFile})` : "#084595" }}>
                                <div className='upload-section'>
                                    <h1>UPLOAD PROFILE PICTURE &nbsp;{sessionStorage.getItem('registerRole') === 'Buyer' ? "(Optional)" : null}</h1>
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
                                <button className='croper-crop-image btn btn-primary' onClick={handleCropSave}>Save Crop</button>
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
                                {sessionStorage.getItem('registerRole') === "Artist" && <div className='col-lg-6' >
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
                                                                    <input onClick={(e) => {
                                                                        styleCheckbox(category?._id, e.target.checked);
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
                                                                    <input onClick={(e) => {
                                                                        mediumCheckbox(medium._id, e.target.checked)
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
                                            <input name='ArtWork' onChange={(e) => {
                                                formik.setFieldValue('ArtWork', e.currentTarget.files[0])
                                            }} type="file" id="file-input-ArtWork" />
                                            <label htmlFor="file-input-ArtWork" className="artWork-file-input" 
                                            style={{ backgroundImage: `url('../assets/CardImage.png')` }}>
                                            </label>
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
                                        <img src={socialArrow} alt='social-icon'/>
                                        <input name='UrlLink[1]' onChange={formik.handleChange} value={formik.values.UrlLink[1]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon'/>
                                        <input name='UrlLink[2]' onChange={formik.handleChange} value={formik.values.UrlLink[2]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon'/>
                                        <input name='UrlLink[3]' onChange={formik.handleChange} value={formik.values.UrlLink[3]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon'/>
                                        <input name='UrlLink[4]' onChange={formik.handleChange} value={formik.values.UrlLink[4]} type="text" />
                                    </div>
                                    <div className='d-flex  social-input'>
                                        <img src={socialArrow} alt='social-icon'/>
                                        <input name='UrlLink[5]' onChange={formik.handleChange} value={formik.values.UrlLink[5]} type="text" />
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <button type='button' onClick={() => goBack()} className="cancel btn ">CANCEL</button>
                                    {apiLoading ? <button className="btn btn-primary" type="button" disabled>
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        Loading...
                                    </button> :
                                        <button type='submit' className="submit btn btn-primary">SAVE & CONTINUE</button>}
                                </div>
                            </Container>
                        </center>
                    </div>
                </div>
            </form>
        </>
    );
}

export default ProfileUpdate;