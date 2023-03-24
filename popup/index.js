const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: alertHelloWorld,
  });
});

function alertHelloWorld() {
  const elemCardJobs  =[...document.querySelectorAll('[id*="jobcard-"]')]
  const jobs = elemCardJobs.map((cardJob) =>{
    return {
      url: cardJob.querySelector("a[class*='jobcard-']").href,
      date: cardJob.querySelector("[class*='date-']").textContent,
      title: cardJob.querySelector("h2[class*='text-']").textContent,
      salary: cardJob.querySelector("span[class*='salary-']").textContent,
      country: cardJob.querySelector("p[class*='text-']").textContent
    };
  });

  console.log(jobs);
}