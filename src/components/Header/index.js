import React, { useDebugValue, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import card from '../../assets/top-nav-gift-card.png';
import cart from '../../assets/top-nav-cart.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import cart1 from "../../assets/top-nav-cart-active.png";
import { socket } from '../../socket';
import {
  useGetCategoryQuery,
  useGetArtProductCategoriesQuery
} from "../../service/Apilist";
import Loader from "react-js-loader";
import CryptoJS from 'crypto-js';

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },

    items: 6
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};



function Navbar({
  connectWallet,
  isWalletConnected,
  loginState,
  LoginFunction,
  cartCount,
  Logo,
  notifyCount
}) {
  let navigate = useNavigate()
  const [spin_loader, setSpin_loader] = useState(false)
  const location = useLocation();
  const [apiLoading, setAPILoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [sliderNav, setSliderNav] = useState();
  const [isartHovering, setIsartHovering] = useState(false);
  const [itemDetailState, setitemDetails] = useState([]);
  const [searchResultState, setsearchResultState] = useState([]);
  const [categroyState, setCategroyState] = useState([]);
  const getCategory = useGetCategoryQuery();
  const getArtProductCategory = useGetArtProductCategoriesQuery();
  const [resultShow, setrestulShow] = useState(false);
  const [resultArtProductShow, setArtProductShow] = useState(false);
  const handleClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (sessionStorage.getItem('login')) {
      LoginFunction(true)
    }
  }, [])
  const search = (e) => {
    setrestulShow(true)
    setSpin_loader(true)
    socket.emit('SearchFilter', { "Search": e.target.value });
  }
  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('searchData', (data) => {
      setSpin_loader(false)
      setsearchResultState(data)
    });
  }, [])

  const [itemList, itemListResponse] = useState([]);

  const [artProductList, artProductResponse] = useState([]);

  useEffect(() => {
    if (getCategory?.status === "fulfilled") {
      setCategroyState(getCategory?.data?.data);
    }
  }, [getCategory])
  useEffect(() => {
    if (getArtProductCategory?.status === "fulfilled") {
      setArtProductShow(getArtProductCategory?.data?.data);
    }
  }, [getArtProductCategory])

  const CustomRightArrow = ({ onClick }) => {
    return (
      <button className='slider-button' onClick={onClick}>Arrow</button>
    );
  };
  const ArtSlider = () => {
    return (
      <div className='sliderNav'
        onMouseLeave={() => setSliderNav(0)}
      >
        <div className='sliderBorder'>
          <div className='container p-5'>
            <div className='row no-padding' >
              <div className='col-lg-3'>
                <p className='SliderHead'>ART</p>
              </div>
              <div className=' header-slider col-lg-9 no-padding'>
                <Carousel
                  infinite={true}
                  autoPlaySpeed={500}
                  responsive={responsive}
                  customLeftArrow={<CustomRightArrow />}
                  className="Header-slider"
                >
                  {categroyState.length > 0 && categroyState.map((item, index) => {
                    const encryptedItemId = CryptoJS.AES.encrypt(item?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                    return (
                      <>
                        <div className='header-slider-div'><a href={`/art/category/${encodeURIComponent(encryptedItemId)}`}> <img src={item?.Image} width="100px" height="100px" ></img>
                          <p className='sliderName'>{item?.Title}</p>
                        </a>
                        </div>
                      </>
                    )
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const CollectionSlider = () => {
    return (
      <div className='sliderNav'
        onMouseLeave={() => setSliderNav(2)}
      >
        <div className='sliderBorder'>
          <div className='container p-5'>
            <div className='row ' >
              <div className='col-lg-4'>
                <p className='SliderHead art-products'>ART PRODUCTS</p>
              </div>
              <div className='col-lg-8'>
                <Carousel
                  infinite={true}
                  autoPlaySpeed={500}
                  responsive={responsive}
                  customLeftArrow={<CustomRightArrow />}
                >
                  {itemList.length > 0 && itemList.map((item, index) => {
                    const encryptedItemId = CryptoJS.AES.encrypt(item?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                    return (
                      <div><a href={`/art/${encodeURIComponent(encryptedItemId)}`}> <img src={item?.Thumb} width="100px" height="100px" ></img>
                        <p className='sliderName'>{item?.Name}</p>
                      </a>
                      </div>
                    )
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const ArtistProductSlider = () => {
    return (
      <div className='sliderNav'
        onMouseLeave={() => setSliderNav(0)}
      >
        <div className='sliderBorder'>
          <div className='container p-5'>
            <div className='row ' >
              <div className='col-lg-3'>
                <p className='SliderHead artist-header'>ART PRODUCTS</p>
              </div>
              <div className=' header-slider col-lg-9 no-padding'>
                <Carousel
                  infinite={true}
                  autoPlaySpeed={500}
                  responsive={responsive}
                  customLeftArrow={<CustomRightArrow />}
                >
                  {resultArtProductShow.length > 0 && resultArtProductShow.map((item, index) => {
                    const encryptedItemId = CryptoJS.AES.encrypt(JSON.stringify(item?._id), process.env.REACT_APP_SECRET_PASS).toString();
                    return (
                      <>
                        <div className='header-slider-div'>
                          <a href={`/art/art-category/${encodeURIComponent(encryptedItemId)}`}> <img src={item?.Image} width="100px" height="100px" ></img>
                            <p className='sliderName'>{item?.Title}</p>
                          </a>
                        </div>
                      </>
                    )
                  })}
                </Carousel>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const input = document.getElementById('myInput');
  useEffect(() => {

    input?.addEventListener('focus', () => {
      document.addEventListener('click', handleClickOutside);
    });
    input?.addEventListener('blur', () => {
      document.removeEventListener('click', handleClickOutside);
    });
  }, [])


  function handleClickOutside(event) {
    if (!input.contains(event.target)) {
    }
  }
  const searchClick = (e) => {
    if (e.target.value) {

    }
  }
  const notifyNavigate = () => {
    navigate('/notification');
  }

  const redirectToLogin = () => {
    window.location.replace('/login');
  };
  return (
    <>
      <Container fluid className='top-nav'>
        <div className='row'>
          <div className='col-lg-5'>
            <div className='d-flex justify-content-end'>
              <div className='search-div'>
                <input id="myInput" onClick={searchClick} onChange={search} className='search' placeholder='Search' />
                <ul id="myBlock" style={{ display: resultShow ? 'block' : 'none' }}>
                  <button type="button" className="close-btn btn" onClick={() => setrestulShow(false)} aria-label="Close">X</button>
                  {spin_loader ? <Loader type="spinner-cub" bgColor={"black"} color={'#FFFFFF'} size={50} /> : null}
                  {searchResultState?.ArtworkData?.length > 0 ?
                    <>
                      <li><h5>Items</h5></li>
                      {searchResultState?.ArtworkData?.map((elem, index) => {
                        const encryptedItemInfo = CryptoJS.AES.encrypt(elem._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();

                        return (
                          <li >
                            <a className='d-flex' style={{ cursor: "pointer" }} href={`${window.location.origin}/art/${encodeURIComponent(encryptedItemInfo)}`}>
                              <div><img src={elem.Thumb}></img></div>
                              <div>{elem.Title}<br /><span>&nbsp;{elem.Currency}</span></div>
                            </a>
                          </li>
                        );
                      })}
                    </>
                    : null}
                  {searchResultState?.UserData?.length > 0 ?
                    <>
                      <li><h5>Accounts</h5></li>
                      {searchResultState?.UserData?.map((elem, index) => {
                        const encryptedItemArtist = CryptoJS.AES.encrypt(elem._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                        return (
                          <li >
                            <a className='d-flex' style={{ cursor: "pointer" }} href={`${window.location.origin}/single-artist/${encodeURIComponent(encryptedItemArtist)}`}>
                              <div><img src={elem?.ProfilePicture && elem.ProfilePicture !== "" ? elem.ProfilePicture : "/img/bg-img/u1.jpg"}></img></div>
                              <div>{elem?.UserName}<br /></div>
                            </a>
                          </li>
                        );
                      })}
                    </>
                    : null}
                  {searchResultState?.CollectionData?.length > 0 ?
                    <>
                      <li><h5>Collection</h5></li>
                      {searchResultState?.CollectionData?.map((elem, index) => {
                        return (
                          <li onClick={(e) => {  }}>
                            <Link onClick={(e) => {  }} className='d-flex' to={`${window.location.origin}/collection/${elem._id}`}>
                              <div><img src={elem?.Thumb && elem.Thumb !== "" ? elem.Thumb : null}></img></div>
                              <div>{elem?.Name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>{elem?.ItemCount + " Items"}</span></div>
                            </Link>
                          </li>
                        );
                      })}
                    </>
                    : null}
                  {!spin_loader && searchResultState?.ArtworkData?.length === 0 && searchResultState?.UserData?.length === 0 && searchResultState?.CollectionData?.length === 0 ? (
                    <>
                      <li><h5 className="text-center">No Result</h5></li>
                    </>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
          <div className='col-lg-1'>
          </div>
          <div className='col-lg-6'>
            <div className='d-flex justify-content-end'>
              <ul className='nav-items'>
                {
                  !loginState ? (
                    <>
                      <li><Link to="/register" className={location.pathname === "/register" ? 'active' : ''} >Register</Link></li>
                      <li> <span onClick={redirectToLogin}>
                        <Link className={location.pathname === "/login" ? 'active' : ''}>Login</Link>
                      </span>
                      </li>
                    </>
                  ) : <>
                    {(sessionStorage.getItem("role") === "Artist" || sessionStorage.getItem("role") === "Collector") || sessionStorage.getItem("role") === "Corporate Collector" && sessionStorage.getItem("isWalletConnected") === "true" ? <li><Link to="/my-collection" className={location.pathname === "/my-collection" ? 'active' : ''} >My collection</Link></li> : null}
                    {sessionStorage.getItem("isWalletConnected") === "true" ? (
                      <>
                        <li>
                          <Link to="/myprofile" className={location.pathname === "/myprofile" ? 'active' : ''} >{sessionStorage?.getItem("UserName")}</Link>

                        </li>
                        <p onClick={notifyNavigate} className='notify-count'>{notifyCount}</p>
                      </>
                    ) : null}
                    <li><Link onClick={() => LoginFunction(false)}  >Logout</Link></li>
                  </>
                }
                <li><Link className={location.pathname === "/features" ? 'active' : ''} to='/features'>Blog</Link></li>
                {loginState ? <li><Link to='/giftart' ><img className='card-icon' src={card} /></Link></li> : null}
                <li><Link to="/paymentArt" >{location.pathname === "/paymentArt" ?
                  <>
                    <img className='cart-icon' src={cart1} />
                  </>
                  :
                  <>
                    <img className='cart-icon' src={cart} />
                  </>
                }
                  <p className='cart-count'>{cartCount}</p>
                </Link></li>
                <li><a>
                </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container >
      <nav>
        <div className="navbar-logo">
          <Link to="/"><img className="logo" src={Logo} /></Link>
        </div>
        <ul className={`navbar-menu`}>
          <li ><Link
            onMouseEnter={() => setSliderNav(1)}
            className={location.pathname === "/art" ? 'active Hart' : ' Hart'} to="/art">Art</Link></li>
          <li><Link
            onMouseEnter={() => setSliderNav(0)}
            className={location.pathname === "/collections" ? 'active Hcollection' : 'Hcollection'} to="/collections">CORPORATE COLLECTIONS</Link></li>
          <li><Link
            onMouseEnter={() => setSliderNav(0)}
            className={location.pathname === "/artist" ? 'active Hartist' : 'Hartist'} to="/artist">Artists</Link></li>
          <li
            onMouseEnter={() => setSliderNav(2)}
          ><Link
            className={location.pathname === "/artProducts" ? 'active HartistProducts' : ' HartistProducts'} to="/artProducts">Art Products</Link ></li>
          <li><Link
            onMouseEnter={() => setSliderNav(0)}
            className={location.pathname === "/private-collector" ? 'active Hprivate-collector' : ' Hprivate-collector'} to="/private-collector">Private Collectors</Link></li>
          <li><Link
            onMouseEnter={() => setSliderNav(0)}
            className={location.pathname === "/auction" ? 'active Hauction' : ' Hauction'} to="/auction">Auctions</Link></li>
        </ul>
        <ul className={`navbar-menu-small ${showMenu ? "active" : ""}  `}>
          <li><a className='active' href="/art">Art</a></li>
          <li><a href="/collections">CORPORATE COLLECTIONS</a></li>
          <li><a href="/artist">Artists</a></li>
          <li><a href="/artProducts">Art Products</a></li>
          <li><a href="/private-collector">Private Collectors</a></li>
          <li><a href="/auction">Auctions</a></li>
        </ul>
        <div className="navbar-hamburger" onClick={handleClick}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
      {sliderNav === 1 ? <ArtSlider></ArtSlider> : null}
      {sliderNav === 3 ? <CollectionSlider></CollectionSlider> : null}
      {sliderNav === 2 ? <ArtistProductSlider></ArtistProductSlider> : null}
      <div className='nav-hover-div'>
      </div>
    </>
  );
}

export default Navbar;