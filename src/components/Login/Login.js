import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    useGetSiteSettingQuery, useLoginAPIMutation, useFacebookLoginMutation,
    useGoogleLoginMutation,
    useGetLandingPageQuery
} from './../../service/Apilist'
import {
    GoogleReCaptchaProvider,
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { gapi } from 'gapi-script';
import LoadingModal from '../Loader/Loading';



function LoginForm(props) {

    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const [resgistrationStep, setstep] = useState(0);
    const [token, setToken] = useState(null);
    const verifyRecaptchaCallback = React.useCallback((token) => {
        setToken(token);
    }, []);


    let navigate = useNavigate();
    function goBack() {
        navigate("/")
    }

    if (props?.loginState) {
        navigate("/")
    }


    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const getSiteSetting = useGetSiteSettingQuery();
    const [LoginAPI, LoginAPIResult] = useLoginAPIMutation();
    const SignupSchema = Yup.object().shape({
        Email: Yup.string().email('Invalid email').required('Email is required'),
        Password: Yup.string().required('Password is required')
            .min(10, "Password length should be atleast 10 with combination of letters and numbers")
            .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password length should be atleast 10 with combination of letters and numbers')
        ,
    });
    const getlaningpage = useGetLandingPageQuery();
    const [landpageState, setLandpageState] = useState();
    useEffect(() => {
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
        }
    }, [getlaningpage])
    const formik = useFormik({
        initialValues: {
            Email: '',
            Password: '',
            Recaptcha: token
        },
        validationSchema: SignupSchema,
        enableReinitialize : true,
        onSubmit: values => {
            setApiLoading(true)
            LoginAPI({
                Email: values.Email,
                Password: values.Password,
                Recaptcha: token
            }).then(res => {
                if (res?.data?.status) {
                    if(res?.data?.Steps == 5){
                        setApiLoading(false)
                        sessionStorage.setItem("registerToken", res.data?.token);
                        sessionStorage.setItem("registerRole", res.data?.role);
                        sessionStorage.setItem("role", res.data?.role);
                        props.registerSteps(Number(res?.data?.Steps) + 2)
                        showToast(res.data.response);
                        navigate("/profile")
                    }else if (res?.data?.Steps) {
                        setApiLoading(false)
                        sessionStorage.setItem("registerToken", res.data?.token);
                        sessionStorage.setItem("registerRole", res.data?.role);
                        sessionStorage.setItem("role", res.data?.role);
                        props.registerSteps(Number(res?.data?.Steps) + 2)
                        navigate("/register")
                    }
                    else if (!res?.data?.Steps) {
                        sessionStorage.setItem("UserId", res.data?.UserId);
                        sessionStorage.setItem("loginToken", res.data?.token);
                        sessionStorage.setItem("login", true);
                        sessionStorage.setItem("registerRole", res.data?.role);
                        sessionStorage.setItem("role", res.data?.role);
                        sessionStorage.setItem("UserName", res.data?.UserName);
                        showToast(res.data.response);
                        setApiLoading(false)
                        if (res.data.response === "2FA Code Sent to Registered Mail") {
                            navigate("/verify");
                        } else {
                            props.LoginFunction(true);
                            navigate("/connect-wallet");
                        }
                    }
                } else {
                    showErroToast(res?.data?.response);
                    setApiLoading(false)
                }
            });
            setRefreshReCaptcha(r => !r);
        },
    });
    useEffect(() => {
        if (LoginAPIResult.error) {
            showErroToast(LoginAPIResult?.error?.data?.response);
        }
    }, [LoginAPIResult])


    const [apiLoading, setApiLoading] = useState(false);
    const [siteKey, setSiteKey] = useState("");
    const [googleCaptcha, setGoogleCaptcha] = useState(false);
    const [googleClientID, setgoogleClientID] = useState("");
    const [facebookClientID, setfacebookClientID] = useState("");
    const [googleLoginAPI, googleLoginResult] = useGoogleLoginMutation();
    const [facebookLoginAPI, facebookLoginResult] = useFacebookLoginMutation();
    const doSomething = () => {
        setRefreshReCaptcha(r => !r);
    }
    useEffect(() => {
        if (getSiteSetting?.status === "fulfilled") {
            setApiLoading(true)
            if (getSiteSetting.data.status) {
                setgoogleClientID(getSiteSetting.data?.info[0]?.SocialLoginDetails?.GoogleClientId)
                setfacebookClientID(getSiteSetting.data?.info[0]?.SocialLoginDetails?.FacebookId)
                if (getSiteSetting.data?.info[0]?.ProjectDetails?.GoogleRecaptchaStatus !== "inactive") {
                    setGoogleCaptcha(true);
                    setSiteKey(getSiteSetting.data?.info[0]?.Captcha?.SiteKey);
                }
            }
            setApiLoading(false)
        }
    }, [getSiteSetting])
    const [googleObj, setGoogleObj] = useState({
        Email: "",
        Token: ""
    })
    const [facebookObj, setfacebookObj] = useState({
        Email: "",
        Token: ""
    })
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const responseGoogle = (response) => {
        googleLoginAPI({
            Email: response.profileObj?.email,
            Token: response.tokenId,
        }).then(res => {
            if (res?.data?.status) {
                if (res?.data?.Steps) {
                    sessionStorage.setItem("registerToken", res.data?.token);
                    props.registerSteps(Number(res?.data?.Steps) + 1)
                    navigate("/register")
                }
                else if (!res?.data?.Steps) {
                    sessionStorage.setItem("UserId", res.data?.UserId);
                    sessionStorage.setItem("loginToken", res.data?.token);
                    sessionStorage.setItem("login", true);
                    sessionStorage.setItem("registerRole", res.data?.role);
                    sessionStorage.setItem("role", res.data?.role);
                    sessionStorage.setItem("UserName", res.data?.UserName);
                    props.LoginFunction(true);
                    showToast(res.data.response);
                    navigate("/connect-wallet");
                }
            } else {
                showErroToast(res?.error?.data?.message);
            }
        });
    }
    useEffect(() => {
        if (googleLoginResult.error) {
            showErroToast(googleLoginResult?.error?.data?.response);
        }
    }, [googleLoginResult])
    function responseFacebook(res) {

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
    const callYourAPI = (accessToken) => {
        window.FB.api('/me', { fields: 'email' }, function (response) {
            if (response && !response.error) {
                const email = response.email;

                facebookLoginAPI({
                    Email: email,
                    Token: accessToken,
                }).then(res => {
                    if (res?.data?.status) {
                        if (res?.data?.Steps) {
                            sessionStorage.setItem("registerToken", res.data?.token);

                            props.registerSteps(Number(res?.data?.Steps) + 1)
                            navigate("/register")
                        }
                        else if (!res?.data?.Steps) {
                            sessionStorage.setItem("UserId", res.data?.UserId);
                            sessionStorage.setItem("loginToken", res.data?.token);
                            sessionStorage.setItem("login", true);
                            sessionStorage.setItem("registerRole", res.data?.role);
                            sessionStorage.setItem("role", res.data?.role);
                            sessionStorage.setItem("UserName", res.data?.UserName);
                            props.LoginFunction(true);
                            showToast(res.data.response);
                            navigate("/connect-wallet");
                        }
                    } else {
                        showErroToast(res?.error?.data?.message);
                    }
                });
            }
        });
    };

    const handleLogin = () => {
        window.FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
            } else {
                window.FB.login(function (response) {
                    if (response.authResponse) {
                        callYourAPI(response.authResponse?.accessToken);
                    } else {
                    }
                }, { scope: 'email' });
            }
        });
    };

    const redirectToLogin = () => {
        window.location.replace('/forgot');
      };
    return (
        <>
            <ToastContainer />
            <Container className='mt-5'>
                <div className='row'>
                    <div className='col-lg-6'>
                        <form method='post' className='register-form' onSubmit={formik.handleSubmit}>
                            <h2 className='register-form-title'>Account details</h2>
                            <div className="form-group">
                                <label htmlFor="inputName">Email</label>
                                <input type="text" name="Email" onChange={formik.handleChange} value={formik.values.Email} className="form-control" id="inputName" aria-describedby="emailHelp" />
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
                                <button type='button' onClick={() => goBack()} className="cancel btn btn-primary">CANCEL</button>
                                <button type="submit" disabled={apiLoading} className="submit btn btn-primary">Login</button>
                            </div>

                        </form>
                    </div>
                    <div className='col-lg-6'>
                        <div className='register-form-right'>
                            <h1 className='register-form-title'>Login</h1>
                            <div className='login-button'>
                                <p>Do not have an account  <span><Link to="/register">Click here to Register</Link></span></p>
                                <p><span onClick={redirectToLogin}>
                                    <Link 
                                    >Forgot password ?</Link></span></p>
                            </div>
                            <div className='signup-others'>
                                <p>Login with Email</p>
                                <div className='line'>
                                    <hr className='register-or-line' />
                                    <span>OR</span>
                                    <hr className='register-or-line' />
                                </div>
                                <div className='other-login-section'>
                                    <p>Login using </p>
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
                                                        <button className='facebook-signup-button' onClick={handleLogin}></button>
                                                    )}
                                                    fields="email"
                                                    callback={responseFacebook}
                                                /> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {apiLoading ? <LoadingModal  text={'Please wait...'}/> : null}
        </>
    );
}

export default LoginForm;