import Banner from '../Homepage/Banner';
import { useEffect, useState, useContext } from "react";
import { ToastContainer } from 'react-toastify';
import {
    useGetLandingPageQuery
} from './../../service/Apilist'
import { useNavigate } from 'react-router-dom';
import LoginForm from './Login';
import LoadingScreen from '../Loader/LoadingScreen';
function LoginScreen(props) {
    let navigate = useNavigate()
    const getlaningpage = useGetLandingPageQuery();
    const [landpageState, setLandpageState] = useState();
    const [apiLoading, setAPILoading] = useState(false);

    useEffect(() => {
        setAPILoading(true)
        if (getlaningpage.status === "fulfilled") {
            setLandpageState(getlaningpage.data?.info[0]);
            setAPILoading(false);
        }
    }, [getlaningpage])
    if (props?.loginState) {
        navigate("/")
    }
    return (
        <>
            <ToastContainer />
            <div className='landing-banner-ps'>
                <Banner banerimage={landpageState?.Section1Image} />
            </div>
            
            <LoginForm  LoginFunction={props.LoginFunction} registerSteps={props.registerSteps}/>

            {apiLoading ? <LoadingScreen/> : null}

        </>
    );
}

export default LoginScreen;