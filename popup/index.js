const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getJobs,
  });
});

function getJobs() {
  const jobCards = [...document.querySelectorAll('[id*="jobcard-"]')];

  const jobsInfo = jobCards.map((jobCard) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: salaryRange },
              { innerText: description = null } = {}, // tal vez no esta presente
              {},
              {
                children: [companyAndLocation],
              },
            ],
          },
        ],
      },
    ] = jobCard.children;

    const company = companyAndLocation?.querySelector("label")?.innerText;
    const location = companyAndLocation?.querySelector("p")?.innerText;

    return { url, date, title, salaryRange, description, company, location };
  });

  console.log(jobsInfo);
  return jobsInfo;
}
