import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import { CompactPicker } from 'react-color';
import {
    useGetStylesQuery,
    useGetMaterialsQuery,
    useGetMediumQuery,
    useGetCategoryQuery
} from '../../service/Apilist'
function ArtFilter(props) {
    const [hideFilter, setHideFilter] = useState(true);
    const [FramedState, setFramedState] = useState(false);
    const [notFramedState, setNotFramedState] = useState(false);
    const [uniqueState, setUniqueState] = useState(false);
    const [notUniqueState, setNotUniqueState] = useState(false);
    const [StylesAPI, setStylesAPI] = useState([]);
    const [Styles, setStyles] = useState([]);
    const [MaterialsAPI, setMaterialsAPI] = useState([]);
    const [Materials, setMaterials] = useState([]);
    const [MediumAPI, setMediumAPI] = useState([]);
    const [CategoryAPI, setCategoryAPI] = useState([]);
    const getStyles = useGetStylesQuery();
    const getMaterials = useGetMaterialsQuery();
    const getMedium = useGetMediumQuery();
    const category = useGetCategoryQuery();
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
        if (getMaterials?.status === "fulfilled") {
            setMaterialsAPI(getMaterials?.data?.data)
            let meterialsData = getMaterials?.data?.data;
            let tempMaterials = [];
            meterialsData.length > 0 && meterialsData.map((meterial, index) => (
                tempMaterials.push({ value: meterial._id, label: meterial.Title },)
            ));
            setMaterials(tempMaterials);
        }
    }, [getMaterials])
    useEffect(() => {
        if (getMedium?.status === "fulfilled") {
            setMediumAPI(getMedium?.data?.data)
            let subjectData = getMedium?.data?.data;
            let tempsubject = [];
        }
    }, [getMedium])
    useEffect(() => {
        if (category?.status === "fulfilled") {
            setCategoryAPI(category?.data?.data)
        }
    }, [category])
    const colorChanger = (color) => {
        props.filterAPI({ "Color": color?.hex })
    }
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
                                    <Accordion.Header>PRICE</Accordion.Header>
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
                                                        props.filterAPI({ "Price": { min: 10000, max: Math.pow(10, 1000) } }, e.target.checked)
                                                    }}
                                                    htmlFor="print-multiple" type="checkbox" />
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Color</Accordion.Header>
                                    <Accordion.Body>
                                        <CompactPicker className='filter' onChangeComplete={colorChanger} />
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>STYLE</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            {Styles?.length > 0 && Styles.map((style, index) => (
                                                <li className='filterContent'>
                                                    <label id='painting'>{style.label}</label>
                                                    <input onClick={(e) => {
                                                        props.filterAPI({ "Styles": style.value }, e.target.checked)
                                                    }
                                                    } htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>MATERIAL USED</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            {Materials?.length > 0 && Materials.map((material, index) => (
                                                <li className='filterContent'>
                                                    <label id='painting'>{material.label}</label>
                                                    <input onClick={(e) => {
                                                        props.filterAPI({ "Material": material?.value }, e.target.checked)
                                                    }
                                                    } htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Medium</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            {CategoryAPI?.length > 0 && CategoryAPI.map((category, index) => (
                                                <li className='filterContent'>
                                                    <label id='painting'>{category.Title}</label>
                                                    <input onClick={(e) => {
                                                        props.filterAPI({ "Styles": category._id }, e.target.checked)
                                                    }
                                                    } htmlFor="painting" type="checkbox" />
                                                </li>
                                            ))}

                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Size</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            <li className='filterContent'>
                                                <label id='painting'>Small</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Size": { min: 0, max: 18 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Medium</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Size": { min: 18, max: 48 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Large</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Size": { min: 48, max: 72 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>OverSized</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Size": { min: 72, max: Math.pow(10, 1000) } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>

                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>ORIENTATION</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            <li className='filterContent'>
                                                <label id='painting'>Horizontal</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Orientation": "Landscape" }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Vertical</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Orientation": "Portrait" }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Square</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "Orientation": "Square" }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>RARITY</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            <li className='filterContent'>
                                                <label id='painting'>Unique</label>
                                                <input onClick={(e) => {
                                                    setUniqueState(e.target.checked)
                                                    if (e.target.checked) {
                                                        setNotUniqueState(false)
                                                    }
                                                    props.filterAPI('Rarity-unique', e.target.checked)
                                                }
                                                } checked={uniqueState} htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Limited Edition</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI('Rarity-limited', e.target.checked)
                                                    setNotUniqueState(e.target.checked)
                                                    if (e.target.checked) {
                                                        setUniqueState(false)
                                                    }
                                                }
                                                } checked={notUniqueState} htmlFor="painting" type="checkbox" />
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>FRAME</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            <li className='filterContent'>
                                                <label id='painting'>Framed</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI('Framed', e.target.checked)
                                                    setFramedState(e.target.checked)
                                                    if (e.target.checked) {
                                                        setNotFramedState(false)
                                                    }
                                                }
                                                } checked={FramedState} htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>NotFramed</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI('NotFramed', e.target.checked)
                                                    setNotFramedState(e.target.checked)
                                                    if (e.target.checked) {
                                                        setFramedState(false)
                                                    }
                                                }
                                                } checked={notFramedState} htmlFor="painting" type="checkbox" />
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>WAYS TO BUY</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            <li className='filterContent'>
                                                <label id='painting'>Purchase</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({'wayToBuy' : {buy : "Purchase"}}, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Make Offer</label>
                                                <input onClick={(e) => {
                                                     props.filterAPI({'wayToBuy' : {buy : "offer"}}, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Bid</label>
                                                <input onClick={(e) => {
                                                     props.filterAPI({'wayToBuy' : {buy : "bid"}}, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Accordion className='accordion'>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>TIME PERIOD</Accordion.Header>
                                    <Accordion.Body>
                                        <ul className='profile-ul-tag'>
                                            <li className='filterContent'>
                                                <label id='painting'>2020s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 2010 , max : 2020 }}, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>2010s</label>
                                                <input onClick={(e) => {
                                                   props.filterAPI({ "timePeriod": { min : 2000 , max : 2010 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>2000s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1990, max : 2000 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1990s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1980 , max : 1990 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1980s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1970, max : 1980 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1970s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1960 , max : 1970 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1960s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1950 , max : 1960 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1950s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 2010 , max : 2020 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1940s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1930 , max : 1940 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1930s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1920, max : 1930 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1920s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1910 , max : 1920 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1910s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1900 , max : 1910 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>1900s</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1890 , max : 1900 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Late 19th Century</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1850 , max : 1900 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Mid 19th Century</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1820 , max : 1866 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>Farly 19th Century</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 1800 , max : 1840 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
                                            <li className='filterContent'>
                                                <label id='painting'>18th Century & Earlier</label>
                                                <input onClick={(e) => {
                                                    props.filterAPI({ "timePeriod": { min : 0 , max : 1799 } }, e.target.checked)
                                                }
                                                } htmlFor="painting" type="checkbox" />
                                            </li>
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

export default ArtFilter;