import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Banner from './Banner'
import OneUser from '../../assets/ertrc1.png'
import { Container } from 'react-bootstrap'
import "../../styles/Collection.css"
import { Link } from 'react-router-dom';
import {
    useGetUserBasedCollectionMutation
} from '../../service/Apilist';
import LazyLoad from 'react-lazy-load';
import CryptoJS from 'crypto-js';

function Collections(props) {
    let parms = useParams();
    let navigate = useNavigate();
    const navCreatecolleciton = () => {
        navigate("/createcollection")
    }
    const [collectionList, collectionListResponse] = useState([]);
    const [userState, setuserState] = useState({});
    const [collectionGetAPI, rescollectionGetAPI] = useGetUserBasedCollectionMutation();

    const decryptedItemId = CryptoJS.AES.decrypt(parms?.artistId, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);

    useEffect(() => {
        collectionGetAPI({
            AuthorId: encodeURIComponent(decryptedItemId)
        })
    }, [])
    useEffect(() => {
        if (rescollectionGetAPI?.status === "fulfilled") {
            collectionListResponse(rescollectionGetAPI?.data?.collectiondata);

            setuserState(rescollectionGetAPI?.data?.userdata[0])


        }
    }, [rescollectionGetAPI?.status])

    return (
        <>
            <div className='landing-banner-ps'>
                <Banner banerimage={props?.bannerState?.CorporateCollection}></Banner>
            </div>
            <br />
            
            <section className='collection-main-box'>
                <Container>
                    <div className='collection-box-inn'>
                        <div className='row' >
                            <div className='col-lg-4'>
                                <div className='collection-box-l'>
                                    <img src={userState?.ProfilePicture} className=""></img>
                                </div>
                            </div>
                            <div className='col-lg-8 collection-box-r'>
                                <div className='collection-box-r-inn'>
                                    <h3>{userState?.ProfileName}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <div className='artistContainer' >
                <Container className='section-collection'>
                    <div className='row artist' >
                        {collectionList?.length > 0 && collectionList.map((collection, index) => {
                            let Cname = index % 3;
                            const encryptedItemId = CryptoJS.AES.encrypt(JSON.stringify(collection._id), process.env.REACT_APP_SECRET_PASS).toString();
                            const encryptedartistId = CryptoJS.AES.encrypt(JSON.stringify(parms?.artistId), process.env.REACT_APP_SECRET_PASS).toString();

                            return (
                                <>
                                    {
                                        (() => {
                                            switch (Cname) {
                                                case 0:
                                                    return <div key={index} className='col-lg-4'>
                                                        <LazyLoad offset={100}>
                                                            <Link to={`/collection/${encodeURIComponent(encryptedartistId)}/${encodeURIComponent(encryptedItemId)}`}>
                                                                <div className=" image-container">
                                                                    <img src={collection?.Thumb} className="collectionOne" />
                                                                    <div className="image-overlay">
                                                                        <p className="image-text">{collection?.Name}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </LazyLoad>
                                                    </div>
                                                case 1:
                                                    return <div key={index} className='col-lg-4'>
                                                        <LazyLoad offset={50}>
                                                            <Link to={`/collection/${encodeURIComponent(decryptedItemId)}/${encodeURIComponent(encryptedItemId)}`}>
                                                                <div className=" collectionTwo image-container">
                                                                    <img src={collection?.Thumb} className="collectionOne" />
                                                                    <div className="image-overlay">
                                                                        <p className="image-text">{collection?.Name}</p>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                        </LazyLoad>
                                                    </div>
                                                case 2:
                                                    return <div key={index} className='col-lg-4'>
                                                        <LazyLoad offset={0}>
                                                        <Link to={`/collection/${encodeURIComponent(decryptedItemId)}/${encodeURIComponent(encryptedItemId)}`}>
                                                                <div className="image-container">
                                                                    <img src={collection?.Thumb} className="collectionOne" />
                                                                    <div className="image-overlay">
                                                                        <p className="image-text">{collection?.Name}</p>
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
        </>
    );
}

export default Collections;