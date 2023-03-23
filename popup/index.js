const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: filterJobs,
  });
});

function filterJobs() {
  const arrayJobs = [...document.querySelectorAll("[id^='jobcard-']")];
  const organizedJobs = arrayJobs.map((job) => {
    return {
      date: job.querySelector("label[class*='text-0-2-82']")?.innerText,
      title: job.querySelector("h2[class*='text-0-2-82']")?.innerText,
      salaryRange: job.querySelector("span[class*='text-0-2-82']")?.innerText,
      workplace: job.querySelector("p[class*='text-0-2-82']")?.innerText,
      employer:
        job.querySelector("a[class*='locContainer-0-2-565']")?.innerText ??
        "Empresa confidencial",
    };
  });

  console.log(organizedJobs);
}
