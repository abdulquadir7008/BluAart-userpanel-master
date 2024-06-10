import React, { useEffect, useState } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {
    useCreateItemMutation,
    useGetStylesQuery,
    useGetMediumQuery,
    useGetMaterialsQuery,
    useGetCategoryQuery,
    useGetKeywordsQuery,
    useCreateArtworkGeneralMutation,
    useCreateArtworkArtistDetailMutation,
    useCreateArtworkPriceDetailMutation,
    useCreateArtworkLogisticDetailMutation,
    useCreateArtworkImageDetailMutation,
    useGetMediaLimitInfoMutation,
    useGetArtProductCategoriesQuery,
    useGetFurnishingNameMutation,
    useGetFurnitureNameMutation,
    useGetLightingNameMutation,
    useGetArtProductStylesQuery,
    useGetArtProductBrandQuery,
    useGetArtProductMaterialQuery,
    useGetArtProductFabricQuery,
    useGetArtProductShapeQuery,
    useGetArtProductTechniqueQuery,
    useGetArtProductTypeQuery,
    useGetCushionSizeQuery,
    useGetRugSizeQuery,
    useGetCollectionInfoMutation
} from '../../service/Apilist';
import { useNavigate, useParams } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { components } from "react-select";
import CryptoJS from 'crypto-js';

