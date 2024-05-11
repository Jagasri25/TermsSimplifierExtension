
import { getCurrentTabUrl, summarizeContent } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const activeTabUrl = await getCurrentTabUrl();
    const summary = await summarizeContent(activeTabUrl);

    const summaryText = document.getElementById("summary-text");
    summaryText.textContent = summary;
  } catch (error) {
    console.error("Error:", error);
  }
});
// Add a button to the popup window that allows users to manually generate a summary of the terms and conditions
const manualSummaryButton = document.getElementById("manual-summary-button");

manualSummaryButton.addEventListener("click", () => {
const summary = prompt("Please enter your own summary of the terms and conditions.");
document.getElementById("summary-text").textContent = summary;
});
