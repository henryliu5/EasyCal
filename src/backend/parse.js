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
    //document.getElementById("output").innerHTML = selection[0];
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
    // Parse with compromise.js
    // let doc = nlp(text);
    // let entities = doc.topics();
    // console.log(entities);
    // if (entities.list[0]) {
    //   console.log(entities.list[0].trim().text());
    //   document.getElementById("location").innerHTML = entities.list[0].text();
    // }

    // Update chrono elements
    // console.log(chronoDate);
    // console.log(chronoDate.text);
    let startDate = (chronoDate.start) ? chronoDate.start.date() : "no valid start date";
    // IDEA: Use two passes on selected text, second time remove start text to
    //       check if there are two dates
    let endDate = (chronoDate.end) ? chronoDate.end.date() : startDate;
    console.log("Start: " + chronoDate.start.date());
    console.log("End: " + endDate);
    //document.getElementById("startDate").innerHTML = startDate;
    //document.getElementById("endDate").innerHTML = endDate;

    // IDEA: set event name description using nlp rather than removing time
    // let eventName = text.replace(chronoDate.text, '');
    // for (var entity of entities.list) {
    //   console.log('removing ' + entity);
    //   eventName = eventName.replace(entity.text(), '');
    // }

    // Set event name using entity from compromise.js
    // document.getElementById("event").innerHTML = eventName;
    // document.getElementById("eventName").value = eventName;
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

// protoype for Strings to change to title case (for event name)
String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At',
    'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'
  ];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
      function(txt) {
        return txt.toLowerCase();
      });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
      uppers[i].toUpperCase());

  return str;
}

export default initParse;