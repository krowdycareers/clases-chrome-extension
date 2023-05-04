const btnScripting = document.getElementById("btnscript");
const pMessageElement = document.getElementById("mensaje")

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const portActive = chrome.tabs.connect(tab.id, {name: "popup"})

  portActive.onMessage.addListener(function({message}){
    pMessageElement.innerText = JSON.stringify(message, null, 3)
  })

  portActive.postMessage({cmd: "scrap"})
});