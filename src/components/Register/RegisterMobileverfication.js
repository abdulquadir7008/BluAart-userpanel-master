import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import physical from "../../assets/register-bottom-physical.png"
import digtal from "../../assets/register-botton-digital.png"
import { Link } from 'react-router-dom';
function RegisterMobileverfication(props) {
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
                                <h1 className='email-verification-title'>Mobile Verification</h1>
                            </div>
                            <div className='register-email-verification-otp-section'>
                                <p>Enter OTP which you received in your Mobile</p>
                                <input type="text" />
                                <div className='d-flex justify-content-center'>
                                    <button type='button' onClick={props.backStep} className="cancel btn ">CANCEL</button>
                                    <button type="button" onClick={props.nextStep} className="submit btn btn-primary">VERIFY OTP</button>
                                </div>
                                <div className='resend-sectoin'>
                                        <p>Did not receive ? <span>Resend OTP</span></p>
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

export default RegisterMobileverfication;