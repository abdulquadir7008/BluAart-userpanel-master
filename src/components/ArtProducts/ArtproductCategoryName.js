import React, { useEffect, useLayoutEffect, useState } from 'react'
import Banner from "./CategoryBanner"
import { Container } from 'react-bootstrap';
import "../../styles/ArtistProduct.css";
import { Link, useParams } from 'react-router-dom';
import Filter from '../Filter/Filter';
import {
  useGetAllPhysicalArtMutation,
  useGetLightingNameMutation,
  useGetFurnishingNameMutation,
  useGetFurnitureNameMutation,
  useGetInnerBannerDetailsQuery

} from "../../service/Apilist"
import { socket } from "../../socket";
import CryptoJS from 'crypto-js';
function ArtproductCategory(props) {
  let parms = useParams()
  const [getAllPhysicalItem, resgetAllPhysicalItem] = useGetAllPhysicalArtMutation();
  const [getLigntingName, resgetLigntingName] = useGetLightingNameMutation();
  const [getFurnishingName, resFurnishingName] = useGetFurnishingNameMutation();
  const [getFurnitureName, resFurnitureName] = useGetFurnitureNameMutation();
  const getInnerBanner = useGetInnerBannerDetailsQuery();
  const [physicatArtNameState, setPhysicalArtNameState] = useState();
  const [physicatArtState, setPhysicalArtState] = useState();
  const [minpriceState, setminpriceState] = useState([]);
  const [StylesState, setStyles] = useState([]);
  const [MaterialState, setMaterial] = useState([]);
  const [BrandState, setBrandState] = useState([]);
  const [ShapeState, setShapeState] = useState([]);
  const [SizeState, setSizeState] = useState([]);
  const [FabricState, setFabricState] = useState([]);
  const [TechniqueState, setTechniqueState] = useState([]);
  const [maxpriceState, setmaxpriceState] = useState([]);
  const [itemAllList, itemAllListResponse] = useState([]);
  const [categoryState, setCategoryState] = useState("");
  const [priceState, setPriceState] = useState([
    {  }
  ])

  const decodedCategory = decodeURIComponent(parms?.category);

const decryptedCategory = CryptoJS.AES.decrypt(decodedCategory, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);
const decryptedItemName = CryptoJS.AES.decrypt(parms.name, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);


  useEffect(() => {
    let categoryName = encodeURIComponent(decryptedCategory);
    let nameParms = encodeURIComponent(decryptedItemName);
    if (categoryName == "6") {
      getAllPhysicalItem({
        Category: categoryName,
        Name: nameParms
      })
    } else if (categoryName == "1") {
      getAllPhysicalItem({
        Category: categoryName,
        Name: nameParms
      })
    } else if (categoryName == "2") {
      getAllPhysicalItem({
        Category: categoryName,
        Name: nameParms
      })
    } else if(categoryName == "3") {
      getAllPhysicalItem({
        Category: categoryName,

      })
    }
  }, [])
  useEffect(() => {
    if (resgetAllPhysicalItem?.status === "fulfilled") {
      setCategoryState(resgetAllPhysicalItem?.data?.category)
      setPhysicalArtState(resgetAllPhysicalItem?.data?.data);
      itemAllListResponse(resgetAllPhysicalItem?.data?.data);
    }
  }, [resgetAllPhysicalItem])

  useEffect(() => {
    if (resgetLigntingName?.status === "fulfilled") {
      setPhysicalArtNameState(resgetLigntingName?.data?.data);
      itemAllListResponse(resgetLigntingName?.data?.data);
    }
  }, [resgetLigntingName?.status])
  useEffect(() => {
    if (resFurnishingName?.status === "fulfilled") {
      setPhysicalArtNameState(resFurnishingName?.data?.data);
      itemAllListResponse(resFurnishingName?.data?.data);
    }
  }, [resFurnishingName?.status])
  useEffect(() => {
    if (resFurnitureName?.status === "fulfilled") {
      setPhysicalArtNameState(resFurnitureName?.data?.data);
      itemAllListResponse(resFurnitureName?.data?.data);
    }
  }, [resFurnitureName?.status])

  const pushElementMaterial = (material) => {
    setMaterial([...MaterialState, material]);
  };

  const removeElementMaterial = (material) => {
    setMaterial(MaterialState.filter((element) => element !== material));
  };

  const pushElementSize = (size) => {
    setSizeState([...SizeState, size]);
  };

  const removeElementSize = (size) => {
    setSizeState(SizeState.filter((element) => element !== size));
  };

  const pushElementFabric = (size) => {
    setFabricState([...FabricState, size]);
  };

  const removeElementFabric = (size) => {
    setFabricState(FabricState.filter((element) => element !== size));
  };

  const pushElementShape = (material) => {
    setShapeState([...ShapeState, material]);
  };

  const removeElementShape = (material) => {
    setShapeState(ShapeState.filter((element) => element !== material));
  };

  const pushElementTechnique = (technique) => {
    setTechniqueState([...TechniqueState, technique]);
  };

  const removeElementTechnique = (technique) => {
    setTechniqueState(TechniqueState.filter((element) => element !== technique));
  };

  const pushElementBrand = (brand) => {
    setBrandState([...BrandState, brand]);
  };

  const removeElementBrand = (brand) => {
    setBrandState(BrandState.filter((element) => element !== brand));
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

  const pushElementStyles = (material) => {
    setStyles([...StylesState, material]);
  };

  const removeElementStyles = (material) => {
    setStyles(StylesState.filter((element) => element !== material));
  };

  const filterAPI = (data, status) => {
    if (data?.Material) {
      if (status) {
        pushElementMaterial(data?.Material);
      } else {
        removeElementMaterial(data?.Material);
      }
    }
    if (data?.Brand) {
      if (status) {
        pushElementBrand(data?.Brand);
      } else {
        removeElementBrand(data?.Brand);
      }
    }
    if (data?.Technique) {
      if (status) {
        pushElementTechnique(data?.Technique);
      } else {
        removeElementTechnique(data?.Technique);
      }
    }
    if (data?.Shape) {
      if (status) {
        pushElementShape(data?.Shape);
      } else {
        removeElementShape(data?.Shape);
      }
    }
    if (data?.Size) {
      if (status) {
        pushElementSize(data?.Size);
      } else {
        removeElementSize(data?.Size);
      }
    }
    if (data?.Fabric) {
      if (status) {
        pushElementFabric(data?.Fabric);
      } else {
        removeElementFabric(data?.Fabric);
      }
    }
    if (data?.Style) {
      if (status) {
        pushElementStyles(data?.Style);
      } else {
        removeElementStyles(data?.Style);
      }
    }
    if (data?.Price) {
      let minvalue = data.Price.min;
      let maxvalue = data.Price.max;
      if (status) {
        let priceStateObj = {
          min: minvalue,
          max: maxvalue
        }
        setPriceState([...priceState, priceStateObj])
      }else{
        setPriceState(priceState.filter(item => item.min !== minvalue && item.max !== maxvalue))
      }


    }
  }

  const [open, setOpen] = useState(false);
  const filterChange = () => {
    setOpen(!open);
  }

  useLayoutEffect(() => {
    emitSocket();
  }, [
    priceState,
    MaterialState,
    BrandState,
    StylesState,
    TechniqueState,
    ShapeState,
    SizeState,
    FabricState
  ])

  const emitSocket = () => {
    let socketData = {};
    if (MaterialState.length > 0) {
      socketData.Material = MaterialState
    }
    if (BrandState.length > 0) {
      socketData.Brand = BrandState
    }
    if (TechniqueState.length > 0) {
      socketData.Technique = TechniqueState
    }
    if (ShapeState.length > 0) {
      socketData.Shape = ShapeState
    }
    if (SizeState.length > 0) {
      socketData.Size = SizeState
    }
    if (StylesState.length > 0) {
      socketData.Style = StylesState
    }
    if (FabricState.length > 0) {
      socketData.Fabric = FabricState
    }
    let minPrice = priceState.length > 0 && priceState?.reduce((prev, curn) => prev.min < curn.min ? prev : curn);
    let maxPrice = priceState.length > 0 && priceState?.reduce((prev, curn) => prev.max > curn.max ? prev : curn);
    if (priceState.length > 0 && minPrice.min >= 0 && maxPrice.max >= 0) {
      socketData.Price = minPrice.min + '-' + maxPrice.max;
    }
    socketData.Category = decodeURIComponent(decryptedCategory);
    if (decodeURIComponent(decryptedItemName) != 3) {
      socketData.Name = decodeURIComponent(decryptedItemName);
    }
    if (Object.keys(socketData).length > 0) {
      socket.emit("getArtProductFilters", socketData);
    } else {
      setPhysicalArtState(itemAllList);
    }
  }
  const [bannerImageState, setBannerImageState] = useState("")
  useEffect(() => {
    if (getInnerBanner.status === "fulfilled") {
      let nameParms = decodeURIComponent(decryptedItemName);
      
      if (nameParms === "Rope Light") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.RopeLights)
      } else if (nameParms === "Bar Cabinets") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.BarCabinets)
      } else if (nameParms === "Side Boards") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.SideBoards)
      } else if (nameParms === "Partitions") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Partition)
      } else if (nameParms === "Frames") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Frames)
      } else if (nameParms === "Center  Table") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.CenterTable)
      } else if (nameParms === "Bookshelves") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.BookShelfs)
      } else if (nameParms === "Rugs") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Rugs)
      } else if (nameParms === "Sculpture") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Sculpture)
      } else if (nameParms === "Cushions") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.Cushions)
      } else if (nameParms == 3) {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.AccentWalls)
      } else if (nameParms === "Cove Lights") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.CoveLights)
      } else if (nameParms === "Pendant Lights") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.PendantLights)
      } else if (nameParms === "Floor Lamps") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.FloorLamps)
      } else if (nameParms === "Table Lamps") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.TableLamps)
      } else if (nameParms === "Wall Scones") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.WallScones)
      } else if (nameParms === "Table Lamps") {
        setBannerImageState(getInnerBanner?.data?.Info[0]?.TableLamps)
      }
    }
  }, [getInnerBanner,categoryState])
  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('artProductData', (data) => {
      setPhysicalArtState(data?.data)
    });
  }, [])
  return (
    <div>
      <div className='landing-banner-ps'>
        <Banner BannerImage={bannerImageState}></Banner>
      </div>
      <br />
      <Container fluid>
        <div className='row'>
          {categoryState !== "" ? <Container className='col-lg-12 sectionOne'>
            <button className='artistProductBtn'>{categoryState}</button>
          </Container> : null}
          <div className='col-lg-3 mainFilter' >
            <Filter filterChange={filterChange} filterAPI={filterAPI}></Filter>
          </div>
          <div className={open ? 'col-9' : 'col-12'}>
            <br />
            <div className='artistContainer'>
              <Container fluid>
                <div className='col-lg-12'>
                  <div className='container'>
                    <div className='row'>
                      <div className='artistContainer'>
                        <Container className='section-four'>
                          <div className='row artist' >
                            {physicatArtState?.length > 0 && physicatArtState.map((artwork, index) => {
                              let Cname = index % 3;
                              const encryptedItemInfo = CryptoJS.AES.encrypt(artwork._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                              return (
                                <>
                                  {
                                    (() => {
                                      switch (Cname) {
                                        case 0:
                                          return <div key={index} className='col-lg-4'>
                                            <Link to={`/art/${encodeURIComponent(encryptedItemInfo)}`}>
                                              <div className=" image-container">
                                                <img src={artwork?.Thumb} className="collectionOne" />
                                                <div className="image-overlay">
                                                  <p className="image-text">{artwork?.Name ? artwork?.Name : artwork?.Title}</p>
                                                </div>
                                              </div>
                                            </Link>
                                          </div>
                                        case 1:
                                          return <div key={index} className='col-lg-4'>
                                            <Link to={`/art/${encodeURIComponent(encryptedItemInfo)}`}>
                                              <div className=" collectionTwo image-container">
                                                <img src={artwork?.Thumb} className="collectionOne" />
                                                <div className="image-overlay">
                                                  <p className="image-text">{artwork?.Name ? artwork?.Name : artwork?.Title}</p>
                                                </div>
                                              </div>
                                            </Link>
                                          </div>
                                        case 2:
                                          return <div key={index} className='col-lg-4'>
                                            <Link to={`/art/${encodeURIComponent(encryptedItemInfo)}`} >
                                              <div className="image-container">
                                                <img src={artwork?.Thumb} className="collectionOne" />
                                                <div className="image-overlay">
                                                  <p className="image-text">{artwork?.Name ? artwork?.Name : artwork?.Title}</p>
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
    </div>
  )
}

export default ArtproductCategory;