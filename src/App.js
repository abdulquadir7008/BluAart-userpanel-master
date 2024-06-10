import React, { useEffect, useState } from "react"
import './App.css';
import { BrowserRouter as Router, Routes, Route, RedirectFunction } from 'react-router-dom';
import Header from './components/Header';
import Homepage from './components/Homepage'
import Register from './components/Register/Register';
import Artist from "./components/Artist/Index"
import ProfileUpdate from './components/Pages/Profile/ProfileUpdate';
import Footer from './components/Footer';
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "./connect/index";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./styles/homepage.css";
import ArtistProduct from "./components/ArtProducts/index";
import ArtproductCategory from "./components/ArtProducts/ArtproductCategory";
import ArtproductCategoryName from "./components/ArtProducts/ArtproductCategoryName";
import PrivateCollector from "./components/PrivateCollector/index"
import ArtistUser from "./components/Artist/Artistuser";
import LoginForm from "./components/Login/Login";
import Art from "./components/Art/Art";
import GiftArt from "./components/Art/GiftArt";
import CollectionART from "./components/Art/CollectionART";
import MyCollectionART from "./components/Art/MycollectionART";
import CollectionARTUserBased from "./components/Collections/CollectionBasedUser";
import ArtDetails from "./components/Art/ArtDetails";
import GiftArtDetails from "./components/Art/GiftArtDetails";
import Collections from "./components/Collections/Collection";
import PurchaseArt from "./components/Art/PurchaseArt";
import PurchaseDetails from "./components/Art/PurchaseDetails";
import CreateCollection from "./components/Collections/Createcollection";
import EditCollection from "./components/Collections/Editcollection";
import ForgotForm from "./components/ForgotPassword";
import Web3 from "web3";
import MyCollection from "./components/Collections/MyCollection";
import {
  useConnectWalletAPIMutation, useGetCartItemsMutation, useGetSiteSettingQuery,
  useGetBannerDetailsQuery
} from "./service/Apilist";
import { useNavigate } from 'react-router-dom';
import ResetForm from "./components/ResetPassword";
import ConnectWallet from "./components/ConnectWallet";
import CreateItem from "./components/Items/CreateItem";
import Myprofile from "./components/Profile/Myprofile";
import EditItem from "./components/Items/EditItemUpdate";
import Editartproduct from "./components/Items/EditartproductItem"
import Chat from "./components/chatbot";
import Category from "./components/Artist/categoryList";
import ArtistLabel from "./components/Artist/artistLabel";
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './service/counterSlice';
import Auction from "./components/Pages/Auctions";
import BulkItems from "./components/Items/bulkItems";
import BulkItemsArtProduct from "./components/Items/bulkItemsArtProduct";
import CreateArtproductItem from "./components/Items/CreateArtproductItem";
import ProfileEdit from "./components/Profile/ProfileUpdate";
import ArtCatetgory from "./components/Art/ArtCatetgory";
import Myaddress from "./components/Profile/Myaddress";
import News from "./components/Pages/News";
import Terms from "./components/Pages/Terms";
import Privacy from "./components/Pages/Privacy";
import AuctionDetails from "./components/Pages/Auctions/AuctionDetails";
import Support from "../src/components/Pages/Support";
import Notification from "../src/components/Pages/Notification";
import Features from "../src/components/Pages/Features";
import Aboutus from "../src/components/Pages/Aboutus";
import Events from "../src/components/Pages/Events";
import Logo from "../src/assets/logo.png";
import LoginScreen from "./components/Login/LoginScreen";
import Twofactor from "./components/Twofactor";
import { socket } from "./socket";
function App(props) {
  const counter = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const { account, active, chainId, activate, deactivate, library } = useWeb3React();
  const [getCartItemAPI, resgetCartItemAPI] = useGetCartItemsMutation();
  const getBannerAPI = useGetBannerDetailsQuery();
  const getSiteSetting = useGetSiteSettingQuery();
  const [newAccount, setNewAccount] = useState("")
  let [loading, setLoading] = useState(true);
  let [cartCount, setcartCount] = useState(0);
  let [notifyCount, setNotifyCount] = useState(0);
  let [siteSettingState, setsiteSettingState] = useState({});
  let [bannerState, setbannerState] = useState({
    Art: "",
    ArtCollection: "",
    ArtPageBanner: "",
    ArtProduct: "",
    Artist: "",
    CorporateCollection: "",
    PrivateCollector: ""
  });
  let [loginState, setLogin] = useState(false);
  let [isWalletConnected, setWalletConnected] = useState(false);
  const [connectwalletAPI, ConnectWalletReponse] = useConnectWalletAPIMutation();
  const showToast = (text) => {
    toast.success(text)
  }
  const showErroToast = (text) => {
    toast.error(text);
  }
  useEffect(() => {
    socket.on('connect', () => { });
    socket.on('walletconnect', (data) => {
      if (data?.status) {
        if (data?.Role === "Collector") {
          navigate('/art');
        } else if (data?.Role === "Artist") {
          navigate('/my-collection');
        } else {
          navigate('/');
        }
      }
    });
    socket.on('autoconnect', (data) => {
      if (data?.status) {

      }
    })
    socket.on('GetNotifyCount', (data) => {
     
        
        setNotifyCount(data?.Count);
    })
    socket.on('notifications', (data) => {
      showToast(data);
    })
  }, [])
  const [isApiProcessing, setApiProcessing] = useState(false);

  const handleConnectWallet = async () => {
    if (isApiProcessing) {
      return;
    }
  
    setApiProcessing(true);

    cartCOuntUpdate()
    if (typeof window.ethereum !== "undefined") {
      try {
        let accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        connectwalletAPI({
          tokenData: sessionStorage.getItem("isWalletConnected") !== null && sessionStorage.getItem("isWalletConnected") === "true" ? sessionStorage.getItem("wallettoken") : sessionStorage.getItem("loginToken"),
          data: { WalletAddress: accs[0] }
        }).then(res => {
          
          if (res.data?.status && res.data?.info === 'Wallet Connection Successful') {
            toast.success(res.data?.info)
            setNewAccount(accs[0]);
            setWalletConnected(true)
            sessionStorage.setItem("isWalletConnected", true);
            sessionStorage.setItem("wallettoken", res.data?.token);
            sessionStorage.setItem("role", res.data?.role);
            cartCOuntUpdate();
            socket.emit('walletconnect', {
              UserId: sessionStorage.getItem('UserId')
            })
            socket.emit('GetNotifyCount', {
              UserId: sessionStorage.getItem('UserId')
            })
          } else if (res?.data) {
            toast.error(res?.data?.info);
          } else {
            toast.error(res?.error?.data?.message);
          }
          setApiProcessing(false);

        })
      } catch (error) {
        toast.error(error.message);
        setWalletConnected(false);
        sessionStorage.setItem("isWalletConnected", false);
        setApiProcessing(false);
      }
    } else {
      toast.error("Please install MetaMask ");
    }
  }
  window?.ethereum?.on('accountsChanged', function (accounts) {
    if(loginState){
      autoConnect()
    }    
  })

  const LoginFunction = (status) => {
    if (status) {
      setLogin(status);

    } else {
      sessionStorage.clear();
      setLogin(status);
      window.location.replace("/");
    }
  }

  const handleDisconnectWallet = () => {
    if (active) {
      deactivate(injectedConnector);
      sessionStorage.setItem("isWalletConnected", false);
    }
  };

  useEffect(() => {
    autoConnect()
  }, [])
  const cartCOuntUpdate = () => {
    if (sessionStorage.getItem("isWalletConnected")) {
      getCartItemAPI()
    }

  }
  useEffect(() => {
    if (resgetCartItemAPI?.status === "fulfilled") {
      if (resgetCartItemAPI?.data?.status) {
        setcartCount(resgetCartItemAPI?.data?.data?.length);
      }
    }
  }, [resgetCartItemAPI?.status])
  const autoConnect = async () => {
    if (sessionStorage.getItem("isWalletConnected")) {
      let accs = await window.ethereum.request({ method: 'eth_requestAccounts' });
      connectwalletAPI({
        tokenData: sessionStorage.getItem("isWalletConnected") !== null && sessionStorage.getItem("isWalletConnected") === "true" ? sessionStorage.getItem("wallettoken") : sessionStorage.getItem("loginToken"),
        data: { WalletAddress: accs[0] }
      }).then(res => {
        if (res.data?.status) {
          setNewAccount(accs[0]);
          setWalletConnected(true);
          sessionStorage.setItem("isWalletConnected", true);
          socket.emit('autoconnect', {
            UserId: sessionStorage.getItem('UserId')
          })
          socket.emit('GetNotifyCount', {
            UserId: sessionStorage.getItem('UserId')
          })
        }
        else if (res.error?.data?.error === "Unauthorized") {
          showToast("Session expired");
          setTimeout(() => {
            LoginFunction(false);
          }, 1000);
        }
        else {
          sessionStorage.setItem("isWalletConnected", false);
          setWalletConnected(false);
          navigate("/connect-wallet");
        }
      })
    }
  }

  const [step, setStep] = useState(1);
  const nextStep = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setStep(step + 1);
  };

  const backStep = () => {
    setStep(step - 1);
  }

  const registerSteps = (steps) => {
    setStep(steps)
  }

  useEffect(() => {
    if (getSiteSetting?.status === "fulfilled") {
      if (getSiteSetting.data.status) {
       
        setsiteSettingState(getSiteSetting.data?.info[0])
       
        let link = document.querySelector("link[rel~='icon']");
        document.title = getSiteSetting.data?.info[0]?.ProjectDetails?.ProjectName;
        if (!link) {          
          link = document.createElement('link');
          link.rel = 'icon';
          link.href = getSiteSetting.data?.info[0]?.ProjectDetails?.Favicon;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        if (getSiteSetting.data?.info?.ProjectDetails?.Favicon) {
          link.href = getSiteSetting.data?.info[0]?.ProjectDetails?.Favicon;
        }

      }
    }
  }, [getSiteSetting])
  useEffect(() => {
    if (getBannerAPI.status === "fulfilled") {
      
      setbannerState({
        Art: getBannerAPI?.data?.Info[0]?.Art,
        ArtCollection: getBannerAPI?.data?.Info[0]?.ArtCollection,
        ArtPageBanner: getBannerAPI?.data?.Info[0]?.ArtPageBanner,
        ArtProduct: getBannerAPI?.data?.Info[0]?.ArtProduct,
        Artist: getBannerAPI?.data?.Info[0]?.Artist,
        CorporateCollection: getBannerAPI?.data?.Info[0]?.CorporateCollection,
        PrivateCollector: getBannerAPI?.data?.Info[0]?.PrivateCollector,
        AuctionBannerImage: getBannerAPI?.data?.Info[0]?.AuctionBannerImage,
      })
    }
  }, [getBannerAPI])

  return (
    <div className="App">
      <ToastContainer />
      <Header notifyCount={notifyCount} Logo={siteSettingState?.ProjectDetails?.Logo} cartCount={cartCount} loginState={loginState} LoginFunction={LoginFunction} connectWallet={(e) => handleConnectWallet(e)} isWalletConnected={isWalletConnected} disconnectWallet={handleDisconnectWallet} />
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/register' element={<Register loginState={loginState} step={step} nextStep={nextStep} backStep={backStep} registerSteps={registerSteps} />} />
        <Route path='/login' element={<LoginScreen loginState={loginState} registerSteps={registerSteps} LoginFunction={LoginFunction} />} />
        <Route path='/forgot' element={<ForgotForm loginState={loginState} />} />
        <Route path='/verify' element={<Twofactor loginState={loginState} LoginFunction={LoginFunction} />} />
        <Route path='/reset-password/:token' element={<ResetForm loginState={loginState}/>} />
        <Route path='/profile' element={<ProfileUpdate registerSteps={registerSteps} />} />
        <Route path='/art' element={<Art bannerState={bannerState} />} />
        <Route path='/giftart' element={<GiftArt />} />
        <Route path='/news/:id' element={<News />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/support' element={<Support />} />
        <Route path='/events' element={<Events />} />
        <Route path='/features' element={<Features />} />
        <Route path='/about-us' element={<Aboutus bannerState={bannerState} />} />
        <Route path='/collection/:artistId/:id' element={<CollectionART isWalletConnected={isWalletConnected} />} />
        <Route path='/my-collection/:id' element={<MyCollectionART loginState={loginState}  isWalletConnected={isWalletConnected} />} />
        <Route path='/collection/:artistId' element={<CollectionARTUserBased bannerState={bannerState} isWalletConnected={isWalletConnected} />} />
        <Route path='/my-collection' element={<MyCollection />} />
        <Route path='/collection' element={<Collections />} />
        <Route path='/connect-wallet' element={<ConnectWallet cartCOuntUpdate={cartCOuntUpdate} connectWallet={(e) => handleConnectWallet(e)} isApiProcessing={isApiProcessing} />} />
        <Route path='/createcollection' element={<CreateCollection />} />
        <Route path='/create-item/:id/single' element={<CreateItem />} />
        <Route path='/create-item/:id/bulk' element={<BulkItems />} />
        <Route path='/create-item/:id/bulk-art-product' element={<BulkItemsArtProduct />} />
        <Route path='/create-item/:id/art-product' element={<CreateArtproductItem />} />
        <Route path='/edit-item/:id' element={<EditItem />} />
        <Route path='/edit-art-product-item/:id' element={<Editartproduct />} />
        <Route path='/editcollection/:id' element={<EditCollection />} />
        <Route path='/art/:id' element={<ArtDetails cartCOuntUpdate={cartCOuntUpdate} loginState={loginState} isWalletConnected={isWalletConnected} />} />
        <Route path='/giftart/:id' element={<GiftArtDetails cartCOuntUpdate={cartCOuntUpdate} loginState={loginState} isWalletConnected={isWalletConnected} />} />
        <Route path='/art/category/:category' element={<ArtCatetgory cartCOuntUpdate={cartCOuntUpdate} loginState={loginState} isWalletConnected={isWalletConnected} />} />
        <Route path='/artist' element={<Artist bannerState={bannerState} />} />
        <Route path='/artist/:category' element={<Category />} />
        <Route path='/artist-label/:category' element={<ArtistLabel />} />
        <Route path='/myprofile' element={<Myprofile />} />
        <Route path='/myprofile/edit' element={<ProfileEdit />} />
        <Route path='/myprofile/address' element={<Myaddress />} />
        <Route path='/single-artist/:id' element={<ArtistUser />} />
        <Route path='/artProducts' element={<ArtistProduct bannerState={bannerState} />} />
        <Route path='/art/art-category/:category' element={<ArtproductCategory />} />
        <Route path='/art/art-category/:category/:name' element={<ArtproductCategoryName />} />
        <Route path='/private-collector' element={<PrivateCollector bannerState={bannerState} />} />
        <Route path='/collections' element={<Collections bannerState={bannerState} />} />
        <Route path='/paymentArt' element={<PurchaseArt cartCOuntUpdate={cartCOuntUpdate} />} />
        <Route path='/paymentDetails/:id/:cartID' element={<PurchaseDetails />} />
        <Route path='/auction' element={<Auction bannerState={bannerState} />} />
        <Route path='/auction/:id' element={<AuctionDetails />} />
        <Route path='/notification' element={<Notification />} />
        
      </Routes>
      <Footer socialLinks={siteSettingState?.SocialLinks} FooterLinks={siteSettingState?.FooterLinks} />
    </div>
  );
}


export default App;
