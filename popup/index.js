const btnScripting = document.getElementById("btnscript");
const pMessageElement = document.getElementById("mensaje");

btnScripting.addEventListener("click", async () => {

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const portTabActive = chrome.tabs.connect(tab.id, {name: 'popup'});

  portTabActive.postMessage({cmd: 'scrap'});

  portTabActive.onMessage.addListener(({message}) => {
    pMessageElement.innerText = JSON.stringify(message, null, '\t');
  });
});


