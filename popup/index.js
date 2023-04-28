const btnScripting = document.getElementById('btnscript')
const pMessageElement = document.getElementById('messaje')

btnScripting.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab) {
    console.error('No se encontró ninguna pestaña activa.')
    return
  }
  const portTabActive = chrome.tabs.connect(tab.id, { name: 'popup' })
  if (!portTabActive) {
    console.error('No se pudo establecer la conexión de mensajes.')
    return
  }
  portTabActive.postMessage({ cmd: 'scrap' })

  portTabActive.onMessage.addListener(function ({ message }) {
    pMessageElement.innerText = JSON.stringify(message, null, 2)
  })
})
