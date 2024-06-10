import React, { useEffect, useState } from 'react'
import Banner from './Banner'
import { Container } from 'react-bootstrap'
import "../../styles/Art.css";
import {
  useGetCartItemsMutation, useRemovecartMutation
} from "../../service/Apilist";
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Loader/LoadingScreen';
import CryptoJS from 'crypto-js';


function PurchaseArt({ cartCOuntUpdate }) {
  const [apiLoading, setAPILoading] = useState(false);
  const [itemDetailState, setitemDetails] = useState([]);
  const [Currency, setCurrency] = useState([]);
  const [getCartItemAPI, resgetCartItemAPI] = useGetCartItemsMutation();
  const [removecartAPI, resremoveCartAPI] = useRemovecartMutation();
  const [CcurrencyState, Setccurrency] = useState("")
  const [CcurrencyPriceState, SetCcurrencyPriceState] = useState(0)
  useEffect(() => {
    getCartItemAPI()
  }, [])
  useEffect(() => {
    setAPILoading(true)
    if (resgetCartItemAPI?.status === "fulfilled") {
      if (resgetCartItemAPI?.data?.status) {
        setitemDetails(resgetCartItemAPI?.data?.data);
        Setccurrency("ETH")
        SetCcurrencyPriceState(resgetCartItemAPI?.data?.data[0]?.ItemInfo?.Price)
        setAPILoading(false)
      }
    }
  }, [resgetCartItemAPI?.status])
  const navigate = useNavigate();
  const RoutePaymentpage = (id, cartID) => {
    navigate(`/paymentDetails/${id}/${cartID}`)
  }
  const removeCart = (item) => {
    removecartAPI({
      CartId: item._id
    }).then(res => {
      cartCOuntUpdate()
      getCartItemAPI()
    })
  }
  const changeCurrency = (Object,CurrencyName) => {
    document.getElementById(Object?._id).innerHTML = CurrencyName + " " + parseFloat(Object?.ItemInfo?.Prices[CurrencyName]).toFixed(4);
   
  }
  return (
    <div>
      <Banner></Banner>
      <Container>
        {itemDetailState.length > 0 && itemDetailState.map((item, index) => {
          return (
            <Container  fluid className='sectionOne paymentArt'>
              <div className='row'>
                <div className='col-lg-3'>
                  <img src={item?.ItemInfo?.Thumb} width={100} height={200}></img>
                </div>
                <div className='col-lg-9'>
                  <div className='row'>
                    <div className='col-lg-3'>
                      <img src={item?.UserInfo?.ProfilePicture} className="artProfile" />
                    </div>
                    <div className='col-lg-9'>
                      <div className='d-flex justify-content-end'>
                        <button className='btn' onClick={() => removeCart(item)}>X</button>
                      </div>
                      <div>
                        <p className='artArtistName'>ARTIST</p>
                        <p className='artArtistNameTwo'>{item?.UserInfo?.ProfileName}</p>
                        <p className='artArtistNameThree'>{item?.UserInfo?.Country}</p>
                        <p className='artistNetworkName'>{item?.ItemId?.Name}</p>
                        <p className='modalPrice'>Price</p>
                        <div className='d-flex' >
                          <p id={item?._id} className={`box_Art_textTwo`} >{item?.ItemInfo?.Currency} {parseFloat(item?.ItemInfo?.Price.toFixed(4))}</p>
                          <select className='purchaseBtn'
                            onChange={(e) => changeCurrency(item,e.target.value)
                            
                            }
                          >
                            {Object.keys(item?.ItemInfo?.Prices).map((price, index) => {
                              return <option value={price}>{price}</option>;
                            })}
                          </select>
                        </div>
                        <button className='continue'
                          onClick={() => {
                            const encryptedItemId = CryptoJS.AES.encrypt(item?.ItemInfo?.Id.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                            const encryptedCartItemId = CryptoJS.AES.encrypt(item?._id.toString(), process.env.REACT_APP_SECRET_PASS).toString();
                            RoutePaymentpage(encodeURIComponent(encryptedItemId), encodeURIComponent(encryptedCartItemId));
                          }}
                        >Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          )
        })}
        {itemDetailState.length === 0 && !resgetCartItemAPI?.isLoading && <><br /><center><p>No items</p></center><br /></>}
      </Container>
      {apiLoading ? <LoadingScreen /> : null}

    </div>
  )
}

export default PurchaseArt;