// Listen for tab updates (e.g., when a new page is loaded)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (tab.url && tab.url.startsWith('http')) {
      // Execute the content script to check if terms and conditions are present
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: containTermsAndConditions,
      });
    }
  }
});

// Function to check if terms and conditions are present
function containTermsAndConditions() {
  const termsKeywords = ["terms and conditions", "terms of use", "terms of service", "terms", "T&C", "terms and conditions of use"];
  const pageText = document.body.textContent.toLowerCase();
  const tokens = pageText.split(/\s+/);

  // Check if any of the terms keywords are present in the page content
  const containsTerms = termsKeywords.some(keyword => tokens.includes(keyword));

  // Send a message to the extension background indicating whether terms were found
  chrome.runtime.sendMessage({ containsTerms: containsTerms });
}
