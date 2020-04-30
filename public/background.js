console.log("background running");
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([rule1]);
  });
});

var rule1 = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { hostContains: '.' }
        })
      ],
      actions: [ new chrome.declarativeContent.ShowPageAction() ]
    };

chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            console.log('message received on background');
            chrome.runtime.sendMessage(request);
        }
    );
