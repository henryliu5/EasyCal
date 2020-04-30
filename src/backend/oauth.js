// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/* globals chrome */

// variables to store messages from parsed selected text
var startDate;
var endDate;
var selectedText;

// Makes API request to upload calendar information
function submit(eventName) {
  // Need to switch back to JS date object format, Date will correctly assume the local time zone
  startDate = new Date(document.getElementById('startDate').getAttribute("value"));
  endDate = new Date(document.getElementById('endDate').getAttribute("value"));
  selectedText = eventName;
  console.log(`Event start date: ${startDate}`);
  console.log(`Event end date: ${endDate}`);
  console.log(`Event desc.: ${selectedText}`);
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
      dateTime: startDate,
    },
    end: {
      dateTime: endDate,
    },
    summary: selectedText,
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
  //document.getElementById('response').innerHTML = JSON.stringify(data, null, 2);
}

export default submit;