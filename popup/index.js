const $ = (selector) => document.querySelector(selector);
const btnStart = $('.btn-start');
const controller = $('.btn-controller');
const btnScriptingBackground = $('#btncomunicacionbckg');
const msg = $('#text');
const tbody = $('.tbody');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');

btnStart.addEventListener('click', async () => {
  controller.style.display = 'flex';
  btnStart.disabled = true;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: 'popup' });
  port.postMessage({message: 'getJobs'});
  port.onMessage.addListener( ({ message, data }) => {
    if (message === 'ok') {
      msg.style.display = 'block'
      data.map( elm => {
        let shortTitle = elm.title.length > 18 ? elm.title.substring(0, 18)+'...' : elm.title;
        tbody.innerHTML += `
          <tr>
            <td>${elm.date}</td>
            <td>${shortTitle}</td>
            <td><a href=${elm.url}>link</a></td>
          </tr>
        `
      })
    } 
  });
});

nextBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: 'popup' });
  port.postMessage({message: 'nextPage'});
  port.onMessage.addListener( ({ message, data }) => {
    if (message === 'ok') {
      msg.style.display = 'block'
      data.map( elm => {
        let shortTitle = elm.title.length > 18 ? elm.title.substring(0, 18)+'...' : elm.title;
        tbody.innerHTML += `
          <tr>
            <td>${elm.date}</td>
            <td>${shortTitle}</td>
            <td><a href=${elm.url}>link</a></td>
          </tr>
        `
      })
    } 
  });
});

btnScriptingBackground.addEventListener('click', async () => {
  let port = chrome.runtime.connect({ name: 'popup-background' });
  port.postMessage({ message: 'Hola BD' });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});