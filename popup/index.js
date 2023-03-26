const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getSummaryJobs,
  });
});

function getSummaryJobs() {
  const jobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const summaryJob = jobs.map(({ children }) => {
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
  console.log(summaryJob);
};
