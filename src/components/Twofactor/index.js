import React, {  useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import {  useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    useGetSiteSettingQuery, useForgotPasswordAPIMutation,
    useVerifyLogin2FAMutation
} from '../../service/Apilist'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Banner from './forgotBanner';
import LoadingScreen from '../Loader/LoadingScreen';

function ForgotForm(props) {

    let navigate = useNavigate();
    
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
    const [verifyOTP, resverifyOTP] = useVerifyLogin2FAMutation();
    const [token, setToken] = useState(null);
    const [refreshReCaptcha, setRefreshReCaptcha] = useState(false);
    const verifyRecaptchaCallback = React.useCallback((token) => {
        setToken(token)
    }, []);
    const SignupSchema = Yup.object().shape({
        OTP: Yup.number().required('OTP is required'),
    });

    const formik = useFormik({
        initialValues: {
            OTP: '',
        },
        validationSchema: SignupSchema,
        onSubmit: values => {
            setApiLoading(true)
            verifyOTP({
                Token: sessionStorage.getItem('loginToken'),
                OTP: Number(values.OTP)
            }).then(res => {
                if (res?.data?.status) {
                    setApiLoading(false)
                    showToast(res.data.response);
                    sessionStorage.setItem("UserId", res.data?.UserId);
                    sessionStorage.setItem("loginToken", res.data?.token);
                    sessionStorage.setItem("login", true);
                    sessionStorage.setItem("role", res.data?.role);
                    sessionStorage.setItem("registerRole", res.data?.role);
                    sessionStorage.setItem("UserName", res.data?.UserName);
                    props.LoginFunction(true);
                    navigate("/connect-wallet");
                } else {
                    showErroToast(res?.data?.response);
                    setApiLoading(false)
                }
            }).catch((error) => {
            })
            setRefreshReCaptcha(r => !r);
        },
    });
    useEffect(() => {
        if (ForgotAPIResult.error) {
            showErroToast(ForgotAPIResult?.error?.data?.response);
        }
    }, [ForgotAPIResult])
    useEffect(() => {
        if (resverifyOTP?.error) {
            showErroToast(resverifyOTP?.error?.data?.response)
        }
    }, [resverifyOTP])
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
                            <h2 className='register-form-title'>Verify OTP</h2>
                            <div className="form-group">
                                <label htmlFor="inputName">OTP</label>
                                <input type="text" name="OTP" onChange={formik.handleChange} value={formik.values.OTP} className="form-control" id="inputName" aria-describedby="emailHelp" placeholder='Enter your OTP' />
                            </div>
                            <div className='errors'>{formik.errors.OTP}</div>
                            <hr></hr>
                            <div className='d-flex justify-content-end'>

                                <button type="submit" 
                                disabled={apiLoading} 
                                className="submit btn btn-primary">SUBMIT</button>
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