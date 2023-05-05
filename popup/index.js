const btnScripting = document.getElementById("btnscript");
const pMessageElement = document.getElementById("mensaje")

btnScripting.addEventListener("click", async () => {
  let port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ cmd: "start" });
});


