import React from 'react';

import "../../styles/homepage.css"
import BannerImage from "../../assets/section-one-banner.png"
function Banner() {
    
    return (
        <>

            <img style={{ width: "100%" , height : "602px" }} src={BannerImage} className="img-responsive" alt='banner' />

        </>
    );
}

export default Banner;