import React, { useState, useRef, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "react-multi-carousel/lib/styles.css";
import {
    useGetLandingPageQuery,   
    useGetPageInfoMutation
} from "../../../service/Apilist";

import LoadingScreen from '../../Loader/LoadingScreen';

function Terms() {

    

    

    let navigate = useNavigate()
    
    const getlaningpage = useGetLandingPageQuery();
    const [ getPageinfoAPI , resGetPageinfoAPI ] = useGetPageInfoMutation();
    const [ termsState , setTermsState ] = useState("");
    

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
            setTermsState(resGetPageinfoAPI?.data?.info)
        }
    }, [resGetPageinfoAPI])
    useEffect(() => {
        getPageinfoAPI({
            Page: "Terms"
          })
    },[])

   
    

    return (
        <>

            <section>
                <div className='heading-section-ms'>
                    <h1>Terms & Conditions</h1>
                </div>
            </section>
            <section className='news-section'>
                <Container className=''>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="news-middle-section">
                                {resGetPageinfoAPI.isLoading ? "Loading" : <div className='news-content' dangerouslySetInnerHTML={{__html : termsState}}></div> } <div className='news-content' dangerouslySetInnerHTML={{__html : termsState}}></div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {apiLoading ? <LoadingScreen/> : null}

       
        </>

    );

}

export default Terms;