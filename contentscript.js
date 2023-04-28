function getJobsInformation() {
  const jobElementInformation = [
    ...document.querySelectorAll('div[id*=jobcard]')
  ]

  const jobJsonInformation = jobElementInformation.map((el) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: fecha },
              { innerText: title },
              { innerText: salary }
            ]
          }
        ]
      }
    ] = el.children

    return { url, fecha, title, salary }
  })

  return jobJsonInformation
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd === 'scrap') {
      const jobsInformation = getJobsInformation()
      port.postMessage({ message: jobsInformation })
    }
  })
})
