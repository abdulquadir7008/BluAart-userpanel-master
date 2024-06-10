import React, { useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import "../../../styles/homepage.css"
function ARTBanner(props) {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [muted, setMuted] = useState({ key1: true });
    const unmuteVideo = () => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            document.getElementById('unmute').style.display = 'none';
            document.getElementById('mute').style.display = 'inline';
        }
    };
    const muteVideo = () => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            document.getElementById('mute').style.display = 'none';
            document.getElementById('unmute').style.display = 'inline';
        }
    };
    const RenderMedia = () => {
        let bannerImage = props.banerimage;
        let mediaFile = bannerImage?.split(".")?.pop();
        switch (mediaFile) {
            case "mp4":
                return <video id="myVideo" ref={videoRef} style={{ width: "100%", height: "500px" }} autoPlay loop muted={true} src={props.banerimage} ></video>
            default:
                return <img style={{ width: "100%", height: "500px" }} src={props.banerimage} className="img-responsive" />;
        }
    }
    const ButtonShow = () => {
        let bannerImage = props.banerimage;
        let mediaFile = bannerImage?.split(".")?.pop();
        switch (mediaFile) {
            case "mp4":
                return (
                    <>
                        <button className='btn unmute banner-mute' id='unmute' onClick={unmuteVideo}><i className="fas fa-volume-mute"></i></button>
                        <button className='btn mute feature-video-mute' id='mute' style={{ display: "none" }} onClick={muteVideo}><i className="fas fa-volume-up"></i></button>
                    </>
                );
            default:
                return null ; 
        }
    }
    
    return (
        <>
            <RenderMedia />
            <ButtonShow/>
        </>
    );
}

export default ARTBanner;