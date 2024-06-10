import React, {  useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import {  useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetSiteSettingQuery, useResetPasswordAPIMutation } from './../../service/Apilist'
import {
    GoogleReCaptchaProvider,
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Banner from './resetBanner';
import LoadingScreen from '../Loader/LoadingScreen';

function ResetForm(props) {
    
    let navigate = useNavigate();
    let parms = useParams();
    
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
    const [ResetPasswordAPI, ResetPasswordAPIResult] = useResetPasswordAPIMutation();
    const [token, setToken] = useState(null);
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const verifyRecaptchaCallback = React.useCallback((token) => {
        setToken(token)
    }, []);
    const SignupSchema = Yup.object().shape({
        Password: Yup.string().required('Password is required')
            .min(10, "Password length should be atleast 10 with combination of letters and numbers")
            .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, 'Password length should be atleast 10 with combination of letters and numbers'),
        CPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref("Password"), null], "Password must be same"),
    });

    const formik = useFormik({
        initialValues: {
            Password: '',
            CPassword: '',

        },
        validationSchema: SignupSchema,
        onSubmit: values => {
            setApiLoading(true)
            ResetPasswordAPI({
                ResetToken: parms.token,
                NewPassword: values.CPassword
            }).then(res => {
                if (res?.data?.status) {
                    showToast(res.data.message);
                    setApiLoading(false);
                    window.location.replace("/login")
                } else {
                    showErroToast(res?.data?.message);
                    setApiLoading(false)
                }
            });
        },
    });
    useEffect(() => {
        if (ResetPasswordAPIResult.error) {
            showErroToast(ResetPasswordAPIResult?.error?.data?.response);
        }
    }, [ResetPasswordAPIResult])

    const [apiLoading, setApiLoading] = useState(false);
    const [siteKey, setSiteKey] = useState("");
    const [googleCaptcha, setGoogleCaptcha] = useState(false);
    const doSomething = () => {
        setRefreshReCaptcha(r => !r);
    }
    useEffect(() => {
        if (getSiteSetting?.status === "fulfilled") {
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
    const [showCPassword, setShowCPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowCPassword = () => {
        setShowCPassword(!showCPassword);
    };
    return (
        <>
            <ToastContainer />
            <Banner />
            <Container className='mt-5'>
                <div className='row'>
                    <div className='col-lg-6 offset-lg-3'>
                        <form method='post' className='register-form' onSubmit={formik.handleSubmit}>
                            <h2 className='register-form-title'>Reset Password</h2>
                            <div className="form-group">
                                <label htmlFor="inputPassword">ENTER PASSWORD</label>
                                <div>
                                    <input type={showPassword ? "text" : "password"} name='Password' onChange={formik.handleChange} value={formik.values.Password} className="form-control" id="inputPassword" />
                                    <button type='button' className='password-eye' onClick={toggleShowPassword}>
                                        {showPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                                    </button>
                                </div>
                            </div>
                            <div className='errors'>{formik.errors.Password}</div>
                            <div className="form-group">
                                <label htmlFor="inputPassword">CONFIRM PASSWORD</label>
                                <div>
                                    <input type={showCPassword ? "text" : "password"} name='CPassword' onChange={formik.handleChange} value={formik.values.CPassword} className="form-control" id="inputPassword" />
                                    <button type='button' className='password-eye' onClick={toggleShowCPassword}>
                                        {showCPassword ? <i className="fa fa-eye"></i> : <i className="fa fa-eye-slash"></i>}
                                    </button>
                                </div>
                            </div>
                            <div className='errors'>{formik.errors.CPassword}</div>
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
                                <button type="submit" disabled={apiLoading} className="submit btn btn-primary">SUBMIT</button>
                            </div>
                        </form>
                    </div>
                </div>
            </Container>
            {apiLoading ? <LoadingScreen/> : null}
        </>
    );
}

export default ResetForm;