import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Banner from './ARTBanner'
import { Container } from 'react-bootstrap'
import "../../styles/Art.css"
import { Link } from 'react-router-dom'
import ArtFilter from '../Filter/ArtFilter';
import LazyLoad from 'react-lazyload';
import { useGetAllArtItemsMutation } from "../../service/Apilist";
import { socket } from "../../socket";
import LoadingScreen from '../Loader/LoadingScreen'
import CryptoJS from 'crypto-js';


function Art(props) {

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [getAllItems, resgetAllItems] = useGetAllArtItemsMutation();
  const [itemList, itemListResponse] = useState([]);
  const [itemAllList, itemAllListResponse] = useState([]);
  const [MaterialState, setMaterial] = useState([]);
  const [MediumState, setMedium] = useState([]);
  const [StylesState, setStyles] = useState([]);
  const [SizeState, setSize] = useState([{}]);
  const [OrientationState, setOrientation] = useState([]);
  const [minpriceState, setminpriceState] = useState([]);
  const [maxpriceState, setmaxpriceState] = useState([]);
  const [wayToBuy, setwayToBuy] = useState([]);
  const [priceState, setpriceState] = useState([
    {}
  ]);
  const [timePeriodState, settimePeriodState] = useState([]);
  const [uniqueState, setUniqueState] = useState('');
  const [frameState, setFrameState] = useState('');
  const [filterColorState, setFilterColorState] = useState('');
  const [apiLoading, setAPILoading] = useState(false);

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
  useEffect(() => {
    getAllItems({
      Category: ""
    })
  }, [])
  useEffect(() => {
    setAPILoading(true)
    if (resgetAllItems?.status === "fulfilled") {
      itemListResponse(resgetAllItems?.data?.data);
      itemAllListResponse(resgetAllItems?.data?.data);
      setAPILoading(false)
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
    if (data?.Color) {
      setFilterColorState(data?.Color)
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
      let minSize = data?.Size?.min;
      let maxSize = data?.Size?.max;
      
      if (status) {
        let newArrayObj = {
          min: minSize,
          max: maxSize
        }
        setSize([...SizeState, newArrayObj])
      } else {
        setSize(SizeState.filter(item => item.min !== minSize && item.max !== maxSize))
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
    if (data === 'Rarity-limited' || data === 'Rarity-unique') {
      if (data === 'Rarity-unique') {
        setUniqueState('Unique');
      } else {
        setUniqueState('Limited');
      }
    }
    if (data === 'Framed' || data === 'NotFramed') {
      if (data === 'Framed') {
        setFrameState('Framed')
      } else {
        setFrameState('NotFramed')
      }
    }
    if (data?.Price) {
      let minvalue = data?.Price?.min;
      let maxvalue = data?.Price?.max;
      if (status) {
        let newArrayObj = {
          min: minvalue,
          max: maxvalue
        }
        setpriceState([...priceState, newArrayObj])
      } else {
        setpriceState(priceState.filter(item => item.min !== minvalue && item.max !== maxvalue))
      }
    }
    if (data.wayToBuy) {
      if (status) {
        setwayToBuy([...wayToBuy, data.wayToBuy.buy])
      } else {
        setwayToBuy(wayToBuy.filter(buy => buy !== data.wayToBuy.buy))
      }
    }
    if (data.timePeriod) {
      if (status) {
        settimePeriodState([...timePeriodState, data.timePeriod])
      } else {
        settimePeriodState(timePeriodState.filter(timeperiod => timeperiod.min !== data.timePeriod.min && timeperiod.max !== data.timePeriod.max))
      }
    }
  }

  useLayoutEffect(() => {
    emitSocket();
  }, [
    MaterialState,
    MediumState,
    frameState,
    StylesState,
    SizeState,
    OrientationState,
    priceState,
    uniqueState,
    filterColorState,
    wayToBuy,
    timePeriodState
  ])
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
      let minSize = SizeState?.reduce((prev, curn) => prev.min < curn.min ? prev : curn);
      let maxSize = SizeState?.reduce((prev, curn) => prev.max > curn.max ? prev : curn);

      if (minSize.min >= 0 && maxSize.max >= 0) {
        socketData.Size = minSize.min + '-' + maxSize.max
      }
    }
    if (OrientationState.length > 0) {
      socketData.Orientation = OrientationState
    }
    if (uniqueState === 'Unique') {
      socketData.Unique = true;
    } else if (uniqueState === 'Limited') {
      socketData.Unique = false;
    }
    if (priceState.length > 0) {
      let minPrice = priceState.length > 0 && priceState?.reduce((prev, curn) => prev.min < curn.min ? prev : curn)
      let maxPrice = priceState.length > 0 && priceState?.reduce((prev, curn) => prev.max > curn.max ? prev : curn)
      if (minPrice.min >= 0 && maxPrice.max >= 0) {
        socketData.Price = minPrice.min + '-' + maxPrice.max;
      }
    }
    if (filterColorState) {
      socketData.Color = filterColorState;
    }
    if (frameState) {
      socketData.Framed = frameState
    }
    if (wayToBuy.length > 0) {
      socketData.wayToBuy = wayToBuy
    }
    if (timePeriodState.length > 0) {
      let minTimePeriod = timePeriodState.length > 0 && timePeriodState?.reduce((prev, curn) => prev.min < curn.min ? prev : curn)
      let maxTimePeriod = timePeriodState.length > 0 && timePeriodState?.reduce((prev, curn) => prev.max > curn.max ? prev : curn)
      socketData.timePeriod = minTimePeriod.min + '-' + maxTimePeriod.max;
    }
    if (Object.keys(socketData).length > 0) {
      
      socket.emit("getItemAllDataFilters", socketData);
    } else {
      itemListResponse(itemAllList);
    }
  }
  
  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('itemData', (data) => {
      itemListResponse(data?.data)
    });
  }, [])
  const [open, setOpen] = useState(false);
  const filterChange = () => {
    setOpen(!open);
  }
  return (
    <div>
      <div className='landing-banner-ps'>
        <Banner banerimage={props?.bannerState?.Art}></Banner>
      </div>
      <Container fluid>
        <div className='row'>
          <div className='col-lg-3 mainFilter' >
            <ArtFilter filterChange={filterChange} filterAPI={filterAPI}></ArtFilter>
          </div>
          <div className={open ? "col-lg-9" : "col-lg-12"}>
            <div className='artistContainer' >
              <Container fluid className='section-art'>
                <div className='row'>
                  {itemList?.length > 0 && itemList.map((item, index) => {
                    let Cname = index % 3;
                    const encryptedItemId = CryptoJS.AES.encrypt(JSON.stringify(item._id), process.env.REACT_APP_SECRET_PASS).toString();

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
                                    <Link
                                      to={`/art/${encodeURIComponent(encryptedItemId)}`}
                                    >
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

      {apiLoading ? <LoadingScreen /> : null}


    </div>
  )
}

export default Art