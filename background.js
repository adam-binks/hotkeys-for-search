chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed and Ready!")
})

// URL detection that accepts both full URLs (with protocol) and domain-based URLs
function isDefinitelyUrl(text) {
  const trimmedText = text.trim()
  // Matches either:
  // 1. Full URLs starting with http:// or https://
  // 2. Domain-based URLs like docs.example.com/page
  const urlPattern =
    /^(https?:\/\/)?[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+(?:\/.*)?$/
  return urlPattern.test(trimmedText)
}

chrome.commands.onCommand.addListener((command) => {
  let searchURL = ""
  switch (command) {
    case "search1":
      searchURL = "https://www.google.com/search?q="
      break
    case "search2":
      searchURL = "https://en.wikipedia.org/wiki/Special:Search/"
      break
    case "search3":
      searchURL = "https://scholar.google.com/scholar?q="
      break
    default:
      return
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      let tabId = tabs[0].id

      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: () => window.getSelection().toString(), // Get the selected text on the active tab
        },
        (result) => {
          if (result && result[0] && result[0].result) {
            let selectedText = result[0].result.trim()

            // If the selected text is definitely a URL, open it directly
            if (isDefinitelyUrl(selectedText)) {
              // Add https:// if the URL doesn't have a protocol
              const urlToOpen = selectedText.startsWith("http")
                ? selectedText
                : `https://${selectedText}`
              chrome.tabs.create({
                url: urlToOpen,
                active: true,
              })
              return
            }

            // Otherwise, proceed with search
            let targetURL = searchURL + encodeURIComponent(selectedText)
            chrome.tabs.create({
              url: targetURL,
              active: true,
            })
          }
        }
      )
    }
  })
})
