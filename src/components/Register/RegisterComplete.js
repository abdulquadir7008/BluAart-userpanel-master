import React from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import {  useNavigate } from 'react-router-dom';
function RegisterComplete() {
    let navigate = useNavigate();
    function profileSetup() {
        navigate("/profile")
    }
    return (
        <Container>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='row'>
                        <center>
                            <div className='col-lg-6'>
                                <div className='register-complete'>
                                    <div className='register-complete-icon-section' >
                                    </div>
                                    <p>Registration request as {sessionStorage.getItem('registerRole') === "Collector" ?  "Private Collector" : sessionStorage.getItem('registerRole')} confirmed. Profile will be visible to public only after Admin approval</p>
                                    <hr />
                                    <div className='d-flex justify-content-center'>

                                        <button type='button' onClick={() => profileSetup()} className="submit btn btn-primary">OK</button>
                                    </div>
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default RegisterComplete;