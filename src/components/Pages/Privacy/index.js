import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';

import "react-multi-carousel/lib/styles.css";
import { useGetLandingPageQuery, useGetPageInfoMutation } from "../../../service/Apilist";

import LoadingScreen from '../../Loader/LoadingScreen';
function Privacy() {

    

    

   
    
    const [getPageinfoAPI, resGetPageinfoAPI] = useGetPageInfoMutation();
    const [privacyState, setprivacyState] = useState("");
    const getlaningpage = useGetLandingPageQuery();
    

    const [landpageState, setLandpageState] = useState();
    const [artistState, setartistState] = useState([]);
   
    const [apiLoading, setAPILoading] = useState(false);

    useEffect(() => {
        setAPILoading(true)
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
            setartistState(getlaningpage.data?.artistinfo);
            setAPILoading(false)
        }
    }, [getlaningpage])
    useEffect(() => {
        if (resGetPageinfoAPI.status === "fulfilled") {
            setprivacyState(resGetPageinfoAPI?.data?.info)
        }
    }, [resGetPageinfoAPI])
    useEffect(() => {
        getPageinfoAPI({
            Page: "Privacy"
        })
    }, [])

   
    
   
    
    return (
        <>

            <section>
                <div className='heading-section-ms'>
                    <h1>Privacy Policy</h1>
                </div>
            </section>
            <section className='news-section'>
                <Container className=''>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="news-middle-section">
                                {resGetPageinfoAPI.isLoading ? "Loading" : <div className='news-content' dangerouslySetInnerHTML={{ __html: privacyState }}></div>}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {apiLoading ? <LoadingScreen/> : null}

        </>

    );

}

export default Privacy;