console.log("Ejecutando el content script 1.0");

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    alert(`${port.name}: message`);
    if (message === "hola") port.postMessage({ message: "Como estas?" });
  });
});

//Connect to background
const port = chrome.runtime.connect({ name: "content-background" });
port.postMessage({ message: "Hola Background" });
port.onMessage.addListener(async ({ message }) => {
  alert(message);
});
