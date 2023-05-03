console.log("se esta ejecutando el javascript")

async function getJobInformation() {
  const pagesNumber = 6
  const url = 'https://www.occ.com.mx/empleos/?page='
  const urlArray = Array(pagesNumber).fill(url)

  const promisesFetch = urlArray.map((url, index) => fetch(url + (index + 1))
    .then(res => res.text())
    .then(html => {
      const dom = new DOMParser();
      const doc = dom.parseFromString(html, 'text/html');

      let jobElementInformation = doc.querySelectorAll('div[id*=jobcard]')
      jobElementInformation = [...jobElementInformation]

      const jobJsonInformationPage = jobElementInformation.map(el => {
        const [{ href: url }, { children: [{ children: [{ innerText: fecha }, { innerText: title }, { innerText: salary }] }] }] = el.children
        return { url, fecha, title, salary }
      })
      return jobJsonInformationPage
    })
  )

  const promisesFetchResults = await Promise.all(promisesFetch)
  const jobsObjectDateFilter = promisesFetchResults.reduce((acc, curr) => acc = [...acc, ...curr], [])
    .reduce((acc, curr) => {
      const key = curr.fecha
      if (!acc[key]) acc[key] = []
      acc[key].push(curr)
      return acc;
    }, {})
  const jobsArrayFilter = Object.entries(jobsObjectDateFilter).map(([fecha, empleos]) => ({ fecha, empleos }))
    // console.log(jobsArrayFilter);
    .map(({ fecha, empleos }) => ({
      fecha,
      rango: empleos.reduce((acc, { salary, title, url }) => {
        const key = salary
        if (!acc[key]) acc[key] = []
        acc[key].push({ title, url })
        return acc
      }, {})
    }))
  return jobsArrayFilter
}


chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd == "scrap") {
      getJobInformation().then(result =>
        port.postMessage({ message: result }))
        .catch(error => console.log(error))
    }
  })
})
