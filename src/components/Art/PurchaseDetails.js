import React, { useEffect, useRef, useState } from 'react'
import Banner from './Banner'
import { Container, Form } from 'react-bootstrap'
import "../../styles/Art.css";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import img1 from "../../assets/price/image 24.png";
import img2 from "../../assets/price/Vector (1).png"
import {
  useGetItemInfoMutation,
  usePurchaseItemMutation,
  useGetAddressListQuery,
  useGetCartItemsMutation,
  useGetCartItemInfoMutation,
  useGetCountiesQuery
} from "../../service/Apilist";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { validate } from 'postal-codes-js';
import { socket } from "../../socket";
import CryptoJS from 'crypto-js';

const Web3 = require('web3');
function PurchaseArt() {
  let navigate = useNavigate()
  const parms = useParams();
  const getCounties = useGetCountiesQuery();
  const [artist, setArtist] = useState(1)
  const [payment, setPayment] = useState(5)
  const [getAllItemInfo, resAllItemInfo] = useGetItemInfoMutation();
  const [getcartItemInfo, rescartItemInfo] = useGetCartItemInfoMutation();
  const [purchaseItemAPI, respurchaseItemAPI] = usePurchaseItemMutation();
  const getAllListAddress = useGetAddressListQuery();
  const [apiLoading, setAPILoading] = useState(false);
  const [physicalState, setPhysicalState] = useState(false);
  const [editionState, seteditionState] = useState(0);
  const [itemDetailState, setitemDetails] = useState({});
  const [MediaURLstate, setMediaURLstate] = useState("");
  const [addressListState, setAddressListState] = useState([]);
  const [cartItemState, setcartItemState] = useState([]);
  const fileInputRef = useRef(null);
  const [paymentProofState, setPaymentProofState] = useState("")

  const decryptedItemIdBytes = CryptoJS.AES.decrypt(parms.id, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);
  const decryptedItemCart = CryptoJS.AES.decrypt(parms.cartID, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);

  const showToast = (text) => {
    toast.success(text)
  }
  const showErroToast = (text) => {
    toast.error(text);
  }
  const handleChange = () => {
    setArtist(3)
    setPayment(5)
  }
  const [country, setCountry] = useState([]);
  const [countryObj, setCountryObj] = useState({})
  const [addressObj, setAddressObj] = useState(null)
  useEffect(() => {
    if (getCounties.status === "fulfilled") {
      setCountry(getCounties.data.info)
    }
  }, [getCounties])

  useEffect(() => {
    getcartItemInfo({
      CartId: encodeURIComponent(decryptedItemCart)
    })
  }, [])
  useEffect(() => {
    socket.on("ArtItemInfo", (data) => {
      setitemDetails(data?.data[0]);
      setAPILoading(false)
    })
  }, [])

  useEffect(() => {
    socket.emit('ArtItemInfo', {
      ItemId: encodeURIComponent(decryptedItemIdBytes)
    })
  }, [])

  useEffect(() => {
    if (getAllListAddress?.status === "fulfilled") {
      if (getAllListAddress?.data?.info) {
        setAddressListState(getAllListAddress?.data?.info);
      }
    }
  }, [getAllListAddress?.status])
  useEffect(() => {
    if (rescartItemInfo?.status === "fulfilled") {
      if (rescartItemInfo?.data?.status) {
        setPhysicalState(rescartItemInfo?.data?.data[0]?.ItemInfo?.PhysicalArt);
        seteditionState(rescartItemInfo?.data?.data[0]?.ItemInfo?.Edition)
        setcartItemState(rescartItemInfo?.data?.data[0]?.ItemInfo);
      }
    }
  }, [rescartItemInfo?.status])

  useEffect(() => {
    setAPILoading(true)
    if (resAllItemInfo?.status === "fulfilled") {
      if (resAllItemInfo?.data?.status) {
        setitemDetails(resAllItemInfo?.data?.data[0]);
        setAPILoading(false)
      }
    }
  }, [resAllItemInfo?.status])

  const transferCall = async (networkDetails) => {
    let toAddress = itemDetailState?.OwnerInfo?.WalletAddress;
    let price = 0;



    if (physicalState) {
      price = itemDetailState?.OfferInfo?.Status === "Accepted" ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.PhysicalPrice;
    } else {
      price = itemDetailState?.OfferInfo?.Status === "Accepted" ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.DigitalPrice;
    }
    const params = {
      from: window.ethereum.selectedAddress,
      to: toAddress.toLowerCase(),
      value: Number(price * Math.pow(10, 18).toString()),
      gasPrice: '20000000000'
    };

    window.web3 = new Web3(window.ethereum);
    window.ethereum.enable();
    let contractAddress = networkDetails?.MultiContract;
    let factoryabi = JSON.parse(networkDetails?.MultiAbiArray)
    let instance = new window.web3.eth.Contract(factoryabi, contractAddress);
    let platformcommision = networkDetails?.AdminCommission ? networkDetails?.AdminCommission : 0;
    let royaltiesCommission = itemDetailState?.CollectionInfo?.Royalties ? itemDetailState?.CollectionInfo?.Royalties : 0;
    let platformprice = price * platformcommision / 100;
    let royalties = price * royaltiesCommission / 100;
    let totalCommission = Number(platformcommision) + Number(royaltiesCommission);
    let balancePrice = price * ((100 - totalCommission) / 100);
    let recipients = [];
    let amounts = [];
    recipients.push(networkDetails?.FeeAddress);
    recipients.push(itemDetailState?.UserInfo?.WalletAddress);
    recipients.push(toAddress);
    amounts.push(Number(Math.floor(platformprice * Math.pow(10, 18))).toString());
    amounts.push(Number(Math.floor(royalties * Math.pow(10, 18))).toString());
    amounts.push(Number(Math.floor(balancePrice * Math.pow(10, 18))).toString());

    
    try {
      await instance.methods.mutiSendETHWithDifferentValue(recipients, amounts).send(params).then(res => {
        if (res.status) {
          if (itemDetailState?.OfferInfo?.Price > 0) {
            purchaseItemAPI({
              ItemId: encodeURIComponent(decryptedItemIdBytes),
              Edition: editionState,
              Price: itemDetailState?.OfferInfo?.Price,
              PaymentProof: paymentProofState
            }).then(res => {
              navigate("/art");
            })
          } else {
            purchaseItemAPI({
              ItemId: encodeURIComponent(decryptedItemIdBytes),
              Edition: editionState,
              PaymentProof: paymentProofState
            }).then(res => {
              navigate("/art");
            })
          }
        }
      });
    } catch (error) {
      if (error.code === 4001) {
        toast.warning(error.message)
      }
      setAPILoading(false)
    }
  }
  async function switchNetwork(networkId, networkObj) {
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

  const purchaseItem = (chain) => {
    setAPILoading(true);
    axios.post(`${process.env.REACT_APP_API_URL}/GetNetworkInfo`, {
      "Currency": chain
    }).then(async res => {
      if (res.data?.status) {
        let web3 = new Web3(window.ethereum);
        let chainId = await web3.eth.getChainId();
        if (chainId === res.data?.info?.ChainID) {
          let networkDetails = res.data?.info;
          await transferCall(networkDetails);
        } else {
          switchNetwork(web3.utils.numberToHex(res.data?.info?.ChainID), res.data?.info).then(async switchRes => {
            if (switchRes) {
              let networkDetails = res.data?.info;
              await transferCall(networkDetails);
            }
          })
        }
      }
    })
  }

  const EtherCard = () => {
    return (
      <div className='container'>
        <div className='row'>
          <div className='paymentArtBtn' style={{ marginLeft: "20px" }}>
            <i className='fas fa-money-check fa-1x'></i>
            <p >Ethers</p>
          </div>
          <div className='row'>
            <button className='saveAnd ' disabled={apiLoading} onClick={() => purchaseItem(itemDetailState?.ItemInfo?.Currency)} >{apiLoading ? "Loading..." : "save and Continue"}   </button>
          </div>
        </div>
      </div>
    )
  }
  const PolygonCard = () => {
    return (
      <div className='container'>
        <div className='row'>
          <div className='paymentArtBtn' style={{ marginLeft: "20px" }}>
            <i className='fas fa-money-check fa-1x'></i>
            <p >Polygon</p>
          </div>
          <div className='d-flex creditBilling'>
            <div className='d-flex'>
              <input type="checkbox" />
            </div>
            <p>Billing and shipping addresses are the same.</p>
          </div>
          <div className='row'>
            <button className='saveAnd ' disabled={apiLoading} onClick={() => purchaseItem(itemDetailState?.ItemInfo?.Currency)} >{apiLoading ? "Loading..." : "save and Continue"}   </button>
          </div>
        </div>
      </div>
    )
  }

  const CreditCard = () => {
    return (

      <Container fluid>
        <div className='row'>
          <div className='paymentArtBtn'>
            <i className='fas fa-money-check fa-1x'></i>
            <p >Credit Card</p>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-4'>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '18ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField id="filled-basic" label="Card Number" variant="filled" />
            </Box>
          </div>
          <div className='col-lg-4'>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '15ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField id="filled-basic" label="Expiry MM/YY" variant="filled" />
            </Box>
          </div>
          <div className='col-lg-4'>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '10ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField id="filled-basic" label="CVC/CVV" variant="filled" />
            </Box>
          </div>
        </div>

        <div className='d-flex creditBilling'>
          <i className='fas fa-exclamation-circle'></i>
          <p>Billing and shipping addresses are the same.</p>
        </div>
        <div className='d-flex creditBilling'>
          <i className='fas fa-exclamation-circle'></i>
          <p>Billing and shipping addresses are the same.</p>
        </div>

        <div className='container'>
          <div className='row'>
            <button className='saveAnd'>save and Continue</button>
          </div>
        </div>
      </Container>
    )
  }
  const OfferArt = () => {
    return (
      <Container>

        <div className='row paymentArtDetails'>

          <div className='col-lg-6'>
            <p className='purchaseText'>{itemDetailState?.UserInfo?.ProfileName} </p>
            <p className='purchaseTextTwo'>{itemDetailState?.OfferInfo?.Price ? "approved your quote price request for the artwork Sandstorm" : null}</p>

            {!rescartItemInfo?.isLoading && !rescartItemInfo?.isError ? <button className='purchaseArtBtn' onClick={() => {
              if (physicalState) {
                setArtist(2)
              } else {
                setArtist(3)
              }
            }}>Continue</button> : null}

          </div>
          <div className='col-lg-6'>
            <div className='row'>
              <div className='col-lg-2'>
                <img src={itemDetailState?.UserInfo?.ProfilePicture} className="artProfile" ></img>
              </div>
              <div className='col-lg-10'>
                <div>
                  <p className='artArtistName'>ARTIST</p>
                  <p className='artArtistNameTwo'>{itemDetailState?.UserInfo?.ProfileName}</p>
                  <p className='artArtistNameThree'>{itemDetailState?.UserInfo?.Country}</p>
                  <p className='artistNetworkName'>LIST PRICE {itemDetailState?.ItemInfo?.Currency} {itemDetailState?.OfferInfo?.Price ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.Price}</p>
                </div>
                <div className='purchaseAmountDetails'>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList">
                        <p className="labes">Your Price</p>
                      </div>
                      <div className="col purchaseList">
                        <p>{itemDetailState?.ItemInfo?.Currency} {itemDetailState?.OfferInfo?.Price ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.Price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList">
                        <p className="labes">Shipping</p>
                      </div>
                      <div className="col purchaseList">
                        <p>Calculated in next steps</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList">
                        <p className="labes">Tax</p>
                      </div>
                      <div className="col purchaseList">
                        <p>Calculated in next steps</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList totalValue">
                        <p className="labes">Total</p>
                      </div>
                      <div className="col purchaseList totalValue">
                        <p>Waiting for final costs</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='disclaimer'>
                  <p className='purchaseTextThree'>*Additional duties and taxes may apply at import</p>
                </div>
                <div className='purchaseAlert'>
                  <div>
                    <i className='fas fa-exclamation-triangle'></i>
                  </div>
                  <div>
                    <p className="alertOne">Your Purchase is protected.</p>
                    <p className='alertTwo'>Learn more about BluAart buyer protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    )

  }

  const PaymentList = () => {
    return (
      <div className='paymentList'>

        <div className='paymentArtBtn' onClick={() => setPayment(6)}>
          <i className='fas fa-money-check fa-1x'></i>
          <p >Credit Card</p>
        </div>
        {itemDetailState?.ItemInfo?.Currency === "MATIC" ?
          <div className='paymentArtBtn' onClick={() => setPayment(8)}>
            <i className='fas fa-dollar-sign'></i>
            <p >Polygon</p>
          </div>
          : null}
        {itemDetailState?.ItemInfo?.Currency === "ETH" ?
          <div className='paymentArtBtn' onClick={() => setPayment(9)}>
            <i className='fab fa-ethereum fa-1x'></i>
            <p>Ethers</p>
          </div>
          : null}
      </div>
    )
  }

  const PaymentArt = () => {
    return (
      <Container>
        <div className='row paymentArtDetails'>
          <div className='col-lg-6'>
            {payment === 5 ? <PaymentList></PaymentList> : null}
            {payment === 6 ? <CreditCard></CreditCard> : null}
            {payment === 9 ? <EtherCard></EtherCard> : null}
            {payment === 8 ? <PolygonCard></PolygonCard> : null}
          </div>
          <div className='col-lg-6 mainContent'>
            <div className='row'>
              <div className='col-lg-2'>
                <img src={itemDetailState?.UserInfo?.ProfilePicture} className="artProfile" ></img>
              </div>
              <div className='col-lg-10'>
                <div>
                  <p className='artArtistName'>ARTIST</p>
                  <p className='artArtistNameTwo'>{itemDetailState?.UserInfo?.ProfileName}</p>
                  <p className='artArtistNameThree'>{itemDetailState?.UserInfo?.Country}</p>
                  <p className='artistNetworkName'>LIST PRICE {itemDetailState?.ItemInfo?.Currency} {itemDetailState?.OfferInfo?.Price ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.Price}</p>
                </div>
                <div className='purchaseAmountDetails'>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList">
                        <p className="labes">Your Price</p>
                      </div>
                      <div className="col purchaseList">
                        <p>{itemDetailState?.ItemInfo?.Currency} {itemDetailState?.OfferInfo?.Price ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.Price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList">
                        <p className="labes">Shipping</p>
                      </div>
                      <div className="col purchaseList">
                        <p>Calculated in next steps</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList">
                        <p className="labes">Tax</p>
                      </div>
                      <div className="col purchaseList">
                        <p>Calculated in next steps</p>
                      </div>
                    </div>
                  </div>
                  <div className="container">
                    <div className="row align-items-center">
                      <div className="col purchaseList totalValue">
                        <p className="labes">Total</p>
                      </div>
                      <div className="col purchaseList totalValue">
                        <p>Waiting for final costs</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='disclaimer'>
                  <p className='purchaseTextThree'>*Additional duties and taxes may apply at import</p>
                </div>
                <div className='purchaseAlert'>
                  <div>
                    <i className='fas fa-exclamation-triangle'></i>
                  </div>
                  <div>
                    <p className="alertOne">Your Purchase is protected.</p>
                    <p className='alertTwo'>Learn more about BluAart’s buyer protection</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    )
  }
  const SignupAddressSchema = Yup.object().shape({
    Country: Yup.object().required('Country is required')
      .test('country-name', 'Country is not a number only', function (value) {
        return isNaN(Number(value));
      })
    ,
    name: Yup.string().required('name is required')
      .test('name', 'name is not a number only', function (value) {
        return isNaN(Number(value));
      })
    ,
    addressOne: Yup.string().required('Address line is required'),
    addressTwo: Yup.string(),
    state: Yup.string().required('State is required')
      .test('country-name', 'State is not a number only', function (value) {
        return isNaN(Number(value));
      })
    ,
    postalCode: Yup.string()
      .required('postal code is required')
      .test(
        "post code check",
        "Invalid postal code",
        function (value) {
          if (validate(countryObj?.code, value) === true) {
            return true;
          } else {
            return false;
          }
        }
      )
    ,
    city: Yup.string().required('City is required')
      .test('country-name', 'City is not a number only', function (value) {
        return isNaN(Number(value));
      })
    ,
    mobileNumber: Yup.string()
      .required('Mobile number is required').test(
        "test phone number valid based on country",
        "Invalid number",
        function (value) {
          const phoneNumberObj = parsePhoneNumberFromString(value, countryObj?.code);
          if (phoneNumberObj && phoneNumberObj.isValid()) {
            return true;
          } else {
            return false;
          }
        }
      ),
  });

  const formik = useFormik({
    initialValues: {
      Country: '',
      name: "",
      addressOne: '',
      addressTwo: '',
      state: '',
      postalCode: '',
      city: '',
      mobileNumber: '',
    },
    enableReinitialize: true,
    validationSchema: SignupAddressSchema,
    onSubmit: values => {
      setArtist(3)
    },
  });
  useEffect(() => {
    if(countryObj && addressObj){
      let formikValueUpdate = {
        addressOne: addressObj?.AddressLine1,
        addressTwo: addressObj?.AddressLine2,
        state: addressObj?.State,
        postalCode: addressObj?.PostalCode,
        city: addressObj?.CityName,
        countryCode: '',
        mobileNumber: addressObj?.MobileNo,
        Country : countryObj
      }
      formik.setValues(formikValueUpdate)
    }
  }, [countryObj,addressObj])
  const selectAddress = (id) => {
    if (id) {
      let getSpecificAddress = addressListState.filter((address) => address._id == id);
      let getCountryObj = country?.filter(obj => obj.name === getSpecificAddress[0]?.CountryName);
      setCountryObj(getCountryObj[0]);
      setAddressObj(getSpecificAddress[0])     
    }else{
      formik.setValues({});
    }
  }
  const ShippingArt = () => {
    return (
      <form onSubmit={formik.handleSubmit} >
        <Container>
          <div className='row paymentArtDetails'>
            <div className='col-lg-6'>
              <p className='purchaseText'>Select a address </p>
              <div>
                <select onChange={(e) => selectAddress(e.target.value)} className='form-select'>
                  <option>Select address</option>
                  {addressListState.length > 0 && addressListState.map((address, index) => (
                    <option value={address._id} >{address.AddressLine1},{address.AddressLine2},{address.CityName},{address.CountryName},{address.PostalCode}</option>
                  ))}
                </select>
              </div>
              <br />
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        onChange={formik.handleChange}
                        value={formik.values.name ? formik.values.name : ""}
                        name="name"
                        id="filled-basic"
                        label="Your Name"
                        variant="filled"
                      />
                      <div className='errors'>{formik.errors.name}</div>
                    </Box>
                  </div>
                </div>
              </div>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <InputLabel id="select-label">Country</InputLabel>
                      <Select
                        labelId="select-label"
                        name='Country'
                        value={formik.values.Country}
                        onChange={(e) => {
                          formik.setFieldValue('Country',e.target.value)
                          setCountryObj(e.target.value)
                        }}
                      >
                        {country.length > 0 && country?.map((countryOBJ, index) => (
                          <MenuItem value={countryOBJ}>{countryOBJ?.name}</MenuItem>
                        ))}
                      </Select>
                      <div className='errors'>{formik.errors.Country}</div>
                    </Box>
                  </div>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        name='postalCode'
                        onChange={formik.handleChange}
                        value={formik.values.postalCode ? formik.values.postalCode : ""}
                        id="filled-basic" label="Postal Code" variant="filled" />
                      <div className='errors'>{formik.errors.postalCode}</div>
                    </Box>
                  </div>
                </div>
              </div>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        name='addressOne'
                        onChange={formik.handleChange}
                        value={ formik.values.addressOne ? formik.values.addressOne : ""}
                        id="filled-basic" label="Address line 1" variant="filled" />
                      <div className='errors'>{formik.errors.addressOne}</div>
                    </Box>
                  </div>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        name='addressTwo'
                        onChange={formik.handleChange}
                        value={formik.values.addressTwo ? formik.values.addressTwo : ""}
                        id="filled-basic" label="Address line 2 (optional)" variant="filled" />
                      <div className='errors'>{formik.errors.addressTwo}</div>
                    </Box>
                  </div>
                </div>
              </div>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        name='city'
                        onChange={formik.handleChange}
                        value={ formik.values.city ? formik.values.city : ""}
                        id="filled-basic" label="City" variant="filled" />
                      <div className='errors'>{formik.errors.city}</div>
                    </Box>
                  </div>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{
                        '& > :not(style)': { m: 1, width: '25ch' },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        name='state'
                        onChange={formik.handleChange}
                        value={formik.values.state ? formik.values.state : ""}
                        id="filled-basic" label="State, Province or Region" variant="filled" />
                      <div className='errors'>{formik.errors.state}</div>
                    </Box>
                  </div>
                </div>
              </div>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-6'>
                    <Box
                      component="form"
                      sx={{ '& > :not(style)': { m: 1, width: '25ch' }, }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        name='mobileNumber'
                        onChange={formik.handleChange}
                        value={formik.values.mobileNumber ? formik.values.mobileNumber : ""}
                        id="filled-basic" label="Phone Number" variant="filled" />
                      <div className='errors'>{formik.errors.mobileNumber}</div>
                    </Box>
                  </div>
                </div>
              </div>
              <div className='container'>
                <div className='row'>
                  <div className='col-lg-12'>
                    <div className='row bell '>
                      <div className='d-flex'>
                        <input type="checkbox" /> &nbsp;&nbsp;&nbsp;
                        <p style={{ marginBottom: "0px", marginTop: "5px" }} className='saveShipping'>  Save shipping address for later use</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='row'>
                <div className='col-lg-2'>
                  <img src={itemDetailState?.UserInfo?.ProfilePicture} className="artProfile" ></img>
                </div>
                <div className='col-lg-10'>
                  <div>
                    <p className='artArtistName'>ARTIST</p>
                    <p className='artArtistNameTwo'>{itemDetailState?.UserInfo?.ProfileName}</p>
                    <p className='artArtistNameThree'>{itemDetailState?.UserInfo?.Country}</p>
                    <p className='artistNetworkName'>LIST PRICE {itemDetailState?.ItemInfo?.Currency} {itemDetailState?.OfferInfo?.Price ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.Price}</p>
                  </div>
                  <div className='purchaseAmountDetails'>
                    <div className="container">
                      <div className="row align-items-center">
                        <div className="col purchaseList">
                          <p className="labes">Your Price</p>
                        </div>
                        <div className="col purchaseList">
                          <p>{itemDetailState?.ItemInfo?.Currency} {itemDetailState?.OfferInfo?.Price ? itemDetailState?.OfferInfo?.Price : itemDetailState?.ItemInfo?.Price}</p>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="row align-items-center">
                        <div className="col purchaseList">
                          <p className="labes">Shipping</p>
                        </div>
                        <div className="col purchaseList">
                          <p>Calculated in next steps</p>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="row align-items-center">
                        <div className="col purchaseList">
                          <p className="labes">Tax</p>
                        </div>
                        <div className="col purchaseList">
                          <p>Calculated in next steps</p>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="row align-items-center">
                        <div className="col purchaseList totalValue">
                          <p className="labes">Total</p>
                        </div>
                        <div className="col purchaseList totalValue">
                          <p>Waiting for final costs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='disclaimer'>
                    <p className='purchaseTextThree'>*Additional duties and taxes may apply at import</p>
                  </div>
                  <div className='purchaseAlert'>
                    <div>
                      <i className='fas fa-exclamation-triangle'></i>
                    </div>
                    <div>
                      <p className="alertOne">Your Purchase is protected.</p>
                      <p className='alertTwo'>Learn more about BluAart’s buyer protection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12'>
                  <p className='shippingOptionOne'>BluAart shipping options </p>
                  <p className='shippingOptionTwo'>All options are eligible for BluAart’s Buyer Protection policy, which protects against damage and loss.</p>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-10'>
                  <div className='d-flex'>
                    <Form>
                      <div>.
                        <Form.Check
                          type="radio"
                          id={`disabled-default-radio`}
                        />
                      </div>
                    </Form>
                    <div className='shippingOption'>
                      <p className='shippingOptionFour'>Priority</p>
                      <p className='shippingOptionThree'>Delivers to your door in 2-4 business days once packaged and shipped via a common carrier, depending on
                        destination and prompt payment of applicable duties and taxes.</p>
                    </div>
                  </div>
                </div>
                <div className='col-lg-2'>
                  <p style={{ fontWeight: "600" }}>$506.05</p>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-10'>
                  <div className='d-flex'>
                    <Form>
                      <div>.
                        <Form.Check
                          type="radio"
                          id={`disabled-default-radio`}
                        />
                      </div>
                    </Form>
                    <div className='shippingOption'>
                      <p className='shippingOptionFour'>White Glove</p>
                      <p className='shippingOptionThree'>Room-of-choice delivery handled via trained technicians with specialized packeaging and climate-controlled
                        transportation. recommended for high-value works. Delivery timing variable.</p>
                    </div>
                  </div>
                </div>
                <div className='col-lg-2'>
                  <p style={{ fontWeight: "600" }}>42,968.33</p>
                </div>
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <button className='saveAnd' type='submit'>save and Continue</button>
              </div>
            </div>
          </div>
        </Container>
      </form >
    )
  }

  const ReviewArt = () => {
    return (
      <div className='container'>
        <div className='row'>
          <p className='submisstion'>Submission Successful !</p>
          <div className='loading'>
            <img src={img2}></img>
          </div>
          <p className='submit'>Thank you for submitting your
            identity document.
            We are verifying your document</p>
          <div className='loading'>
            <img src={img1}></img>
          </div>
          <p className='moment'>Pleasse wait for a moment</p>
        </div>
      </div>
    )
  }
  return (
    <div>
      <Banner></Banner>
      <Container fluid>
        <div className='row'>
          <div className='purchaseDetails'>
            <ul>
              <li
                className={artist === 1 ? "active" : null}
              >Offer</li>
              {physicalState ? <li
                className={artist === 2 ? "active" : null}
              >Shipping</li> : null}
              <li
                className={artist === 3 ? "active" : null}
              >Payment</li>
            </ul>
          </div>
        </div>
      </Container>
      {artist === 1 ? <OfferArt></OfferArt> : null}
      {artist === 2 ? ShippingArt() : null}
      {artist === 3 ? <PaymentArt></PaymentArt> : null}
      {artist === 4 ? <ReviewArt></ReviewArt> : null}
    </div>
  )
}

export default PurchaseArt;