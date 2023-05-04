const btnScript = document.getElementById("btnScript");
const messageElement = document.getElementById("messages");

btnScript.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const portTabActive = chrome.tabs.connect(tab.id, { name: 'popup' });

  portTabActive.onMessage.addListener((msg) => {
    let mesage = msg.mesage;
    messageElement.innerText = mesage;
  });
  
  portTabActive.postMessage({cmd:"active"})
});