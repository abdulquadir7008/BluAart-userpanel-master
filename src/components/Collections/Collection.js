import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Banner from './Banner'
import { Container } from 'react-bootstrap'
import "../../styles/Collection.css"
import { Link } from 'react-router-dom';
import {
    useGetAllCollectionMutation
} from '../../service/Apilist';
import LazyLoad from 'react-lazy-load';
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';


function Collections(props) {
    let navigate = useNavigate();
    const navCreatecolleciton = () => {
        navigate("/createcollection")
    }
    const [collectionList, collectionListResponse] = useState([]);
    const [collectionGetAPI, rescollectionGetAPI] = useGetAllCollectionMutation();
    const [apiLoading, setAPILoading] = useState(false);

    useEffect(() => {
        collectionGetAPI({
            Role: "Corporate Collector"
        })
    }, [])
    useEffect(() => {
        setAPILoading(true)
        if (rescollectionGetAPI?.status === "fulfilled") {
            collectionListResponse(rescollectionGetAPI?.data?.data);
            setAPILoading(false)
        }
    }, [rescollectionGetAPI?.status])

    return (
        <>
            <div className='landing-banner-ps'>
                <Banner banerimage={props?.bannerState?.CorporateCollection}></Banner>
            </div>
            <br />
            <Container fluid className='sectionOne'>
                <button className='corporate-collection-title'>CORPORATE COLLECTION</button>
            </Container>
            <div className='artistContainer' >
                <Container className='section-collection'>
                    <div className='row artist' >
                        {collectionList?.length > 0 && collectionList.map((collection, index) => {
                            let Cname = index % 3;
                            const encryptedItemId = CryptoJS.AES.encrypt(JSON.stringify(collection._id), process.env.REACT_APP_SECRET_PASS).toString();

                            return (
                                <>
                                    {
                                        (() => {
                                            switch (Cname) {
                                                case 0:
                                                    return <div key={index} className='col-lg-4'>
                                                        <LazyLoad offset={100}>
                                                            <Link to={`/collection/${encodeURIComponent(encryptedItemId)}`}>
                                                                <div className=" image-container">
                                                                    <img src={collection?.ProfilePicture} className="collectionOne" />
                                                                    <div className="image-overlay">
                                                                        <p className="image-text">{collection?.ProfileName}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </LazyLoad>
                                                    </div>
                                                case 1:
                                                    return <div key={index} className='col-lg-4'>
                                                        <LazyLoad offset={50}>
                                                            <Link to={`/collection/${encodeURIComponent(encryptedItemId)}`}>
                                                                <div className=" collectionTwo image-container">
                                                                    <img src={collection?.ProfilePicture} className="collectionOne" />
                                                                    <div className="image-overlay">
                                                                        <p className="image-text">{collection?.ProfileName}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </LazyLoad>
                                                    </div>
                                                case 2:
                                                    return <div key={index} className='col-lg-4'>
                                                        <LazyLoad offset={0}>
                                                            <Link to={`/collection/${encodeURIComponent(encryptedItemId)}`} >
                                                                <div className="image-container">
                                                                    <img src={collection?.ProfilePicture} className="collectionOne" />
                                                                    <div className="image-overlay">
                                                                        <p className="image-text">{collection?.ProfileName}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </LazyLoad>
                                                    </div>
                                            }
                                        })()}
                                </>
                            );
                        })}
                    </div>
                </Container>
            </div>

            {apiLoading ? <LoadingScreen/> : null}
        </>
    );
}

export default Collections;