const btnScripting = document.getElementById("btnscript");
const pMessageElement = document.getElementById("mensaje");

btnScripting.addEventListener("click", async () => {
  // const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  // const portTabActive = chrome.tabs.connect(tab.id, { name: "popup" });
  // portTabActive.onMessage.addListener(function(message) {
  //   pMessageElement.innerText = JSON.stringify(message,null,2)
  // });
  // portTabActive.postMessage({ cmd: "scrapt" });
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ cmd: "start" });
  // port.onMessage.addListener(function ({ message }) {
  //   alert(message);
  // });
});
