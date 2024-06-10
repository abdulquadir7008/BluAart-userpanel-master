import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Banner from './Banner'
import { Container } from 'react-bootstrap'
import "../../styles/Art.css"
import { Link, useParams } from 'react-router-dom'
import LazyLoad from 'react-lazyload';
import { useGetAllArtItemsMutation, useGetInnerBannerDetailsQuery } from "../../service/Apilist";
import { socket } from "../../socket";
import CryptoJS from 'crypto-js';

function ArtCatetgory() {
  let parms = useParams();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [getAllItems, resgetAllItems] = useGetAllArtItemsMutation();
  const getInnerBanner = useGetInnerBannerDetailsQuery();
  const [itemList, itemListResponse] = useState([]);
  const [itemAllList, itemAllListResponse] = useState([]);
  const [MaterialState, setMaterial] = useState([]);
  const [MediumState, setMedium] = useState([]);
  const [StylesState, setStyles] = useState([]);
  const [SizeState, setSize] = useState([]);
  const [OrientationState, setOrientation] = useState([]);
  const [minpriceState, setminpriceState] = useState([]);
  const [maxpriceState, setmaxpriceState] = useState([]);
  const [categoryState, setCategoryState] = useState("");
  const pushElementMaterial = (material) => {
    setMaterial([...MaterialState, material]);
  };

  const removeElementMaterial = (material) => {
    setMaterial(MaterialState.filter((element) => element !== material));
  };

  const pushElementMedium = (material) => {
    setMedium([...MediumState, material]);
  };

  const removeElementMedium = (material) => {
    setMedium(MediumState.filter((element) => element !== material));
  };

  const pushElementStyles = (material) => {
    setStyles([...StylesState, material]);
  };

  const removeElementStyles = (material) => {
    setStyles(StylesState.filter((element) => element !== material));
  };

  const pushElementSize = (material) => {
    setSize([...SizeState, material]);
  };

  const removeElementSize = (material) => {
    setSize(SizeState.filter((element) => element !== material));
  };

  const pushElementOrientation = (material) => {
    setOrientation([...OrientationState, material]);
  };

  const removeElementOrientation = (material) => {
    setOrientation(OrientationState.filter((element) => element !== material));
  };

  const pushElementMinPrice = (price) => {
    setminpriceState([...minpriceState, price]);
  };

  const removeElementMinPrice = (price) => {
    setminpriceState(minpriceState.filter((element) => element !== price));
  };
  const pushElementMaxPrice = (price) => {
    setmaxpriceState([...maxpriceState, price]);
  };

  const removeElementMaxPrice = (price) => {
    setmaxpriceState(maxpriceState.filter((element) => element !== price));
  };

  const decryptedItemName = CryptoJS.AES.decrypt(parms.category, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);

  useEffect(() => {
    getAllItems({
      Category: decodeURIComponent(decryptedItemName)
    })
  }, [])
  useEffect(() => {
    if (resgetAllItems?.status === "fulfilled") {
      itemListResponse(resgetAllItems?.data?.data);
      setCategoryState(resgetAllItems?.data?.category)
      itemAllListResponse(resgetAllItems?.data?.data);
    }
  }, [resgetAllItems?.status])

  const filterAPI = (data, status) => {
    if (data?.Material) {
      if (status) {
        pushElementMaterial(data?.Material);
      } else {
        removeElementMaterial(data?.Material);
      }
    }
    if (data?.Medium) {
      if (status) {
        pushElementMedium(data?.Medium);
      } else {
        removeElementMedium(data?.Medium);
      }
    }
    if (data?.Styles) {
      if (status) {
        pushElementStyles(data?.Styles);
      } else {
        removeElementStyles(data?.Styles);
      }
    }
    if (data?.Size) {
      if (status) {
        pushElementSize(data?.Size);
      } else {
        removeElementSize(data?.Size);
      }
    }
    if (data?.Orientation) {
      if (status) {
        pushElementOrientation(data?.Orientation);
      } else {
        removeElementOrientation(data?.Orientation);
      }
    }
    if (data?.Orientation) {
      if (status) {
        pushElementOrientation(data?.Orientation);
      } else {
        removeElementOrientation(data?.Orientation);
      }
    }

    if (data.Price) {
      let minvalue = data.Price.min;
      let maxvalue = data.Price.max;
      if (minvalue || minvalue === 0) {
        if (status) {
          pushElementMinPrice(data?.Price?.min);
        } else {
          removeElementMinPrice(data?.Price?.min);
        }
      }
      if (maxvalue) {
        if (status) {
          pushElementMaxPrice(data?.Price?.max);
        } else {
          removeElementMaxPrice(data?.Price?.max);
        }
      }

    }
  }
  useLayoutEffect(() => {

    emitSocket();
  }, [MaterialState, MediumState, StylesState, SizeState, OrientationState, minpriceState, maxpriceState])
  const emitSocket = () => {
    let socketData = {};
    if (MaterialState.length > 0) {
      socketData.Material = MaterialState
    }
    if (MediumState.length > 0) {
      socketData.Medium = MediumState
    }
    if (StylesState.length > 0) {
      socketData.Styles = StylesState
    }
    if (SizeState.length > 0) {
      socketData.Size = SizeState
    }
    if (OrientationState.length > 0) {
      socketData.Orientation = OrientationState
    }
    if (minpriceState.length > 0 && maxpriceState.length > 0) {
      socketData.Price = minpriceState[0] + '-' + maxpriceState.pop();
    }
    
    if (Object.keys(socketData).length > 0) {
      socket.emit("getItemAllDataFilters", socketData);
    } else {
      itemListResponse(itemAllList);
    }
  }
  const [bannerImageState, setBannerImageState] = useState("")
  useEffect(() => {
    if (getInnerBanner.status === "fulfilled") {
      
      let category = decodeURIComponent(decryptedItemName);
      if(category == 10){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Textileart)
      }else if(category == 18){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.ResinArt)
      }else if(category == 8){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.DigitalArt)
      }else if(category == 7){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Glassart)
      }else if(category == 6){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Metalart)
      }else if(category == 5){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Woodart)
      }else if(category == 4){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Potteryandceramics)
      }else if(category == 3){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.PrintMedia)
      }else if(category == 2){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Sculpture)
      }else if(category == 1){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Paintings)
      }else if(category == 19){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Textureart)
      }else if(category == 20){
        setBannerImageState(getInnerBanner?.data?.Info[0]?.MixMediaart)
      }

      
    }
  }, [getInnerBanner])
  
  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('itemData', (data) => {
      itemListResponse(data?.data);
    });
  }, [])
  const [open, setOpen] = useState(false);
  const filterChange = () => {
    setOpen(!open);
  }
  return (
    <div>
      <div className='landing-banner-ps'>
        <Banner BannerImage={bannerImageState}></Banner>
      </div>
      <br/>
      <Container fluid>
        <div className='row'>
          
          {categoryState !== "" ? <Container fluid className='sectionOne'>
            <button className='ArtOne'>{categoryState}</button>
          </Container> : null} 
          <div className='col-lg-3 mainFilter' >
          </div>
          <div className={open ? "col-9" : "col-12"}>
            <div className='artistContainer' >
              <Container fluid className='section-art'>
                <div className='row'>
                  {itemList?.length > 0 && itemList.map((item, index) => {
                    let Cname = index % 3;
                    const encryptedItemId = CryptoJS.AES.encrypt(item._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                    return (
                      <>
                        {
                          (() => {
                            switch (Cname) {
                              case 0:
                                return <div key={index} className='col-lg-4'>
                                  <LazyLoad
                                    offset={100}
                                    once
                                  >
                                    <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                      <div className="image-container">
                                        <img src={item?.Thumb} className="artistOne"></img>
                                        <div className="image-overlay">
                                          <p className="image-text">{item?.Title}</p>
                                        </div>
                                      </div>
                                    </Link>
                                  </LazyLoad>
                                </div>
                              case 1:
                                return <div key={index} className='col-lg-4'>
                                  <LazyLoad
                                    offset={50}
                                    once
                                  >
                                    <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                      <div className="image-container image-container-artistTwo">
                                        <img src={item?.Thumb} className="artistTwo"></img>
                                        <div className="image-overlay">
                                          <p className="image-text">{item?.Title}</p>
                                        </div>
                                      </div>
                                    </Link>
                                  </LazyLoad>
                                </div>
                              case 2:
                                return <div key={index} className='col-lg-4'>
                                  <LazyLoad
                                    offset={0}
                                    once
                                  >
                                    <Link to={`/art/${encodeURIComponent(encryptedItemId)}`} >
                                      <div className="image-container">
                                        <img src={item?.Thumb} className="artistThree"></img>
                                        <div className="image-overlay">
                                          <p className="image-text">{item?.Title}</p>
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
          </div>
        </div>
      </Container>
    </div>
  )
}

export default ArtCatetgory