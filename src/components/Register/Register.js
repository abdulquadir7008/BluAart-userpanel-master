import Banner from '../Homepage/Banner';
import RegisterFrom from "./RegisterFrom";
import { useEffect, useState } from "react";
import RegisterEmailVerification from "./RegisterEmailVerification";
import RegisterSelectUser from "./RegisterSelectUser";
import RegisterAddress from "./RegisterAddress";
import RegisterAgreement from "./RegisterAgreement";
import RegisterKYC from "./RegisterKYC";
import RegisterComplete from "./RegisterComplete";
import { ToastContainer } from 'react-toastify';
import {
    useGetLandingPageQuery
} from './../../service/Apilist'
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '../Loader/LoadingScreen';

function Register(props) {
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
            {props.step === 1 && <RegisterFrom nextStep={props.nextStep} backStep={props.backStep} registerSteps={props.registerSteps} />}
            {props.step === 2 && <RegisterEmailVerification nextStep={props.nextStep} backStep={props.backStep} />}
            {props.step === 3 && <RegisterSelectUser nextStep={props.nextStep} backStep={props.backStep} />}
            {props.step === 4 && <RegisterAddress nextStep={props.nextStep} backStep={props.backStep} />}
            {props.step === 5 && <RegisterAgreement nextStep={props.nextStep} backStep={props.backStep} />}
            {props.step === 6 && <RegisterKYC nextStep={props.nextStep} backStep={props.backStep} />}
            {props.step === 7 && <RegisterComplete nextStep={props.nextStep} backStep={props.backStep} />}

            {apiLoading ? <LoadingScreen/> : null}

        </>
    );
}

export default Register;