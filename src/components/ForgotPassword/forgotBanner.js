import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import "../../styles/homepage.css"
import BannerImage from "../../assets/section-one-banner.png"
function Banner(props) {
    
    return (
        <>

            <img style={{ width: "100%" , height : "602px" }} src={BannerImage} className="img-responsive" />

        </>
    );
}

export default Banner;