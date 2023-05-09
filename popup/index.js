const btnScripting = document.getElementById("btnscript");
const pMessageElement = document.getElementById("mensaje");

// btnScripting.addEventListener("click", async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   // chrome.scripting.executeScript({
//   //   target: { tabId: tab.id },
//   //   func: alertHelloWorld,
//   // });

//   const portTabActive = chrome.tabs.connect(tab.id, { name: "popup" });

//   // portTabActive.postMessage({ message: "Extensión ejecutándose" });
//   portTabActive.postMessage({ cmd: "scrap" });
//   portTabActive.onMessage.addListener(function (message) {
//     pMessageElement.innerHTML = JSON.stringify(message, null, 3);
//   });
// });

//

btnScripting.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ cmd: "start" });
});
