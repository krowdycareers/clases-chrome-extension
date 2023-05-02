const btnScrapData = document.getElementById('btn-scrap-data')
const btnShowData = document.getElementById('btn-show-data')
const messageElement = document.getElementById('message')

async function connectToActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  return chrome.tabs.connect(tab.id, { name: 'popup' })
}

async function scrapeData() {
  const portActiveTab = await connectToActiveTab()
  portActiveTab.postMessage({ cmd: 'scrap' })
}

async function showData() {
  const portActiveTab = await connectToActiveTab()
  portActiveTab.onMessage.addListener(({ message }) => {
    messageElement.innerText = JSON.stringify(message, null, 2)
  })
  portActiveTab.postMessage({ cmd: 'show' })
}

btnScrapData.addEventListener('click', scrapeData)
btnShowData.addEventListener('click', showData)
