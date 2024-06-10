import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';
import { useGetCollectionInfoMutation, useUpdateCollectionMutation } from '../../service/Apilist';
import LoadingScreen from "../Loader/LoadingScreen";
export default function EditCollection(props) {
    const parms = useParams();
    let navigate = useNavigate();
    const [ThumbURLstate, setThumbURLstate] = useState("");
    const [MediaURLstate, setMediaURLstate] = useState("");
    const [apiLoading, setAPILoading] = useState(false);
    const [getApiLoading, setgetApiLoading] = useState(false);
    const [updateCollectionAPI, resUpdateCollectionAPI] = useUpdateCollectionMutation();
    const [collectionGetinfo, rescollectionGetInfo] = useGetCollectionInfoMutation();

    const decryptedItemIdBytes = CryptoJS.AES.decrypt(parms.id, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);


    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const CollectionSchema = Yup.object().shape({
        Name: Yup.string()
            .min(4, 'Name must be atleast four letters')
            .max(50, 'Name must be minimum 50 letters')
            .required('Name is required'),
        Description: Yup.string()
            .min(100, 'Description must be atleast 100 letters')
            .required('Description is required'),
        Thumb: Yup.mixed().test(
            'fileFormat',
            'Unsupported Format',
            (value) => {
                if (!value) return true;
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            },
        ),
        Banner: Yup.mixed().test(
            'fileFormat',
            'Unsupported Format',
            (value) => {
                if (!value) return true;
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            },
        ),
        Royalties: Yup.number().required('Royalties is required'),

    });

    const formik = useFormik({
        initialValues: {
            Name: '',
            Description: '',
            Banner: null,
            Thumb: null,
            Royalties: 0,

        },
        validationSchema: CollectionSchema,
        onSubmit: values => {
            setAPILoading(true)
            const formData = new FormData();
            formData.append('Name', values.Name);
            formData.append('Description', values.Description);
            formData.append('Banner', values.Banner);
            formData.append('Thumb', values.Thumb);
            formData.append('Royalties', values.Royalties);
            formData.append('Currency', values.Currency);
            formData.append('CollectionId', encodeURIComponent(decryptedItemIdBytes));
            updateCollectionAPI(formData).then(res => {
                if (res.data.status) {
                    showToast(res.data.message)
                    setAPILoading(false)
                    navigate("/my-collection")
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch(err => {
                setAPILoading(false)
            })
        },
    });
    useEffect(() => {
        collectionGetinfo({
            CollectionId: encodeURIComponent(decryptedItemIdBytes)
        })
    }, [])
    useEffect(() => {
        setAPILoading(true)
        setgetApiLoading(true)
        if (rescollectionGetInfo?.status === "fulfilled") {
            if (rescollectionGetInfo?.data?.status) {
                formik.setValues({
                    Name: rescollectionGetInfo?.data?.data[0].CollectionInfo?.Name,
                    Description: rescollectionGetInfo?.data?.data[0].CollectionInfo?.Description,
                    Royalties: rescollectionGetInfo?.data?.data[0].CollectionInfo?.Royalties,
                    Currency: rescollectionGetInfo?.data?.data[0].CollectionInfo?.Currency
                })
                // setMediaURLstate(rescollectionGetInfo?.data?.data[0].CollectionInfo?.Banner);
                // setThumbURLstate(rescollectionGetInfo?.data?.data[0].CollectionInfo?.Thumb);
                setAPILoading(false)
                setgetApiLoading(false)
            }
        }
    }, [rescollectionGetInfo?.status])

    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>Edit collection</h1>
                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="exampleInputName" className="form-label">Name</label>
                                <input name="Name" onChange={formik.handleChange} value={formik.values.Name} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                                <div className="errors">{formik.errors.Name}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputDescription" className="form-label">Description</label>
                                <textarea name="Description" onChange={formik.handleChange} value={formik.values.Description} className="form-control" id="textAreaExample1" rows="4"></textarea>
                                <div className="errors">{formik.errors.Description}</div>
                            </div>
                            <div className="mb-3">
                                <img src={ThumbURLstate ? URL.createObjectURL(ThumbURLstate) : rescollectionGetInfo?.data?.data[0].CollectionInfo?.Thumb} width="250px" height="350px" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="collectionthumb" className="form-label">Thumb  <i>(Low-resolution image and 350 x 350 px recommended)</i></label>
                                <input name="Thumb" onChange={(e) => {
                                    formik.setFieldValue('Thumb', e.currentTarget.files[0])
                                    setThumbURLstate(e.currentTarget.files[0])


                                }} type="file" className="form-control" id="collectionthumb" />
                                <div className="errors">{formik.errors.Thumb}</div>
                            </div>
                            <div className="mb-3">
                                <img src={MediaURLstate ? URL.createObjectURL(MediaURLstate) : rescollectionGetInfo?.data?.data[0].CollectionInfo?.Banner} width="250px" height="350px" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="collectionMedia" className="form-label">Media <i>(High-Resolution image and 350 x 350 px recommended)</i></label>
                                <input name="Banner" onChange={(e) => {
                                    formik.setFieldValue('Banner', e.currentTarget.files[0])
                                    setMediaURLstate(e.currentTarget.files[0])
                                }} type="file" className="form-control" id="collectionMedia" />
                                <div className="errors">{formik.errors.Banner}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="royalties" className="form-label">Royalties</label>
                                <select name="Royalties" onChange={formik.handleChange} value={formik.values.Royalties} className="form-select" aria-label="Default select example">
                                    <option value=""></option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                </select>
                                <div className="errors">{formik.errors.Royalties}</div>
                            </div>
                            {apiLoading ?
                                <button className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                                : <button type="submit" className="btn btn-primary">Submit</button>
                            }
                        </form>
                        <br />
                    </div>
                </div>
            </div>
            {getApiLoading ? <LoadingScreen text={"Please wait..."} /> : null}
        </>
    );
}