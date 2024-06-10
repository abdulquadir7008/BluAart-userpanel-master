import React, { useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';

function ArtistFilter(props) {

    const [hideFilter, setHideFilter] = useState(true)
    const [fillterstate, setfillterstate] = useState([]);

    const pushCategory = (material) => {
        setfillterstate([...fillterstate, material]);
    };
    const removeCategory = (material) => {

        setfillterstate(fillterstate.filter((element) => element !== material));
    };

    const addFilter = (filter, status) => {
        if (status) {
            pushCategory(filter)
        } else {
            removeCategory(filter);
        }
    }

    return (
        <div className='container'>
            <div className='row filterData'>
                <div className='col-lg-12'>
                    <p className='filterBorder' onClick={() => {
                        setHideFilter(!hideFilter)
                        props.filterChange()
                    }}>{hideFilter !== true ? "Hide Filter" : "Filter"}</p>
                    {!hideFilter !== true ? null : <Accordion className='accordion'>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>STYLE</Accordion.Header>
                            <Accordion.Body>
                                <ul className='profile-ul-tag'>
                                    {props.categoryList?.length > 0 && props.categoryList.map((category, index) => (
                                        <li className='filterContent'>
                                            <label id='painting'>{category?.Title}</label>
                                            <input onClick={(e) => {
                                                props.filterCategory(category, e.target.checked);
                                            }
                                            } htmlFor="painting" type="checkbox" />
                                        </li>
                                    ))}

                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>}
                </div>
            </div>
        </div>
    )
}

export default ArtistFilter;