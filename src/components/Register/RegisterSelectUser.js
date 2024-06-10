import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import buyerthumb from "../../assets/buyer-user-thumb.png";
import artistthumb from "../../assets/artist-user-thumb.png";
import collectorthumb from "../../assets/collector-user-thumb.png";
import { useSelectRoleRegistrationMutation } from "../../service/Apilist";
import { toast } from 'react-toastify';
function RegisterSelectUser(props) {
    const storedData = sessionStorage.getItem("registerToken");
    const [isActivebuyer, setIsActivebuyer] = useState(false);
    const [isActiveartist, setIsActiveartist] = useState(false);
    const [isActiveCollector, setIsActiveCollector] = useState(false);
    const [isActiveCorporateCollector, setIsActiveCorporateCollector] = useState(false);
    const [selectRole, setSelectRole] = useState("");
    const [selectUser, selectUserResult] = useSelectRoleRegistrationMutation();
    const handleClick = (role) => {
        if (role === "buyer") {
            setSelectRole("Buyer")
            setIsActivebuyer(true);
            setIsActiveartist(false);
            setIsActiveCollector(false);
            setIsActiveCorporateCollector(false);
        } else if (role === "artist") {
            setSelectRole("Artist")
            setIsActivebuyer(false);
            setIsActiveartist(true);
            setIsActiveCollector(false);
            setIsActiveCorporateCollector(false);
        } else if (role === 'collector') {
            setSelectRole("Collector")
            setIsActivebuyer(false);
            setIsActiveartist(false);
            setIsActiveCollector(true);
            setIsActiveCorporateCollector(false);
        } else if (role === "Corporate collector") {
            setSelectRole("Corporate Collector")
            setIsActivebuyer(false);
            setIsActiveartist(false);
            setIsActiveCollector(false);
            setIsActiveCorporateCollector(true);
        }
    };
    const submitSelectRole = () => {
        selectUser({
            Auth: storedData,
            Role: selectRole
        }).then(res => {
            if (res?.data?.status) {
                showToast(res.data.message)
                sessionStorage.setItem("registerToken", res.data.response);
                sessionStorage.setItem("registerRole", selectRole);
                props.nextStep();
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
    return (
        <Container>
            <div className='row'>
                <div className='col-lg-2'>
                </div>
                <div className='col-lg-8'>
                    <div className='row'>
                        <center>
                            <div className='register-select-user'>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: "70%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <h1 className='email-verification-title'>Purpose of Registration</h1>
                            </div>
                            <div className='register-select-user-section'>
                                <p className='register-select-user-section-title' >Select user</p>
                                <div className='col-lg-12'>
                                    <div className='select-user-section'>
                                        <div className='buyer d-flex'>
                                            <div className='justify-content-start'>
                                                <img className='img-responsive' src={buyerthumb} alt='user-thumb' />
                                            </div>
                                            <div className='justify-content-center'>
                                                <div className='buyer-content'>
                                                    <h1 className='buyer-title'>Buyer</h1>
                                                    <p>Explore and acquire works from emerging and established artists from across the world.</p>
                                                </div>
                                            </div>
                                            <div className='justify-content-end'>
                                                <button className={isActivebuyer ? "buyer-button active" : "buyer-button"} onClick={() => handleClick("buyer")}>Select</button>
                                            </div>
                                        </div>
                                        <div className='artist-register d-flex'>
                                            <div className='justify-content-start'>
                                                <img className='img-responsive' src={artistthumb} alt='user-thumb' />
                                            </div>
                                            <div className='justify-content-center'>
                                                <div className='artist-content'>
                                                    <h1 className='artist-title'>Artist</h1>
                                                    <p>Join us as an Artist to sell your work directly on the platform.</p>
                                                </div>
                                            </div>
                                            <div className='d-flex justify-content-end align-items-center'>
                                                <div className=''>
                                                    <button className={isActiveartist ? "artist-button active" : "artist-button"} onClick={() => handleClick("artist")}>Select</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='collector d-flex justify-content-center'>
                                            <div className='justify-content-start'>
                                                <img className='img-responsive' src={collectorthumb} alt='user-thumb' />
                                            </div>
                                            <div className='justify-content-center'>
                                                <div className='collector-content'>
                                                    <h1 className='collector-title'>Private Collector</h1>
                                                    <p>Calling all distinguished Collectors! Step into our Platform and unveil the Art Treasures that await you.</p>
                                                </div>
                                            </div>
                                            <div className='justify-content-end'>
                                                <button className={isActiveCollector ? "collector-button active" : "collector-button"} onClick={() => handleClick("collector")}>Select</button>
                                            </div>
                                        </div>
                                        <div className='collector d-flex justify-content-center'>
                                            <div className='justify-content-start'>
                                                <img className='img-responsive' src={collectorthumb} alt='user-thumb' />
                                            </div>
                                            <div className='justify-content-center'>
                                                <div className='collector-content'>
                                                    <h1 className='collector-title'>Corporate Collector</h1>
                                                    <p>Calling all distinguished Collectors! Step into our Platform and unveil the Art Treasures that await you.</p>
                                                </div>
                                            </div>
                                            <div className='justify-content-end'>
                                                <button className={isActiveCorporateCollector ? "collector-button active" : "collector-button"} onClick={() => handleClick("Corporate collector")}>Select</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className='select-user-section-line' />
                                <div className='d-flex justify-content-center'>
                                    <button type='button' onClick={props.backStep} className="cancel btn ">CANCEL</button>
                                    <button type="submit" onClick={submitSelectRole} className="submit btn btn-primary">NEXT PAGE</button>
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

export default RegisterSelectUser;