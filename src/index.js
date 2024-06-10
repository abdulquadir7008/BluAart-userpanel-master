import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../src/service/store';

import { Web3ReactProvider } from '@web3-react/core'
import Web3 from 'web3';


function getLibrary(provider) {
  return new Web3(provider)
}

const root = ReactDOM.createRoot(document.getElementById('root'));




root.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <BrowserRouter>
      <Provider store={store}>      
          <App />       
      </Provider>
    </BrowserRouter>
  </Web3ReactProvider>
);


reportWebVitals();
