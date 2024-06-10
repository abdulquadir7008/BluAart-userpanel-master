import React, { useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useCreateCollectionMutation } from '../../service/Apilist';
import { useNavigate } from "react-router-dom";
export default function CreateCollection(props) {
    let navigate = useNavigate();
    const [ThumbURLstate, setThumbURLstate] = useState("");
    const [MediaURLstate, setMediaURLstate] = useState("");
    const [apiLoading, setAPILoading] = useState(false);
    const [createCollectionAPI, resCreateCollectionAPI] = useCreateCollectionMutation();

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
        Thumb: Yup.mixed().required('Thumb image is required').test(
            'fileFormat',
            'Unsupported Format',
            (value) => {
                if (!value) return false;
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            },
        ),
        Banner: Yup.mixed().required('Media image is required').test(
            'fileFormat',
            'Unsupported Format',
            (value) => {
                if (!value) return false;
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            },
        ),
        Royalties: Yup.number().required('Royalties is required'),
        Currency: Yup.string().required('Currency is required'),

    });

    const formik = useFormik({
        initialValues: {
            Name: '',
            Description: '',
            Banner: '',
            Thumb: '',
            Royalties: 0,
            Currency: ''
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
            createCollectionAPI(formData).then(res => {
                if (res.data.status) {
                    showToast(res.data.message)
                    setAPILoading(false)
                    navigate("/my-collection")
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch((error) => {
                setAPILoading(false)
                showErroToast(error?.message)
            })
        },
    });
    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h1>Create collection</h1>
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
                                <label htmlFor="collectionthumb" className="form-label">Thumb <i>(Low-resolution image and 350 x 350 px recommended)</i></label>
                                <input name="Thumb" onChange={(e) => {
                                    formik.setFieldValue('Thumb', e.currentTarget.files[0])
                                }} type="file" className="form-control" id="collectionthumb" />
                                <div className="errors">{formik.errors.Thumb}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="collectionMedia" className="form-label">Media <i>(High-Resolution image and 350 x 350 px recommended)</i></label>
                                <input name="Banner" onChange={(e) => {
                                    formik.setFieldValue('Banner', e.currentTarget.files[0])
                                }} type="file" className="form-control" id="collectionMedia" />
                                <div className="errors">{formik.errors.Banner}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="royalties" className="form-label">Royalties</label>
                                <select name="Royalties" onChange={formik.handleChange} value={formik.values.Royalties} className="form-select" aria-label="Default select example">
                                    <option value=""></option>
                                    <option value="0">0 %</option>
                                    <option value="1">1 %</option>
                                    <option value="2">2 %</option>
                                    <option value="3">3 %</option>
                                    <option value="4">4 %</option>
                                    <option value="5">5 %</option>
                                    <option value="6">6 %</option>
                                    <option value="7">7 %</option>
                                    <option value="8">8 %</option>
                                    <option value="9">9 %</option>
                                    <option value="10">10 %</option>
                                </select>
                                <div className="errors">{formik.errors.Royalties}</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="block" className="form-label">Blockchain</label>
                                <select name="Currency" onChange={formik.handleChange} value={formik.values.Currency} className="form-select" aria-label="Default select example">
                                    <option value=""></option>
                                    <option value="ETH">ETH</option>
                                    <option value="MATIC">MATIC</option>
                                </select>
                                <div className="errors">{formik.errors.Currency}</div>
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
        </>
    );
}