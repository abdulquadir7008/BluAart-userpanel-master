import React, { useEffect, useState } from 'react'
import Banner from "./Banner"
import { Container } from 'react-bootstrap';
import "../../styles/ArtistProduct.css";
import { Link } from 'react-router-dom';
import Filter from '../Filter/Filter';
import { useGetArtProductCategoriesQuery } from "../../service/Apilist"
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';


function Index(props) {

  const getAllPhysicalItem = useGetArtProductCategoriesQuery();
  const [physicatArtState, setPhysicalArtState] = useState();
  const [apiLoading, setAPILoading] = useState(false);

  useEffect(() => {
    setAPILoading(true)
    if (getAllPhysicalItem?.status === "fulfilled") {
      setPhysicalArtState(getAllPhysicalItem?.data?.data);
      setAPILoading(false)
    }
  }, [getAllPhysicalItem?.status])

  return (
    <div>
      <div className='landing-banner-ps'>
        <Banner banerimage={props?.bannerState?.ArtProduct}/>
      </div>

      <Container fluid>
        <div className='row'>
          <div className='col-lg-12'>

            <div className='artistContainer'>
              <Container fluid>
                
                <div className='col-lg-12 '>
                  <div className='container'>
                    <div className='row'>
                      <div className='artistContainer' >
                        <Container className='section-four'>
                          <div className='row artist' >
                            {physicatArtState?.length > 0 && physicatArtState.map((artwork, index) => {
                              let Cname = index % 3;
                              const encryptedItemId = CryptoJS.AES.encrypt(artwork._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                              return (
                                <>
                                  {
                                    (() => {
                                      switch (Cname) {
                                        case 0:
                                          return <div key={index} className='col-lg-4'>
                                            <Link to={`/art/art-category/${encodeURIComponent(encryptedItemId)}`}>
                                              <div className=" image-container">
                                                <img src={artwork?.Image} className="collectionOne" />
                                                <div className="image-overlay">
                                                  <p className="image-text">{artwork?.Title}</p>
                                                </div>
                                              </div>
                                            </Link>
                                          </div>
                                        case 1:
                                          return <div key={index} className='col-lg-4'>
                                            <Link to={`/art/art-category/${encodeURIComponent(encryptedItemId)}`}>
                                              <div className=" collectionTwo image-container">
                                                <img src={artwork?.Image} className="collectionOne" />
                                                <div className="image-overlay">
                                                  <p className="image-text">{artwork?.Title}</p>
                                                </div>
                                              </div>
                                            </Link>
                                          </div>
                                        case 2:
                                          return <div key={index} className='col-lg-4'>
                                            <Link to={`/art/art-category/${encodeURIComponent(encryptedItemId)}`} >
                                              <div className="image-container">
                                                <img src={artwork?.Image} className="collectionOne" />
                                                <div className="image-overlay">
                                                  <p className="image-text">{artwork?.Title}</p>
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
          </div>
        </div>
      </Container>
      {apiLoading ? <LoadingScreen/> : null}
    </div>
  )
}

export default Index