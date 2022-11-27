
try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      var tab = tabs[0];
      var tablink = tab.url;
      if (tablink.indexOf("portal.azure.com") > -1 || tablink.indexOf("console.aws.amazon.com") > -1) {
        chrome.action.setBadgeText({
          text: "On"
        });
      } else chrome.action.setBadgeText({
        text: "Off"
      });


    });
  });

  //ON page change

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {

      //if (changeInfo.url) {
      chrome.scripting.executeScript({
        files: ['contentScript.js'],
        target: { tabId: tab.id }
      });
      //}
    }
  });


} catch (e) {
  //console.log(e);
}
