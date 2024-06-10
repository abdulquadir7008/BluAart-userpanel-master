import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import "../../styles/homepage.css"
function Banner(props) {
    return (
        <>

            <img style={{ width: "100%" }} src={props?.BannerImage} className="img-responsive" />

        </>
    );
}

export default Banner;