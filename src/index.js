/* global chrome */ 
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Popup from './popup';
import initParse from './backend/parse';

initParse();
// Must render once in case there is nothing selected
var defaultStart = toISOLocal(new Date()).slice(0,16);
var defaultEnd = toISOLocal(new Date()).slice(0,16);
ReactDOM.render(
  <Popup startDate={defaultStart} endDate={defaultEnd}/>,
  document.getElementById('root')
);

// Set up listener to receive message from background.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    //console.log('message received on index: ');
    //console.log(request);
    if (request.msg == "time parsed"){
      rerender(request.data.start, request.data.end)
    }
  }
);

// Rerender the popup when the parsed event info gets back
function rerender(requestStart, requestEnd){
  // Request dates will be in ISOString form relative to UTC time
  // Convert back to local time and clip 
  var convertStart = toISOLocal(new Date(requestStart));
  var convertEnd = toISOLocal(new Date(requestEnd));
  ReactDOM.render(
    <Popup startDate={convertStart.slice(0,16)} endDate={convertEnd.slice(0,16)} />,
    document.getElementById('root')
  )
}

// credit RobG @ https://stackoverflow.com/questions/49330139/date-toisostring-but-local-time-instead-of-utc
function toISOLocal(d) {
  var z = n => ('0' + n).slice(-2);
  var zz = n => ('00' + n).slice(-3);
  var off = d.getTimezoneOffset();
  var sign = off < 0 ? '+' : '-';
  off = Math.abs(off);

  return d.getFullYear() + '-'
    + z(d.getMonth() + 1) + '-' +
    z(d.getDate()) + 'T' +
    z(d.getHours()) + ':' +
    z(d.getMinutes()) + ':' +
    z(d.getSeconds()) + '.' +
    zz(d.getMilliseconds()) +
    sign + z(off / 60 | 0) + ':' + z(off % 60);
}
