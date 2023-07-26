const btnScrap = document.getElementById("btn-scrap");

btnScrap.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ cmd: "scrap-jobs" });
  port.onMessage.addListener(function ({ success, message }) {
    if (success) alert(message);
  });
});
