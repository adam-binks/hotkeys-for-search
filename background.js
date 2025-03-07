chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed and Ready!");
});

chrome.commands.onCommand.addListener((command) => {
  let searchURL = "";
  switch (command) {
    case "search1":
      searchURL = "https://www.google.com/search?q=";
      break;
    case "search2":
      searchURL = "https://en.wikipedia.org/wiki/Special:Search/";
      break;
    case "search3":
      searchURL = "https://www.youtube.com/results?search_query=";
      break;
    default:
      return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      let tabId = tabs[0].id;

      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => window.getSelection().toString()  // Get the selected text on the active tab
        },
        (result) => {
          if (result && result[0] && result[0].result) {
            let selectedText = result[0].result;
            let targetURL = searchURL + encodeURIComponent(selectedText);

            chrome.tabs.create({
              url: targetURL,
              active: true
            });
          }
        }
      );
    }
  });
});
