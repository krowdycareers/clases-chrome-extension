const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: jobsScraping,
  });
});

const jobsScraping = () => {
  alert("Jobs scraped!");
  let cardsJobs = Array.from(document.querySelectorAll("[id*='jobcard-']"));
  const jobs = cardsJobs.map((cardJob) => {
    return {
      date: cardJob.querySelector("[class*='date-']").textContent,
      title: cardJob.querySelector("h2").textContent,
      salary: cardJob.querySelector("[class*='salary-']").textContent,
      benefits: {
        ...Array.from(cardJob.querySelectorAll("ul")).map((ul) =>
          Array.from(ul.querySelectorAll("li"), (li) => li.textContent)
        ),
      },
      description: cardJob.querySelector("[class*='descriptionText-']")
        .textContent,
      company: cardJob.querySelector("[class*='linkContainer-']").textContent,
      city: cardJob.querySelector("[class*='zonesLinks-']").textContent,
      url: cardJob.querySelector("a[class*='jobcard-']").getAttribute("href"),
    };
  });
  console.table(jobs);
};
