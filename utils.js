export async function getCurrentTabUrl() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0) {
          resolve(tabs[0].url);
        } else {
          reject(new Error("Unable to get active tab URL."));
        }
      });
    });
  }
  
  export async function summarizeContent(url) {
    return new Promise((resolve, reject) => {
      // Send a message to the content script to retrieve terms and conditions content
      chrome.scripting.executeScript({
        target: { tabId: getCurrentTabUrl },
        function: getContentFromPage, // Your function to extract terms and conditions content
      }, async function (result) {
        const termsAndConditions = result[0].result;
        if (termsAndConditions) {
          // Process termsAndConditions to extract key points and generate a summary
          const keyPoints = extractKeyPoints(termsAndConditions);
          resolve(keyPoints);
        } else {
          reject(new Error("Terms and conditions content not found."));
        }
      });
    });
  }
  
  function extractKeyPoints(termsAndConditions) {
    // Your summarization logic to extract key points
    // For demonstration purposes, let's return a dummy summary
    const keywords = ["privacy", "security", "data", "consent"];
    const matches = termsAndConditions.match(new RegExp("(" + keywords.join("|") + ")", "gi"));
    if (matches) {
      return matches.join(", ");
    } else {
      return "No key points found.";
    }
  }
  
  function getContentFromPage() {
    // Inject a script into the active tab to interact with the page
    chrome.scripting.executeScript(
      {
        function: function () {
          // Your real-time interaction logic goes here
          // For example, you can manipulate the DOM to extract terms and conditions content
          const termsAndConditionsElement = document.getElementById('terms-and-conditions');
          if (termsAndConditionsElement) {
            return termsAndConditionsElement.textContent;
          } else {
            return null;
          }
        },
      },
      function (result) {
        // Handle the result of the executed script
        const termsAndConditions = result[0].result;
  
        // Perform summarization logic using the extracted content
        const summarizedContent = extractKeyPoints(termsAndConditions);
  
        // Send the summarized content back to the extension
        chrome.runtime.sendMessage({ summarizedContent: summarizedContent });
      }
    );
  }
  
  
  