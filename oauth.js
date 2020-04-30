// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// variables to store messages from parsed selected text
var startDate;
var endDate;
var selectedText;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('message received by oauth.js');
        if (request.msg === "time parsed") {
            startDate = request.data.start;
            endDate = request.data.end;
            selectedText = request.data.selectedText;
            console.log('start date received: ' + startDate);
            console.log('end date received: ' + endDate);
        }
    }
);
console.log('listener established in oauth.js');


var button = document.getElementById("submitButton");
button.onclick = initAuth;

function initAuth() {
  chrome.identity.getAuthToken({
    interactive: true
  }, useToken);
}

function useToken(token) {
  console.log("OAuth token: " + token);

  // use primary calendar
  // TODO: allow selection of other calendars
  let calendarId = 'primary';

  // payload body for post
  let data = {
    start: {
      dateTime: startDate
    },
    end: {
      dateTime: endDate
    },
    summary: document.getElementById('eventName').value,
    reminders: {
      useDefault: true
    },
    description: selectedText + "\n *Added by There."
  }
  console.log(JSON.stringify(data));

  let init = {
    method: 'post',
    body: JSON.stringify(data),
    async: true,
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    'contentType': 'json'
  };


/*
  var url = new URL('https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events/quickAdd'),
    params = data;
  // TODO: Figure out what this does
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
*/
  fetch(
      'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events',
      init)
    .then((response) => response.json())
    .then(printResponse);
}

function printResponse(data) {
  console.log(data);
  document.getElementById('response').innerHTML = JSON.stringify(data, null, 2);
}
