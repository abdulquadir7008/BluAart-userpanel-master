import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { useParams } from 'react-router-dom';
import {
    useGetStylesQuery,
    useGetMaterialsQuery,
    useGetMediumQuery,
    useGetCategoryQuery,
    useGetArtProductMaterialQuery,
    useGetArtProductBrandQuery,
    useGetArtProductStylesQuery,
    useGetArtProductTechniqueQuery,
    useGetArtProductShapeQuery,
    useGetCushionSizeQuery,
    useGetRugSizeQuery,
    useGetArtProductFabricQuery
} from '../../service/Apilist'
function Filter(props) {
    let params = useParams();
    const [hideFilter, setHideFilter] = useState(true)
    const [StylesAPI, setStylesAPI] = useState([]);
    const [Styles, setStyles] = useState([]);
    const [MaterialsAPI, setMaterialsAPI] = useState([]);
    const [Materials, setMaterials] = useState([]);
    const [BrandState, setBrandState] = useState([]);
    const [ShapeState, setShapeState] = useState([]);
    const [techniqueState, setTechniqueState] = useState([]);
    const [rugsSizeState, setrugsSizeState] = useState([]);
    const [fabricState, setfabricState] = useState([]);
    const [cushionSizeState, setcushionSizeState] = useState([]);
    const [MediumAPI, setMediumAPI] = useState([]);
    const [CategoryAPI, setCategoryAPI] = useState([]);

    const getMaterials = useGetArtProductMaterialQuery();
    const getBrand = useGetArtProductBrandQuery();
    const getStyles = useGetArtProductStylesQuery();
    const getMedium = useGetMediumQuery();
    const category = useGetCategoryQuery();
    const getTechnique = useGetArtProductTechniqueQuery();
    const getShape = useGetArtProductShapeQuery();
    const getCushion = useGetCushionSizeQuery();
    const getRugs = useGetRugSizeQuery();
    const getFabric = useGetArtProductFabricQuery();
    let categoryName = atob(params.category);
    let nameParms = atob(params.name)

    useEffect(() => {
        if (getStyles?.status === "fulfilled") {
            setStylesAPI(getStyles?.data?.data)
            let stylesData = getStyles?.data?.data;
            let tempstyles = [];
            stylesData.length > 0 && stylesData.map((meterial, index) => (
                tempstyles.push({ value: meterial._id, label: meterial.Title },)
            ));
            setStyles(tempstyles);
        }
    }, [getStyles])
    useEffect(() => {
        if (getTechnique?.status === "fulfilled") {
            let stylesData = getTechnique?.data?.data;
            let tempstyles = [];
            stylesData.length > 0 && stylesData.map((meterial, index) => (
                tempstyles.push({ value: meterial._id, label: meterial.Title },)
            ));
            setTechniqueState(tempstyles);
        }
    }, [getTechnique])
    useEffect(() => {
        if (getMaterials?.status === "fulfilled") {
            setMaterialsAPI(getMaterials?.data?.data)
            let meterialsData = getMaterials?.data?.data;
            let tempMaterials = [];
            meterialsData?.length > 0 && meterialsData?.map((meterial, index) => (
                tempMaterials.push({ value: meterial._id, label: meterial.Title },)
            ));
            setMaterials(tempMaterials);
        }
    }, [getMaterials])
    useEffect(() => {
        if (getFabric?.status === "fulfilled") {
            setfabricState(getFabric?.data?.data)
        }
    }, [getFabric])
    useEffect(() => {
        if (getRugs?.status === "fulfilled") {
            setrugsSizeState(getRugs?.data?.data)
        }
    }, [getRugs])
    useEffect(() => {
        if (getCushion?.status === "fulfilled") {
            setcushionSizeState(getCushion?.data?.data)
        }
    }, [getCushion])
    useEffect(() => {
        if (getBrand?.status === "fulfilled") {
            setBrandState(getBrand?.data?.data)
        }
    }, [getBrand])
    useEffect(() => {
        if (getShape?.status === "fulfilled") {
            setShapeState(getShape?.data?.data)
        }
    }, [getShape])
    useEffect(() => {
        if (getMedium?.status === "fulfilled") {
            setMediumAPI(getMedium?.data?.data)
        }
    }, [getMedium])
    useEffect(() => {
        if (category?.status === "fulfilled") {
            setCategoryAPI(category?.data?.data)
        }
    }, [category])
    return (
        <div className='container'>
            <div className='row filterData'>
                <div className='col-lg-12'>
                    <p className='filterBorder' onClick={() => {
                        setHideFilter(!hideFilter)
                        props.filterChange()
                    }}>{hideFilter !== true ? "Hide Filter" : "Filter"}</p>
                    {!hideFilter !== true ? null :
                        <>
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Price</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            <li className='filterContent'>
                                                <label id='painting'>0-500</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Price": { min: 0, max: 500 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='drawing'>500-1,000 </label>
                                                <input
                                                    onClick={(e) => {
                                                        props.filterAPI({ "Price": { min: 500, max: 1000 } }, e.target.checked)
                                                    }}
                                                    htmlFor="drawing" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='sculpture'>1,000 -2,000</label>
                                                <input
                                                    onClick={(e) => {
                                                        props.filterAPI({ "Price": { min: 1000, max: 2000 } }, e.target.checked)
                                                    }}
                                                    htmlFor="sculpture" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='photography'>2,000 - 5,000</label>
                                                <input
                                                    onClick={(e) => {
                                                        props.filterAPI({ "Price": { min: 2000, max: 5000 } }, e.target.checked)
                                                    }}
                                                    htmlFor="photography" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='digitalNFT'>5,000 - 10,000</label>
                                                <input
                                                    onClick={(e) => {
                                                        props.filterAPI({ "Price": { min: 5000, max: 10000 } }, e.target.checked)
                                                    }}
                                                    htmlFor="digitalNFT" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='print-multiple'>Over 10,000</label>
                                                <input
                                                    onClick={(e) => {
                                                        props.filterAPI({ "Price": { min: 10000, max:  Math.pow(10, 1000) } }, e.target.checked)
                                                    }}
                                                    htmlFor="print-multiple" type="checkbox" />
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            {categoryName === '1'
                                || (categoryName === '2' && nameParms === "Rugs")
                                || categoryName === '3' ?
                                <Accordion className='accordion'>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Style</Accordion.Header>
                                        <Accordion.Body>
                                            <ul className='profile-ul-tag'>
                                                {Styles.length > 0 && Styles.map((style, index) => (
                                                    <li className='filterContent'>
                                                        <label id='painting'>{style.label}</label>
                                                        <input onClick={(e) => {
                                                            props.filterAPI({ "Style": style?.value }, e.target.checked)
                                                        }} htmlFor="painting" type="checkbox" />
                                                    </li>
                                                ))}
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion> : null}
                            {categoryName === '2' ? <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Technique</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            {techniqueState?.length > 0 && techniqueState.map((technique, index) => (
                                                <li className='filterContent'>
                                                    <label id='painting'>{technique.label}</label>
                                                    <input onClick={(e) => {                                                        
                                                        props.filterAPI({ "Technique": technique?.value }, e.target.checked)
                                                    }
                                                    } htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion> : null}
                            {categoryName === '2' && nameParms === 'Cushions' ? <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Fabric</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            {fabricState?.length > 0 && fabricState.map((fabric, index) => (
                                                <li className='filterContent'>
                                                    <label id='painting'>{fabric.Title}</label>
                                                    <input onClick={(e) => {
                                                        props.filterAPI({ "Fabric": fabric?._id }, e.target.checked)
                                                    }
                                                    } htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion> : null}
                            {categoryName === '6' ? <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Material</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>

                                            {Materials?.length > 0 && Materials.map((material, index) => (
                                                <li className='filterContent'>

                                                    <label id='painting'>{material?.label}</label>
                                                    <input onClick={(e) => {
                                                        props.filterAPI({ "Material": material?.value }, e.target.checked)
                                                    }} htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion> : null}
                            {categoryName === '2' ? <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Shape</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            {ShapeState.length > 0 && ShapeState.map((shape, index) => (
                                                <li className='filterContent'>
                                                    <label id='painting'>{shape.Title}</label>
                                                    <input onClick={(e) => {
                                                        props.filterAPI({ "Shape": shape._id }, e.target.checked)
                                                    }} htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion> : null}
                            {categoryName === '2' ?
                                (<>
                                    {nameParms === 'Rugs' ?
                                        <Accordion className='accordion'>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>Size</Accordion.Header>
                                                <Accordion.Body>
                                                    <ul className='profile-ul-tag'>
                                                        {rugsSizeState.length > 0 && rugsSizeState.map((rugsize, index) => (
                                                            <li className='filterContent'>
                                                                <label id='painting'>{rugsize.Title}</label>
                                                                <input onClick={(e) => {
                                                                    props.filterAPI({ "Size": rugsize._id }, e.target.checked)
                                                                }} htmlFor="painting" type="checkbox" />
                                                            </li>
                                                        ))}

                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        :
                                        <Accordion className='accordion'>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>Size</Accordion.Header>
                                                <Accordion.Body>
                                                    <ul className='profile-ul-tag'>
                                                        {cushionSizeState.length > 0 && cushionSizeState.map((cushionsize, index) => (
                                                            <li className='filterContent'>
                                                                <label id='painting'>{cushionsize.Title}</label>
                                                                <input onClick={(e) => {
                                                                   props.filterAPI({ "Size": cushionsize._id }, e.target.checked)
                                                                }} htmlFor="painting" type="checkbox" />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    }
                                </>)
                                : null}
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Brand</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            {BrandState.length > 0 && BrandState.map((brand, index) => (
                                                <li className='filterContent'>
                                                    <label id='painting'>{brand?.Title}</label>
                                                    <input onClick={(e) => {
                                                        props.filterAPI({ "Brand": brand?._id }, e.target.checked)
                                                    }} htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}

                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </>}
                </div>
            </div>
        </div>
    )
}

export default Filter