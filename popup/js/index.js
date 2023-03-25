const btnScripting = document.getElementById("btnscript");
const textData = document.getElementById("textData");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "getJobsData" });
  port.onMessage.addListener(function ({ message, data }) {
    if (message === "ok") textData.innerText = JSON.stringify(data, null, 2);
  });
});
