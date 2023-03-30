const $ = (selector) => document.querySelector(selector);
const btnStart = $('.btn-start');
const controllers = $('.controllers');
const btnScriptingBackground = $('#btncomunicacionbckg');
const msg = $('#text');
const tbody = $('.tbody');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');

let port;
let jobsData = null;

btnStart.addEventListener('click', async () => {
    controllers.style.display = 'flex';
    btnStart.disabled = true;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    port = chrome.tabs.connect(tab.id, { name: 'popup' });
    port.postMessage({ message: 'getJobs' });
    port.onMessage.addListener(({ message, data }) => {
        if (message === 'ok') {
            msg.style.display = 'block';
            updateJobsTable(data);
        }
    })
});

function updateJobsTable(data) {
    tbody.innerHTML = '';
    data.map(elm => {
        let shortTitle = elm.title.length > 18 ? elm.title.substring(0, 18) + '...' : elm.title;
        tbody.innerHTML += `
      <tr>
        <td>${elm.date}</td>
        <td>${shortTitle}</td>
        <td><a href=${elm.url}>link</a></td>
      </tr>
    `;
    });
}

nextBtn.addEventListener('click', () => {
    port.postMessage({ message: 'nextPage' });
    tbody.innerHTML = 'Cargando...';

    setTimeout(async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        port = chrome.tabs.connect(tab.id, { name: 'popup' });
        port.postMessage({ message: 'getJobs' });
        port.onMessage.addListener(({ message, data }) => {
            if (message === 'ok') {
                msg.style.display = 'block';
                updateJobsTable(data);
            }
        })
    }, 3000);
});

prevBtn.addEventListener('click', () => {
    port.postMessage({ message: 'prevPage' });
    tbody.innerHTML = 'Cargando...';

    setTimeout(async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        port = chrome.tabs.connect(tab.id, { name: 'popup' });
        port.postMessage({ message: 'getJobs' });
        port.onMessage.addListener(({ message, data }) => {
            if (message === 'ok') {
                msg.style.display = 'block';
                updateJobsTable(data);
            }
        })
    }, 3000);
});