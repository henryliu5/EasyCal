/* global chrome */ 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Popup from './popup';
import backgroundInit from './backend/background.js'

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);

//document.getElementById('submitButton').innerHTML = "Changed";
//backgroundInit();