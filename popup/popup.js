const btnScript = document.querySelector('#btnScript');
const showData = document.querySelector('#showData');

btnScript.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const portTabActive = chrome.tabs.connect(tab.id, { name: 'popup' });

  portTabActive.onMessage.addListener((msg) => {
    let mesage = msg.mesage;
    showData.innerText = mesage;
  });

  portTabActive.postMessage({ cmd: 'active' });
});
