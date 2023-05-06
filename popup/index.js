const btnScripting = document.getElementById("btncomunicacion");
const pMensaje = document.getElementById("mensajes");

btnScripting.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ cmd: "start" });
  
});
