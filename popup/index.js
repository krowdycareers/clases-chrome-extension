const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: jobsScrap,
  });
});

const jobsScrap = () => {
  const arrayJobs = [...document.querySelectorAll("[id*='jobcard-']")];
  const jobs = arrayJobs.map((jobcard) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: salaryRange },
              { innerText: benefits },
              { innerText: description },
              { innerText: company },
            ],
          },
        ],
      },
    ] = jobcard.children;
    return {
      date: date.split("\n")[0],
      title,
      salaryRange,
      benefits: benefits.split("\n"),
      description,
      company: company.split("\n")[0],
      url,
    };
  });
  console.log(jobs);
};
