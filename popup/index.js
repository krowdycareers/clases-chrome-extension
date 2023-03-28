const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "hola" });
  port.onMessage.addListener(function ({ message }) {
    // if(message === "ok")
    alert(message);
  });
});

btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});
