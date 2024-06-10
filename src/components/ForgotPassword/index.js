import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useGetSiteSettingQuery, useForgotPasswordAPIMutation } from './../../service/Apilist'
import {
    GoogleReCaptchaProvider,
    GoogleReCaptcha
} from 'react-google-recaptcha-v3';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Banner from './forgotBanner';
import LoadingScreen from '../Loader/LoadingScreen';

function ForgotForm(props) {
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
    const [ForgotAPI, ForgotAPIResult] = useForgotPasswordAPIMutation();
    const [token, setToken] = useState(null);
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const verifyRecaptchaCallback = React.useCallback((token) => {
        setToken(token)
    }, []);
    const SignupSchema = Yup.object().shape({
        Email: Yup.string().email('Invalid email').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            Email: '',
            Recaptcha: ''
        },
        validationSchema: SignupSchema,
        onSubmit: values => {
            setApiLoading(true)
            ForgotAPI({
                Email: values.Email,
                Recaptcha: token
            }).then(res => {
                if (res?.data?.status) {
                    showToast(res.data.message);
                    setApiLoading(false)
                } else {
                    showErroToast(res?.data?.message);
                    setApiLoading(false)
                }
            });
            setRefreshReCaptcha(r => !r);
        },
    });
    useEffect(() => {
        if (ForgotAPIResult.error) {
            showErroToast(ForgotAPIResult?.error?.data?.response);
        }
    }, [ForgotAPIResult])

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


    return (
        <>
            <ToastContainer />
            <Banner />
            <Container className='mt-5'>
                <div className='row'>
                    <div className='col-lg-6 offset-lg-3'>
                        <form method='post' className='register-form' onSubmit={formik.handleSubmit}>
                            <h2 className='register-form-title'>Forgot Password</h2>
                            <div className="form-group">
                                <label htmlFor="inputName">Email</label>
                                <input type="text" name="Email" onChange={formik.handleChange} value={formik.values.Email} className="form-control" id="inputName" aria-describedby="emailHelp" />
                            </div>
                            <div className='errors'>{formik.errors.Email}</div>
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

export default ForgotForm;