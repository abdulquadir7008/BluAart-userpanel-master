import React from 'react';
import "../../styles/LoadingModal.css";

const LoadingModal = (props) => {
    return (
        <div className="loading-modal">
            <div className="loading-content">
                <h6 className="loading-text">{props?.text}</h6>
                <br />                
                <div className='d-flex justify-content-center'>
                    <span className="loading-text">Loading...</span>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        </div>
    );
};

export default LoadingModal;