import React, { useEffect, useState } from 'react'
import Banner from "./CategoryBanner"
import { Container } from 'react-bootstrap';
import "../../styles/ArtistProduct.css";
import { Link, redirect, useParams } from 'react-router-dom';
import {
  useGetAllPhysicalArtMutation,
  useGetLightingNameMutation,
  useGetFurnishingNameMutation,
  useGetFurnitureNameMutation,
  useGetInnerBannerDetailsQuery
} from "../../service/Apilist"
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';

function ArtproductCategory() {
  let parms = useParams()
  const [getAllPhysicalItem, resgetAllPhysicalItem] = useGetAllPhysicalArtMutation();
  const [getLigntingName, resgetLigntingName] = useGetLightingNameMutation();
  const [getFurnishingName, resFurnishingName] = useGetFurnishingNameMutation();
  const [getFurnitureName, resFurnitureName] = useGetFurnitureNameMutation();
  const getInnerBanner = useGetInnerBannerDetailsQuery();
  const [physicatArtNameState, setPhysicalArtNameState] = useState();
  const [physicatArtState, setPhysicalArtState] = useState();
  const [categoryState, setCategoryState] = useState("");
  const [apiLoading, setAPILoading] = useState(false);

  const { category } = useParams();
  const decryptedCategory = CryptoJS.AES.decrypt(parms.category, 'XkhZG4fW2t2W');
  const decryptedItemId = decryptedCategory.toString(CryptoJS.enc.Utf8);


  useEffect(() => {
    let categoryName = decodeURIComponent(decryptedItemId);
    if (categoryName === "6") {
      getLigntingName({
      })
    } else if (categoryName === "1") {
      getFurnitureName({

      })
    } else if (categoryName === "2") {
      getFurnishingName({

      })
    } else {
       window.location.replace(`${(encodeURIComponent(parms.category))}/${encodeURIComponent(parms.category)}`)
    }
  }, [])
  useEffect(() => {
    setAPILoading(true)
    if (resgetAllPhysicalItem?.status === "fulfilled") {
      setCategoryState(resgetAllPhysicalItem?.data?.category);
      setPhysicalArtState(resgetAllPhysicalItem?.data?.data);
      setAPILoading(false)
    }
  }, [resgetAllPhysicalItem?.status])
  useEffect(() => {
    setAPILoading(true)
    if (resgetLigntingName?.status === "fulfilled") {
      setPhysicalArtNameState(resgetLigntingName?.data?.data);
      setCategoryState(resgetLigntingName?.data?.category);
      setAPILoading(false)
    }
  }, [resgetLigntingName?.status])
  useEffect(() => {
    setAPILoading(true)
    if (resFurnishingName?.status === "fulfilled") {
      setPhysicalArtNameState(resFurnishingName?.data?.data);
      setCategoryState(resFurnishingName?.data?.category);
      setAPILoading(false)
    }
  }, [resFurnishingName?.status])
  useEffect(() => {
    setAPILoading(true)
    if (resFurnitureName?.status === "fulfilled") {
      setPhysicalArtNameState(resFurnitureName?.data?.data);
      setCategoryState(resFurnitureName?.data?.category);
      setAPILoading(false)
    }
  }, [resFurnitureName?.status])
  const [bannerImageState, setBannerImageState] = useState("")
  useEffect(() => {
    if (getInnerBanner.status === "fulfilled") {
      let categoryName = encodeURIComponent(decryptedItemId);
      
      if (categoryName == "6") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.AccentLighting)
      } else if (categoryName == "3") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.AccentWalls)
      } else if (categoryName == "2") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.AccentFurnishing)
      } else if (categoryName == "1") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.AccentFurniture)
      } else if (categoryName === "Metal Carving") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Metalart)
      } else if (categoryName === "Wood Carving") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Woodart)
      } else if (categoryName === "Pottery and Ceramics") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Potteryandceramics)
      } else if (categoryName === "Print Making") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.PrintMedia)
      } else if (categoryName === "Sculpture") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Sculpture)
      } else if (categoryName === "Painting") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Paintings)
      }
    }
  }, [getInnerBanner])
  return (
    <div>
      <div className='landing-banner-ps'>
        <Banner BannerImage={bannerImageState}></Banner>
      </div>
      <Container fluid>
        <div className='row'>
          <div className='col-lg-12'>
            <br />
            <Container fluid className='sectionOne'>
              <button className='artistProductBtn'>{categoryState}</button>
            </Container>
            <div className='artistContainer'>
              <Container fluid>
                <div className='col-lg-12 '>
                  <div className='container'>
                    <div className='row'>
                      <div className='artistContainer' >
                        {categoryState === "Feature/Accent walls" ?
                          <Container className='section-four'>
                            <div className='row artist' >
                              {physicatArtState?.length > 0 && physicatArtState.map((artwork, index) => {
                                let Cname = index % 3;
                                const encryptedItemId = CryptoJS.AES.encrypt(artwork?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                                return (
                                  <>
                                    {
                                      (() => {
                                        switch (Cname) {
                                          case 0:
                                            return <div key={index} className='col-lg-4'>
                                              <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                                <div className=" image-container">
                                                  <img src={artwork?.Thumb} className="collectionOne" />
                                                  <div className="image-overlay">
                                                    <p className="image-text">{artwork?.Name}</p>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          case 1:
                                            return <div key={index} className='col-lg-4'>
                                              <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                                <div className=" collectionTwo image-container">
                                                  <img src={artwork?.Thumb} className="collectionOne" />
                                                  <div className="image-overlay">
                                                    <p className="image-text">{artwork?.Name}</p>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                          case 2:
                                            return <div key={index} className='col-lg-4'>
                                              <Link to={`/art/${encodeURIComponent(encryptedItemId)}`} >
                                                <div className="image-container">
                                                  <img src={artwork?.Thumb} className="collectionOne" />
                                                  <div className="image-overlay">
                                                    <p className="image-text">{artwork?.Name}</p>
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
                          </Container> :
                          <Container className='section-four'>
                            <div className='row artist' >
                              {physicatArtNameState?.length > 0 && physicatArtNameState.map((artwork, index) => {
                                let Cname = index % 3;
                                const encryptedItemId = CryptoJS.AES.encrypt(artwork?.Title.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                                const encryptedCategory = CryptoJS.AES.encrypt(parms?.category.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                                const encodedEncryptedCategory = encodeURIComponent(encryptedCategory);
                                return (
                                  <>
                                    {
                                      (() => {
                                        switch (Cname) {
                                          case 0:
                                            return <div key={index} className='col-lg-4'>
                                              <Link to={`/art/art-category/${encodeURIComponent(parms?.category)}/${encodeURIComponent(encryptedItemId)}`}>
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
                                              <Link to={`/art/art-category/${encodeURIComponent(parms?.category)}/${encodeURIComponent(encryptedItemId)}`}>
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
                                              <Link to={`/art/art-category/${encodeURIComponent(parms?.category)}/${encodeURIComponent(encryptedItemId)}`} >
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
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </Container>
      {apiLoading ? <LoadingScreen /> : null}
    </div>
  )
}

export default ArtproductCategory;