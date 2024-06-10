import React, { useEffect, useRef, useState } from 'react'
import { Container } from 'react-bootstrap'
import Table from 'react-bootstrap/Table'
import ProfileIcon from "../../assets/art/profile.png"
import axios from 'axios';
import {
    useGetItemInfoMutation,
    useItemPublishMutation,
    useUpdateItemMutation,
    useSellItemMutation,
    useAddtoCartMutation,
    useMakeOfferMutation,
    useOfferlistBasedItemMutation,
    useAcceptOfferMutation,
    useItemOwnerListMutation,
    useItemHistoryListMutation,
    useSellNFTMutation,
    useAddBidMutation,
    useGetCartItemsMutation,
    useDelistArtNFTMutation,
    useHideArtNFTMutation,
    useAddPreOfferMutation,
    useCheckBidMutation,
    useGetGiftItemInfoMutation
} from "../../service/Apilist";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CryptoJS from 'crypto-js';
import '@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { socket } from "../../socket";
import Viewer from 'react-viewer';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import LoadingModal from '../Loader/Loading';
const Web3 = require('web3');
const UserId = sessionStorage.getItem("UserId")
function ArtDetails(props) {
    let navigate = useNavigate()
    const [visible, setVisible] = useState(false);
    const [editionstate, setEditionState] = useState();
    const [artist, setArtist] = useState(2);
    const [show, setShow] = useState(false);
    const [showbid, setShowbid] = useState(false);
    const [showPreOffer, setShowPreOffer] = useState(false);
    const [offerSale, setOfferSale] = useState(false);
    const [bidSale, setBidSale] = useState(false);
    const [iteminfostate, setiteminfostate] = useState([]);
    const [offerState, setofferState] = useState([]);
    const [ownerState, setownerState] = useState([]);
    const [hitoryState, sethitoryState] = useState([]);
    const [cartIdState, setCartIdState] = useState([]);
    const [offerIdState, setofferIdState] = useState([]);
    const [showSell, setShowSell] = useState(false);
    const [apiLoading, setAPILoading] = useState(false);
    const [sectionLoading, setSectionLoading] = useState(false);
    const [mintLoadint, setmintLoadint] = useState(false);
    const [bidLoadint, setbidLoadint] = useState(false);
    const [viewRoom, setViewRoom] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handlebidClose = () => setShowbid(false);
    const handlebidShow = () => setShowbid(true);
    const handlepreOfferShow = () => setShowPreOffer(true);
    const handlepreOfferClose = () => setShowPreOffer(false);
    const handleSellClose = () => setShowSell(false);
    const handleSellShow = () => setShowSell(true);
    const [itemDetailState, setitemDetails] = useState({});
    const [viewRoomsizeState, setviewRoomsizeState] = useState({
        width: "0px",
        height: "0px"
    });
    const [widthState, setWidthState] = useState(0);
    const [heightState, setHeightState] = useState(0);
    const [sizeState, setsizeState] = useState("");
    const [value, onChange] = useState([new Date(), new Date()]);
    const parms = useParams();
    const [getAllItemInfo, resAllItemInfo] = useGetItemInfoMutation();
    const [getGiftItemInfo, resGiftItemInfo] = useGetGiftItemInfoMutation();
    const [delistArtNFT, resdelistArtNFT] = useDelistArtNFTMutation();
    const [pusblishAPI, resPublishAPI] = useItemPublishMutation();
    const [updateItemAPI, resupdateItemAPI] = useUpdateItemMutation();
    const [sellitemAPI, ressellItemAPI] = useSellItemMutation();
    const [addTocartAPI, resaddTocartAPI] = useAddtoCartMutation();
    const [makeOffer, resmakeOfferAPI] = useMakeOfferMutation();
    const [preOffer, respreOfferAPI] = useAddPreOfferMutation();
    const [OfferList, resOfferListAPI] = useOfferlistBasedItemMutation();
    const [acceptOffer, resacceptOfferAPI] = useAcceptOfferMutation();
    const [ownerlistAPI, resownerlistAPI] = useItemOwnerListMutation();
    const [historylistAPI, reshistorylistAPI] = useItemHistoryListMutation();
    const [sellNFTAPI, ressellNFTAPI] = useSellNFTMutation();
    const [BidAPI, resBidAPI] = useAddBidMutation();
    const [CheckBidAPI, resCheckBidAPI] = useCheckBidMutation();
    const [hideArtNFT, resHideArtNFT] = useHideArtNFTMutation();
    const [getCartItemAPI, resgetCartItemAPI] = useGetCartItemsMutation();
    const [CcurrencyState, Setccurrency] = useState("")
    const [CcurrencyPriceState, SetCcurrencyPriceState] = useState(0)

    const decryptedItemId = CryptoJS.AES.decrypt(parms.id, process.env.REACT_APP_SECRET_PASS).toString(CryptoJS.enc.Utf8);


    const showToast = (text) => {
        toast.success(text)
    }

    const showErroToast = (text) => {
        toast.error(text);
    }

    useEffect(() => {
        getGiftItemInfo({
            ItemId: encodeURIComponent(decryptedItemId)
        })
    }, [])
    useEffect(() => {
        setAPILoading(true)
        if (resGiftItemInfo?.status === "fulfilled") {
            if (resGiftItemInfo?.data?.status) {
                setitemDetails(resGiftItemInfo?.data?.data[0]);
                setAPILoading(false);
            }
        }
    }, [resGiftItemInfo?.status])
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

    const mint = async (contractAddress, id, authorId) => {
        setmintLoadint(true);
        let web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_CONTRACT_ABI), contractAddress);

        let TokenId = await contractInstance.methods.lastTokenId().call();
        TokenId++;
        socket.emit("ArtItemMint", {
            TokenId,
            ItemId: id,
            AuthorId: authorId
        })
    }

    const mintItem = (chain, contractAddress, id, authorId) => {
        if (!props.isWalletConnected) {
            showErroToast("Please connect wallet");
            navigate('/connect-wallet')
            return true;
        }
        axios.post(`${process.env.REACT_APP_API_URL}/GetNetworkInfo`, {
            "Currency": chain
        }).then(async res => {
            let web3 = new Web3(window.ethereum);
            let chainId = await web3.eth.getChainId();
            if (chainId === res.data?.info?.ChainID) {
                mint(contractAddress, id, authorId)
            } else {
                switchNetwork(web3.utils.numberToHex(res.data?.info?.ChainID), res.data?.info).then((switchRes) => {
                    if (switchRes) {
                        mint(contractAddress, id, authorId)
                    }
                }).catch((error) => {
                })
            }
        })
    }


    const OverViewArt = () => {
        return (
            <div className='bottom-details'>
                <p className='artworkInformation'>artwork information</p>
                <div className='lineFour'>
                </div>
                <div>
                    <p className='artHeading'>Description</p>
                    <p className='artDescription'>{itemDetailState?.ItemInfo?.Description}</p>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <p className="packing">Material</p>
                            <p className='packingText'>{itemDetailState?.ItemInfo?.Type === "ArtProduct" ? itemDetailState?.ItemInfo?.ProductMaterial : itemDetailState?.ItemInfo?.Material.replace(/,$/, "")}</p>
                        </div>
                        <div className='col-lg-6'>
                            <p className="packing">Category</p>
                            <p className='packingText'>{itemDetailState?.ItemInfo?.Type === "ArtProduct" ? itemDetailState?.ItemInfo?.ProductCategory : itemDetailState?.ItemInfo?.Category}</p>
                        </div>
                    </div>
                </div>
                {itemDetailState?.ItemInfo?.Type === "Artwork" && <div className='container'>
                    <div className='row'>
                        <div className='col-lg-6'>
                            <p className="packing">Orientation</p>
                            <p className='packingText'>{itemDetailState?.ItemInfo?.Orientation}</p>
                        </div>
                        <div className='col-lg-6'>
                            <p className="packing">SUBJECT</p>
                            <p className='packingText'>{itemDetailState?.ItemInfo?.Subject.replace(/,$/, "")}</p>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }

    const DetailsArt = () => {
        return (
            <div className='bottom-details'>

                <div className='d-flex'>
                    <a target="_blank" href={itemDetailState?.NetworkInfo?.BlockExplorer + "/address/" + itemDetailState?.NetworkInfo?.FactoryContract} className='btn btn-secondary'>View Etherscan/Polygon</a>&nbsp;
                    <a target="_blank" href={itemDetailState?.ItemInfo?.MediaIPFS} className='btn btn-secondary'>View IPFS</a>&nbsp;
                    <a target="_blank" href={itemDetailState?.ItemInfo?.IPFSHash  + itemDetailState?.ItemInfo?.TokenId + ".json"} className='btn btn-secondary'>View METAJSON</a>
                </div>
                <br />
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className='d-flex justify-content-between'>
                                <p className="">Contract Address</p>
                                <p className=''>{itemDetailState?.NetworkInfo?.FactoryContract}</p>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <p className="">Token ID</p>
                                <p className=''>{itemDetailState?.ItemInfo?.TokenId}</p>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <p className="">Token Standard</p>
                                <p className=''>ERC-1155</p>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <p className="">Chain</p>
                                <p className=''>{itemDetailState?.NetworkInfo?.ChainName}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const BidsArt = () => {
        return (
            <div className='container'>
                <div className='row'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Event</th>
                                <th>Chain</th>
                                <th>User</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>{itemDetailState?.GitfHistory?.HistoryType}</td>
                                <td>{itemDetailState?.NetworkInfo?.ChainName}</td>
                                <td>{itemDetailState?.UserInfo?.ProfileName}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }
    const AcceptOfferNFT = (id) => {
        if (!props.isWalletConnected) {
            showErroToast("Please connect wallet");
            return true;
        }
        acceptOffer({
            OfferId: id,
            Status: "Accepted"
        }).then(res => {
            if (res?.data?.status) {
                showToast(res?.data?.message)
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } else {
                showErroToast(res?.data?.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            }
        })
    }
    const OwnerArt = () => {
        return (
            <div className='container '>
                <div className='d-flex justify-content-start'>
                    <i className="fas fa-bars fx-2 mx-2"></i>
                    <p className='artName'>Offers</p>
                </div>
                <div className='row' >
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>User</th>
                                <th>Price</th>
                                <th>Currency</th>
                                <th>Status</th>
                                {editionstate?.EnableAuction && sessionStorage.getItem("UserId") === itemDetailState?.ItemInfo?.AuthorId ? <th>Action</th> : null}
                            </tr>
                        </thead>
                        <tbody>
                            {!resOfferListAPI?.isLoading && offerState?.length > 0 ? offerState?.map((offer, index) => {
                                return (<tr>
                                    <td>{index + 1}</td>
                                    <td>{offer?.SenderInfo?.ProfileName}</td>
                                    <td>{offer?.OfferInfo?.Price ? offer?.OfferInfo?.Price : offer?.BidInfo?.Price}</td>
                                    <td>{itemDetailState?.ItemInfo?.Currency}</td>
                                    <td>{offer?.OfferInfo?.Status ? offer?.OfferInfo?.Status : offer?.BidInfo?.Status}</td>
                                    {editionstate?.EnableAuction && sessionStorage.getItem("UserId") === editionstate?.CurrentOwner ?
                                        <td>
                                            {offer?.OfferInfo?.Status === "Pending" ? <button className='btn btn-success accept-offer' onClick={() => AcceptOfferNFT(offer?.OfferInfo?._id)}>Accept</button> : null}
                                        </td>
                                        : null}
                                </tr>)
                            }) : (<>
                                {!resOfferListAPI?.isLoading && offerState.length === 0 ? <tr><td colSpan="6">No Offers</td></tr> : (<>
                                    <tr><td colSpan="6">Loading....</td></tr>
                                </>)}
                            </>)}

                        </tbody>
                    </Table>
                </div>
            </div>
        )
    }

    const HistoryArt = () => {
        return (

            <div className='container '>
                <div className='d-flex justify-content-start'>
                    <p>History</p>
                </div>
                <div className='row' >
                    <div className='history'>
                        <img src={ProfileIcon} ></img>
                        <div className=' historyDetails'>
                            <p><span>{itemDetailState?.UserInfo?.UserName}</span>{itemDetailState?.GitfHistory?.HistoryType}</p>
                            <p>{itemDetailState?.GitfHistory?.UpdatedAt}</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    const CartAdd = (ItemId) => {
        if (!props.isWalletConnected) {
            showErroToast("Please connect wallet");
            return true;
        }
        addTocartAPI({
            ItemId: ItemId,
            Edition: editionstate?.Edition
        }).then(res => {
            showToast(res.data.message)
            props.cartCOuntUpdate()
            getCartItemAPI({

            })
        })
    }
    const removeFromSell = (itemID, edition) => {
        if (itemID && edition?.Edition) {
            delistArtNFT({
                ItemId: itemID,
                Edition: edition?.Edition
            }).then((res) => {
                if (res?.data?.status) {
                    showToast(res?.data?.message)
                    getAllItemInfo({
                        ItemId: encodeURIComponent(decryptedItemId)
                    })
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                } else {
                    showErroToast(res?.data?.message);

                }
            })
        }
    }
    const deListConfirmPopup = (itemID, edition) => {
        confirmAlert({
            title: 'Remove from Sell',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => removeFromSell(itemID, edition)
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    const deletArtWork = (itemID) => {
        hideArtNFT({
            ItemId: itemID
        }).then((res) => {
            if (res?.data?.status) {
                showToast(res?.data?.message)
                setTimeout(() => {
                    navigate('/my-collection');
                }, 1500);
            } else {
                showErroToast(res?.data?.message);
            }
        })
    }
    const deleteConfirmPopup = () => {
        confirmAlert({
            title: 'Delete the art',
            message: 'Are you sure to do this.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deletArtWork(itemDetailState?.ItemInfo?._id)
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    const currencyState = (e, physic) => {
        if (e.target.value !== "") {
            Setccurrency(e.target.value)
            if (physic?.PhysicalArt) {
                SetCcurrencyPriceState(itemDetailState?.ItemInfo?.PhysicalPrices[e.target.value]);
            } else {
                SetCcurrencyPriceState(itemDetailState?.ItemInfo?.DigitalPrices[e.target.value]);
            }
        }
    }
    const itemStatus = (mintStatus, listStatus, loginStatus) => {
        switch (true) {
            case !loginStatus:
                return (
                    <div className='box_Art'>
                        {itemDetailState?.ItemInfo?.PriceDisplay ? (<>
                            <p className='box_Art_text'>Price</p>
                            <div className='one'>
                                <p className='box_Art_textTwo'>{CcurrencyState} {parseFloat(CcurrencyPriceState?.toFixed(5))}</p>
                                <select value={CcurrencyState} className='oneBtn' onChange={(e) => currencyState(e, editionstate)}>
                                    <option value="">---</option>
                                    {editionstate?.PhysicalArt ? Object.keys(itemDetailState?.ItemInfo?.PhysicalPrices).map((price, index) => {
                                        let selected = "";
                                        if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                            selected = "ETHER"
                                        } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                            selected = "MATIC"
                                        }
                                        return (
                                            <option selected={selected === price} value={price}>{price}</option>
                                        );
                                    }) : Object.keys(itemDetailState?.ItemInfo?.DigitalPrices).map((price, index) => {

                                        let selected = "";
                                        if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                            selected = "ETHER"
                                        } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                            selected = "MATIC"
                                        }
                                        return (
                                            <option selected={selected === price} value={price}>{price}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </>) : (<>
                            <br />
                        </>)}
                    </div>
                );
            case mintStatus && listStatus:
                return (props.loginState && sessionStorage.getItem("UserId") !== editionstate?.CurrentOwner ?
                    <div className='box_Art'>
                        {itemDetailState?.ItemInfo?.PriceDisplay ? (<>
                            <p className='box_Art_text'>Price</p>
                            <div className='one'>
                                <p className='box_Art_textTwo'>{CcurrencyState} {parseFloat(CcurrencyPriceState.toFixed(4))}</p>
                                <select value={CcurrencyState} className='oneBtn' onChange={(e) => {
                                    if (e.target.value !== "") {
                                        Setccurrency(e.target.value)
                                        SetCcurrencyPriceState(itemDetailState?.ItemInfo?.PhysicalPrices[e.target.value]);
                                    }
                                }}>
                                    <option value="">---</option>
                                    {Object.keys(itemDetailState?.ItemInfo?.PhysicalPrices).map((price, index) => {

                                        let selected = "";
                                        if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                            selected = "ETHER"
                                        } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                            selected = "MATIC"
                                        }
                                        return (
                                            <option selected={selected === price} value={price}>{price}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </>) : (<>
                            <br />
                        </>)}
                        {!sectionLoading ? <div className='one'>
                            {editionstate?.EnableAuctionStatus ? (<>
                                {new Date().getTime() < new Date(editionstate?.EndDateTimeUtc).getTime() ? (<>
                                    {!cartIdState.includes(itemDetailState?.ItemInfo?._id) ? <button className='cartOffer' onClick={() => CartAdd(itemDetailState?.ItemInfo?._id)} >Add to cart</button> : null}
                                    {itemDetailState?.OfferInfo?.SellerInfo?.Id !== sessionStorage.getItem("UserId") ? (<>  {!offerIdState.includes(sessionStorage.getItem('UserId')) ? <button className='btnOffer' onClick={handleShow} >MAKE AN OFFER</button> : null} </>) : null}


                                </>) : (<></>)}
                            </>) : (<></>)}
                            {editionstate?.EnableAuctionStatus ? (<>
                                {itemDetailState?.OfferInfo?.SellerInfo?.Id === sessionStorage.getItem("UserId") ? (<> {!cartIdState.includes(itemDetailState?.ItemInfo?._id) ? <button className='cartOffer' onClick={() => CartAdd(itemDetailState?.ItemInfo?._id)} >Add to cart</button> : null}</>) : null}
                            </>) : (<></>)}
                            {editionstate?.EnableBidStatus ? (<>
                                {new Date().getTime() < new Date(editionstate?.EndDateTimeUtcBID).getTime() && new Date().getTime() > new Date(editionstate?.StartDateTimeUtcBID).getTime() ? (<>
                                    {editionstate?.CurrentOwner !== sessionStorage.getItem("UserId") ? (
                                        <>
                                            {itemDetailState?.BidInfo?.SellerInfo?.Id !== sessionStorage.getItem("UserId") ? <button className='btnOffer' onClick={handlebidShow} >MAKE A BID</button> : null}
                                        </>
                                    ) : (<></>)}
                                </>) : (new Date().getTime() < new Date(editionstate?.EndDateTimeUtcBID).getTime() && <button className='btnOffer' onClick={handlepreOfferShow} >MAKE PRE OFFER</button>)}
                            </>) : (<></>)}
                            {!editionstate?.EnableBidStatus ? (<>
                                {!editionstate?.EnableAuctionStatus ? (<>
                                    {!cartIdState.includes(itemDetailState?.ItemInfo?._id) ? <button className='cartOffer' onClick={() => CartAdd(itemDetailState?.ItemInfo?._id)} >Add to cart</button> : null}
                                </>) : (<></>)}
                            </>) : (<></>)}
                        </div> : <div className='text-center'>"Loading...."</div>}
                        <p className='box_artPara'>Shipping and taxes calculated at checkout
                            This Artwork is shipping from australia</p>
                    </div>
                    : (<>
                        {props.loginState && sessionStorage.getItem("UserId") === editionstate?.CurrentOwner && <div className='box_Art'>
                            <p className='box_Art_text'>Price</p>
                            <div className='one'>
                                <p className='box_Art_textTwo'>{CcurrencyState} {parseFloat(CcurrencyPriceState?.toFixed(4))}</p>
                                <select value={CcurrencyState} className='oneBtn' onChange={(e) => {
                                    if (e.target.value !== "") {
                                        Setccurrency(e.target.value)
                                        SetCcurrencyPriceState(itemDetailState?.ItemInfo?.PhysicalPrices[e.target.value]);
                                    }
                                }}>
                                    <option value="">---</option>
                                    {Object.keys(itemDetailState?.ItemInfo?.PhysicalPrices).map((price, index) => {

                                        let selected = "";
                                        if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                            selected = "ETHER"
                                        } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                            selected = "MATIC"
                                        }
                                        return (
                                            <option selected={selected === price} value={price}>{price}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className='one'>
                                <button className='btnOffer' onClick={() => deListConfirmPopup(itemDetailState?.ItemInfo?._id, editionstate)}>Remove SELL</button>
                                &nbsp;
                                <button className='btnOffer' onClick={() => deleteConfirmPopup()}>Delete</button>
                            </div>
                            <p className='box_artPara'>Shipping and taxes calculated at checkout
                                This Artwork is shipping from australia</p>
                        </div>}
                    </>
                    )
                );
            case mintStatus:
                return (props.loginState && sessionStorage.getItem("UserId") === editionstate?.CurrentOwner ? <div className='box_Art sell'>
                    <div className='one'>
                        <button className='btnOffer' onClick={handleSellShow} >SELL</button>
                        <button className='btnOffer' onClick={() => deletArtWork(itemDetailState?.ItemInfo?._id)}>Delete</button>
                    </div>
                </div> : (
                    <>
                        <div className='box_Art'>
                            {itemDetailState?.ItemInfo?.PriceDisplay ? (<>
                                <p className='box_Art_text'>Price</p>
                                <div className='one'>
                                    <p className='box_Art_textTwo'>{CcurrencyState} {parseFloat(CcurrencyPriceState?.toFixed(4))}</p>
                                    <select className='oneBtn' value={CcurrencyState} onChange={(e) => currencyState(e, editionstate)}>
                                        <option value="">---</option>
                                        {editionstate?.PhysicalArt ? Object.keys(itemDetailState?.ItemInfo?.PhysicalPrices).map((price, index) => {
                                            let selected = "";
                                            if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                                selected = "ETHER"
                                            } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                                selected = "MATIC"
                                            }
                                            return (
                                                <option selected={selected === price} value={price}>{price}</option>
                                            );
                                        }) : Object.keys(itemDetailState?.ItemInfo?.DigitalPrices).map((price, index) => {

                                            let selected = "";
                                            if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                                selected = "ETHER"
                                            } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                                selected = "MATIC"
                                            }
                                            return (
                                                <option selected={selected === price} value={price}>{price}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </>) : (<>
                                <br />
                            </>)}
                        </div>
                    </>
                ));
            case !mintStatus && !listStatus:
                return (props.loginState && sessionStorage.getItem("UserId") === itemDetailState?.ItemInfo?.AuthorId ? <div className='box_Art'>
                    <div>
                        {itemDetailState?.ItemInfo?.PriceDisplay ? (<>
                            <p className='box_Art_text'>Price</p>
                            <div className='one'>
                                <p className='box_Art_textTwo'>{CcurrencyState} {parseFloat(CcurrencyPriceState?.toFixed(4))}</p>
                                <select value={CcurrencyState} className='oneBtn' onChange={(e) => currencyState(e, editionstate)}>
                                    <option value="">---</option>
                                    {editionstate?.PhysicalArt ? Object.keys(itemDetailState?.ItemInfo?.PhysicalPrices).map((price, index) => {
                                        let selected = "";
                                        if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                            selected = "ETHER"
                                        } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                            selected = "MATIC"
                                        }
                                        return (
                                            <option selected={selected === price} value={price}>{price}</option>
                                        );
                                    }) : Object.keys(itemDetailState?.ItemInfo?.DigitalPrices).map((price, index) => {

                                        let selected = "";
                                        if (itemDetailState?.ItemInfo?.Currency === "ETH") {
                                            selected = "ETHER"
                                        } else if (itemDetailState?.ItemInfo?.Currency === "MATIC") {
                                            selected = "MATIC"
                                        }
                                        return (
                                            <option selected={selected === price} value={price}>{price}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </>) : (<>

                        </>)}
                    </div>

                    <div className='one'>

                        {props.loginState && sessionStorage.getItem("UserId") === itemDetailState?.ItemInfo?.AuthorId && itemDetailState?.ItemInfo?.ApproveStatus ? (
                            <button disabled={mintLoadint} className='btnOffer' onClick={() => mintItem(itemDetailState?.ItemInfo?.Currency, itemDetailState?.CollectionInfo?.ContractAddress, itemDetailState.ItemInfo?._id, itemDetailState.ItemInfo?.AuthorId)}> {mintLoadint ? <>&nbsp;MINTING.....&nbsp; </> : <>&nbsp;MINT&nbsp;</>} </button>
                        ) : (
                            <button disabled={true} className='btnOffer' title='After Admin approves you can proceed further' > {<>&nbsp;MINT&nbsp;</>} </button>
                        )
                        }
                    </div>
                    <br />
                </div> : null);

        }
    }
    const listNFT = async (contractAddress, id, itemId, edition) => {

        let web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_CONTRACT_ABI), contractAddress);
        let account = await web3.eth.getAccounts();
        try {
            let approve = await contractInstance.methods.putforsale().send({
                from: account[0],
            })
            if (approve) {
                sellitemAPI({
                    "ItemId": itemId,
                    "Edition": edition,
                    "TransactionHash": approve?.transactionHash
                }).then(res => {
                    setAPILoading(false)
                    window.location.replace("/art")
                })
            }
        } catch (error) {
            setAPILoading(false)
            if (error?.code === 4001) {
                toast.warning(error?.message)
            }
        }

    }
    const approveAll = async (chain, contractAddress, id, itemId, edition) => {
        if (!props.isWalletConnected) {
            showErroToast("Please connect wallet");
            return true;
        }
        let web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_CONTRACT_ABI), contractAddress);
        let account = await web3.eth.getAccounts()
        if (props.isWalletConnected) {
            axios.post(`${process.env.REACT_APP_API_URL}/GetNetworkInfo`, {
                "Currency": chain
            }).then(async res => {
                let web3 = new Web3(window.ethereum);
                let chainId = await web3.eth.getChainId();
                if (chainId === res.data?.info?.ChainID) {
                    listNFT(contractAddress, id, itemId, edition)
                } else {
                    switchNetwork(web3.utils.numberToHex(res.data?.info?.ChainID), res.data?.info).then(async switchRes => {
                        if (switchRes) {
                            listNFT(contractAddress, id, itemId, edition)
                        }
                    })
                }
            })
        } else {
            showErroToast("please connect you wallet");
        }

    }
    const validationSchema = Yup.object().shape({
        Offer: Yup.boolean(),
        Bid: Yup.boolean(),
    });

    const formik = useFormik({
        initialValues: {
            directSale: true,
            bidSale: false,
            offerSale: false
        },
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: values => {
            if (!props?.isWalletConnected || !props?.isWalletConnected === undefined) {
                showErroToast("Please connect your wallet");
                navigate("/connect-wallet");
                return;
            }
            if (!values.bidSale && !values.offerSale && !values.directSale) {
                showErroToast("Please select any one of sale type");
                return;
            }
            setAPILoading(true)
            let formValue = {
                Edition: editionstate?.Edition,
                EnableBid: values.bidSale,
                EnableAuction: values.offerSale,
                TimeZone: value.toString(),
                ItemId: itemDetailState?.ItemInfo?._id
            }
            if (values.offerSale) {
                formValue.DateRange = value;
            } else if (values.bidSale) {
                formValue.DateRange = value;
            }
            sellNFTAPI(formValue).then(res => {
                if (res.data.status) {
                    approveAll(itemDetailState?.ItemInfo?.Currency, itemDetailState?.CollectionInfo?.ContractAddress, itemDetailState.ItemInfo?.TokenId, itemDetailState.ItemInfo?._id, editionstate?.Edition).then(res => {
                    })
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
            }).catch(err => {
                setAPILoading(false)
            })
        },
    });
    const validationOfferSchema = Yup.object().shape({
        price: Yup.number().required("Item price is required").test(
            'Is positive?',
            'Price must be greater than 0!',
            (value) => value > 0
        ),
    });
    const formikOffer = useFormik({
        initialValues: {
            price: 0,
            message: ""
        },
        enableReinitialize: true,
        validationSchema: validationOfferSchema,
        onSubmit: values => {
            if (!props?.isWalletConnected || !props?.isWalletConnected === undefined) {
                showErroToast('Please connect your wallet')
                setTimeout(() => {
                    navigate("/connect-wallet");
                }, 1000);
            }
            setAPILoading(true)
            let formValue = {
                Price: values.price,
                ItemId: itemDetailState?.ItemInfo?._id,
                Edition: editionstate?.Edition,
                Message: values.message
            }
            makeOffer(formValue).then(res => {
                if (res.data.status) {
                    setAPILoading(false)
                    showToast(res.data.message);
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
                handleClose()
            }).catch(err => {
                setAPILoading(false)
            })
        },
    });

    const validationPreOfferSchema = Yup.object().shape({
        price: Yup.number().required("Item price is required").test(
            'Is positive?',
            'Price must be greater than 0!',
            (value) => value > 0
        ),
    });
    const formikPreOffer = useFormik({
        initialValues: {
            price: 0,
            message: ""
        },
        enableReinitialize: true,
        validationSchema: validationPreOfferSchema,
        onSubmit: values => {
            if (!props?.isWalletConnected || !props?.isWalletConnected === undefined) {
                showErroToast('Please connect your wallet')
                setTimeout(() => {
                    navigate("/connect-wallet");
                }, 1000);
            }
            setAPILoading(true)
            let formValue = {
                Price: values.price,
                ItemId: itemDetailState?.ItemInfo?._id,
                Edition: editionstate?.Edition,
                Message: values.message
            }
            preOffer(formValue).then(res => {
                if (res.data.status) {
                    showToast(res.data.message);
                } else {
                    setAPILoading(false)
                    showErroToast(res.data.message)
                }
                handlepreOfferClose()
            }).catch(err => {
                setAPILoading(false)
            })
        },
    });

    const validationBidSchema = Yup.object().shape({
        price: Yup.number().required("Item price is required").test(
            'Is positive?',
            'Price must be greater than 0!',
            (value) => value > 0
        ),
    });
    const bid = async (res, amount, formValue) => {
        let web3 = new Web3(window.ethereum);
        let account = await web3.eth.getAccounts()
        const contract = new web3.eth.Contract(JSON.parse(res.data?.info?.MultiAbiArray), res.data?.info?.MultiContract);
        const transactionObject = {
            from: account[0],
            to: res.data?.info?.MultiContract,
            value: web3.utils.toWei(amount.toString(), 'ether'),
            gas: 210000, // Gas limit for a basic Ether transfer                    
        };

        try {
            let transactionHash = await web3.eth.sendTransaction(transactionObject);
            if (transactionHash) {
                BidAPI(formValue).then(res => {
                    if (res.data.status) {
                        getAllItemInfo({
                            ItemId: encodeURIComponent(decryptedItemId)
                        })
                        showToast(res.data.message);
                        setbidLoadint(false)
                    } else {
                        setbidLoadint(false)
                        showErroToast(res.data.message)
                    }
                    handlebidClose()
                }).catch(err => {
                    setbidLoadint(false)
                })
            }

        } catch (error) {
            setbidLoadint(false)
        }
    }
    const bidAmount = async (chain, amount, formValue) => {
        if (!props.isWalletConnected) {
            showErroToast("Please connect wallet");
            return true;
        }
        let web3 = new Web3(window.ethereum);
        let account = await web3.eth.getAccounts()
        if (props.isWalletConnected) {
            axios.post(`${process.env.REACT_APP_API_URL}/GetNetworkInfo`, {
                "Currency": chain
            }).then(async res => {
                let chainId = await web3.eth.getChainId();
                if (chainId === res.data?.info?.ChainID) {
                    bid(res, amount, formValue)
                } else {
                    switchNetwork(web3.utils.numberToHex(res.data?.info?.ChainID), res.data?.info).then((switchRes) => {
                        if (switchRes) {
                            bid(res, amount, formValue)
                        }
                    })
                }

            })
        } else {
            showErroToast("please connect you wallet");
        }
    }
    const formikBid = useFormik({
        initialValues: {
            price: 0,
            message: ""
        },
        enableReinitialize: true,
        validationSchema: validationBidSchema,
        onSubmit: values => {
            if (!props?.isWalletConnected || !props?.isWalletConnected === undefined) {
                showErroToast('Please connect your wallet')
                setTimeout(() => {
                    navigate("/connect-wallet");
                }, 1000);
            }
            setbidLoadint(true)
            let formValue = {
                Edition: editionstate?.Edition,
                Price: values.price,
                ArtworkId: itemDetailState?.ItemInfo?._id,
                Message: values.message
            }
            CheckBidAPI({
                "ArtworkId": itemDetailState?.ItemInfo?._id,
                "Price": Number(values.price),
                "Edition": editionstate?.Edition,
            }).then((res) => {
                if (res.data?.status) {
                    bidAmount(itemDetailState?.ItemInfo?.Currency, values.price, formValue);
                } else {
                    showErroToast(res.data?.message);
                    setbidLoadint(false);
                }
            })
        },
    });

    const [position, setPosition] = useState({ x: 250, y: 70 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 250, y: 70 });
    const [movedState, setMovedState] = useState(true);
    const handleMouseDown = (event) => {
        setMovedState(false);
        setIsDragging(true);
        const offsetX = event.clientX - position.x;
        const offsetY = event.clientY - position.y;
        setDragOffset({ x: offsetX, y: offsetY });
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const newX = event.clientX - dragOffset.x;
            const newY = event.clientY - dragOffset.y;
            setPosition({ x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };
    const socketMint = async (data) => {
        let web3 = new Web3(window.ethereum);
        const contractInstance = new web3.eth.Contract(JSON.parse(process.env.REACT_APP_CONTRACT_ABI), data.contractAddress);
        let account = await web3.eth.getAccounts();
        let TokenId = await contractInstance.methods.lastTokenId().call();
        let typeItems = data?.editiondetails.map((type) => {
            if (type.PhysicalArt) {
                return "Physical";
            } else {
                return "Digital";
            }
        })
        try {
            let mint = await contractInstance.methods.mint(data?.edition, data?.ipfsHash, typeItems, "0x00").send({
                from: account[0]
            });
            if (mint) {
                TokenId = await contractInstance.methods.lastTokenId().call();
                socket.emit("ArtItemPublish", {
                    TokenId,
                    ItemId: encodeURIComponent(decryptedItemId),
                    TransactionHash: mint?.transactionHash
                })
            }
        } catch (error) {
            setmintLoadint(false);
            showErroToast(error?.message)
        }

    }

    useEffect(() => {
        socket.on('connect', () => { });
        socket.on('ArtItemMint', async (data) => {
            if (data?.status) {
                socketMint(data);
            } else {
                setmintLoadint(false)
                showErroToast(data?.message)
            }
        });
        socket.on("ArtItemPublish", async (data) => {
            if (data?.status) {
                showToast(data?.message);
                setmintLoadint(false);
                getAllItemInfo({
                    ItemId: encodeURIComponent(decryptedItemId)
                })
            }
        })
    }, [])
    function inchesToCentimeters(inches) {
        return inches * 2.54;
    }
    function centimetersToInches(centimeters) {
        return centimeters / 2.54;
    }
    const changeSize = (Dim, Hei, Wid, toSize) => {
        setsizeState(toSize)
        if (toSize === 'CM') {
            if (Dim !== toSize) {
                let height = inchesToCentimeters(Hei);
                let width = inchesToCentimeters(Wid);
                setHeightState(height);
                setWidthState(width);
            } else {
                setHeightState(Hei);
                setWidthState(Wid)
            }
        } else if (toSize === "IN") {
            if (Dim !== toSize) {
                let height = centimetersToInches(Hei);
                let width = centimetersToInches(Wid);
                setHeightState(height);
                setWidthState(width)
            } else {
                setHeightState(Hei);
                setWidthState(Wid)
            }
        }
    }
    const renderItems = (quantity) => {
        const renderedItems = [];
        for (let i = 0; i < quantity; i++) {
            renderedItems.push(<option selected={editionstate === i + 1} value={i + 1} key={i}>{i + 1 + '/' + quantity}</option>);
        }
        return renderedItems;
    };
    const [viewRoomState, setViewRoomState] = useState('room image.png')
    const roomPicCahnge = (url) => {
        setViewRoomState(url)
    }
    const selectEdition = (id) => {

        Setccurrency(itemDetailState?.ItemInfo?.Currency)
        document.getElementsByClassName('oneBtn').value = "MATIC";
        itemStatus(itemDetailState?.ItemInfo?.PublishStatus, editionstate?.MarketPlaceStatus, props.loginState)
        itemDetailState?.EditionInfo?.editions.map((edition, index) => {
            if (edition.Edition === Number(id.target.value)) {
                setEditionState(edition);
                SetCcurrencyPriceState(edition?.Price)
                return;
            }
        });
    }
    const divRef = useRef(null);
    const convertINToFeet = (inchValue) => {
        const inches = parseFloat(inchValue);
        const feet = inches / 12;
        return feet; // Round the result to 2 decimal places
    };
    const convertCMToFeet = (cmvalue) => {
        const cm = parseFloat(cmvalue);
        const feet = ((cm * 0.393700) / 12);
        return feet; // Round the result to 2 decimal places
    };
    useEffect(() => {
        const viewRoomDiv = document.getElementById('room-div');

        let sixFeet = viewRoomDiv.offsetWidth / 1.25;
        let itemDimensionWidth = itemDetailState.ItemInfo?.Width;
        let itemDimensionHeight = itemDetailState.ItemInfo?.Height;
        let moovablePicWidthFeet = 0;
        let moovablePicHeightFeet = 0;
        if (itemDetailState?.ItemInfo?.Dimension === "IN") {
            moovablePicWidthFeet = convertINToFeet(itemDimensionWidth)
            moovablePicHeightFeet = convertINToFeet(itemDimensionHeight)
        } else {
            moovablePicWidthFeet = convertCMToFeet(itemDimensionWidth)
            moovablePicHeightFeet = convertCMToFeet(itemDimensionHeight)
        }
        setviewRoomsizeState({
            width: (sixFeet / 12) * moovablePicWidthFeet,
            height: (sixFeet / 12) * moovablePicHeightFeet
        })
    }, [viewRoom]);


    return (
        <div>
            <Container >
                <div className='row'>

                    <div className='col-lg-6'>
                        <img onClick={() => setVisible(true)} src={itemDetailState?.ItemInfo?.Media} className='img-responsive media-img' style={{ width: "100%", height: "700px" }} ></img>
                        <div className='bottomNav'>
                            <ul>
                                <li className={artist === 2 ? "active" : null} value="2" onClick={(e) => setArtist(e.target.value)}>owners</li>
                                <li className={artist === 4 ? "active" : null} value="4" onClick={(e) => setArtist(e.target.value)}>history</li>
                                {itemDetailState?.ItemInfo?.PublishStatus ? <li className={artist === 5 ? "active" : null} value="5" onClick={(e) => setArtist(e.target.value)}>Details</li> : null}
                            </ul>
                        </div>
                        {artist === 2 ? <BidsArt></BidsArt> : null}
                        {artist === 4 ? <HistoryArt></HistoryArt> : null}
                        {artist === 5 ? <DetailsArt></DetailsArt> : null}
                    </div>
                    <div className='col-lg-6'>
                        <div className='row'>
                            <div className='col-12'>
                                <div className='d-flex '>
                                    <div className="col-9">
                                        <div className='secondText'>
                                            <p className='artArtistNameFive'>ARTWORK NAME</p>
                                            <p className='artArtistNameFour'>{itemDetailState?.ItemInfo?.Name}
                                            </p>
                                            <p className='artArtistNameFive'>CHAIN</p>
                                            <p className='artArtistNameFour'>{itemDetailState?.NetworkInfo?.ChainName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
            <div className='view-room-div' style={{ display: viewRoom ? "block" : "none", }}>
                <div className='d-flex justify-content-end'>
                    <button className='btn ' onClick={() => setViewRoom(false)}> X</button>
                </div>
                {movedState ? <p className='text-center'>Picture is movable</p> : null}
                <div ref={divRef} id="room-div" className='room-div'
                    style={{ position: 'relative', backgroundImage: `url('../../assets/${viewRoomState}')` }}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <div onMouseDown={handleMouseDown} id="moovablepic"
                        style={{ position: 'absolute', left: position.x, top: position.y, width: viewRoomsizeState?.width, height: viewRoomsizeState?.height, backgroundImage: `url(${itemDetailState?.ItemInfo?.Media})` }}
                    ></div>
                </div>
                <div className='d-flex room-all-pic justify-content-center'>
                    <img onClick={() => roomPicCahnge('room image.png')} src='../assets/room image.png' width="100px" height="70px" />
                    <img onClick={() => roomPicCahnge('room image 1.jpg')} src='../assets/room image 1.jpg' width="100px" height="70px" />
                    <img onClick={() => roomPicCahnge('room image 2.jpg')} src='../assets/room image 2.jpg' width="100px" height="70px" />
                    <img onClick={() => roomPicCahnge('room image 3.jpg')} src='../assets/room image 3.jpg' width="100px" height="70px" />
                </div>
            </div>
            <Viewer
                visible={visible}
                onClose={() => { setVisible(false); }}
                images={[{ src: itemDetailState?.ItemInfo?.Media, alt: itemDetailState?.ItemInfo?.Media }]}
            />
            {apiLoading ? <LoadingModal text={"Please wait..."} /> : null}
        </div>
    )
}

export default ArtDetails