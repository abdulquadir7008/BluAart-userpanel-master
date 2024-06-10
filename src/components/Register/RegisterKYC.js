import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';

function RegisterKYC(props) {
    const [apiLoading, setAPILoading] = useState(false);
    const storedData = sessionStorage.getItem("registerToken");
    const SignupKYCSchema = Yup.object().shape({
        Profilename: Yup.string()
            .min(4, 'Profilename must be atleast four letters')
            .max(50, 'Profilename must be minimum 50 letters')
            .required('Profilename is required'),
        addressProof: Yup.mixed().required('Address Proof is required').test(
            'fileFormat',
            'Unsupported Format',
            (value) => {
                if (!value) return false;
                return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
            },
        ),
        IdProof: Yup.mixed().required('Identity proof is required').test(
            'fileFormat',
            'Unsupported Format',
            (value) => {
                if (!value) return false;
                return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
            },
        ),
    });
    const updateKYC = async (formdata) => {
        const response = axios.post(`${process.env.REACT_APP_API_URL}/UpdateKyc`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        response.then(res => {
            setAPILoading(false)
            if (res?.data?.status) {
                showToast(res.data.message)
                sessionStorage.setItem("registerToken", res.data.token);
                sessionStorage.setItem("registerRole", res.data.role);
                props.nextStep()
            } else {
                showErroToast(res?.data?.message);
            }
        })
    }
    const formik = useFormik({
        initialValues: {
            Profilename: '',
            addressProof: null,
            IdProof: null,
        },
        validationSchema: SignupKYCSchema,
        onSubmit: values => {
            setAPILoading(true)
            let formdata = new FormData();
            formdata.append("ProofName", values.Profilename);
            formdata.append("AddressProof", values.addressProof);
            formdata.append("IdentityProof", values.IdProof);
            formdata.append("Auth", storedData);
            updateKYC(formdata);
        },
    });
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    return (
        <Container>
            <div className='row'>
                <div className='col-lg-12'>
                    <div className='row'>
                        <center>
                            <div className='col-lg-6'>
                                <div className='register-kyc'>
                                    <div className="progress">
                                        <div className="progress-bar" role="progressbar" style={{ width: "85%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                    <h1 className='register-kyc-title'>Identity Verification</h1>
                                </div>
                                <div className='register-kyc-section'>
                                    <form className='register-kyc-form' onSubmit={formik.handleSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="inputName">Identify Verification</label>
                                            <input type="text" className="form-control" name="Profilename" onChange={formik.handleChange} values={formik.values.Profilename} id="inputName" placeholder='FULL NAME ( please provide your legal first and last name )' />
                                            <div className='errors'>{formik.errors.Profilename}</div>
                                        </div>
                                        <p>
                                            We require to confirm the seller's identity. Please provide a copy of your passport/national ID/driving licence and a proof of your correspondence address (utility bill/ official mall/ bank statement/ lease agreement - first page). BluAart secures the information by storing it in an encrypted format.
                                        </p>
                                        <div className='kyc-input-fields'>
                                            <div className='row'>
                                                <div className='col-lg-6' align="center">
                                                    <label>Identity proof with photo</label><br />
                                                    <input onChange={(event) => {
                                                        formik.setFieldValue('IdProof', event.currentTarget.files[0]);
                                                    }} type="file" id="file-input" className='file-upload' name="file-input" />
                                                    <label htmlFor="file-input" className="custom-file-upload">
                                                    </label>
                                                    <div className='errors text-center'>{formik.errors.IdProof}</div>
                                                </div>
                                                <div className='col-lg-6' align="center" >
                                                    <label>Address Proof</label><br />
                                                    <input onChange={(event) => {
                                                        formik.setFieldValue('addressProof', event.currentTarget.files[0]);
                                                    }} type="file" id="file-input-address" className='file-upload' name="file-input" />
                                                    <label htmlFor="file-input-address" className="custom-file-upload">
                                                    </label>
                                                    <div className='errors text-center'>{formik.errors.addressProof}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        <div className='d-flex justify-content-center'>
                                            <button type='button' onClick={() => props.backStep()} className="cancel btn btn-primary">CANCEL</button>
                                            {apiLoading ? <button className="btn btn-primary" type="button" disabled>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Loading...
                                            </button> : <button type='submit' onClick={formik.handleSubmit} className="submit btn btn-primary">NEXT PAGE</button>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default RegisterKYC;