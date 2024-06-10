import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../../styles/Collection.css"
import { useGetMetamaskVideoQuery } from '../../service/Apilist';
import metamask from "../../assets/MetaMask_Fox.svg";

function Collections(props) {
    let navigate = useNavigate();
    let getmetamaskVideoInfo = useGetMetamaskVideoQuery()
    const [metamaskVideoState, setMetamaskVideoState] = useState();
    const [metamaskaddNetworkVideoState, setMetamaskaddNetworkVideoState] = useState();
    useEffect(() => {
        if (getmetamaskVideoInfo?.status === "fulfilled") {
            setMetamaskVideoState(getmetamaskVideoInfo?.data?.Info[0]?.Metamask);
            setMetamaskaddNetworkVideoState(getmetamaskVideoInfo?.data?.Info[0]?.Metamasketh)
        }
    }, [getmetamaskVideoInfo?.status])
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-lg-6 offset-lg-3'>
                    <br />
                    <br />
                    <div onClick={props.connectWallet}
                        className={`wallet-connect d-flex ${props.isApiProcessing ? 'disabled' : ''}`}
                        style={{
                            borderColor: props.isApiProcessing ? '#b6aaaa' : 'initial', // Use 'initial' for the regular border color
                        }}
                    >
                        <img src={metamask} alt="Metamask" />
                        <h1 className={`${props.isApiProcessing ? 'dimmed' : ""}`}>Click to Connect your Metamask Wallet</h1>
                    </div>
                    <br />
                    <br />
                    <a href={metamaskaddNetworkVideoState} target="_blank" className='wallet-connect-demo'><i>Click Here for Watching Video on How to Make Metamask Wallet</i></a>
                    <br />
                    <br />
                    <a href={metamaskVideoState} target="_blank" className='wallet-connect-demo'><i>Click Here for Watching Video on How to Add Polygon network in Metamask Wallet</i></a>
                </div>
            </div>
        </div>
    );
}

export default Collections;