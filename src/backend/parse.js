/* globals chrome */
var chrono = require('chrono-node');
const nlp = require('compromise')
const nlp_sentences = require('compromise-sentences')
nlp.default.extend(nlp_sentences.default) 


// Gets selection information
function initParse() {
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
  let startDate = new Date();
  let endDate = new Date();
  
  // Check if chrono does not find date
  if (chronoDate) {
    if(chronoDate.start){
      startDate = chronoDate.start.date();
    }
    if(chronoDate.end){
      endDate = chronoDate.end.date();
    } 
  } else {
    console.log("No valid dates found");
  }
  if(!chronoDate.end){
    endDate = new Date(startDate);
    endDate.setMinutes(startDate.getMinutes() + 30);
  }

  // CompromiseJS to get topics
  let doc = nlp.default(text);
  console.log("Topics: " + doc.topics().json());
  var subjects = ""
  try{
    subjects = doc.sentences().sentences().json()[0].subject.text;
  } catch{
    console.log("No subjects found")
  }
  
  console.log("Subjects: " + subjects);
  console.log("Start: " + startDate);
  console.log("End: " + endDate);

  chrome.runtime.sendMessage({
    msg: "time parsed",
    data: {
      start: startDate,
      end: endDate,
      eventName: subjects
    }
  });

}

export default initParse;