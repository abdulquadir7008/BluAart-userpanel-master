import React, { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap';
import "../../styles/Artist.css";
import { Link, useNavigate } from 'react-router-dom';
import {
    useGetProfileInfoQuery,    
    useGetCountiesQuery,
    useAddAddressMutation,
    useGetAddressListQuery,
    useGetOneAddressMutation,
    useEditAddressMutation,
    useDeleteAddressMutation
} from "../../service/Apilist";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import { default as ReactSelect } from "react-select";
import LoadingScreen from '../Loader/LoadingScreen';

function Myaddress() {
    let navigate = useNavigate();
    const profileInfo = useGetProfileInfoQuery();
    const getAllListAddress = useGetAddressListQuery();
    const [updateAddressAPI, updateAddressAPIResult] = useAddAddressMutation();
    const [getOneAddressAPI, resgetOneAddressAPI] = useGetOneAddressMutation();
    const [editAddressAPI, reseditAddressAPI] = useEditAddressMutation();
    const [deleteAddressAPI, resdeleteAddressAPI] = useDeleteAddressMutation();
    const [profileState, setprofileState] = useState({});
    const [addressListState, setAddressListState] = useState([]);
    const [apiLoading, setAPILoading] = useState(false);


    useEffect(() => {
        setAPILoading(true)
        if (profileInfo?.status === "fulfilled") {
            if (profileInfo?.data?.info) {
                setprofileState(profileInfo?.data?.info[0]);
                setAPILoading(false)
            }
        }
    }, [profileInfo])
    useEffect(() => {
        setAPILoading(true)
        if (getAllListAddress?.status === "fulfilled") {
            if (getAllListAddress?.data?.info) {
                setAddressListState(getAllListAddress?.data?.info);
                setAPILoading(false)
            }
        }
    }, [getAllListAddress])

    const getCounties = useGetCountiesQuery();
    const [country, setCountry] = useState([]);
    useEffect(() => {
        if (getCounties.status === "fulfilled") {
            setCountry(getCounties.data.info)
        }

    }, [getCounties])
    const [showAddAddressState, setShowAddAddressState] = useState(false);
    const [showEditAddressState, setShowEditAddressState] = useState(false);
    const handleAddAddressClose = () => setShowAddAddressState(false);
    const handleAddAddressShow = () => setShowAddAddressState(true);
    const handleEditAddressClose = () => setShowEditAddressState(false);
    const handleEditAddressShow = () => setShowEditAddressState(true);
    const getOneAddress = (id) => {
        getOneAddressAPI({
            Id: id
        })
        handleEditAddressShow()
    }
    const addAddressSchema = Yup.object().shape({
        CountryName: Yup.string().required('Country is required')
            .test('country-name', 'Country is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        AddressLine1: Yup.string().required('Address line is required'),
        AddressLine2: Yup.string().required('Address line is required'),
        State: Yup.string().required('State is required')
            .test('country-name', 'State is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        MobileNo: Yup.number().required('Phone number is required'),
        PostalCode: Yup.string()
            .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode')
            .required('postal code is required')
        ,
        CountryCode: Yup.object().required('Code is required'),
        CityName: Yup.string().required('City is required')
            .test('country-name', 'City is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        primary: Yup.boolean(),
    });

    const formik = useFormik({
        initialValues: {
            CityName: "",
            CountryCode: "",
            PostalCode: "",
            AddressLine1: "",
            AddressLine2: "",
            CountryName: "",
            State: "",
            MobileNo: '',
            primary: false
        },
        validationSchema: addAddressSchema,
        onSubmit: values => {
            setAPILoading(true)
            updateAddressAPI({
                AddressLine1: values.AddressLine1,
                AddressLine2: values.AddressLine2,
                CityName: values.CityName,
                State: values.State,
                PostalCode: values.PostalCode,
                CountryName: values.CountryName,
                CountryCode: values.CountryCode?.dial_code,
                MobileNo: values.MobileNo,
                PrimaryAddress: values.primary
            }).then(res => {
                if (res?.data?.status) {
                    setAPILoading(false)
                    getAllListAddress.refetch()
                    showToast(res.data.info)
                    navigate("/myprofile");
                    setShowAddAddressState(false);
                } else {
                    showErroToast(res?.error?.data?.message);
                    setAPILoading(false)
                }
            });
        },
    });

    const EditAddressSchema = Yup.object().shape({
        CountryName: Yup.string().required('Country is required')
            .test('country-name', 'Country is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        AddressLine1: Yup.string().required('Address line is required'),
        AddressLine2: Yup.string().required('Address line is required'),
        State: Yup.string().required('State is required')
            .test('country-name', 'State is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        MobileNo: Yup.number().required('Phone number is required'),
        PostalCode: Yup.string()
            .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode')
            .required('postal code is required')
        ,
        CountryCode: Yup.object().required('Code is required'),
        CityName: Yup.string().required('City is required')
            .test('country-name', 'City is not a number only', function (value) {
                return isNaN(Number(value));
            })
        ,
        primary: Yup.boolean(),
    });

    const Editformik = useFormik({
        initialValues: {
            CityName: "",
            CountryCode: "",
            PostalCode: "",
            AddressLine1: "",
            AddressLine2: "",
            CountryName: "",
            State: "",
            MobileNo: '',
            Id: "",
            primary: false
        },
        validationSchema: EditAddressSchema,
        onSubmit: values => {
            setAPILoading(true)
            editAddressAPI({
                AddressLine1: values.AddressLine1,
                AddressLine2: values.AddressLine2,
                CityName: values.CityName,
                CountryName: values.CountryName,
                State: values.State,
                PostalCode: values.PostalCode,
                CountryCode: values.CountryCode?.dial_code,
                MobileNo: values.MobileNo,
                Id: values.Id,
                PrimaryAddress: values.primary
            }).then(res => {
                if (res?.data?.status) {
                    setAPILoading(false)
                    getAllListAddress.refetch()
                    showToast(res.data.info)
                    handleEditAddressClose()
                } else {
                    showErroToast(res?.error?.data?.message);
                    setAPILoading(false)
                }
            });
        },
    });
    useEffect(() => {
        if (resgetOneAddressAPI?.status === "fulfilled") {
            if (resgetOneAddressAPI?.data?.info) {
                let countryFilter = country.filter(country => country?.dial_code === resgetOneAddressAPI?.data?.info.CountryCode)
                Editformik.setValues({
                    AddressLine1: resgetOneAddressAPI?.data?.info.AddressLine1,
                    AddressLine2: resgetOneAddressAPI?.data?.info.AddressLine2,
                    CityName: resgetOneAddressAPI?.data?.info.CityName,
                    CountryName: resgetOneAddressAPI?.data?.info.CountryName,
                    State: resgetOneAddressAPI?.data?.info.State,
                    PostalCode: resgetOneAddressAPI?.data?.info.PostalCode,
                    CountryCode: countryFilter[0],
                    MobileNo: resgetOneAddressAPI?.data?.info.MobileNo,
                    Id: resgetOneAddressAPI?.data?.info._id,
                    primary: resgetOneAddressAPI?.data?.info.PrimaryAddress,
                })
            }
        }
    }, [resgetOneAddressAPI?.status])
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
            height: '50px',
            padding: '0 6px'
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
        }),

        indicatorsContainer: (provided) => ({
            ...provided,
            height: '45px',
        }),
    }
    const deleteAddress = (id) => {
        deleteAddressAPI({
            Id: id
        }).then((res) => {
            showToast(res?.data?.info)
            getAllListAddress.refetch()
        })
    }
    return (
        <>
            <Container fluid className='artistUserImage'>
                <div className='container'>
                    <div className='row d-flex align-items-center justify-content-center artistUserImageContent'>
                        <div className='col-lg-4 d-flex align-items-center justify-content-center'>
                            <img src={profileState?.ProfilePicture} width="200px" height="250px" className="artistPerson" alt="img"></img>
                        </div>
                        <div className='col-lg-8'>
                            <div className='d-flex justify-content-end'>
                                <Link to="/myprofile/edit" className='btn btn-secondary'>Edit Profile</Link>
                            </div>
                            <br />
                            <br />
                            <div className='artistBorder'>
                                <p>{sessionStorage.getItem('role')}</p>
                            </div>
                            <div className='artistContent'>
                                <p className='artistContentTitle'>{profileState?.ProfileName}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </Container>
            <br />
            <div className='container'>
                <div className='row'>
                    <div className='col-12'>
                        <div className='d-flex justify-content-end'>
                            <button onClick={() => handleAddAddressShow(true)} className='btn btn-secondary'>Add address</button>
                        </div>
                        <div className="container">
                            <div className="row">
                                {addressListState?.length > 0 && addressListState.map((address, index) => (
                                    <div className='col-4'>
                                        <div className='address-section'>
                                            <h5>Address</h5>
                                            <button onClick={() => deleteAddress(address?._id)} className='btn' style={{ float: "right" }}><i className='fa fa-trash'></i></button>
                                            <button onClick={() => getOneAddress(address?._id)} className='btn' style={{ float: "right" }}><i className='fa fa-edit'></i></button>
                                            <label>Address : <span>{address.AddressLine1}</span></label><br />
                                            <label><span>{address.AddressLine2}</span></label><br />
                                            <label>City Name : <span>{address.CityName}</span></label><br />
                                            <label>State : <span>{address.State}</span></label><br />
                                            <label>Country Name : <span>{address.CountryName}</span></label><br />
                                            <label>PostalCode  : <span>{address.PostalCode}</span></label><br />
                                            <label>MobileNo  : <span>{address.CountryCode}{address.MobileNo}</span></label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <br />
                    </div>
                </div>
            </div>
            <Modal show={showAddAddressState} onHide={handleAddAddressClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className='' onSubmit={formik.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="inputCountry">COUNTRY</label>
                            <input type="text" onChange={formik.handleChange} value={formik.values.CountryName} name='CountryName' className="form-control" id="inputCountryName" aria-describedby="emailHelp" />
                        </div>
                        <div className='errors'>{formik.errors.CountryName}</div>
                        <div className="form-group">
                            <label htmlFor="inputAddressOne">ADDRESS LINE 1</label>
                            <input type="text" name='AddressLine1' onChange={formik.handleChange} value={formik.values.AddressLine1} className="form-control" id="inputAddressLine1" />
                        </div>
                        <div className='errors'>{formik.errors.AddressLine1}</div>
                        <div className="form-group">
                            <label htmlFor="inputAddressTwo">ADDRESS LINE 2</label>
                            <input type="text" name='AddressLine2' onChange={formik.handleChange} value={formik.values.AddressLine2} className="form-control" id="inputAddressLine2" />
                        </div>
                        <div className='errors'>{formik.errors.AddressLine2}</div>
                        <div className="form-group">
                            <label htmlFor="inputStateRegion">STATE PROVIENCE REGION</label>
                            <input type="text" name='State' onChange={formik.handleChange} value={formik.values.State} className="form-control" id="inputStateRegion" />
                        </div>
                        <div className='errors'>{formik.errors.State}</div>
                        <div className="form-group">
                            <div className='row'>
                                <div className='col-6'>
                                    <div className="form-group">
                                        <label htmlFor="inputPostalCode">POSTAL CODE </label>
                                        <input type="text" onChange={formik.handleChange} value={formik.values.PostalCode} name="PostalCode" className="form-control" id="inputPostalCode" />
                                    </div>
                                    <div className='errors'>{formik.errors.PostalCode}</div>
                                </div>
                                <div className='col-6'>
                                    <div className="form-group">
                                        <label htmlFor="inputTwonCity">TOWN CITY</label>
                                        <input type="text" name='CityName' onChange={formik.handleChange} value={formik.values.CityName} className="form-control" id="inputTwonCityName" />

                                    </div>
                                    <div className='errors'>{formik.errors.CityName}</div>
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
                                            name="CountryCode"
                                            className='country-select-box'
                                            styles={CustomStyle}
                                            placeholder="Code"
                                            value={formik.values.CountryCode}
                                            options={country}
                                            onChange={(value) => formik.setFieldValue('CountryCode', value)}
                                            getOptionValue={(opt) => opt.dial_code}
                                            getOptionLabel={e => (
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <img width={25} src={e.flag} alt='flag' />
                                                    <span style={{ marginLeft: 5 }}>{e.dial_code}</span>
                                                </div>
                                            )}
                                        />
                                        <div className='errors'>{formik.errors.CountryCode}</div>
                                    </div>
                                </div>

                                <div className='col-lg-8'>
                                    <input type="tel" className="form-control" id="mobile" onChange={formik.handleChange} value={formik.values.MobileNo} name="MobileNo" />
                                    <div className='errors'>{formik.errors.MobileNo}</div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="form-check">
                            <input type="checkbox" name='primary' onChange={formik.handleChange} className="form-check-input" id="checkbox-two" />
                            <label className="form-check-label" htmlFor="checkbox-two">Primary address</label>
                        </div>
                        <div className='errors'>{formik.errors.primary}</div>
                        <hr></hr>
                        <div className='d-flex justify-content-end'>
                            <button type="submit" className="submit btn btn-primary">Submit</button>
                        </div>

                    </form>
                </Modal.Body>
            </Modal>
            <Modal show={showEditAddressState} onHide={handleEditAddressClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {resgetOneAddressAPI.isLoading ? (<>
                        <h6>Loading</h6>
                    </>) : (<>

                        <form className='' onSubmit={Editformik.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="inputCountry">COUNTRY</label>
                                <input type="text" onChange={Editformik.handleChange} value={Editformik.values.CountryName} name='CountryName' className="form-control" id="inputCountryName" aria-describedby="emailHelp" />
                            </div>
                            <div className='errors'>{Editformik.errors.CountryName}</div>
                            <div className="form-group">
                                <label htmlFor="inputAddressOne">ADDRESS LINE 1</label>
                                <input type="text" name='AddressLine1' onChange={Editformik.handleChange} value={Editformik.values.AddressLine1} className="form-control" id="inputAddressLine1" />
                            </div>
                            <div className='errors'>{Editformik.errors.AddressLine1}</div>
                            <div className="form-group">
                                <label htmlFor="inputAddressTwo">ADDRESS LINE 2</label>
                                <input type="text" name='AddressLine2' onChange={Editformik.handleChange} value={Editformik.values.AddressLine2} className="form-control" id="inputAddressLine2" />
                            </div>
                            <div className='errors'>{Editformik.errors.AddressLine2}</div>
                            <div className="form-group">
                                <label htmlFor="inputStateRegion">STATE PROVIENCE REGION</label>
                                <input type="text" name='State' onChange={Editformik.handleChange} value={Editformik.values.State} className="form-control" id="inputStateRegion" />
                            </div>
                            <div className='errors'>{Editformik.errors.State}</div>
                            <div className="form-group">
                                <div className='row'>
                                    <div className='col-6'>
                                        <div className="form-group">
                                            <label htmlFor="inputPostalCode">POSTAL CODE </label>
                                            <input type="text" onChange={Editformik.handleChange} value={Editformik.values.PostalCode} name="PostalCode" className="form-control" id="inputPostalCode" />
                                        </div>
                                        <div className='errors'>{Editformik.errors.PostalCode}</div>
                                    </div>
                                    <div className='col-6'>
                                        <div className="form-group">
                                            <label htmlFor="inputTwonCity">TOWN CITY</label>
                                            <input type="text" name='CityName' onChange={Editformik.handleChange} value={Editformik.values.CityName} className="form-control" id="inputTwonCityName" />

                                        </div>
                                        <div className='errors'>{Editformik.errors.CityName}</div>
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
                                                name="CountryCode"
                                                className='country-select-box'
                                                styles={CustomStyle}
                                                placeholder="Code"
                                                value={Editformik.values.CountryCode}
                                                options={country}
                                                onChange={(value) => Editformik.setFieldValue('CountryCode', value)}
                                                getOptionValue={(opt) => opt.dial_code}
                                                getOptionLabel={e => (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <img width={25} src={e.flag} alt='flag' />
                                                        <span style={{ marginLeft: 5 }}>{e.dial_code}</span>
                                                    </div>
                                                )}
                                            />
                                            <div className='errors'>{Editformik.errors.CountryCode}</div>
                                        </div>
                                    </div>
                                    <div className='col-lg-8'>
                                        <input type="tel" className="form-control" id="mobile" onChange={Editformik.handleChange} value={Editformik.values.MobileNo} name="MobileNo" />
                                        <div className='errors'>{Editformik.errors.MobileNo}</div>
                                    </div>
                                </div>
                            </div>
                            <br />
                            <div className="form-check">
                                <input type="checkbox" name='primary' checked={Editformik.values.primary} onChange={Editformik.handleChange} className="form-check-input" id="checkbox-two" />
                                <label className="form-check-label" htmlFor="checkbox-two">Primary address</label>
                            </div>
                            <div className='errors'>{Editformik.errors.primary}</div>
                            <hr></hr>
                            <div className='d-flex justify-content-end'>
                                <button type="submit" className="submit btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </>)}
                </Modal.Body>
            </Modal>
            {apiLoading ? <LoadingScreen/> : null}
        </>
    )
}

export default Myaddress;