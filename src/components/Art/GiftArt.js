import React, { useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import "../../styles/Art.css"
import { Link } from 'react-router-dom'
import LazyLoad from 'react-lazyload';
import { useGiftNftListQuery } from "../../service/Apilist";
import CryptoJS from 'crypto-js';

function Art(props) {
  const getAllGiftItems = useGiftNftListQuery();
  const [itemList, itemListResponse] = useState([]);

  useEffect(() => {
    if (getAllGiftItems?.status === "fulfilled") {
      itemListResponse(getAllGiftItems?.data?.data);
    }
  }, [getAllGiftItems?.status])
  return (
    <div>
      <Container fluid>
        <div className='row'>
          <div className="col-12">
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
                                    <Link to={`/giftart/${encodeURIComponent(encryptedItemId)}`}>
                                      <div className="image-container">
                                        <img src={item?.Thumb} className="artistOne"></img>
                                        <div className="image-overlay">
                                          <p className="image-text">{item?.Name}</p>
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
                                    <Link to={`/giftart/${encodeURIComponent(encryptedItemId)}`}>
                                      <div className="image-container image-container-artistTwo">
                                        <img src={item?.Thumb} className="artistTwo"></img>
                                        <div className="image-overlay">
                                          <p className="image-text">{item?.Name}</p>
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
                                    <Link to={`/giftart/${encodeURIComponent(encryptedItemId)}`} >
                                      <div className="image-container">
                                        <img src={item?.Thumb} className="artistThree"></img>
                                        <div className="image-overlay">
                                          <p className="image-text">{item?.Name}</p>
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

export default Art