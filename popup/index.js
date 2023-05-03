const btnScripting = document.getElementById("btnscript");
const TEMPLATE_CONTAINER = document.getElementById("information");
const TEMPLATE_TITLES = document.getElementById("information__titles");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  const portTabActive = chrome.tabs.connect(tab.id, {name: 'popup'});

  portTabActive.onMessage.addListener(function ({message}) {
    TEMPLATE_TITLES.style.display = 'flex';
    TEMPLATE_CONTAINER.insertAdjacentHTML('beforeend', message);
  })
  portTabActive.postMessage({cmd: 'scrap'});
});
