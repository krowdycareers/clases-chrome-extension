const pMessageElement = document.getElementById("message");
const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const portTabActive = chrome.tabs.connect(tab.id, { name: "popup" });

  portTabActive.onMessage.addListener(({message}) => {
    pMessageElement.innerText = JSON.stringify(message,null,2);
  });

    portTabActive.postMessage({ cmd: "scrapt" });

});


