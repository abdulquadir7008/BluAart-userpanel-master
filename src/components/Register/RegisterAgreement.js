import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import { useAgreementAcceptMutation, useGetUserRoleInfoMutation } from './../../service/Apilist';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
function RegisterAgreement(props) {
    const [acceptAggrement, acceptAggrementResponse] = useAgreementAcceptMutation();
    const [GetaggrementAPI, resGetaggrementAPI] = useGetUserRoleInfoMutation();
    const storedData = sessionStorage.getItem("registerToken");
    const agreeAccept = () => {
        acceptAggrement({
            Auth: storedData,
            Agreement: true
        }).then(res => {
            if (res.data?.status) {
                showToast(res.data.message)
                sessionStorage.setItem("registerToken", res.data.response);
                props.nextStep()
            }
        })
    }
    const [aggrementState, setaggrementState] = useState("")
    useEffect(() => {
        GetaggrementAPI({
            Role: sessionStorage.getItem('registerRole')
        });
    }, [])
    useEffect(() => {
        if (resGetaggrementAPI.status === 'fulfilled') {
            setaggrementState(resGetaggrementAPI?.data?.info)
        }
    }, [resGetaggrementAPI])
    const showToast = (text) => {
        toast.success(text)
    }
    
    const SignupSchema = Yup.object().shape({
        Terms: Yup.boolean().oneOf([true], 'BluAart agreement is required').required("BluAart agreement is required"),
    });
    const formik = useFormik({
        initialValues: {
            Terms: null
        },
        validationSchema: SignupSchema,
        onSubmit: values => {
            agreeAccept();
        },
    });
    const divRef = useRef(null);
    const [scrollState, setScrollState] = useState(true);
    const handleScroll = () => {
        if (divRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = divRef.current;
            const isFullyScrolled = scrollTop + clientHeight + 20 >= scrollHeight;
            if (isFullyScrolled) {
                setScrollState(false)
            }
        }
    };
    return (
        <Container>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='row'>
                        <center>
                            <div className='col-lg-6'>
                                <div className='register-agreement'>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar" style={{ width: "85%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <h1 className='register-agreement-title'>Agreement</h1>
                                </div>
                            </div>
                            <div className='register-agreement-text-section'>
                                <div style={{ height: "500px", overflowY: 'auto' }} ref={divRef} onScroll={handleScroll} className='agreement-text' dangerouslySetInnerHTML={{ __html: aggrementState?.Agreement }}>
                                </div>
                                <br />
                                <br />
                                <form onSubmit={formik.handleSubmit}>
                                    <div className="form-check col-lg-3 offset-lg-1">
                                        <input type="checkbox" name='Terms' onChange={formik.handleChange} value={formik.values.Terms} className="form-check-input" id="checkbox-two" />
                                        <label className="form-check-label" htmlFor="checkbox-two">I agree to BluAart Agreement </label>
                                    </div>
                                    <div className="form-check col-lg-4 offset-lg-1"><div className='errors'>{formik.errors.Terms}</div></div>

                                    <div className='col-lg-6'>
                                        <hr></hr>
                                    </div>
                                    <div className='d-flex justify-content-center'>
                                        <button type='button' onClick={props.backStep} className="cancel btn ">CANCEL</button>
                                        <button disabled={scrollState} type="submit" className="submit btn btn-primary">NEXT PAGE</button>
                                    </div>
                                </form>
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default RegisterAgreement;