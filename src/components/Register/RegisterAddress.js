import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import '../../styles/registerForm.css';

import { useGetCountiesQuery, useAddressUpdateRegistrationMutation } from './../../service/Apilist';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { default as ReactSelect } from "react-select";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { validate } from 'postal-codes-js';
function RegisterAddress(props) {
    const storedData = sessionStorage.getItem("registerToken");
    
    const getCounties = useGetCountiesQuery();
    const [updateAddressAPI, updateAddressAPIResult] = useAddressUpdateRegistrationMutation();
    
    const [countryObj, setCountryObj] = useState({})
    const [country, setCountry] = useState([]);
    useEffect(() => {
        if (getCounties.status === "fulfilled") {
            setCountry(getCounties.data.info)
        }

    }, [getCounties])

    const SignupAddressSchema = Yup.object().shape({
        Country: Yup.object().required('Country is required')
            .test('country-name', 'Country is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        addressOne: Yup.string().required('Address line is required'),
        addressTwo: Yup.string().required('Address line is required'),
        state: Yup.string().required('State is required')
            .test('country-name', 'State is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        postalCode: Yup.string()
            .required('postal code is required')
            .test(
                "post code check",
                "Invalid postal code",
                function (value) {
                    if (validate(countryObj?.code, value) === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            )
        ,
        city: Yup.string().required('City is required')
            .test('country-name', 'City is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        countryCode: Yup.object().required('Code is required'),
        mobileNumber: Yup.string()
            .required('Mobile number is required').test(
                "test phone number valid based on country",
                "Invalid number",
                function (value) {
                    const phoneNumberObj = parsePhoneNumberFromString(value, countryObj?.code);
                    if (phoneNumberObj && phoneNumberObj.isValid()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            ),
    });

    const formik = useFormik({
        initialValues: {
            Country: '',
            addressOne: '',
            addressTwo: '',
            state: '',
            postalCode: '',
            mobileNumber: '',
            city: '',
            countryCode: '',           
        },
        validationSchema: SignupAddressSchema,
        onSubmit: values => {
            updateAddressAPI({
                Auth: storedData,
                Address1: values.addressOne,
                Address2: values.addressTwo,
                City: values.city,
                State: values.state,
                Pincode: values.postalCode,
                CountryCode: values.countryCode?.dial_code,
                MobileNo: values.mobileNumber,
                Country: values.Country.name
            }).then(res => {
                if (res?.data?.status) {
                    showToast(res.data.message);
                    sessionStorage.setItem("registerToken", res.data.response);
                    props.nextStep();
                } else {
                    showErroToast(res?.error?.data?.message);
                }
            });
        },
    });
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }

    const CustomStyle = {
        menuList: styles => ({
            ...styles,
            background: 'papayawhip',
        }),
        option: (styles, { isFocused, isSelected }) => ({
            ...styles,
            background: isFocused
                ? '#084595'
                : isSelected
                    ? 'white'
                    : 'white',
            color: 'black',
            zIndex: 1,
        }),
        menu: base => ({
            ...base,
            zIndex: 100,
        }),
        valueContainer: (provided) => ({
            ...provided,
            height: '45px',
            padding: '0px 0px 0px 6px'
        }),
        control: (provided, state) => ({
            ...provided,
            background: '#fff',
            borderColor: '#9e9e9e',
            minHeight: '30px',
            height: '45px',
            boxShadow: state.isFocused ? null : null,
        }),
        input: (provided) => ({
            ...provided,
            margin: '0px',
            height: '45px',
        }),

        indicatorsContainer: (provided) => ({
            ...provided,
            height: '45px',
        }),
    }
    return (
        <Container>
            <div className='row'>
                <div className='offset-lg-3 col-lg-6'>
                    <div className='row'>
                        <center>
                            <div className='register-address'>
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: "80%" }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <h1 className='register-address-title'>Address Details</h1>
                            </div>
                        </center>
                    </div>
                    <form className='register-address-form' onSubmit={formik.handleSubmit}>
                        <p className='register-address-form-title'>The Address will be used for shipping and billing address</p>
                        <div className="form-group">
                            <label htmlFor="inputCountry">COUNTRY</label>
                            <ReactSelect
                                id='debugSelect'
                                name="Country"
                                className='country-select-box'
                                styles={CustomStyle}
                                placeholder="COUNTRY"
                                value={formik.values.Country}
                                options={country}
                                onChange={(value) => {
                                    setCountryObj(value);
                                    formik.setValues({
                                        Country: value,
                                        countryCode: value
                                    })
                                }
                                }
                                getOptionValue={(opt) => opt.name}
                                getOptionLabel={e => (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img width={25} src={e.flag} alt='country-flag' />
                                        <span style={{ marginLeft: 5 }}>{e.name}</span>
                                    </div>
                                )}
                            />
                        </div>
                        <div className='errors'>{formik.errors.Country}</div>
                        <div className="form-group">
                            <label htmlFor="inputAddressOne">ADDRESS LINE 1</label>
                            <input type="text" name='addressOne' onChange={formik.handleChange} value={formik.values.addressOne} className="form-control" id="inputAddressOne" />
                        </div>
                        <div className='errors'>{formik.errors.addressOne}</div>
                        <div className="form-group">
                            <label htmlFor="inputAddressTwo">ADDRESS LINE 2</label>
                            <input type="text" name='addressTwo' onChange={formik.handleChange} value={formik.values.addressTwo} className="form-control" id="inputAddressTwo" />
                        </div>
                        <div className='errors'>{formik.errors.addressTwo}</div>
                        <div className="form-group">
                            <label htmlFor="inputStateRegion">STATE PROVIENCE REGION</label>
                            <input type="text" name='state' onChange={formik.handleChange} value={formik.values.state} className="form-control" id="inputStateRegion" />
                        </div>
                        <div className='errors'>{formik.errors.state}</div>
                        <div className="form-group">
                            <div className='row'>
                                <div className='col-6'>
                                    <div className="form-group">
                                        <label htmlFor="inputPostalCode">POSTAL CODE </label>
                                        <input type="text" onChange={formik.handleChange} value={formik.values.postalCode} name="postalCode" className="form-control" id="inputPostalCode" />
                                    </div>
                                    <div className='errors'>{formik.errors.postalCode}</div>
                                </div>
                                <div className='col-6'>
                                    <div className="form-group">
                                        <label htmlFor="inputTwonCity">TOWN CITY</label>
                                        <input type="text" name='city' onChange={formik.handleChange} value={formik.values.city} className="form-control" id="inputTwonCity" />

                                    </div>
                                    <div className='errors'>{formik.errors.city}</div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobile">MOBILE NUMBER</label>
                            <div className="input-group">
                                <div className="col-lg-4">
                                    <div>
                                        <ReactSelect
                                            id='debugSelect'
                                            name="countryCode"
                                            className='country-select-box'
                                            styles={CustomStyle}
                                            placeholder="Code"
                                            value={formik.values.countryCode}
                                            options={country}
                                            onChange={(value) => formik.setFieldValue('countryCode', value)}
                                            getOptionValue={(opt) => opt.dial_code}
                                            getOptionLabel={e => (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img width={25} src={e.flag} alt='country-flag' />
                                                    <span style={{ marginLeft: 5 }}>{e.dial_code}</span>
                                                </div>
                                            )}
                                        />
                                        <div className='errors'>{formik.errors.countryCode}</div>
                                    </div>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="tel" className="form-control" id="mobile" onChange={formik.handleChange} value={formik.values.mobileNumber} name="mobileNumber" />
                                    <div className='errors'>{formik.errors.mobileNumber}</div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className='d-flex justify-content-end'>
                            <button type='button' onClick={() => props.backStep()} className="cancel btn btn-primary">CANCEL</button>
                            <button type="submit" className="submit btn btn-primary">NEXT PAGE</button>
                        </div>
                    </form>
                </div>
            </div>
        </Container>
    );
}

export default RegisterAddress;