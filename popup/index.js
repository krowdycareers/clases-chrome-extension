const btnScripting = document.getElementById("btnscript");
const showMessageInElementP = document.getElementById("message");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const portTabActive = chrome.tabs.connect(tab.id, { name: "popup" });

  portTabActive.onMessage.addListener(({ message }) => {
    showMessageInElementP.innerText = JSON.stringify(message, null, 3);
  });
  portTabActive.postMessage({ command: "scrap" });
});
