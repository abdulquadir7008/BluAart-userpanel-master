import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import physical from "../../assets/register-bottom-physical.png"
import digtal from "../../assets/register-botton-digital.png"
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetSiteSettingQuery, useRegisterAPIMutation, useGoogleRegisterMutation, useFacebookRegisterMutation } from './../../service/Apilist'
import {
    GoogleReCaptchaProvider,
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { gapi } from 'gapi-script';
import Modal from 'react-bootstrap/Modal';
import LoadingModal from '../Loader/Loading';

function RegisterFrom(props) {
    let navigate = useNavigate();
    function goBack() {
        navigate("/")
    }
    
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const getSiteSetting = useGetSiteSettingQuery();
    const [googleObj, setGoogleObj] = useState({
        Email: "",
        Token: ""
    })
    const [facebookObj, setfacebookObj] = useState({
        Email: "",
        Token: ""
    })
    const [registerAPI, registerAPIResult] = useRegisterAPIMutation();
    const [googleRegisterAPI, googleRegisterResult] = useGoogleRegisterMutation();
    const [facebookRegisterAPI, facebookRegisterResult] = useFacebookRegisterMutation();
    const [token, setToken] = useState(null);
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const verifyRecaptchaCallback = React.useCallback((token) => {
        setToken(token)
    }, []);
    const SignupSchema = Yup.object().shape({
        UserName: Yup.string()
            .min(4, 'Username must be atleast four letters')
            .max(20, 'Username must be minimum 20 letters')
            .required('Username is required')
            .matches(/^\S*$/, 'Username cannot contain spaces')
            .test('is-full-name', 'Username is Number & alphabets accepted', function (value) {
                return isNaN(Number(value));
            }),
        Email: Yup.string().email('Invalid email').required('Email is required'),
        Password: Yup.string()
            .required('Password is required')
            .min(10, "Password length should be atleast 10 with combination of letters and numbers")
            .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password length should be atleast 10 with combination of letters and numbers'),
        Terms: Yup.boolean().oneOf([true], 'Terms and condition required').required("Terms and condition required"),
        Subscription: Yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            UserName: '',
            Email: '',
            Password: '',
            Terms: false,
            Subscription: false,
            Recaptcha: token
        },
        validationSchema: SignupSchema,
        onSubmit: values => {
            setApiLoading(true)
            registerAPI({
                UserName: values.UserName,
                Email: values.Email,
                Password: values.Password,
                Terms: values.Terms,
                Subscription: values.Subscription,
                Recaptcha: token
            }).then(res => {
                if (res?.data) {
                    if (res?.data?.status) {
                        setApiLoading(false)
                        showToast(res.data.message)
                        sessionStorage.setItem("registerToken", res.data.response);
                        props.nextStep()
                    } else {
                        showErroToast(res?.data?.message);
                        setApiLoading(false)
                    }
                } else {
                    showErroToast(res?.error?.data?.message);
                    setApiLoading(false)
                }
            });
            setRefreshReCaptcha(r => !r);
        },
    });
    const SignupGoogleSchema = Yup.object().shape({
        UserName: Yup.string()
            .min(4, 'Username must be atleast four letters')
            .max(20, 'Username must be minimum 20 letters')
            .required('Username is required')
            .test('is-full-name', 'Username is Number & alphabets accepted', function (value) {
                return isNaN(Number(value));
            }),
        Terms: Yup.boolean().oneOf([true], 'Terms and condition required').required("Terms and condition required"),
        Subscription: Yup.boolean()
    });

    const googleFormik = useFormik({
        initialValues: {
            UserName: '',
            Terms: false,
            Subscription: false
        },
        validationSchema: SignupGoogleSchema,
        onSubmit: values => {
            googleRegisterAPI({
                Email: googleObj?.Email,
                Token: googleObj?.Token,
                UserName: values.UserName,
                Terms: values.Terms,
                Subscription: values.Subscription
            }).then(res => {
                if (res?.data?.status) {
                    showToast(res.data.message)
                    sessionStorage.setItem("registerToken", res.data.response);
                    props.registerSteps(Number(3));
                } else {
                    handleClose();
                    showErroToast(res?.data?.message);
                }
            });

        },
    });
    const SignupfacebookSchema = Yup.object().shape({
        UserName: Yup.string()
            .min(4, 'Username must be atleast four letters')
            .max(20, 'Username must be minimum 20 letters')
            .required('Username is required')
            .test('is-full-name', 'Username is Number & alphabets accepted', function (value) {
                return isNaN(Number(value));
            }),
        Terms: Yup.boolean().oneOf([true], 'Terms and condition required').required("Terms and condition required"),
        Subscription: Yup.boolean()
    });

    const facebookFormik = useFormik({
        initialValues: {
            UserName: '',
            Terms: false,
            Subscription: false
        },
        validationSchema: SignupfacebookSchema,
        onSubmit: values => {
            handleLogin(values);

        },
    });

    const [apiLoading, setApiLoading] = useState(false);
    const [siteKey, setSiteKey] = useState("");
    const [googleClientID, setgoogleClientID] = useState("");
    const [facebookClientID, setfacebookClientID] = useState("");
    const [googleCaptcha, setGoogleCaptcha] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [fshow, setfShow] = useState(false);
    const handleClosef = () => setfShow(false);
    const handleShowf = () => setfShow(true);

    const doSomething = () => {
        setRefreshReCaptcha(r => !r);
    }
    useEffect(() => {
        if (getSiteSetting?.status === "fulfilled") {
            setgoogleClientID(getSiteSetting.data?.info[0]?.SocialLoginDetails?.GoogleClientId)
            setfacebookClientID(getSiteSetting.data?.info[0]?.SocialLoginDetails?.FacebookId)
            setApiLoading(true)
            if (getSiteSetting.data.status) {
                if (getSiteSetting.data?.info[0]?.ProjectDetails?.GoogleRecaptchaStatus !== "inactive") {
                    setGoogleCaptcha(true);
                    setSiteKey(getSiteSetting.data?.info[0]?.Captcha?.SiteKey);
                }
            }
            setApiLoading(false)
        }
    }, [getSiteSetting])

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const responseGoogle = (response) => {
        setGoogleObj({
            Email: response.profileObj?.email,
            Token: response.tokenId
        })
        handleShow();
    }

    function responseFacebook() {

        handleShowf()
    }
    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: googleClientID,
                scope: ""
            })
        }
        gapi.load('client:auth2', start);
    })
    const callYourAPI = (accessToken, values) => {
        window.FB.api('/me', { fields: 'email' }, function (response) {
            if (response && !response.error) {
                const email = response.email;
                facebookRegisterAPI({
                    Email: email,
                    Token: accessToken,
                    UserName: values.UserName,
                    Terms: values.Terms,
                    Subscription: values.Subscription
                }).then(res => {
                    if (res?.data?.status) {
                        showToast(res.data.message)
                        sessionStorage.setItem("registerToken", res.data.response);
                        props.registerSteps(Number(3));
                    } else {
                        handleClosef()
                        showErroToast(res?.data?.message);
                    }
                });
            }
        });
    };
    const handleLogin = (value) => {
        window.FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
            } else {
                window.FB.login(function (response) {
                    if (response.authResponse) {
                        callYourAPI(response.authResponse?.accessToken, value);
                    } else {
                    }
                }, { scope: 'email' });
            }
        });
    };

    const redirectToLogin = () => {
        // Redirect to the login page using window.location.replace
        window.location.replace('/login');
      };

    return (

        <Container className='mt-5'>
            <div className='row'>
                <div className='col-lg-6'>
                    <form method='post' className='register-form' onSubmit={formik.handleSubmit}>
                        <h2 className='register-form-title'>Account details</h2>
                        <div className="form-group">
                            <label htmlFor="inputName">USERNAME</label>
                            <input type="text" name="UserName" onChange={formik.handleChange} value={formik.values.UserName} className="form-control" id="inputName" aria-describedby="emailHelp" />
                        </div>
                        <div className='errors'>{formik.errors.UserName}</div>
                        <div className="form-group">
                            <label htmlFor="inputEmail">EMAIL</label>
                            <input type="email" name='Email' onChange={formik.handleChange} value={formik.values.Email} className="form-control" id="inputEmail" />
                        </div>
                        <div className='errors'>{formik.errors.Email}</div>
                        <div className="form-group">
                            <label htmlFor="inputPassword">PASSWORD</label>
                            <div>
                                <input type={showPassword ? "text" : "password"} name='Password' onChange={formik.handleChange} value={formik.values.Password} className="form-control" id="inputPassword" />
                                <button type='button' className='password-eye' onClick={toggleShowPassword}>
                                    {showPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                                </button>
                            </div>
                        </div>
                        <div className='errors'>{formik.errors.Password}</div>
                        <center className='check-box'>
                            <div className="form-check">
                                <input type="checkbox" name='Subscription' onChange={formik.handleChange} className="form-check-input" id="checkbox-one" />
                                <label className="form-check-label" htmlFor="checkbox-one">Subscribe to latest news and offers from BluAart</label>
                            </div>
                            <div className='errors'>{formik.errors.Subscription}</div>
                            <div className="form-check">
                                <input type="checkbox" name='Terms' onChange={formik.handleChange} className="form-check-input" id="checkbox-two" />
                                <label className="form-check-label" htmlFor="checkbox-two">
                                    <a target="_blank" href="/terms">I agree to BluAart Terms of Use and</a>
                                    <a target="_blank" href="/privacy"> Privacy Policy </a></label>
                            </div>
                            <div className='errors'>{formik.errors.Terms}</div>
                        </center>
                        {siteKey !== "" && googleCaptcha &&
                            <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
                                <GoogleReCaptcha
                                    onVerify={verifyRecaptchaCallback}
                                    refreshReCaptcha={refreshReCaptcha}
                                />
                            </GoogleReCaptchaProvider>
                        }

                        <hr></hr>
                        <div className='d-flex justify-content-end'>
                            <button type='button' onClick={() => goBack()} className="cancel btn btn-primary">Cancel</button>&nbsp;
                            <button type="submit" disabled={apiLoading} className="submit btn btn-primary">Register</button>
                        </div>
                    </form>
                </div>
                <div className='col-lg-6'>
                    <div className='register-form-right'>
                        <h1 className='register-form-title'>Sign up</h1>
                        <div className='login-button'>
                            <p>Do you have an account  <span  onClick={redirectToLogin}>
                                <Link>Click here to Login</Link>
                                </span></p>
                        </div>
                        <div className='signup-others'>
                            <p>Sign up with Email</p>
                            <div className='line'>
                                <hr className='register-or-line' />
                                <span>OR</span>
                                <hr className='register-or-line' />
                            </div>
                            <div className='other-login-section'>
                                <p>Sign up using </p>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div className='other-login-buttons '>
                                            
                                            {googleClientID !== "" ? <GoogleLogin
                                                clientId={googleClientID}
                                                render={renderProps => (
                                                    <button onClick={renderProps.onClick} disabled={renderProps.disabled} className='google-signup-button'></button>
                                                )}
                                                buttonText="Google"
                                                onSuccess={responseGoogle}
                                                cookiePolicy={'single_host_origin'}
                                            /> : null}

                                            {facebookClientID ? <FacebookLogin
                                                appId={facebookClientID}
                                                render={renderProps => (
                                                    <button className='facebook-signup-button' onClick={responseFacebook}></button>
                                                )}
                                                fields="email"
                                                callback={responseFacebook}
                                            /> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='physical-digtale'>
                                <div className='row'>
                                    <img src={physical} alt='physical' />
                                    <img src={digtal} alt='digital' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={show} className='register-form' onHide={handleClose}>
                <Modal.Body>
                    <form onSubmit={googleFormik?.handleSubmit} >
                        <div className="form-group">
                            <label htmlFor="inputName">USERNAME</label>
                            <input type="text" name="UserName" onChange={googleFormik.handleChange} value={googleFormik.values.UserName} className="form-control" id="inputName" aria-describedby="emailHelp" />
                        </div>
                        <div className='errors'>{googleFormik.errors.UserName}</div>
                        <div className="form-check">
                            <input type="checkbox" name='Subscription' onChange={googleFormik.handleChange} className="form-check-input" id="checkbox-one" />
                            <label className="form-check-label" htmlFor="checkbox-one">Subscribe to latest news and offers from BluAart</label>
                        </div>
                        <div className='errors'>{googleFormik.errors.Subscription}</div>
                        <div className="form-check">
                            <input type="checkbox" name='Terms' onChange={googleFormik.handleChange} className="form-check-input" id="checkbox-two" />
                            <label className="form-check-label" htmlFor="checkbox-two">I agree to BluAart Terms of Use and Privacy Policy </label>
                        </div>
                        <div className='errors'>{googleFormik.errors.Terms}</div>
                        <div className='d-flex justify-content-end'>
                            <button type='button' onClick={() => goBack()} className="cancel btn ">CANCEL</button>
                            <button type="submit" disabled={apiLoading} className="submit btn ">NEXT PAGE</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={fshow} className='register-form' onHide={handleClose}>
                <Modal.Body>
                    <form onSubmit={facebookFormik?.handleSubmit} >
                        <div className="form-group">
                            <label htmlFor="inputName">USERNAME</label>
                            <input type="text" name="UserName" onChange={facebookFormik.handleChange} value={facebookFormik.values.UserName} className="form-control" id="inputName" aria-describedby="emailHelp" />
                        </div>
                        <div className='errors'>{facebookFormik.errors.UserName}</div>
                        <div className="form-check">
                            <input type="checkbox" name='Subscription' onChange={facebookFormik.handleChange} className="form-check-input" id="checkbox-one" />
                            <label className="form-check-label" htmlFor="checkbox-one">Subscribe to latest news and offers from BluAart</label>
                        </div>
                        <div className='errors'>{facebookFormik.errors.Subscription}</div>
                        <div className="form-check">
                            <input type="checkbox" name='Terms' onChange={facebookFormik.handleChange} className="form-check-input" id="checkbox-two" />
                            <label className="form-check-label" htmlFor="checkbox-two">I agree to BluAart Terms of Use and Privacy Policy </label>
                        </div>
                        <div className='errors'>{facebookFormik.errors.Terms}</div>
                        <div className='d-flex justify-content-end'>
                            <button type='button' onClick={() => goBack()} className="cancel btn ">CANCEL</button>
                            <button type="submit" disabled={apiLoading} className="submit btn ">NEXT PAGE</button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
            {apiLoading ? <LoadingModal text={'Please wait...'} /> : null}
        </Container>
    );
}

export default RegisterFrom;