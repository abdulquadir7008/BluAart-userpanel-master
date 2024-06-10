import React, { useEffect, useState } from 'react'
import Banner from "./Banner"
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import "../../styles/Artist.css"
import { useGetArtistListMutation, useArtistLabelBasedUsersMutation } from "../../service/Apilist"
import { socket } from "../../socket";
import CryptoJS from 'crypto-js';

function Category() {
  let params = useParams();
  const [artistlistAPI, resartistlistAPI] = useArtistLabelBasedUsersMutation();
  const [authorList, setauthorList] = useState([]);
  const [labelName, setLabelName] = useState("");

  const decryptedItemIdBytes = CryptoJS.AES.decrypt(params.category, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);

  useEffect(() => {
    artistlistAPI({
      Label: encodeURIComponent(decryptedItemIdBytes)
    })
  }, [])

  useEffect(() => {
    if (resartistlistAPI?.status === "fulfilled") {
      setauthorList(resartistlistAPI?.data?.info);
      setLabelName(resartistlistAPI?.data?.lableName)
    }
  }, [resartistlistAPI.status])

  const filterArtist = (filter) => {
    socket.emit("ArtistFilterbyStyle", { Style: filter });
  }
  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('artistData', (data) => {
      setauthorList(data?.data);
    });
  }, []);

  return (
    <div>
      <Banner />
      <Container fluid>
        <div className='row'>
          <Container fluid className='sectionOne'>
            {labelName !== "" ? <button className='artistBtn'>{labelName}</button> : null} 
          </Container>

          <div className="col-12">

       
            <div className='artistContainer' >
              <Container fluid className='section-artist'>
                <div className='row artist' >
                  {authorList?.length > 0 && authorList.map((author, index) => {
                    let Cname = index % 3;
                    const encryptedItemId = CryptoJS.AES.encrypt(author._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                    return (
                      <>
                        {
                          (() => {
                            switch (Cname) {
                              case 0:
                                return <div key={index} className='col-lg-4 artist-category'>
                                  <Link className='' to={`/single-artist/${encodeURIComponent(encryptedItemId)}`}>
                                    <div className=" image-container">
                                      <img src={author?.ProfilePicture} className="collectionOne"></img>
                                      <div className="image-overlay">
                                        <p className="image-text">{author?.ProfileName}</p>
                                      </div>
                                    </div>
                                  </Link>

                                </div>
                              case 1:
                                return <div key={index} className='col-lg-4'>
                                  <Link to={`/single-artist/${encodeURIComponent(encryptedItemId)}`}>
                                    <div className="image-container image-container-artistTwo">
                                      <img width="100%" height="540px" src={author?.ProfilePicture} className=""></img>
                                      <div className="image-overlay">
                                        <p className="image-text">{author?.ProfileName}</p>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              case 2:
                                return <div key={index} className='col-lg-4'>
                                  <Link to={`/single-artist/${encodeURIComponent(encryptedItemId)}`} >
                                    <div className=" image-container">
                                      <img src={author?.ProfilePicture} className="collectionThree"></img>
                                      <div className="image-overlay">
                                        <p className="image-text">{author?.ProfileName}</p>
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
      </Container>
      <Container fluid className='section-five artistImage'>
        <p>Similar Artist</p>
      </Container>
    </div>
  )
}

export default Category;