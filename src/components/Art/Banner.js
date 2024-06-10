import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import "../../styles/homepage.css"
import BannerImage from "../../assets/art/resized-t-q-GOPvKYn26F4-unsplash 1.png"
function Banner(props) {
    return (
        <>

            <img style={{ width: "100%" }} src={props?.BannerImage} className="img-responsive" />

        </>
    );
}

export default Banner;