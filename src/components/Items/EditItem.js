import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useCreateItemMutation, useGetStylesQuery, useGetMediumQuery, useGetMaterialsQuery, useGetCategoryQuery, useGetItemInfoMutation, useUpdateItemMutation } from '../../service/Apilist';
import { useNavigate, useParams } from "react-router-dom";
import { CompactPicker } from 'react-color';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
export default function EditItem(props) {
    let navigate = useNavigate();
    let parms = useParams()
    const [ThumbURLstate, setThumbURLstate] = useState("");
    const [MediaURLstate, setMediaURLstate] = useState("");
    const [CreatItemColor, setCreatItemColor] = useState("");
    const [StylesAPI, setStylesAPI] = useState([]);
    const [MediumAPI, setMediumAPI] = useState([]);
    const [MaterialsAPI, setMaterialsAPI] = useState([]);
    const [CategoryAPI, setCategoryAPI] = useState([]);
    const [apiLoading, setAPILoading] = useState(false);
    const getStyles = useGetStylesQuery();
    const getMedium = useGetMediumQuery();
    const getMaterials = useGetMaterialsQuery();
    const category = useGetCategoryQuery();
    const [formValues, setFormValues] = useState([])
    const [formValuesforLevel, setFormValuesforLevel] = useState([])
    const [formValuesforStats, setFormValuesforStats] = useState([])
    const [propertiesValues, setpropertiesValues] = useState([])
    const [levelValues, setlevelValues] = useState([])
    const [statValues, setstatValues] = useState([])
    const [getAllItemInfo, resAllItemInfo] = useGetItemInfoMutation();
    const [updateItemAPI, resupdateItemAPI] = useUpdateItemMutation();
    const [itemDetailState, setitemDetails] = useState({});
    useEffect(() => {
        getAllItemInfo({
            ItemId: parms.id
        })

    }, [])

    let addFormFields = () => {
        setFormValues([...formValues, { type: "", name: "" }])
    }
    let addFormFieldsforLevel = () => {
        setFormValuesforLevel([...formValuesforLevel, { type: "", value: "", valueof: "" }])
    }
    let addFormFieldsforStats = () => {
        setFormValuesforStats([...formValuesforStats, { type: "", value: "", valueof: "" }])
    }
    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }
    let removeFormFieldsforLevel = (i) => {
        let newFormValues = [...formValuesforLevel];
        newFormValues.splice(i, 1);
        setFormValuesforLevel(newFormValues)
    }
    let removeFormFieldsforStats = (i) => {
        let newFormValues = [...formValuesforStats];
        newFormValues.splice(i, 1);
        setFormValuesforStats(newFormValues)
    }
    let handleChange = (i, e) => {
        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValues(newFormValues);
    }
    let handleChangeforLevel = (i, e) => {
        let newFormValues = [...formValuesforLevel];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValuesforLevel(newFormValues);
        
    }
    let handleChangeforLevelOne = (i, e) => {
        let newFormValues = [...formValuesforLevel];
        newFormValues[i][e.target.name] = e.target.valueOne;
        setFormValuesforLevel(newFormValues);
    }
    let handleChangeforStats = (i, e) => {
        let newFormValues = [...formValuesforStats];
        newFormValues[i][e.target.name] = e.target.value;
        setFormValuesforStats(newFormValues);
        
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        setpropertiesValues(formValues)
    }
    const handleSubmitforLevel = (event) => {
        event.preventDefault();
        setlevelValues(formValuesforLevel);
    }
    const handleSubmitforStats = (event) => {
        event.preventDefault();
        setstatValues(formValuesforStats);
    }
    // for properties
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // for levels
    const [showlevel, setShowlevel] = useState(false);
    const handleCloseforlevel = () => setShowlevel(false);
    const handleShowforlevel = () => setShowlevel(true);
    // for stats
    const [showstat, setShowstat] = useState(false);
    const handleCloseforstat = () => setShowstat(false);
    const handleShowforstat = () => setShowstat(true);
    const updateMediaupload = async (file) => {
        setAPILoading(true)
        let formdata = new FormData();
        formdata.append("Media", file)
        const response = axios.post(`${process.env.REACT_APP_API_URL}/ItemMedia`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
            }
        })
        response.then(res => {
            setAPILoading(false)
            if (res?.data?.status) {
                setMediaURLstate(res.data?.filepath)
            } else {
                showErroToast(res?.error?.data?.message);
            }
        })
    }
    const updateThumbupload = async (file) => {
        setAPILoading(true)
        let formdata = new FormData();
        formdata.append("Thumb", file)
        const response = axios.post(`${process.env.REACT_APP_API_URL}/ItemThumb`, formdata, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
            }
        })
        response.then(res => {
            setAPILoading(false)
            if (res?.data?.status) {
                setThumbURLstate(res.data?.filepath);
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
    const CollectionSchema = Yup.object().shape({
        Name: Yup.string()
            .min(4, 'Name must be atleast four letters')
            .max(50, 'Name must be minimum 50 letters')
            .required('Name is required'),
        Description: Yup.string()
            .min(100, 'Name must be atleast 100 letters')
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
        Color: Yup.string().required('Color is required'),
        Styles: Yup.string().required('Styles is required'),
        Medium: Yup.string().required('Medium is required'),
        Category: Yup.string().required('Category is required'),
        Size: Yup.string().required('Size is required'),
        Orientation: Yup.string().required('Orientation is required'),
        Material: Yup.string().required('Materials is required'),
        PhysicalART: Yup.boolean()
    });

    const formik = useFormik({
        initialValues: {
            Name: '',
            Description: '',
            Banner: '',
            Thumb: '',
            Color: '',
            Styles: '',
            Medium: '',
            Category: '',
            Size: '',
            Orientation: '',
            Material: '',
            PhysicalART: false
        },
        validationSchema: CollectionSchema,
        onSubmit: values => {
            setAPILoading(true)
            let formValue = {
                Name: values.Name,
                Description: values.Description,
                Media: MediaURLstate,
                Thumb: ThumbURLstate,
                Color: values.Color,
                Styles: values.Styles,
                Medium: values.Medium,
                CategoryId: values.Category,
                Size: values.Size,
                Orientation: values.Orientation,
                Material: values.Material,
                CollectionId: parms.id,
                Price: 0,
                EnableBid: false,
                EnableAuction: false,
                PhysicalArt: values.PhysicalART,
                ItemId: parms.id,
            }
            updateItemAPI(formValue).then(res => {
                if (res.data.status) {
                    showToast(res.data.message)
                    setAPILoading(false)
                    window.location.replace("/myprofile")
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
        setAPILoading(true)
        if (resAllItemInfo?.status === "fulfilled") {
            if (resAllItemInfo?.data?.status) {
                if (resAllItemInfo?.data?.status) {
                    formik.setValues({
                        Name: resAllItemInfo?.data?.data[0].ItemInfo?.Name,
                        Description: resAllItemInfo?.data?.data[0].ItemInfo?.Description,
                        Color: resAllItemInfo?.data?.data[0].ItemInfo?.Color,
                        Styles: resAllItemInfo?.data?.data[0].ItemInfo?.Styles,
                        Medium: resAllItemInfo?.data?.data[0].ItemInfo?.Medium,
                        Category: resAllItemInfo?.data?.data[0].ItemInfo?.CategoryId,
                        Size: resAllItemInfo?.data?.data[0].ItemInfo?.Size,
                        Orientation: resAllItemInfo?.data?.data[0].ItemInfo?.Orientation,
                        Material: resAllItemInfo?.data?.data[0].ItemInfo?.Material,
                        CollectionId: resAllItemInfo?.data?.data[0].ItemInfo?.Material,
                        Price: 0,
                        EnableBid: false,
                        EnableAuction: false,
                        PhysicalArt: resAllItemInfo?.data?.data[0].ItemInfo?.PhysicalArt,

                    })
                    setCreatItemColor({
                        hex: resAllItemInfo?.data?.data[0].ItemInfo?.Color
                    });
                    setMediaURLstate(resAllItemInfo?.data?.data[0].ItemInfo?.Media);
                    setThumbURLstate(resAllItemInfo?.data?.data[0].ItemInfo?.Thumb);
                    setAPILoading(false)
                }
            }
        }
    }, [resAllItemInfo?.status])
    const colorChanger = (color) => {
        setCreatItemColor(color)
        formik.setFieldValue('Color', color?.hex);
    }
    useEffect(() => {
        if (getStyles?.status === "fulfilled") {
            setStylesAPI(getStyles?.data?.data)
        }
    }, [getStyles])
    useEffect(() => {
        if (getMedium?.status === "fulfilled") {
            setMediumAPI(getMedium?.data?.data)
        }
    }, [getMedium])
    useEffect(() => {
        if (getMaterials?.status === "fulfilled") {
            setMaterialsAPI(getMaterials?.data?.data)
        }
    }, [getMaterials])
    useEffect(() => {
        if (category?.status === "fulfilled") {
            setCategoryAPI(category?.data?.data)
        }
    }, [category])
    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1>Edit art item</h1>
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
                                <img src={ThumbURLstate ? ThumbURLstate : itemDetailState?.data?.data[0].ItemInfo?.Banner} width="250px" height="350px" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="collectionthumb" className="form-label">Thumb</label>
                                <input name="Thumb" onChange={(e) => {
                                    formik.setFieldValue('Thumb', e.currentTarget.files[0])
                                    updateThumbupload(e.currentTarget.files[0])
                                }} type="file" className="form-control" id="collectionthumb" />
                                <div className="errors">{formik.errors.Thumb}</div>
                            </div>
                            <div className="mb-3">
                                <img src={MediaURLstate ? MediaURLstate : itemDetailState?.data?.data[0].ItemInfo?.Banner} width="250px" height="350px" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="collectionMedia" className="form-label">Media</label>
                                <input name="Banner" onChange={(e) => {
                                    formik.setFieldValue('Banner', e.currentTarget.files[0])
                                    updateMediaupload(e.currentTarget.files[0])
                                }} type="file" className="form-control" id="collectionMedia" />
                                <div className="errors">{formik.errors.Banner}</div>
                            </div>
                            <br />
                            <label className="form-label">Color</label>
                            <div className="selectedColor" style={{ backgroundColor: CreatItemColor !== "" ? CreatItemColor?.hex : null }}>
                            </div>
                            <br />
                            <CompactPicker onChangeComplete={colorChanger} />
                            <div className="errors">{formik.errors.Color}</div>
                            <br />
                            <div className="mb-3">
                                <label className="form-label">Styles</label>
                                <select className="form-select form-select-lg" name="Styles" onChange={formik.handleChange} value={formik.values.Styles} aria-label=".form-select-lg example">
                                    <option ></option>
                                    {StylesAPI.map((style, index) => {
                                        return <option key={index} value={style?.Title}>{style?.Title}</option>
                                    })}
                                </select>
                                <div className="errors">{formik.errors.Styles}</div>
                            </div>
                            <br />
                            <div className="mb-3">
                                <label className="form-label">Medium</label>
                                <select className="form-select form-select-lg " name="Medium" onChange={formik.handleChange} aria-label=".form-select-lg example">
                                    <option ></option>
                                    {MediumAPI.map((style, index) => {
                                        return <option selected={formik.values.Medium === style?.Title} key={index} value={style?.Title}>{style?.Title}</option>
                                    })}
                                </select>
                                <div className="errors">{formik.errors.Medium}</div>
                            </div>
                            <br />
                            <div className="mb-3">
                                <label className="form-label">Materials</label>
                                <select className="form-select form-select-lg" name="Material" onChange={formik.handleChange} aria-label=".form-select-lg example">
                                    <option ></option>
                                    {MaterialsAPI.map((style, index) => {
                                        return <option selected={formik.values.Material === style?.Title} key={index} value={style?.Title}>{style?.Title}</option>
                                    })}
                                </select>
                                <div className="errors">{formik.errors.Material}</div>
                            </div>
                            <br />
                            <label className="form-label">Category</label>
                            <select className="form-select form-select-lg" name="Category" onChange={formik.handleChange} aria-label=".form-select-lg example">
                                <option ></option>
                                {CategoryAPI.map((style, index) => {
                                    return <option key={index} selected={formik.values.Category === style?._id} value={style?._id}>{style?.Title}</option>
                                })}
                            </select>
                            <div className="errors">{formik.errors.Category}</div>
                            <br />
                            <label className="form-label">Size</label>
                            <select className="form-select form-select-lg" name="Size" onChange={formik.handleChange} aria-label=".form-select-lg example">
                                <option ></option>
                                <option selected={formik.values.Size === "Small"} value="Small">Small</option>
                                <option selected={formik.values.Size === "Medium"} value="Medium">Medium</option>
                                <option selected={formik.values.Size === "Large"} value="Large">Large</option>
                                <option selected={formik.values.Size === "Oversized"} value="Oversized">Oversized</option>
                            </select>
                            <div className="errors">{formik.errors.Size}</div>
                            <br />
                            <label className="form-label">Orientation</label>
                            <select className="form-select form-select-lg " name="Orientation" onChange={formik.handleChange} aria-label=".form-select-lg example">
                                <option ></option>
                                <option selected={formik.values.Orientation === "Horizontal"} value="Horizontal">Horizontal</option>
                                <option selected={formik.values.Orientation === "Vertical"} value="Vertical">Vertical</option>
                                <option selected={formik.values.Orientation === "Square"} value="Square">Square</option>
                            </select>
                            <div className="errors">{formik.errors.Orientation}</div>
                            <br />
                            <div className="col-12 ">
                                <div className="mb-4 d-flex justify-content-between">
                                    <div>
                                        <h5 >Add Properties</h5>
                                        <h6 >Add different properties of NFTs to display </h6>
                                    </div>
                                    <div className="addMore-button">
                                        <button className="btn btn-primary add w-7" type="button" onClick={() => handleShow()}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                {propertiesValues.map((element, index) => (
                                    <div key={index} className="item-create-card" >
                                        <div className="container">
                                            <h4><b>{element.type}</b></h4>
                                            <p >{element.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Add Levels */}
                            <div className="col-12 ">
                                <div className="mb-4 d-flex justify-content-between">
                                    <div >
                                        <h5 >Add Level</h5>
                                        <h6 >Add the levels for NFTs to progress</h6>
                                    </div>
                                    <div className="addMore-button">
                                        <button className="btn btn-primary add w-7" type="button" onClick={() => handleShowforlevel()}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                {levelValues.map((element, index) => (
                                    <div key={index} className="item-create-card" >
                                        <div className="container">
                                            <h4><b>{element.type}</b></h4>
                                            <p >{element.value + '/' + element.valueof}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Add Stats */}
                            <div className="col-12 ">
                                <div className="mb-4 d-flex justify-content-between">
                                    <div >
                                        <h5 >Add Stats</h5>
                                        <h6>Add various stats of the NFTs to show</h6>
                                    </div>
                                    <div className="addMore-button">
                                        <button className="btn btn-primary add w-7" type="button" onClick={() => handleShowforstat()}>+</button>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                {statValues.map((element, index) => (
                                    <div key={index} className="item-create-card" >
                                        <div className="container">
                                            <h4><b>{element.type}</b></h4>
                                            <p >{element.value + '/' + element.valueof}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="form-check">
                                <input type="checkbox" name='PhysicalART' checked={formik.values.PhysicalART} onChange={formik.handleChange} className="form-check-input" id="checkbox-two" />
                                <label className="form-check-label" htmlFor="checkbox-two">Physical Art </label>
                            </div>
                            <div className='errors'>{formik.errors.PhysicalART}</div>
                            <br />
                            {apiLoading ?
                                <button className="btn btn-primary" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    Loading...
                                </button>
                                : <button type="submit" className="btn btn-primary">Submit</button>
                            }
                        </form>
                        <br />
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add properties</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6 style={{ color: "#a1a3ad" }}>Add the properties by uploading the digital files and you will also have the option to customize certain features.</h6>
                                {formValues.map((element, index) => (
                                    <div className="form-inline properties col-12 justify-content-between" key={index}>
                                        <input type="text" autoComplete='off' name="type" value={element.type || ""} onChange={e => handleChange(index, e)} placeholder="Enter your type" />
                                        <input type="text" autoComplete='off' name="name" className='col-4' value={element.name || ""} onChange={e => handleChange(index, e)} placeholder="Enter your value" />
                                        <button type="button" className="btn btn-warning remove w-7" onClick={() => removeFormFields(index)}>-</button>
                                    </div>
                                ))}
                                <button className="btn btn-primary addMore w-25" type="button" onClick={() => addFormFields()}>Add more</button>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={(e) => {
                                    handleSubmit(e)
                                    handleClose()
                                }
                                }>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={showlevel} onHide={handleCloseforlevel}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Levels</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6 style={{ color: "#a1a3ad" }}>You can manage the access of NFTs to explore the maximum level to complete an objective as per your requirements.</h6>
                                {formValuesforLevel.map((element, index) => (
                                    <div className="form-inline properties col-12" key={index}>
                                        <input type="text" name="type" autoComplete='off' value={element.type || ""} onChange={e => handleChangeforLevel(index, e)} placeholder="Enter your type" />
                                        <input type="number" autoComplete='off' className='col-2' name="value" value={element.value || ""} onChange={e => handleChangeforLevel(index, e)} placeholder="00" />
                                        <input type="number" autoComplete='off' name="valueof" className='col-2' value={element.valueof || ""} onChange={e => handleChangeforLevel(index, e)} placeholder="00" />
                                        <button type="button" className="btn btn-warning remove w-7" onClick={() => removeFormFieldsforLevel(index)}>-</button>
                                    </div>
                                ))}
                                <button className="btn btn-primary addMore w-25" type="button" onClick={() => addFormFieldsforLevel()}>Add more</button>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={(e) => {

                                    handleSubmitforLevel(e)
                                    handleCloseforlevel()
                                }
                                }>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={showstat} onHide={handleCloseforstat}>
                            <Modal.Header closeButton>
                                <Modal.Title>Add Stats</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h6 style={{ color: "#a1a3ad" }}>You can display various data that represent specific aspects of NFTs as stats to understand the performance.</h6>
                                {formValuesforStats.map((element, index) => (
                                    <div className="form-inline properties col-12" key={index}>
                                        <input type="text" name="type" autoComplete='off' value={element.type || ""} onChange={e => handleChangeforStats(index, e)} placeholder="Enter your type" />
                                        <input type="number" autoComplete='off' className='col-2' name="value" value={element.value || ""} onChange={e => handleChangeforStats(index, e)} placeholder="00" />
                                        <input type="number" autoComplete='off' className='col-2' name="valueof" value={element.valueof || ""} onChange={e => handleChangeforStats(index, e)} placeholder="00" />

                                        <button type="button" className="btn btn-warning remove w-7" onClick={() => removeFormFieldsforStats(index)}>-</button>
                                    </div>
                                ))}
                                <button className="btn btn-primary addMore w-25" type="button" onClick={() => addFormFieldsforStats()}>Add more</button>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="primary" onClick={(e) => {

                                    handleSubmitforStats(e)
                                    handleCloseforstat()
                                }
                                }>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}