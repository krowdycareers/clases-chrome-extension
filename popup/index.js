const btnScripting = document.getElementById('btnscript')
const pMessageElement = document.getElementById('messaje')
const numberOfPages = document.getElementById('inputNumberPages')
const containerDate = document.getElementById('containerDate')
const containerSalary = document.getElementById('containerSalary')
const inputs = document.getElementsByName('inputsContainer')

let num = 0
btnScripting.disabled = true
numberOfPages.addEventListener('change', (e) => {
  num = parseInt(e.target.value)

  if (num > 0 && num <= 6) btnScripting.disabled = false
  else btnScripting.disabled = true
})

btnScripting.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true
  })

  if (!tab) {
    console.error('No se encontró ninguna pestaña activa.')
    return
  }

  const portTabActive = await chrome.tabs.connect(tab.id, { name: 'popup' })

  if (!portTabActive) {
    console.error('No se pudo establecer la conexión de mensajes.')
    return
  }

  portTabActive.postMessage({
    cmd: 'scrap',
    number: num
  })

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, a) {
    console.log('hola onUpdate')
    if (changeInfo.status === 'complete') {
      portTabActive.postMessage({ cmd: 'scrap' })
    }
  })

  portTabActive.onMessage.addListener(function ({ message }) {
    containerSalary.innerHTML = message.salary
    containerDate.innerHTML = message.date
  })
})

inputs.forEach((u) => {
  u.addEventListener('change', (e) => {
    const { value } = e.target

    if (value === 'date') {
      containerSalary.style.display = 'none'
      containerDate.style.display = 'block'
    } else {
      containerSalary.style.display = 'block'
      containerDate.style.display = 'none'
    }
  })
})
