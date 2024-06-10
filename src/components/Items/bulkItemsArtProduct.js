import React, { useEffect, useRef, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useBulkUploadMutation, useGetCollectionInfoMutation, useGetCSVSamplesMutation } from '../../service/Apilist';
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from 'crypto-js';

const Web3 = require('web3');
export default function BulkItemsArtProduct(props) {
    let navigate = useNavigate();
    const fileInputCSVRef = useRef();
    let parms = useParams()
    const [ThumbURLstate, setThumbURLstate] = useState([]);
    const [MediaURLstate, setMediaURLstate] = useState([]);
    const [bulkCSVErrorstate, setbulkCSVErrorstate] = useState([]);
    const [CreatItemColor, setCreatItemColor] = useState("");
    const [ThumbProgress, setThumbProgress] = useState(0);
    const [ThumbProgressComplete, setThumbProgressComplete] = useState(false);
    const [MediaProgress, setMediaProgress] = useState(0);
    const [MediaProgressComplete, setMediaProgressComplete] = useState(false);
    const [apiLoading, setAPILoading] = useState(false);
    const [thumbLoading, setthumbLoading] = useState(false);
    const [mediaAPILoading, setmediaAPILoading] = useState(false);
    const [bulkUploadAPI, resBulkUploadAPI] = useBulkUploadMutation();
    const [collectionAPI, rescollectionAPI] = useGetCollectionInfoMutation();
    const [csvFileState, setCSVFileState] = useState("");
    const [bulkUploadSampleCSVAPI, resBulkUploadSampleCSVAPI] = useGetCSVSamplesMutation();
   
    const decryptedItemIdBytes = CryptoJS.AES.decrypt(parms.id, process.env.REACT_APP_SECRET_PASS);
    const decryptedItemIdString = decryptedItemIdBytes.toString(CryptoJS.enc.Utf8);
   
    const showToast = (text) => {
        toast.success(text)
    }
    const showErroToast = (text) => {
        toast.error(text);
    }
    const CollectionSchema = Yup.object().shape({
        Quantity: Yup.number()
            .typeError('Invalid Quantity')
            .required('Quantity is required')
            .positive('Quantity must be positive')
            .integer('Quantity must be an integer'),
        Media: Yup.mixed().required("Please select media folder").test(
            'fileFormat',
            'Please check your folder. Accepted JPEG , JPG & PNG file only',
            (value) => {
                if (value?.length === 0) return true;
                for (let index = 0; index < value?.length; index++) {
                    const element = value[index];
                    if (!value) return true;
                    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(element.type)) {
                        return false;
                    }
                }
                return true;
            },
        ).test(
            'Check quantity',
            'Please check quantity field',
            (value) => {
                if (formik.values.Quantity < 1) return false;
                else return true;
            },
        ),
        Thumb: Yup.mixed().required("Please select thumb folder").test(
            'fileFormat',
            'Please check your folder. Accepted JPEG , JPG & PNG file only',
            (value) => {
                if (value?.length === 0) return true;
                for (let index = 0; index < value?.length; index++) {
                    const element = value[index];
                    if (!value) return true;
                    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(element.type)) {
                        return false;
                    }
                }
                return true;
            },
        ).test(
            'Check quantity',
            'Please check quantity field',
            (value) => {
                if (formik.values.Quantity < 1) return false;
                else return true;
            },
        ),
        Document: Yup.mixed().required("Please select CSV document folder").test(
            'fileFormat',
            'Accepted CSV file only',
            (value) => {
                if (!value) return true;
                return ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'].includes(value.type);
            },
        ),
    });

    const formik = useFormik({
        initialValues: {
            Quantity: '',
            Media: '',
            Thumb: '',
            Document: null,
            PhysicalART: false
        },
        validationSchema: CollectionSchema,
        onSubmit: values => {
            setAPILoading(true)
            let formdata = new FormData();
            formdata.append("Type", "ArtProduct")
            formdata.append("csvFile", values.Document)
            formdata.append("CollectionId", encodeURIComponent(decryptedItemIdString))
            for (let index = 0; index < MediaURLstate.length; index++) {
                const element = MediaURLstate[index];
                formdata.append("Media", JSON.stringify(element))
            }
            for (let index = 0; index < ThumbURLstate.length; index++) {
                const element = ThumbURLstate[index];
                formdata.append("Thumb", JSON.stringify(element))
            }
            formdata.append("Quantity", values.Quantity)
            formdata.append("PhysicalArt", parms.type === 'physical' ? true : false,)
            bulkUploadAPI(formdata).then(res => {
                if (res.data.status) {
                    showToast(res.data.message)
                    setAPILoading(false)
                    window.location.replace("/myprofile")
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                    setbulkCSVErrorstate(res.data.errors)
                }
            }).catch(err => {
                setAPILoading(false)
            })
        },
    });
    const thumbInput = useRef(null);
    const mediaInput = useRef(null);
    const quantityChange = (value) => {

        formik.setFieldValue("Thumb", "")
        formik.setFieldValue("Media", "")
        if (thumbInput.current) {
            thumbInput.current.value = '';
        }
        if (mediaInput.current) {
            mediaInput.current.value = '';
        }
        formik.setFieldValue("Quantity", value?.target.value)
    }


    const updateThumbupload = async (file) => {
        setthumbLoading(true);
        setThumbProgressComplete(false);
        setThumbProgress(0);
        let formdata = new FormData();
        for (let index = 0; index < file.length; index++) {
            const element = file[index];
            formdata.append("Image", element)
        }
        formdata.append("Type", "Thumb")
        formdata.append("CollectionId", encodeURIComponent(decryptedItemIdString))
        formdata.append("Quantity", formik.values.Quantity)
        const response = axios.post(`${process.env.REACT_APP_API_URL}/ThumbBulkUpload`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
            },
            onUploadProgress: (progressEvent) => {
                const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                setThumbProgress(percentage);
            }
        })
        response.then(res => {
            setthumbLoading(false)
            if (res?.data?.status) {
                setThumbProgressComplete(true)
                setThumbURLstate(res.data?.Thumb);
            } else {
                showErroToast(res?.data?.message);
                formik.setFieldValue("Thumb", "")
                setThumbProgressComplete(false);
                setThumbProgress(0)
                if (thumbInput.current) {
                    thumbInput.current.value = '';
                }
            }
        })
    }
    const updateMediaupload = async (file) => {
        setmediaAPILoading(true);
        setMediaProgressComplete(false);
        setMediaProgress(0);
        let formdata = new FormData();
        for (let index = 0; index < file.length; index++) {
            const element = file[index];
            formdata.append("Image", element)

        }
        formdata.append("Type", "Media")
        formdata.append("CollectionId", encodeURIComponent(decryptedItemIdString))
        formdata.append("Quantity", formik.values.Quantity)
        const response = axios.post(`${process.env.REACT_APP_API_URL}/ThumbBulkUpload`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
            },
            onUploadProgress: (progressEvent) => {
                const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                setMediaProgress(percentage);
            }
        })
        response.then(res => {
            setmediaAPILoading(false)
            if (res?.data?.status) {
                setMediaProgressComplete(true);
                setMediaURLstate(res.data?.Thumb)
            } else {
                showErroToast(res?.data?.message);
                formik.setFieldValue("Media", "")
                setMediaProgressComplete(false);
                setMediaProgress(0);
                if (mediaInput.current) {
                    mediaInput.current.value = '';
                }
            }
        })
    }
    useEffect(() => {
        bulkUploadSampleCSVAPI({
            Type: "Artproduct"
        })
    }, [])
    useEffect(() => {
        if (resBulkUploadSampleCSVAPI?.status === "fulfilled") {
            setCSVFileState(resBulkUploadSampleCSVAPI?.data?.info?.Sample)
        }
    }, [resBulkUploadSampleCSVAPI])
    const handleDownload = () => {
        // Create a hidden link element
        const link = document.createElement('a');
        link.href = csvFileState;  // Replace with the actual file URL

        // Set the filename for the download
        link.download = 'filename.pdf';  // Replace with the desired filename

        // Simulate a click event to trigger the download
        link.click();
    };
    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-12 ">
                        <h1 className="bulk-art-title">Create bulk art product</h1>
                        {bulkCSVErrorstate?.length > 0 && <div className="bulk-error">
                            {bulkCSVErrorstate?.length > 0 && bulkCSVErrorstate?.map((error, index) => (
                                Object.keys(error).map((key, index) => (
                                    <div key={index}>
                                        <br />
                                        <li >{key}</li>
                                        <li >{error[key]}</li>
                                    </div>
                                ))
                            ))}
                        </div>}
                        <form onSubmit={formik.handleSubmit}>
                            <div className="row">
                                <div className="col-12 col-sm-12 col-lg-6 col-xl-6">
                                    <div className="mb-3 box-div-bulk">
                                        <div className="d-flex justify-content-between">
                                            <label htmlFor="collectionMedia" className="form-label ">NFT information File</label>
                                            {!resBulkUploadSampleCSVAPI.isLoading ? (
                                                <>
                                                    <div className="">
                                                        <a className="sample-csv-file" onClick={handleDownload}>Sample CSV file download</a>
                                                    </div>
                                                </>
                                            ) : null}
                                        </div>
                                        <p>Download the template file and fill in your NFT information before uploading. Supported file type: CSV.</p>
                                        <input type="button" onClick={() => fileInputCSVRef.current.click()} className="bulk-upload-file" value="Upload CSV File" />
                                        <input name="Document" accept=".csv" onChange={(e) => {
                                            formik.setFieldValue('Document', e.currentTarget.files[0])
                                        }} type="file" className="form-control" style={{ display: "none" }} id="collectionMedia" ref={fileInputCSVRef} />
                                        {formik.values.Document !== null && formik.values.Document ?
                                            <>
                                                <br />
                                                <br />
                                                <i className="fa-solid fa-file-csv"></i>&nbsp;{formik?.values?.Document?.name}
                                            </> : null}
                                        <div className="errors">{formik.errors.Document}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-lg-6 col-xl-6">
                                    <div className="mb-3 box-div-bulk">
                                        <label htmlFor="exampleInputName" className="form-label">Quantity</label>
                                        <p>Please enter quantity as a number and media , thumb file should be equal to quantity</p>
                                        <input name="Quantity" onChange={quantityChange} value={formik.values.Quantity} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                                        <div className="errors">{formik.errors.Quantity}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-lg-6 col-xl-6">
                                    <div className="mb-3 box-div-bulk">
                                        <label htmlFor="collectionthumb" className="form-label">Thumb File</label>
                                        <p>Upload Folder of Image. File types supported: JPG, PNG, JPEG.  Max number of files: 1000 files.</p>
                                        <input type="button" onClick={() => thumbInput?.current?.click()} className="bulk-upload-file" value="Upload Media Folder" />
                                        <input ref={thumbInput} name="Thumb" onChange={(e) => {
                                            if (formik.values.Quantity !== '') {
                                                formik.setFieldValue('Thumb', e.currentTarget.files)
                                                updateThumbupload(e.currentTarget.files)
                                            } else {
                                                showErroToast("Please check quantity")
                                            }
                                        }} type="file" directory="" webkitdirectory="" style={{ display: "none" }} className="form-control" id="collectionthumb" />
                                        {formik.values.Thumb !== '' ?
                                            <>
                                                <br />
                                                <br />
                                                <i className="fa-solid fa-folder"></i>&nbsp;&nbsp;
                                                {formik.values.Thumb[0]?.webkitRelativePath?.split('/')[0]}
                                                {!ThumbProgressComplete ? <div className="progress bulk-progress">
                                                    <div className="progress-bar" role="progressbar" style={{ width: `${ThumbProgress}%` }} aria-valuenow={ThumbProgress} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div> :
                                                    <>
                                                        <br />
                                                        <p className="bulk-file-complete"> <i className="fa-solid fa-check"></i> &nbsp; File upload Complete</p>
                                                    </>
                                                }
                                            </>
                                            : null}
                                        <div className="errors">{formik.errors.Thumb}</div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-12 col-lg-6 col-xl-6">
                                    <div className="mb-3 box-div-bulk">
                                        <label htmlFor="collectionthumb" className="form-label">Media File</label>
                                        <p>Upload Folder of Image. File types supported: JPG, PNG, JPEG.  Max number of files: 1000 files.</p>
                                        <input type="button" onClick={() => mediaInput?.current?.click()} className="bulk-upload-file" value="Upload Media Folder" />
                                        <input ref={mediaInput} name="Media" onChange={(e) => {
                                            if (formik.values.Quantity !== '') {
                                                formik.setFieldValue('Media', e.currentTarget.files)
                                                updateMediaupload(e.currentTarget.files)
                                            } else {
                                                showErroToast("Please check quantity")
                                            }
                                        }} type="file" directory="" webkitdirectory="" style={{ display: "none" }} className="form-control" id="collectionthumb" />
                                        {formik.values.Media !== '' ?
                                            <>
                                                <br />
                                                <br />
                                                <i className="fa-solid fa-folder"></i>&nbsp;&nbsp;
                                                {formik.values.Media[0]?.webkitRelativePath?.split('/')[0]}
                                                {!MediaProgressComplete ? <div className="progress bulk-progress">
                                                    <div className="progress-bar" role="progressbar" style={{ width: `${MediaProgress}%` }} aria-valuenow={MediaProgress} aria-valuemin="0" aria-valuemax="100"></div>
                                                </div> :
                                                    <>
                                                        <br />
                                                        <p className="bulk-file-complete"> <i className="fa-solid fa-check"></i> &nbsp; File upload Complete</p>
                                                    </>
                                                }
                                            </>
                                            : null}
                                        <div className="errors">{formik.errors.Media}</div>

                                    </div>
                                </div>
                                <br />
                                <center>
                                    {apiLoading || mediaAPILoading || thumbLoading ?
                                        <button className="btn btn-primary submit-bulk" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Loading...
                                        </button>
                                        : <button type="submit" className="btn btn-primary submit-bulk">Submit</button>
                                    }
                                </center>
                            </div>
                        </form>
                        <br />
                    </div>
                </div>
            </div>
        </>
    );
}