import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import { useEmailOTPverificationMutation, useResendRegistrationOTPMutation } from "../../service/Apilist";
import { toast } from 'react-toastify';

function RegisterEmailVerification(props) {
    const storedData = sessionStorage.getItem("registerToken");
    const [verifyAPI, verifyAPIResult] = useEmailOTPverificationMutation();
    const [reSendrequest, reSendrequestResult] = useResendRegistrationOTPMutation();
    const [OTP, setOTP] = useState(null);
    const submitOTP = () => {
        verifyAPI({
            Token: storedData,
            OTP
        }).then(res => {
            if (res?.data?.status) {
                showToast(res.data.message)
                sessionStorage.setItem("registerToken", res.data.response);
                props.nextStep();
            } else {
                showErroToast(res?.error?.data?.message);
            }
        })
    }
    const reSendOTP = () => {
        reSendrequest({
            Token: storedData
        }).then(res => {
            if (res?.data?.status) {
                showToast(res.data.message)
                sessionStorage.setItem("registerToken", res.data.response);

            } else {
                showErroToast(res?.error?.data?.message);
            }
        })
    }
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const onChange = (e) => {
        setOTP(e.target.value);
    }
    return (
        <Container>
            <div className='row'>
                <div className='col-lg-2'>
                </div>
                <div className='col-lg-8'>
                    <div className='row'>
                        <center>
                            <div className='register-email-verification'>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: "45%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <h1 className='email-verification-title'>Email Verification</h1>
                            </div>
                            <div className='register-email-verification-otp-section'>
                                <p>Enter OTP which you received in your Email</p>
                                <input type="text" name='OTP' onChange={onChange} />
                                <div className='d-flex justify-content-center'>
                                    <button type='button' onClick={props.backStep} className="cancel btn ">CANCEL</button>
                                    <button type="submit" onClick={submitOTP} className="submit btn btn-primary">VERIFY OTP</button>
                                </div>
                                <div className='resend-sectoin'>
                                    <p>Did not receive ? <span onClick={reSendOTP}>Resend OTP</span></p>
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
                <div className='col-lg-2'>
                </div>
            </div>
        </Container>
    );
}

export default RegisterEmailVerification;