import React, { useEffect, useState } from 'react'
import Banner from "./Banner";
import { Container } from 'react-bootstrap';
import "../../styles/ArtistProduct.css";
import { Link } from 'react-router-dom';

import { useGetArtistListMutation, useGetAllCollectionMutation } from "../../service/Apilist"
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';

function Index(props) {
 
  const [apiLoading, setAPILoading] = useState(false);
  const [collectionList, collectionListResponse] = useState([]);
  const [collectionGetAPI, rescollectionGetAPI] = useGetAllCollectionMutation();
  useEffect(() => {
    collectionGetAPI({
      Role: "Collector"
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
    <div>
      <div className='landing-banner-ps'>
        <Banner banerimage={props?.bannerState?.PrivateCollector} />
      </div>
      <Container fluid className='sectionOne'>
        <button className='artistProductBtn'>Private Collectors</button>
      </Container>
      <br />
      <br />
      <br />
      <Container fluid>
        <div className='row'>
          <Container>
            <div className=''>
              <div className=''>
                <div className='row'>
                  <div className='artistContainer' >
                    <Container className='section-four'>
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
                                        <Link className='' to={`/collection/${encodeURIComponent(encryptedItemId)}`}>
                                          <div className=" image-container">
                                            <img src={collection?.ProfilePicture} className="collectionOne" alt='collector-img' />
                                            <div className="image-overlay">
                                              <p className="image-text">{collection?.ProfileName}</p>
                                            </div>
                                          </div>
                                        </Link>
                                      </div>
                                    case 1:
                                      return <div key={index} className='col-lg-4'>
                                        <Link className='' to={`/collection/${encodeURIComponent(encryptedItemId)}`}>
                                          <div className=" collectionTwo image-container">
                                            <img src={collection?.ProfilePicture} className="collectionOne"  alt='collector-img'/>
                                            <div className="image-overlay">
                                              <p className="image-text">{collection?.ProfileName}</p>
                                            </div>
                                          </div>
                                        </Link>
                                      </div>
                                    case 2:
                                      return <div key={index} className='col-lg-4'>
                                        <Link className='' to={`/collection/${encodeURIComponent(encryptedItemId)}`} >
                                          <div className="image-container">
                                            <img src={collection?.ProfilePicture} className="collectionOne"  alt='collector-img'/>
                                            <div className="image-overlay">
                                              <p className="image-text">{collection?.ProfileName}</p>
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
                </div>
              </div>
            </div>
          </Container>
        </div>
      </Container>
      {apiLoading ? <LoadingScreen /> : null}
    </div>
  )
}

export default Index