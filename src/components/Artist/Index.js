import React, { useEffect, useState } from 'react'
import Banner from "../Artist/ArtistBanner"
import { Container } from 'react-bootstrap';
import { Link, renderMatches } from 'react-router-dom';
import "../../styles/Artist.css"
import ArtistFilter from '../Filter/ArtistFilter';
import { useGetArtistListMutation, useGetArtistCategoriesQuery } from "../../service/Apilist"
import LazyLoad from 'react-lazy-load';
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';


function Index(props) {
  const getCategoryList = useGetArtistCategoriesQuery();
  const [categoryList, setCategoryList] = useState([]);
  const [categoryAllList, setCategoryAllList] = useState([]);
  const [idsList, setidsList] = useState([]);
  const [apiLoading, setAPILoading] = useState(false);

  useEffect(() => {
    setAPILoading(true)
    if (getCategoryList?.status === "fulfilled") {
      setCategoryList(getCategoryList?.data?.data);
      setCategoryAllList(getCategoryList?.data?.data);
      setAPILoading(false)
    }
  }, [getCategoryList.status])
  const [open, setOpen] = useState(false);
  const filterChange = () => {
    setOpen(!open);
  }
  const pushElementCategory = (id) => {
    setidsList([...idsList, id]);
  };

  const removeElementCategory = (id) => {
    setidsList(idsList.filter((element) => element !== id));
  };
  const filterCategory = (id, status) => {
    if (status) {
      pushElementCategory(id)
    } else {
      removeElementCategory(id)
    }
  }
  useEffect(() => {
    if (idsList?.length > 0) {
      setCategoryList(idsList);
    } else {
      setCategoryList(categoryAllList);
    }
  }, [idsList])
  return (
    <div>
      <div className='landing-banner-ps'>
        <Banner banerimage={props?.bannerState?.Artist} />
      </div>
      <Container >
        <div className='row'>
          <Container fluid className='sectionOne mt-3'>
            <button className='artistBtn'>Artist</button>
          </Container>
          <div className='col-lg-3 mainFilter'>
            <ArtistFilter filterChange={filterChange} categoryList={categoryAllList} filterCategory={filterCategory}></ArtistFilter>
          </div>
          <div className={open ? "col-9" : "col-12"}>
           
            <div className='artistContainer' >
              <Container fluid className='section-artist'>
                <div className='row artist' >
                  {categoryList?.length > 0 && categoryList.map((category, index) => {
                    const encryptedItemId = CryptoJS.AES.encrypt(category._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                    let Cname = index % 3;
                    return (
                      <>
                        {
                          (() => {
                            switch (Cname) {
                              case 0:
                                return <div key={index} className='col-lg-4 artist-category'>
                                  <LazyLoad offset={100}>
                                    <Link className='' to={`/artist/${encodeURIComponent(encryptedItemId)}`}>
                                      <div className="image-container">
                                        <img src={category?.Image} className="collectionOne" />
                                        <div className="image-overlay">
                                          <p className="image-text">{category?.Title}</p>
                                        </div>
                                      </div>
                                    </Link>
                                  </LazyLoad>
                                </div>
                              case 1:
                                return <div key={index} className='col-lg-4'>
                                  <LazyLoad offset={50} >
                                    <Link to={`/artist/${encodeURIComponent(encryptedItemId)}`}>
                                      <div className="collectionTwo image-container">
                                        <img src={category?.Image} className="collectionOne" />
                                        <div className="image-overlay">
                                          <p className="image-text">{category?.Title}</p>
                                        </div>
                                      </div>
                                    </Link>
                                  </LazyLoad>
                                </div>
                              case 2:
                                return <div key={index} className='col-lg-4'>
                                  <LazyLoad offset={0} >
                                    <Link to={`/artist/${encodeURIComponent(encryptedItemId)}`} >
                                      <div className="image-container">
                                        <img src={category?.Image} className="collectionOne" />
                                        <div className="image-overlay">
                                          <p className="image-text">{category?.Title}</p>
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
      <Container fluid className='section-five artistImage'>
        <p>Similar Artist</p>
      </Container>

      {apiLoading ? <LoadingScreen /> : null}
    </div>
  )
}

export default Index