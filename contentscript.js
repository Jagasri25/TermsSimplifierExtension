chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.containsTerms) {
    const summary = extractKeyPoints(document.body.textContent);
    sendResponse({summary: summary});
  }
});
  // Import the NLTK library
  const nltk = require("nltk");
  function extractKeyPoints(termsAndConditions) {
    console.log("extracting key points....");
    const keyPoints = [];
    const keywords = nltk.word_tokenize(termsAndConditions);
    const stopWords = ["a", "an", "the", "and", "or", "but", "if", "of", "for"];
    keywords = keywords.filter(keyword => !stopWords.includes(keyword));
    const matches = termsAndConditions.match(new RegExp("(" + keywords.join("|") + ")", "gi"));
    const mostCommonKeywords = nltk.FreqDist(keywords).most_common(5);
    return mostCommonKeywords.map(keyword => keyword[0]);
  
    if (matches) {
      for (let i = 0; i < matches.length; i++) {
        keyPoints.push(matches[i]);
      }
    }
  
    return keyPoints.join(", ");
  }
  
  function updateSummary(summary) {
    const summaryText = document.getElementById("summary-text");
    summaryText.textContent = summary;
  }
  
  function handleButtonClick() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentTab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: currentTab.id },
          function: extractKeyPoints,
        },
        function (result) {
          const keyPoints = result[0].result;
          updateSummary(keyPoints);
        }
      );
    });
  }
  