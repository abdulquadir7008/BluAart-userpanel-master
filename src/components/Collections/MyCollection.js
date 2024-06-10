import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Banner from './ProfileBanner'
import { Container } from 'react-bootstrap'
import "../../styles/Collection.css"
import { Link } from 'react-router-dom';
import { useGetCollectionQuery } from '../../service/Apilist';
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';


function MyCollection(props) {
    let navigate = useNavigate();
    const navCreatecolleciton = () => {
        navigate("/createcollection")
    }
    let params = useParams();
    const [collectionList, collectionListResponse] = useState([]);
    const [userStae, setuserState] = useState({});
    const [apiLoading, setAPILoading] = useState(false);


    const collectionGet = useGetCollectionQuery();
    useEffect(() => {
        collectionGet.refetch();
    },[])
    useEffect(() => {
        setAPILoading(true)
        if (collectionGet?.status === "fulfilled") {
            collectionListResponse(collectionGet?.data?.data);
            setuserState(collectionGet?.data?.data[0]?.UserInfo)
            setAPILoading(false)
        }
    }, [collectionGet])

    return (
        <>
            <div className='landing-banner-ps'>
                <Banner banerimage={userStae?.CoverVideo}></Banner>
            </div>
            <br />
            <div className='d-flex justify-content-end'>
                <button className='btn btn-success' onClick={navCreatecolleciton} >Create Collection</button>
            </div>
            <div className='artistContainer' >
                <Container className='section-collection'>
                    
                    <div className='row' >
                        {collectionList?.length > 0 && collectionList.map((collection, index) => {
                              if (collection._id === null) {
                                return null;
                            }
                            const encryptedItemId = CryptoJS.AES.encrypt(collection._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                            let Cname = index % 3;
                            return (
                                <>
                                    {
                                        (() => {
                                            switch (Cname) {
                                                case 0:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/my-collection/${encodeURIComponent(encryptedItemId)}`}>
                                                            <div className="image-container">
                                                                <img src={collection?.CollectionInfo?.Thumb} className="collectionOne"></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{collection?.CollectionInfo?.Name}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                case 1:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/my-collection/${encodeURIComponent(encryptedItemId)}`}>
                                                            <div className="collectionTwo image-container">
                                                                <img src={collection?.CollectionInfo?.Thumb} className="artistTwo"></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{collection?.CollectionInfo?.Name}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                case 2:
                                                    return <div key={index} className='col-lg-4'>
                                                        <Link to={`/my-collection/${encodeURIComponent(encryptedItemId)}`} >
                                                            <div className="image-container">
                                                                <img src={collection?.CollectionInfo?.Thumb} className="artistThree"></img>
                                                                <div className="image-overlay">
                                                                    <p className="image-text">{collection?.CollectionInfo?.Name}</p>
                                                                </div>
                                                            </div>
                                                        </Link>
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

export default MyCollection;