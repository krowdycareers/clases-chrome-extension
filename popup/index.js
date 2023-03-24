const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: alertHelloWorld,
  });
});

function alertHelloWorld() {
  // alert("Hello World");
  let getJobs = [...document.querySelectorAll('[id*="jobcard-"]')]
  const jobs = getJobs.map((jobcard) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: rangeSalary },
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
      rangeSalary,
      benefits: benefits.split("\n"),
      description,
      company: company.split("\n")[0],
      url,
    };
  });
  console.log(jobs);
};
