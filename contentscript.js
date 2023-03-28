console.log("Ejecutando el content script 1.0");

function getJobInformation() {
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

  return organizedJobs;
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });
portBackground.postMessage({ message: "finish" });

portBackground.onMessage.addListener(async ({ message }) => {
  if (message === "next page") {
    const nextPageButton = document.querySelector("li[class*='next-']");
    nextPageButton.click();
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "getJobs") {
      const jobs = getJobInformation();
      port.postMessage({ message: "ok", data: jobs });
      portBackground.postMessage({ message: "finish" });
    }
  });
});