export default function CreateArtproductItem(props) {
    let navigate = useNavigate();
    let parms = useParams();
    const [collectionInfoAPI, resCollectionInfoAPI] = useGetCollectionInfoMutation();
    const [collectionInfo, collectionInfoResponse] = useState([]);

    const decryptedItemIdBytes = CryptoJS.AES.decrypt(parms.id, process.env.REACT_APP_SECRET_PASS);
const decryptedItemIdString = decryptedItemIdBytes.toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        collectionInfoAPI({
            CollectionId: encodeURIComponent(decryptedItemIdString)
        })
    }, [])
    useEffect(() => {
        if (resCollectionInfoAPI?.status === "fulfilled") {
            collectionInfoResponse(resCollectionInfoAPI?.data?.data);
            setCurrencyState(resCollectionInfoAPI?.data?.data[0].CollectionInfo?.Currency)
        }
    }, [resCollectionInfoAPI?.status])

    const [ThumbURLstate, setThumbURLstate] = useState("");
    const [MediaURLstate, setMediaURLstate] = useState("");
    const [currencyState, setCurrencyState] = useState("");
    const [StylesAPI, setStylesAPI] = useState([]);
    const [Styles, setStyles] = useState([]);
    const [MediumAPI, setMediumAPI] = useState([]);
    const [Subject, setSubject] = useState([]);
    const [MaterialsAPI, setMaterialsAPI] = useState([]);
    const [Materials, setMaterials] = useState([]);
    const [keywords, setkeywords] = useState([]);
    const [CategoryAPI, setCategoryAPI] = useState([]);
    const [apiLoading, setAPILoading] = useState(false);
    const [thumbLoading, setthumbLoading] = useState(false);
    const [mediaLoading, setmediaLoading] = useState(false);
    const [createItemState, setcreateItemState] = useState(0);
    const getStyles = useGetStylesQuery();
    const getMedium = useGetMediumQuery();
    const getMaterials = useGetMaterialsQuery();
    const getKeywords = useGetKeywordsQuery();
    const category = useGetCategoryQuery();
    const [formValues, setFormValues] = useState([])
    const [formValuesforLevel, setFormValuesforLevel] = useState([])
    const [formValuesforStats, setFormValuesforStats] = useState([])
    const [propertiesValues, setpropertiesValues] = useState([])
    const [levelValues, setlevelValues] = useState([])
    const [statValues, setstatValues] = useState([])
    const [mediaLimit, setmediaLimit] = useState({})
    const [createItemAPI, resCreateItemAPI] = useCreateItemMutation();
    const [createItemGeneralAPI, resCreateItemGeneralAPI] = useCreateArtworkGeneralMutation();
    const [createItemArtistDetailAPI, resCreateItemArtistDetailAPI] = useCreateArtworkArtistDetailMutation();
    const [createItemPriceDetailAPI, resCreateItemPriceDetailAPI] = useCreateArtworkPriceDetailMutation();
    const [createItemLogisticDetailAPI, resCreateItemLogisticDetailAPI] = useCreateArtworkLogisticDetailMutation();
    const [createItemImageDetailAPI, resCreateItemImageDetailAPI] = useCreateArtworkImageDetailMutation();
    const [getMediaLimitAPI, resgetMediaLimitAPI] = useGetMediaLimitInfoMutation();
    const artProdcutCategoryAPI = useGetArtProductCategoriesQuery();
    const [artProdcutFrunishingAPI, resartProdcutFrunishingAPI] = useGetFurnishingNameMutation();
    const [artProdcutFurnitureNameAPI, resartProdcutFurnitureNameAPI] = useGetFurnitureNameMutation();
    const [artProdcutLightingNameAPI, resartProdcutLightingNameAPI] = useGetLightingNameMutation();
    const artProdcutStyleAPI = useGetArtProductStylesQuery();
    const artProdcutBrandAPI = useGetArtProductBrandQuery();
    const artProdcutMaterialAPI = useGetArtProductMaterialQuery();
    const artProdcutFabricAPI = useGetArtProductFabricQuery();
    const artProdcutShapeAPI = useGetArtProductShapeQuery();
    const artProdcutTechniqueAPI = useGetArtProductTechniqueQuery();
    const artProdcutTypeAPI = useGetArtProductTypeQuery();
    const artProdcutCushionSizeAPI = useGetCushionSizeQuery();
    const artProdcutRugSizeAPI = useGetRugSizeQuery();
    const [artProductCategoryState, setartProductCategoryState] = useState([]);
    const [artProdcutFrunishingState, setartProdcutFrunishingState] = useState([]);
    const [artProdcutFurnitureNameState, setartProdcutFurnitureNameState] = useState([]);
    const [artProdcutLightingNameState, setartProdcutLightingNameState] = useState([]);
    const [artProdcutStyleState, setartProdcutStyleState] = useState([]);
    const [artProdcutBrandState, setartProdcutBrandState] = useState([]);
    const [artProdcutMaterialState, setartProdcutMaterialState] = useState([]);
    const [artProdcutFabricState, setartProdcutFabricState] = useState([]);
    const [artProdcutShapeState, setartProdcutShapeState] = useState([]);
    const [artProdcutTechniqueState, setartProdcutTechniqueState] = useState([]);
    const [artProdcutTypeState, setartProdcutTypeState] = useState([]);
    const [artProdcutCushionSizeState, setartProdcutCushionSizeState] = useState([]);
    const [artProdcutRugSizeState, setartProdcutRugSizeState] = useState([]);
    useEffect(() => {
        if (artProdcutMaterialAPI?.status === "fulfilled") {
            setartProdcutMaterialState(artProdcutMaterialAPI.data?.data)
        }
    }, [artProdcutMaterialAPI])
    useEffect(() => {
        if (artProdcutFabricAPI?.status === "fulfilled") {
            setartProdcutFabricState(artProdcutFabricAPI.data?.data)
        }
    }, [artProdcutFabricAPI])
    useEffect(() => {
        if (artProdcutShapeAPI?.status === "fulfilled") {
            setartProdcutShapeState(artProdcutShapeAPI.data?.data)
        }
    }, [artProdcutShapeAPI])
    useEffect(() => {
        if (artProdcutTechniqueAPI?.status === "fulfilled") {
            setartProdcutTechniqueState(artProdcutTechniqueAPI.data?.data)
        }
    }, [artProdcutTechniqueAPI])
    useEffect(() => {
        if (artProdcutTypeAPI?.status === "fulfilled") {
            setartProdcutTypeState(artProdcutTypeAPI.data?.data)
        }
    }, [artProdcutTypeAPI])
    useEffect(() => {
        if (artProdcutCushionSizeAPI?.status === "fulfilled") {
            setartProdcutCushionSizeState(artProdcutCushionSizeAPI.data?.data)
        }
    }, [artProdcutCushionSizeAPI])
    useEffect(() => {
        if (artProdcutRugSizeAPI?.status === "fulfilled") {
            setartProdcutRugSizeState(artProdcutRugSizeAPI.data?.data)
        }
    }, [artProdcutRugSizeAPI])
    useEffect(() => {
        artProdcutFrunishingAPI({

        })
        artProdcutFurnitureNameAPI({

        })
        artProdcutLightingNameAPI({

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
    // htmlFor properties
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // htmlFor levels
    const [showlevel, setShowlevel] = useState(false);
    const handleCloseforlevel = () => setShowlevel(false);
    const handleShowforlevel = () => setShowlevel(true);
    // htmlFor stats
    const [showstat, setShowstat] = useState(false);
    const handleCloseforstat = () => setShowstat(false);
    const handleShowforstat = () => setShowstat(true);


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
                CollectionId: encodeURIComponent(decryptedItemIdString),
                Price: 0,
                EnableBid: false,
                EnableAuction: false,
                PhysicalArt: values.PhysicalART
            }
            createItemAPI(formValue).then(res => {
                if (res.data.status) {
                    showToast(res.data.message)
                    setAPILoading(false)
                    window.location.replace("/collection")
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
        getMediaLimitAPI({
            Type: "Artwork"
        })
    }, [])
    useEffect(() => {
        if (artProdcutBrandAPI?.status === "fulfilled") {
            setartProdcutBrandState(artProdcutBrandAPI.data?.data)
        }
    }, [artProdcutBrandAPI])
    useEffect(() => {
        if (artProdcutStyleAPI?.status === "fulfilled") {
            setartProdcutStyleState(artProdcutStyleAPI.data?.data)
        }
    }, [artProdcutStyleAPI])
    useEffect(() => {
        if (resartProdcutFrunishingAPI?.status === "fulfilled") {
            setartProdcutFrunishingState(resartProdcutFrunishingAPI.data?.data)
        }
    }, [resartProdcutFrunishingAPI])
    useEffect(() => {
        if (resartProdcutFurnitureNameAPI?.status === "fulfilled") {
            setartProdcutFurnitureNameState(resartProdcutFurnitureNameAPI.data?.data)
        }
    }, [resartProdcutFurnitureNameAPI])
    useEffect(() => {
        if (resartProdcutLightingNameAPI?.status === "fulfilled") {
            setartProdcutLightingNameState(resartProdcutLightingNameAPI?.data?.data)
        }
    }, [resartProdcutLightingNameAPI])
    useEffect(() => {
        if (artProdcutCategoryAPI?.status === "fulfilled") {
            setartProductCategoryState(artProdcutCategoryAPI.data?.data)
        }
    }, [artProdcutCategoryAPI])
    useEffect(() => {
        if (resgetMediaLimitAPI?.status === "fulfilled") {
            setmediaLimit(resgetMediaLimitAPI.data.info)
        }
    }, [resgetMediaLimitAPI])
    useEffect(() => {
        if (getStyles?.status === "fulfilled") {
            setStylesAPI(getStyles?.data?.data)
            let stylesData = getStyles?.data?.data;
            let tempstyles = [];
            stylesData.length > 0 && stylesData.map((meterial, index) => (
                tempstyles.push({ value: meterial.Title, label: meterial.Title },)
            ));
            setStyles(tempstyles);
        }
    }, [getStyles])
    useEffect(() => {
        if (getMedium?.status === "fulfilled") {
            setMediumAPI(getMedium?.data?.data)
            let subjectData = getMedium?.data?.data;
            let tempsubject = [];
            subjectData.length > 0 && subjectData.map((subject, index) => (
                tempsubject.push({ value: subject.Title, label: subject.Title },)
            ));
            setSubject(tempsubject);
        }
    }, [getMedium])
    useEffect(() => {
        if (getMaterials?.status === "fulfilled") {
            setMaterialsAPI(getMaterials?.data?.data)
            let meterialsData = getMaterials?.data?.data;
            let tempMaterials = [];
            meterialsData.length > 0 && meterialsData.map((meterial, index) => (
                tempMaterials.push({ value: meterial.Title, label: meterial.Title },)
            ));
            setMaterials(tempMaterials);
        }
    }, [getMaterials])
    useEffect(() => {
        if (getKeywords?.status === "fulfilled") {
            setMaterialsAPI(getKeywords?.data?.data)
            let keywordsData = getKeywords?.data?.data;
            let tempKeywords = [];
            keywordsData.length > 0 && keywordsData.map((keyword, index) => (
                tempKeywords.push({ value: keyword.Title, label: keyword.Title },)
            ));
            setkeywords(tempKeywords);
        }
    }, [getKeywords])
    useEffect(() => {
        if (category?.status === "fulfilled") {
            setCategoryAPI(category?.data?.data)
        }
    }, [category])
   

    const generalInfoSchma = Yup.object().shape({
        Title: Yup.string()
            .min(4, 'Title must be atleast four letters')
            .max(50, 'Title must be minimum 50 letters')
            .required('Title is required'),
        CreationYear: Yup.string()
            .min(4, 'Year of creation must be atleast four letters')
            .max(50, 'Year of creation must be minimum 50 letters')
            .required('Year Of creation is required'),
        ProductCategory: Yup.string()
            .required('Art Product Category is required'),
        ProductName: Yup.string().when("ProductCategory", {
            is: (value) => ['2', '1', '6'].includes(value),
            then: () => Yup.string().required("Name is required"),
            otherwise: () => Yup.string(),
        }),
        ProductStyle: Yup.string().when("ProductCategory", {
            is: (value) => ['1', '3', '2'].includes(value),
            then: () => Yup.string().required("Style is required").when("ProductName", {
                is: (value) => ['Cushions'].includes(value),
                then: () => Yup.string(),
                otherwise: () => Yup.string().required("Style is required"),
            }),
            otherwise: () => Yup.string(),
        }),
        ProductBrand: Yup.string().required("Brand is required"),
        PhysicalEdition: Yup.number()
            .typeError('Please enter a valid number')
            .required('Physical Edition is required')
            .when(['Unique', 'DigitalEdition'], {
                is: (value1, value2) => value1 === 'multiple' && value2 <= 1,
                then: () => Yup.number()
                    .required('Physical Edition is required')
                    .test("check at least one", "At least one field required more than one", function (value) {
                        if (value <= 1) {
                            return false;
                        } else {
                            return true;
                        }
                    })
            })
            .when(['Unique', 'DigitalEdition'], {
                is: (value1, value2) => value1 === 'Unique' && (value2 === 0 || value2 > 1 || value2 === 1),
                then: (value1, value2) => Yup.number()
                    .required('Physical Edition is required')
                    .test("check at least one", "At least one field required equal one", function (value) {
                        if (value === 0 && this.resolve(Yup.ref('DigitalEdition')) === 0) {
                            return false;
                        } else if (value > 1) {
                            return false;
                        } else {
                            return true
                        }
                    })
            }),
        DigitalEdition: Yup.number()
            .typeError('Please enter a valid number')
            .required('Digital Edition is required')
            .when(['Unique', 'PhysicalEdition'], {
                is: (value1, value2) => value1 === 'multiple' && value2 <= 1,
                then: () => Yup.number()
                    .required('Digital Edition is required')
                    .test("check at least one", "At least one field required more than one", function (value) {
                        if (value <= 1) {
                            return false;
                        } else {
                            return true;
                        }
                    })
            })
            .when(['Unique', 'PhysicalEdition'], {
                is: (value1, value2) => value1 === 'Unique' && (value2 === 0 || value2 > 1 || value2 === 1),
                then: (value1, value2) => Yup.number()
                    .required('Physical Edition is required')
                    .test("check at least one", "At least one field required equal one", function (value) {
                        if (value === 0 && this.resolve(Yup.ref('PhysicalEdition')) === 0) {
                            return false;
                        } else if (value > 1) {
                            return false;
                        } else {
                            return true
                        }
                    }),
            }),
    }, ['PhysicalEdition', 'DigitalEdition'])

    const generalInfoFromik = useFormik({
        initialValues: {
            ProductCategory: "",
            ProductName: "",
            ProductBrand: "",
            ProductFabric: "",
            ProductStyle: "",
            ProductSize: "",
            ProductMaterial: "",
            ProductTechnique: "",
            ProductShape: "",
            ProductType: "",
            Title: "",
            CreationYear: "",
            Unique: "Unique",
            PhysicalEdition: 1,
            DigitalEdition: 0,
            CollectionId: encodeURIComponent(decryptedItemIdString),
            PhysicalArt: parms.type === 'physical' ? true : false,
        },
        validationSchema: generalInfoSchma,
        onSubmit: values => {
            setAPILoading(true)
            sessionStorage.setItem('PhysicalEdition', values.PhysicalEdition);
            sessionStorage.setItem('DigitalEdition', values.DigitalEdition);
            createItemGeneralAPI({
                ProductCategory: values.ProductCategory,
                ProductName: values.ProductName,
                ProductBrand: values.ProductBrand,
                ProductFabric: values.ProductFabric,
                ProductStyle: values.ProductStyle,
                ProductSize: values.ProductSize,
                ProductMaterial: values.ProductMaterial,
                ProductTechnique: values.ProductTechnique,
                ProductShape: values.ProductShape,
                Type: "ArtProduct",
                Title: values.Title,
                CreationYear: values.CreationYear,
                Unique: values.Unique === 'Unique' ? true : false,
                PhysicalEdition: values.PhysicalEdition,
                DigitalEdition: values.DigitalEdition,
                CollectionId: values.CollectionId,
                PhysicalArt: values.PhysicalArt
            }).then((res) => {
                if (res.data.status) {
                    setAPILoading(false)
                    showToast(res.data.message)
                    setcreateItemState(1)
                    sessionStorage.setItem('Artworkid', res.data.Artworkid);
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch((error) => {
                setAPILoading(false)
            })

        }
    })

    const gerneraInfo = () => {
        return (
            <form onSubmit={generalInfoFromik.handleSubmit}>
                <label className="form-label">Category</label>
                <select className="form-select form-select-lg" name="ProductCategory" value={generalInfoFromik?.values?.ProductCategory} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                    <option ></option>
                    {artProductCategoryState?.map((category, index) => {
                        return <option  key={index} value={category?._id}>{category?.Title}</option>
                    })}
                </select>
                <div className="errors">{generalInfoFromik.errors.ProductCategory}</div>

                {generalInfoFromik.values.ProductCategory === "2"
                    || generalInfoFromik.values.ProductCategory === "1"
                    || generalInfoFromik.values.ProductCategory === "6" ? (<>
                        {generalInfoFromik.values.ProductCategory === "2" ? (<>
                            <br />
                            <label className="form-label">Name</label>
                            <select className="form-select form-select-lg" name="ProductName" value={generalInfoFromik?.values?.ProductName} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                                <option ></option>
                                {artProdcutFrunishingState.map((name, index) => {
                                    return <option key={index} value={name?._id}>{name?.Title}</option>
                                })}
                            </select>
                        </>) : null}

                        {generalInfoFromik.values.ProductCategory === "1" ? (<>
                            <br />
                            <label className="form-label">ProductName</label>
                            <select className="form-select form-select-lg" name="ProductName" value={generalInfoFromik?.values?.ProductName} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                                <option ></option>
                                {artProdcutFurnitureNameState.map((name, index) => {
                                    return <option key={index} value={name?._id}>{name?.Title}</option>
                                })}
                            </select>
                        </>) : null}

                        {generalInfoFromik.values.ProductCategory === "6" ? (<>
                            <br />
                            <label className="form-label">Name</label>
                            <select className="form-select form-select-lg" name="ProductName" value={generalInfoFromik?.values?.ProductName} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                                <option ></option>
                                {artProdcutLightingNameState?.map((name, index) => {
                                    return <option key={index} value={name?._id}>{name?.Title}</option>
                                })}
                            </select>
                        </>) : null}
                        <div className="errors">{generalInfoFromik.errors.ProductName}</div>
                    </>) : null}
                {generalInfoFromik.values.ProductCategory === "2"
                    || generalInfoFromik.values.ProductCategory === "1"
                    || generalInfoFromik.values.ProductCategory === "3"
                    ? (<>
                        {generalInfoFromik.values.ProductCategory === "2" && generalInfoFromik.values?.ProductName === "Cushions" ? (<>
                        </>) : (<>
                            <br />
                            <label className="form-label">Art Product Style</label>
                            <select className="form-select form-select-lg" name="ProductStyle" value={generalInfoFromik?.values?.ProductStyle} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                                <option></option>
                                {artProdcutStyleState?.map((style, index) => {
                                    return <option key={index} value={style?._id}>{style?.Title}</option>
                                })}
                            </select>
                        </>)}

                        <div className="errors">{generalInfoFromik.errors.ProductStyle}</div>
                    </>) : null}
                {generalInfoFromik.values?.ProductName === "Cushions" ? (<>
                    <br />
                    <label className="form-label">Art Product Fabric</label>
                    <select className="form-select form-select-lg" name="ProductFabric" value={generalInfoFromik?.values?.ProductFabric} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                        <option></option>
                        {artProdcutFabricState.map((fabric, index) => {
                            return <option key={index} value={fabric?.Title}>{fabric?.Title}</option>
                        })}
                    </select>
                    <div className="errors">{generalInfoFromik.errors.ProductFabric}</div>
                </>) : null}
                {generalInfoFromik.values?.ProductName === "Cushions"
                    || generalInfoFromik.values?.ProductName === "Rugs"
                    ? (<>
                        <br />
                        <label className="form-label">Art Product Technique</label>
                        <select className="form-select form-select-lg" name="ProductTechnique" value={generalInfoFromik?.values?.ProductTechnique} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                            <option></option>
                            {artProdcutTechniqueState.map((technique, index) => {
                                return <option key={index} value={technique?.Title}>{technique?.Title}</option>
                            })}
                        </select>
                        <div className="errors">{generalInfoFromik.errors.ProductTechnique}</div>
                    </>) : null}

                {generalInfoFromik.values?.ProductName === "Cushions"
                    || generalInfoFromik.values?.ProductName === "Rugs"
                    ? (<>
                        <br />
                        <label className="form-label">Art Product Shape</label>
                        <select className="form-select form-select-lg" name="ProductShape" value={generalInfoFromik?.values?.ProductShape} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                            <option></option>
                            {artProdcutShapeState.map((technique, index) => {
                                return <option key={index} value={technique?.Title}>{technique?.Title}</option>
                            })}
                        </select>
                        <div className="errors">{generalInfoFromik.errors.ProductShape}</div>
                    </>) : null}
                {generalInfoFromik.values?.ProductName === "Cushions" ? (<>
                    <br />
                    <label className="form-label">Art Product Size</label>
                    <select className="form-select form-select-lg" name="ProductSize" value={generalInfoFromik?.values?.ProductSize} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                        <option></option>
                        {artProdcutCushionSizeState?.map((size, index) => {
                            return <option key={index} value={size?.Title}>{size?.Title}</option>
                        })}
                    </select>
                    <div className="errors">{generalInfoFromik.errors.ProductSize}</div>
                </>) : null}
                {generalInfoFromik.values?.ProductName === "Rugs" ? (<>
                    <br />
                    <label className="form-label">Art Product Size</label>
                    <select className="form-select form-select-lg" name="ProductSize" value={generalInfoFromik?.values?.ProductSize} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                        <option></option>
                        {artProdcutRugSizeState?.map((size, index) => {
                            return <option key={index} value={size?.Title}>{size?.Title}</option>
                        })}
                    </select>
                    <div className="errors">{generalInfoFromik.errors.ProductSize}</div>
                </>) : null}
                {generalInfoFromik.values.ProductCategory === "6" ? (<>
                    <br />
                    <label className="form-label">Art Product Material</label>
                    <select className="form-select form-select-lg" name="ProductMaterial" value={generalInfoFromik?.values?.ProductMaterial} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                        <option></option>
                        {artProdcutMaterialState?.map((material, index) => {
                            return <option key={index} value={material?._id}>{material?.Title}</option>
                        })}
                    </select>
                    <div className="errors">{generalInfoFromik.errors.ProductMaterial}</div>
                </>) : null}
                
                <label className="form-label">Brand</label>
                <select className="form-select form-select-lg" name="ProductBrand" value={generalInfoFromik?.values?.ProductBrand} onChange={generalInfoFromik.handleChange} aria-label=".form-select-lg example">
                    <option ></option>
                    {artProdcutBrandState.map((brand, index) => {
                        return <option key={index} value={brand?._id}>{brand?.Title}</option>
                    })}
                </select>
                <div className="errors">{generalInfoFromik.errors.ProductBrand}</div>
                <br />
                <div className="mb-3">
                    <label htmlFor="exampleInputName" className="form-label">Title</label>
                    <input name="Title" onChange={generalInfoFromik.handleChange} value={generalInfoFromik.values.Title} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                    <div className="errors">{generalInfoFromik.errors.Title}</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputDescription" className="form-label">Year of creation</label>
                    <input name="CreationYear" onChange={generalInfoFromik.handleChange} value={generalInfoFromik.values.CreationYear} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                    <div className="errors">{generalInfoFromik.errors.CreationYear}</div>
                </div>
                <br />
                <div className="mb-3">
                    <label className="form-label">Unique/Multiple</label>
                    <div className="uniqueOrmultiple">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="Unique" id="uniquOrMultiple1" onChange={generalInfoFromik.handleChange} checked={generalInfoFromik.values.Unique === 'Unique'} value="Unique" />
                            <label className="form-check-label" htmlFor="uniquOrMultiple1">
                                Unique
                            </label>
                        </div>
                        &nbsp;
                        &nbsp;
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="Unique" id="uniquOrMultiple2" onChange={generalInfoFromik.handleChange} checked={generalInfoFromik.values.Unique === 'multiple'} value="multiple" />
                            <label className="form-check-label" htmlFor="uniquOrMultiple2">
                                Multiple
                            </label>
                        </div>
                    </div>
                </div>
                <br />
                <div className="mb-3">
                    <label htmlFor="exampleInputName" className="form-label">Physical Edition of</label>
                    <input name="PhysicalEdition" onChange={generalInfoFromik.handleChange} value={generalInfoFromik.values.PhysicalEdition} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                    <div className="errors">{generalInfoFromik.errors.PhysicalEdition}</div>
                </div>
                <br />
                <div className="mb-3">
                    <label htmlFor="exampleInputName" className="form-label">Digital Edition of</label>
                    <input name="DigitalEdition" onChange={generalInfoFromik.handleChange} value={generalInfoFromik.values.DigitalEdition} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                    <div className="errors">{generalInfoFromik.errors.DigitalEdition}</div>
                </div>
                <br />

                <div className="d-flex justify-content-around">
                    {apiLoading ?
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <>
                            <button type="submit" className="btn btn-primary">Next</button>
                        </>
                    }
                </div>
            </form>);
    }
    const artistDetailsSchma = Yup.object().shape({
        Description: Yup.string()
            .min(100, 'Description must be atleast 100 letters')
            .max(1000, 'Description must be atleast 1000 letters')
            .required('Description is required'),
    })

    const artistDetailsFromik = useFormik({
        initialValues: {
            Description: "",
            Artworkid: sessionStorage.getItem('Artworkid')
        },
        validationSchema: artistDetailsSchma,
        onSubmit: values => {
            setAPILoading(true)
            createItemArtistDetailAPI({
                Description: values.Description,
                Artworkid: sessionStorage.getItem('Artworkid')
            }).then((res) => {
                if (res.data.status) {
                    setAPILoading(false)
                    showToast(res.data.message)
                    setcreateItemState(2)
                    sessionStorage.setItem('Artworkid', res.data.Artworkid);
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch((error) => {
                setAPILoading(false)
            })

        }
    })
    const artistDetails = () => {
        return (
            <form onSubmit={artistDetailsFromik.handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputDescription" className="form-label">Detailed description</label>
                    <textarea name="Description" onChange={artistDetailsFromik.handleChange} value={artistDetailsFromik.values.Description} type="text" className="form-control" rows={3} cols={3}></textarea>
                    <div className="errors">{artistDetailsFromik.errors.Description}</div>
                </div>
                <br />
                <div className="d-flex justify-content-evenly">
                    {apiLoading ?
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <>
                            <button type="button" onClick={() => { setcreateItemState(0) }} className="btn btn-primary">Back</button>
                            <button type="submit" className="btn btn-primary">Next</button>
                        </>
                    }
                </div>
            </form>);
    }
    const pricingSchma = Yup.object().shape({
        PriceDisplay: Yup.string().required('Price Display is required'),
        AutoAcceptOffers: Yup.boolean(),
        AutoRejectOffers: Yup.boolean(),
        PhysicalPrice: Yup.number().test('check required', "Price is required", function (value) {
            if (sessionStorage.getItem('PhysicalEdition') > 0) {
                if (value <= 0 || !value) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true
            }
        }),
        DigitalPrice: Yup.number().test('check required', "Price is required", function (value) {
            if (sessionStorage.getItem('DigitalEdition') > 0) {
                if (value <= 0 || !value) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true
            }
        }),
        PriceTransparency: Yup.number().moreThan(0, "Price must be greater than zero").required('Price Transparency is required'),
    })

    const pricingFromik = useFormik({
        initialValues: {
            PriceDisplay: "Display the price",
            AutoAcceptOffers: false,
            AutoRejectOffers: false,
            PhysicalPrice: 0,
            DigitalPrice: 0,
            PriceTransparency: 0,
            Artworkid: sessionStorage.getItem('Artworkid')
        },
        validationSchema: pricingSchma,
        onSubmit: values => {
            setAPILoading(true)
            createItemPriceDetailAPI({
                PriceDisplay: values.PriceDisplay === "Display the price" ? true : false,
                AutoAcceptOffers: values.AutoAcceptOffers,
                AutoRejectOffers: values.AutoRejectOffers,
                PhysicalPrice: values.PhysicalPrice,
                DigitalPrice: values.DigitalPrice,
                Currency: currencyState,
                PriceTransparency: values.PriceTransparency,
                Artworkid: sessionStorage.getItem('Artworkid')
            }).then((res) => {
                if (res.data.status) {
                    setAPILoading(false)
                    showToast(res.data.message)
                    if (sessionStorage.getItem('PhysicalEdition') > 0) {
                        setcreateItemState(3)
                    } else {
                        setcreateItemState(4)
                    }
                    sessionStorage.setItem('Artworkid', res.data.Artworkid);
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch((error) => {
                setAPILoading(false)
            })
        }
    })
    const currencyChoose = (e) => {
        setCurrencyState(e.target.value)
    }
    const pricing = () => {
        return (
            <form onSubmit={pricingFromik.handleSubmit}>
                <div className="mb-3">
                    {sessionStorage.getItem('PhysicalEdition') > 0 ? (<> <label htmlFor="exampleInputDescription" className="form-label">Physical selling price</label>
                        <div className="d-flex">
                            <input name="PhysicalPrice" onChange={pricingFromik.handleChange} value={pricingFromik.values.PhysicalPrice} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                            &nbsp; &nbsp;  <select name="sellingprice" onChange={currencyChoose} className="form-control">
                                <option selected={currencyState === collectionInfo[0]?.CollectionInfo?.Currency} value={collectionInfo[0]?.CollectionInfo?.Currency} >{collectionInfo[0]?.CollectionInfo?.Currency}</option>
                                <option selecte={currencyState === "USD"} value="USD">USD</option>
                            </select>
                        </div>
                        <div className="errors">{pricingFromik.errors.PhysicalPrice}</div>
                    </>) : null}
                </div>
                <br />
                <div className="mb-3">
                    {sessionStorage.getItem('DigitalEdition') > 0 ? (<>  <label htmlFor="exampleInputDescription" className="form-label"> Digital selling price</label>
                        <div className="d-flex">
                            <input name="DigitalPrice" onChange={pricingFromik.handleChange} value={pricingFromik.values.DigitalPrice} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                            &nbsp;  <select name="sellingprice" value={currencyState} onChange={currencyChoose} className="form-control">

                                <option selected={currencyState === collectionInfo[0]?.CollectionInfo?.Currency} value={collectionInfo[0]?.CollectionInfo?.Currency} >{collectionInfo[0]?.CollectionInfo?.Currency}</option>
                                <option selecte={currencyState === "USD"} value="USD" >USD</option>
                            </select>
                        </div>
                        <div className="errors">{pricingFromik.errors.DigitalPrice}</div>
                    </>) : null}
                </div>
                <br />
                <label className="form-label">Price transparency</label>

                <br />
                <br />
                <div className="mb-3">
                    <div className="uniqueOrmultiple">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="PriceDisplay" id="PriceDisplay1" onChange={pricingFromik.handleChange} checked={pricingFromik.values.PriceDisplay === "Display the price"} value="Display the price" />
                            <label className="form-check-label" htmlFor="PriceDisplay1">
                                Display the price
                            </label>
                        </div>
                        &nbsp;
                        &nbsp;
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="PriceDisplay" id="PriceDisplay2" onChange={pricingFromik.handleChange} checked={pricingFromik.values.PriceDisplay === "Hide the price"} value="Hide the price" />
                            <label className="form-check-label" htmlFor="PriceDisplay2">
                                Hide the price
                            </label>
                        </div>
                    </div>
                </div>
                <div className="mb-3 d-flex" >
                    <div className="col-lg-6">
                        <label htmlFor="exampleInputDescription" className="form-label">Price negotiation</label>
                    </div>
                    <div className="col-lg-6">
                        <input name="PriceTransparency" onChange={pricingFromik.handleChange} value={pricingFromik.values.PriceTransparency} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                    </div>

                </div>
                <div className="errors">{pricingFromik.errors.PriceTransparency}</div>
                <div className="price-negotiation">

                    <div className="form-check">
                        <input className="form-check-input" checked={pricingFromik?.values?.AutoAcceptOffers} onChange={pricingFromik.handleChange} type="checkbox" name="AutoAcceptOffers" id="AutoAcceptOffers" />
                        <label className="form-check-label" htmlFor="AutoAcceptOffers">
                            Set limit to auto reject any bid made below the %ge value <br />
                            User would be prompted to offer a higher value htmlFor the work.
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" checked={pricingFromik?.values?.AutoRejectOffers} onChange={pricingFromik.handleChange} type="checkbox" name="AutoRejectOffers" id="AutoRejectOffers" />
                        <label className="form-check-label" htmlFor="AutoRejectOffers">
                            Set limit to auto accept any bids made above the %ge value.
                        </label>
                    </div>
                </div>
                <div className="d-flex justify-content-evenly">
                    {apiLoading ?
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <>
                            <button type="button" onClick={() => { setcreateItemState(1) }} className="btn btn-primary">Back</button>
                            <button type="submit" className="btn btn-primary">Next</button>
                        </>
                    }
                </div>

            </form>);
    }
    const logisticsSchma = Yup.object().shape({
        Packaging: Yup.string().required('Packaging is required'),
        PackageDimension: Yup.string().required('Package Dimension is required'),
        PackageHeight: Yup.number().moreThan(0, "Height must be greater than zero").required('Package Height is required'),
        PackageWidth: Yup.number().moreThan(0, "Width must be greater than zero").required('Package Width is required'),
        PackageDepth: Yup.number().required('Package Depth is required'),
        PackageWeight: Yup.string().required('Estimated weight with packaging is required'),
        PackageWeightValue: Yup.number().moreThan(0, "Package Weight must be greater than zero").required('Package Weight is required'),
    })

    const logisticsFromik = useFormik({
        initialValues: {
            Packaging: "",
            PackageDimension: "IN",
            PackageHeight: 0,
            PackageWidth: 0,
            PackageDepth: 0,
            PackageWeight: "KG",
            PackageWeightValue: 0,
            Artworkid: sessionStorage.getItem('Artworkid')
        },
        validationSchema: logisticsSchma,
        onSubmit: values => {
            setAPILoading(true)
            createItemLogisticDetailAPI({
                Packaging: values.Packaging,
                PackageDimension: values.PackageDimension,
                PackageHeight: values.PackageHeight,
                PackageWidth: values.PackageWidth,
                PackageDepth: values.PackageDepth,
                PackageWeightValue: values.PackageWeightValue,
                PackageWeight: values.PackageWeight,
                Artworkid: sessionStorage.getItem('Artworkid')
            }).then((res) => {
                setAPILoading(false)
                if (res.data?.status) {
                    showToast(res.data.message)
                    setcreateItemState(4)
                    sessionStorage.setItem('Artworkid', res.data.Artworkid);
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch((error) => {
                setAPILoading(false)
            })
        }
    })
    const Logistics = () => {
        return (
            <form onSubmit={logisticsFromik.handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputDescription" className="form-label">Packaging</label>
                    <input name="Packaging" onChange={logisticsFromik.handleChange} value={logisticsFromik.values.Packaging} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                    <div className="errors">{logisticsFromik.errors.Packaging}</div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Packaging Dimensions</label>
                    <div className="dimensions">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="PackageDimension" id="Dimension1" onChange={logisticsFromik.handleChange} checked={logisticsFromik.values.PackageDimension === 'CM'} value="CM" />
                            <label className="form-check-label" htmlFor="Dimension1">
                                cm
                            </label>
                        </div>
                        &nbsp;
                        &nbsp;
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="PackageDimension" id="Dimension2" onChange={logisticsFromik.handleChange} checked={logisticsFromik.values.PackageDimension === 'IN'} value="IN" />
                            <label className="form-check-label" htmlFor="Dimension2">
                                in
                            </label>
                        </div>
                    </div>
                    <div className="errors">{logisticsFromik.errors.PackageDimension}</div>
                </div>
                <div className="size-input">
                    <div className="mb-3">
                        <label htmlFor="exampleInputName" className="form-label">Height</label>
                        <input name="PackageHeight" onChange={logisticsFromik.handleChange} value={logisticsFromik.values.PackageHeight} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                        <div className="errors">{logisticsFromik.errors.PackageHeight}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputName" className="form-label">Width</label>
                        <input name="PackageWidth" onChange={logisticsFromik.handleChange} value={logisticsFromik.values.PackageWidth} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                        <div className="errors">{logisticsFromik.errors.PackageWidth}</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputName" className="form-label">Depth</label>
                        <input name="PackageDepth" onChange={logisticsFromik.handleChange} value={logisticsFromik.values.PackageDepth} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                        <div className="errors">{logisticsFromik.errors.PackageDepth}</div>
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Estimated weight with packaging</label>
                    <div className="dimensions">
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="PackageWeight" id="Dimension1" onChange={logisticsFromik.handleChange} checked={logisticsFromik.values.PackageWeight === "KG"} value="KG" />
                            <label className="form-check-label" htmlFor="Dimension1">
                                kg
                            </label>
                        </div>
                        &nbsp;
                        &nbsp;
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="PackageWeight" id="Dimension2" onChange={logisticsFromik.handleChange} checked={logisticsFromik.values.PackageWeight === "LB"} value="LB" />
                            <label className="form-check-label" htmlFor="Dimension2">
                                lb
                            </label>
                        </div>
                    </div>
                    <div className="errors">{logisticsFromik.errors.PackageWeight}</div>
                </div>
                <div className="mb-3">
                    <input name="PackageWeightValue" onChange={logisticsFromik.handleChange} value={logisticsFromik.values.PackageWeightValue} type="text" className="form-control" id="exampleInputName" aria-describedby="emailHelp" />
                    <div className="errors">{logisticsFromik.errors.PackageWeightValue}</div>
                </div>
                <div className="d-flex justify-content-evenly">
                    {apiLoading ?
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <>
                            <button type="button" onClick={() => { setcreateItemState(2) }} className="btn btn-primary">Back</button>
                            <button type="submit" className="btn btn-primary">Next</button>
                        </>
                    }
                </div>
            </form>);
    }
    const megabytesToBytes = (megabytes) => {
        const bytes = megabytes * 1024 * 1024;
        return bytes;
    };
    const imageDetailsSchma = Yup.object().shape({
        Thumb: Yup.mixed()
            .required('Thumb image is required').test(
                'fileFormat',
                'Unsupported Format',
                (value) => {
                    if (!value) return false;
                    return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
                },
            ).test('fileSize', 'File size is too large', (value) => {
                if (value && mediaLimit?.Size) {
                    return value.size <= megabytesToBytes(mediaLimit?.Size); // 1 MB 2504642
                }
                return true;
            }),
        Banner: Yup.mixed().required('Media image is required').test(
            'fileFormat',
            'Unsupported Format',
            (value) => {
                if (!value) return false;
                return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
            },
        ).test('fileSize', 'File size is too large', (value) => {
            if (value && mediaLimit?.Size) {
                return value.size <= megabytesToBytes(mediaLimit?.Size); // 1 MB 2504642
            }
            return true;
        }),
    })
    const imageDetailsFormik = useFormik({
        initialValues: {
            Banner: '',
            Thumb: '',
            Artworkid: sessionStorage.getItem('Artworkid')
        },
        validationSchema: imageDetailsSchma,
        onSubmit: values => {
            setAPILoading(true)
            createItemImageDetailAPI({
                Media: MediaURLstate,
                Thumb: ThumbURLstate,
                Artworkid: sessionStorage.getItem('Artworkid')
            }).then((res) => {
                setAPILoading(false)
                if (res.data?.status) {
                    sessionStorage.removeItem('Artworkid');
                    showToast(res.data.message)
                    setAPILoading(false)
                    window.location.replace(`/my-collection/${encodeURIComponent(parms.id)}`)
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch((error) => {
                setAPILoading(false)
            })
        }
    })
    const updateThumbupload = async (file) => {
        const selectedFile = file;
        const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSizeInBytes = mediaLimit?.Size * 1024 * 1024; // 10MB      
        if (!allowedExtensions.includes(selectedFile?.type)) {
        } else if (selectedFile.size > maxSizeInBytes) {
        } else {
            setAPILoading(true)
            setthumbLoading(true)
            let formdata = new FormData();
            formdata.append("Thumb", file)
            formdata.append("ItemId", sessionStorage.getItem('Artworkid'))
            const response = axios.post(`${process.env.REACT_APP_API_URL}/ArtItemThumb`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                }
            })
            response.then(res => {
                setAPILoading(false)
                setthumbLoading(false)
                if (res?.data?.status) {
                    setThumbURLstate(res.data?.Thumb);
                } else {
                    showErroToast(res?.error?.data?.message);
                }
            })
        }
    }
    const updateMediaupload = async (file) => {
        const selectedFile = file;
        const allowedExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSizeInBytes = mediaLimit?.Size * 1024 * 1024; // 10MB      
        if (!allowedExtensions.includes(selectedFile?.type)) {
        } else if (selectedFile.size > maxSizeInBytes) {
        } else {
            setAPILoading(true)
            setmediaLoading(true)
            let formdata = new FormData();
            formdata.append("Media", file)
            formdata.append("ItemId", sessionStorage.getItem('Artworkid'))
            const response = axios.post(`${process.env.REACT_APP_API_URL}/ArtItemMedia`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${sessionStorage.getItem("wallettoken")}`
                }
            })
            response.then(res => {
                setAPILoading(false)
                setmediaLoading(false)
                if (res?.data?.status) {
                    setMediaURLstate(res.data?.Media)
                } else {
                    showErroToast(res?.error?.data?.message);
                }
            })
        }
    }
    const imageUpload = () => {
        return (
            <form onSubmit={imageDetailsFormik.handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="collectionthumb" className="form-label">Thumb {"(" + mediaLimit?.Height} X {mediaLimit?.Width} px recommended {")"}</label>
                    <input name="Thumb" onChange={(e) => {
                        imageDetailsFormik.setFieldValue('Thumb', e.currentTarget.files[0])
                        updateThumbupload(e.currentTarget.files[0])
                    }} type="file" className="form-control" id="collectionthumb" />
                    <div className="errors">{imageDetailsFormik.errors.Thumb}</div>
                </div>

                <div className="mb-3">
                    <label htmlFor="collectionMedia" className="form-label">Media {"(" + mediaLimit?.Height} X {mediaLimit?.Width} px recommended {")"}</label>
                    <input name="Banner" onChange={(e) => {
                        imageDetailsFormik.setFieldValue('Banner', e.currentTarget.files[0])
                        updateMediaupload(e.currentTarget.files[0])
                    }} type="file" className="form-control" id="collectionMedia" />
                    <div className="errors">{imageDetailsFormik.errors.Banner}</div>
                </div>
                <div className="d-flex justify-content-evenly">
                    {apiLoading || mediaLoading || thumbLoading ?
                        <button className="btn btn-primary" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Loading...
                        </button>
                        : <>
                            <button type="button" onClick={() => {
                                if (sessionStorage.getItem('PhysicalEdition') > 0) {
                                    setcreateItemState(3)

                                } else {
                                    setcreateItemState(2)
                                }

                            }} className="btn btn-primary">Back</button>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </>
                    }
                </div>
            </form>
        );
    }
    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row">
                    <div className="col-8 offset-2">
                        <h1>Create art product item</h1>
                        <div className="step-section-header">
                            <ul className="step-section">
                                <li className={createItemState > 0 ? "active" : null}>{createItemState > 0 ? <i className="fa fa-check" aria-hidden="true"></i> : null}General Info</li>
                                <li className={createItemState > 1 ? "active" : null}>{createItemState > 1 ? <i className="fa fa-check" aria-hidden="true"></i> : null}Art Product Details</li>
                                <li className={createItemState > 2 ? "active" : null}>{createItemState > 2 ? <i className="fa fa-check" aria-hidden="true"></i> : null}Pricing</li>
                                <li className={createItemState > 3 ? "active" : null}>{createItemState > 3 ? <i className="fa fa-check" aria-hidden="true"></i> : null}Logistics</li>
                                <li className={createItemState > 4 ? "active" : null}>{createItemState > 4 ? <i className="fa fa-check" aria-hidden="true"></i> : null}Image</li>
                            </ul>
                        </div>

                        {createItemState === 0 && gerneraInfo()}
                        {createItemState === 1 && artistDetails()}
                        {createItemState === 2 && pricing()}
                        {createItemState === 3 && Logistics()}
                        {createItemState === 4 && imageUpload()}
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