console.log("Ejecutando el content script 1.0");

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ cmd }) {
    alert(`${port.name}: message`);
    if (cmd === "scrap-jobs") {
      port.postMessage({ message: "Como estas?" });
    }
  });
});
