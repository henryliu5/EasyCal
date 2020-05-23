/* globals chrome */
var chrono = require('chrono-node');
var nlp = require('compromise');

// Gets selection information
function initParse(){
  chrome.tabs.executeScript({
    code: "window.getSelection().toString();"
  }, getSelection);
}

// Callback function for parsing selection information
function getSelection(selection) {
  if (selection != "") {
    console.log("Selected text:" + selection[0]);
    buildDate(selection[0]);
  } else {
    // handle if there is no selection
    console.log("no valid selection");
  }
}

function buildDate(text) {
  // Use chrono to parse selected text
  var chronoDate = chrono.parse(text)[0];
  // Check if chrono does not find date
  if (chronoDate) {
    let startDate = (chronoDate.start) ? chronoDate.start.date() : "no valid start date";
    let endDate = (chronoDate.end) ? chronoDate.end.date() : startDate;
    console.log("Start: " + chronoDate.start.date());
    console.log("End: " + endDate);

    chrome.runtime.sendMessage({
      msg: "time parsed",
      data: {
        start: startDate,
        end: endDate,
        selectedText: "test fixed text"
      }
    });

  } else {
    console.log("Date object creation failed: no valid dates found");
  }

}

export default initParse;