function getJobsSummary() {
  const jobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const jobSummary = jobs.map(({ children }) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              {
                children: [{ children: [{ innerText: date }] }]
              },
              { innerText: title },
              { innerText: salaryRange },
              { innerText: utils },
              { innerText: beforeCompany },
              { innerText: afterCompany }
            ]
          }
        ]
      }
    ] = children;
    return {
      url,
      date,
      title,
      salaryRange: salaryRange.split('\n')[0],
      utils: utils.length > 0 ? utils.split('\n') : 'No menciona',
      company: utils.length > 0 ? afterCompany.split('\n\n')[0] : beforeCompany.split('\n\n')[0],
      city: utils.length > 0 ? (!!afterCompany.split('\n\n')[1] ? afterCompany.split('\n\n')[1] : 'No menciona') : (!!beforeCompany.split('\n\n')[1] ? beforeCompany.split('\n\n')[1] : 'No menciona'),
    }
  })
  return jobSummary;
};

console.log('Ejecutando el content script 1.0');

// Connect to background
const portBackground = chrome.runtime.connect({ name: 'content-background' });
portBackground.onMessage.addListener(async ({ message }) => {
  if ((message = 'nextpage')) {
    const nextBtn = document.querySelector('[class*=next-]');
    nextBtn.click();
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async ({ message }) => {
    if (message === 'getJobs') {
      const jobs = getJobsSummary();
      port.postMessage({ message: 'ok', data: jobs });
    } else if (message === 'nextPage') {
      portBackground.postMessage({ message: 'nextPage' });
      await portBackground.onMessage.addListener( ({ message }) => {
        if(message === 'ok') {
          const jobs = getJobsSummary();
          port.postMessage({ message: 'ok', data: jobs });
        }
      })
    }
  });
});