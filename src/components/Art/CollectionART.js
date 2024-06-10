import React, { useEffect, useState } from 'react'
import Banner from '../Artist/Banner'
import { Container } from 'react-bootstrap'
import "../../styles/Art.css"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import {
  useGetCollectionBasedItemMutation, useGetCollectionInfoMutation,
  useGetCollectionBasedMintedItemMutation
} from "../../service/Apilist"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import LazyLoad from 'react-lazyload';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { socket } from "../../socket";
import { object } from 'yup'
import CryptoJS from 'crypto-js';

const Web3 = require('web3');
function CollectionART(props) {
  let navigate = useNavigate();
  const parms = useParams();
  const decryptedItemId = CryptoJS.AES.decrypt(parms?.id, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);

  const [collectionInfoAPI, resCollectionInfoAPI] = useGetCollectionInfoMutation();
  const navCreatecolleciton = () => {
    navigate(`/editcollection/${encodeURIComponent(decryptedItemId)}`)
  }
  const [apiLoading, setAPILoading] = useState(false);
  const [collectionItemList, collectionItemListResponse] = useState([]);
  const [collectionMintedItemList, collectionMintedItemListResponse] = useState([]);
  const [collectionUnMintedItemList, collectionUnMintedItemListResponse] = useState([]);
  const [collectionInfo, collectionInfoResponse] = useState([]);
  const [collectionItemsAPI, collectionItemsAPIRes] = useGetCollectionBasedItemMutation();
  const [collectionMintItemsAPI, rescollectionMintItemsAPIRes] = useGetCollectionBasedMintedItemMutation();
  useEffect(() => {
      collectionItemsAPI({
        CollectionId: encodeURIComponent(decryptedItemId)
      })
  }, [])
  useEffect(() => {
    if (collectionItemsAPIRes?.status === "fulfilled") {
      collectionItemListResponse(collectionItemsAPIRes?.data?.data)
     
    }
  }, [collectionItemsAPIRes])
  useEffect(() => {
    collectionInfoAPI({
      CollectionId: encodeURIComponent(decryptedItemId)
    })
  }, [])
  useEffect(() => {
    if (resCollectionInfoAPI?.status === "fulfilled") {
    
      collectionInfoResponse(resCollectionInfoAPI?.data?.data);
    }
  }, [resCollectionInfoAPI?.status])
  useEffect(() => {
    if (rescollectionMintItemsAPIRes?.status === "fulfilled") {
      collectionMintedItemListResponse(rescollectionMintItemsAPIRes?.data?.mintdata);
      collectionUnMintedItemListResponse(rescollectionMintItemsAPIRes?.data?.unmintdata);
    }
  }, [rescollectionMintItemsAPIRes?.status])
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isPhysical, setIsPhysical] = useState(false);



  const handlePhysicalCheckboxChange = () => {
    setError("")

    setIsPhysical(false)
    setIsDigital(true);
  };
  const [createError, setError] = useState("")

  const [isDigital, setIsDigital] = useState(false);
  const [isArt, setIsArt] = useState(true);
  const [isArtProduct, setIsArtProduct] = useState(false);
  const handleDigitalCheckboxChange = () => {
    setError("")
    setIsPhysical(true);
    setIsDigital(false)
  };
  const handleArttypeChange = () => {
    setIsArt(true)
    setIsArtProduct(false)
  };
  const handleArtProductTypeChange = () => {
    setIsArt(false);
    setIsArtProduct(true)
  };
  const navCreateItem = (type) => {

    if (type === "bulkartproduct") {
      navigate(`/create-item/${encodeURIComponent(decryptedItemId)}/bulk-art-product`)
    } else {
      navigate(`/create-item/${encodeURIComponent(decryptedItemId)}/${atob(type)}`)
    }
  }
  const navArtProdcutcreateItem = () => {

    navigate(`/create-item/${encodeURIComponent(decryptedItemId)}/art-product`)
    
  }
  const [mintLoadint, setmintLoadint] = useState(false);
  const mint = async (contractAddress, quantity, collectionitem, collectionId) => {
    setmintLoadint(true);
    let web3 = new Web3(window.ethereum);
    const contractInstance = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_CONTRACT_ABI), contractAddress);

    let TokenId = await contractInstance.methods.lastTokenId().call();
   
    let tokenIds = [];
    let itemIds = [];
    for (let index = 0; index < quantity; index++) {
      TokenId++;
      tokenIds.push(TokenId);
    }
    for (let index = 0; index < collectionitem.length; index++) {
      itemIds.push(collectionitem[index]?._id)
    }
    socket.emit("ArtBulkItemMint", {
      itemIds,
      tokenIds,
      collectionid: collectionId
    })
    setmintLoadint(false);
  }
  const showToast = (text) => {
    toast.success(text)
  }
  const showErroToast = (text) => {
    toast.error(text);
  }
  async function switchNetwork(networkId,networkObj) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networkId }],
      });
      return true;
    } catch (error) {
      setAPILoading(false)
      if (error?.code === 4001) {
        toast.warning(error?.message)
      }
      if (error?.code === 4902) {
        window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
                chainId: networkId,
                chainName: networkObj?.Name,
                nativeCurrency: {
                    name: networkObj?.Name,
                    symbol: networkObj?.Currency,
                    decimals: 18
                },
                rpcUrls: [networkObj?.RpcUrl],
                blockExplorerUrls: [networkObj?.BlockExplorer]
            }]
        }).then((res) => {
           showToast("Add network successfully please proceed again")
        })
            .catch((error) => {
              
            })
    }
   
    }
  }
  const socketMint = async (data) => {
    setmintLoadint(true)
    let web3 = new Web3(window.ethereum);
    const contractInstance = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_CONTRACT_ABI), data.contractAddress);
    let account = await web3.eth.getAccounts();
    let FTokenId = await contractInstance.methods.lastTokenId().call();
    let amountsId = [];
    let type = [];
   
    data?.editions && Object.values(data?.editions).map((item, index) => {
      
      amountsId.push(item.edition);
      let editiontype = [];
     
      if (item?.editiondetails?.length > 0) {
        for (let index = 0; index < item?.editiondetails.length; index++) {
          if (item.editiondetails[index].PhysicalArt) {
            editiontype.push("Physical");
          } else {
            editiontype.push("Digital");
          }
        }
        type.push(editiontype);
      }
    })
    
    
    try {
      let mint = await contractInstance.methods.mintBatch(amountsId, data?.ipfsHash, type, "0x00").send({
        from: account[0]
      });

      if (mint) {
        let TTokenId = await contractInstance.methods.lastTokenId().call();
        
        let tokenLength = parseInt(TTokenId) - parseInt(FTokenId);

        let tokenIds = []
        for (let index = 0; index < tokenLength; index++) {
          tokenIds.push(parseInt(FTokenId) + 1);
        }
        
        let bulkMintSocketParms = {
          itemIds: Object.keys(data?.editions),
          tokenIds: tokenIds,
          transactionHashes: mint?.transactionHash,
          collectionId: atob(parms.id)
        }
        socket.emit("ArtItemBulkPublish", bulkMintSocketParms)
        setmintLoadint(false);
      }
    } catch (error) {
      setmintLoadint(false);
      showErroToast(error?.message)
    }

  }
  const bulkMint = (chain, contractAddress, collectionId) => {
    if (!props.isWalletConnected) {
      showErroToast("Please connect wallet");
      return true;
    }
    setmintLoadint(true)
    axios.post(`${process.env.REACT_APP_API_URL}/GetNetworkInfo`, {
      "Currency": chain
    }).then(async res => {
      let web3 = new Web3(window.ethereum);
      let chainId = await web3.eth.getChainId();
      if (chainId === res.data?.info?.ChainID) {

        mint(contractAddress,
          collectionUnMintedItemList?.length,
          collectionUnMintedItemList,
          collectionId
        )
      } else {

        switchNetwork(web3.utils.numberToHex(res.data?.info?.ChainID),res.data?.info).then((switchRes) => {
          if (switchRes) {
            mint(contractAddress,
              collectionUnMintedItemList?.length,
              collectionUnMintedItemList,
              collectionId
            )
          }
        }).catch((error) => {
          setmintLoadint(false)
          showErroToast(error?.message)
        })
      }
    })
  }
  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('ArtBulkItemMint', async (data) => {
      if (data?.status) {
        socketMint(data);
      } else {
        setmintLoadint(false)
        showErroToast(data?.message)
      }
    });
    socket.on("ArtItemBulkPublish", async (data) => {
      if (data?.status) {
        showToast(data?.message);
        setmintLoadint(false);
        collectionMintItemsAPI({
          CollectionId: encodeURIComponent(decryptedItemId)
        })
      }
    })
  }, [])
  return (
    <div>
      <Banner></Banner>

      {collectionInfo[0]?.CollectionInfo?.AuthorId === sessionStorage.getItem("UserId") ? <div className='d-flex justify-content-end'>
        <button className='btn btn-success' onClick={navCreatecolleciton}  >Edit Collection</button>
        &nbsp;<button className='btn btn-success' onClick={handleShow}  >Create art item</button>
      </div> : null}
      <div className='artistContainer mt-0' >
        <Container className='section-item'>
          <div className='auction-tab-section'>
            <div className='row artist' >
              { collectionItemList?.length > 0 && collectionItemList.map((item, index) => {
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
                                  <div className="image-container ">
                                    <img src={item?.Thumb} className="artistThree"></img>
                                    <div className="image-overlay"><p className="image-text">{item?.Title}</p></div>
                                  </div>
                                </Link>
                              </LazyLoad>
                            </div>
                          case 1:
                            return <div key={index} className='col-lg-4'>
                              <LazyLoad
                                offset={100}
                                once
                              >
                                <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                  <div className="image-container image-container-artistTwo">
                                    <img src={item?.Thumb} className="artistTwo"></img>
                                    <div className="image-overlay"><p className="image-text">{item?.Title}</p></div>
                                  </div>
                                </Link>
                              </LazyLoad>
                            </div>
                          case 2:
                            return <div key={index} className='col-lg-4'>
                              <LazyLoad
                                offset={100}
                                once
                              >
                                <Link to={`/art/${encodeURIComponent(encryptedItemId)}`} >
                                  <div className="image-container">
                                    <img src={item?.Thumb} className="artistOne"></img>
                                    <div className="image-overlay"><p className="image-text">{item?.Title}</p></div>
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

              {collectionInfo[0]?.CollectionInfo?.AuthorId === sessionStorage.getItem("UserId") ? (
                <>
                  <TabList>
                    <Tab eventKey="tab1">Minted Item</Tab>
                    <Tab eventKey="tab2">Unminted Item</Tab>
                  </TabList>
                </>
              ) : null}

                <br />
                <div className='row'>
                  {collectionMintedItemList?.length > 0 && collectionMintedItemList.map((item, index) => {
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
                                      <div className="image-container ">
                                        <img src={item?.Thumb} className="artistThree"></img>
                                        <div className="image-overlay"><p className="image-text">{item?.Title}</p></div>
                                      </div>
                                    </Link>
                                  </LazyLoad>
                                </div>
                              case 1:
                                return <div key={index} className='col-lg-4'>
                                  <LazyLoad
                                    offset={100}
                                    once
                                  >
                                    <Link to={`/art/${encodeURIComponent(encryptedItemId)}`}>
                                      <div className="image-container image-container-artistTwo">
                                        <img src={item?.Thumb} className="artistTwo"></img>
                                        <div className="image-overlay"><p className="image-text">{item?.Title}</p></div>
                                      </div>
                                    </Link>
                                  </LazyLoad>
                                </div>
                              case 2:
                                return <div key={index} className='col-lg-4'>
                                  <LazyLoad
                                    offset={100}
                                    once
                                  >
                                    <Link to={`/art/${encodeURIComponent(encryptedItemId)}`} >
                                      <div className="image-container">
                                        <img src={item?.Thumb} className="artistOne"></img>
                                        <div className="image-overlay"><p className="image-text">{item?.Title}</p></div>
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

              
            {/* </Tabs> */}
          </div>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create art work</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <center>
                <div className='art-type'>
                  <div className='d-flex'>
                    <div className="form-check">
                      <input className="form-check-input" checked={isArt} type="checkbox" onChange={handleArttypeChange} id="flexCheckDefault" />
                      <label className="form-check-label" for="flexCheckDefault">
                        Art
                      </label>
                    </div>
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    &nbsp;
                    <div className="form-check">
                      <input className="form-check-input" checked={isArtProduct} type="checkbox" onChange={handleArtProductTypeChange} id="flexCheckDefault" />
                      <label className="form-check-label" for="flexCheckDefault">
                        Art product
                      </label>
                    </div>
                  </div>
                  <br />
                </div>
                <div className='errors text-center'>{createError !== "" ? createError : null}</div>
                <br />
                {isArt ? (<>
                  <Button variant="primary" onClick={() => navCreateItem("single")}>
                    Add Artwork
                  </Button>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <Button variant="primary" onClick={() => navCreateItem("bulk")}>
                    BulkArtwork
                  </Button>
                </>) : (<>
                  <Button variant="primary" onClick={() => navArtProdcutcreateItem()}>
                    Add Art Product
                  </Button>
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  &nbsp;
                  <Button variant="primary" onClick={() => navCreateItem("bulkartproduct")}>
                    Bulk Artwork
                  </Button>
                </>)}
              </center>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  )
}

export default CollectionART