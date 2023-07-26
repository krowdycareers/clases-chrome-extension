console.log("Ejecutando el content script 1.0");
function scrapJobs() {
  let jobElements = document.querySelectorAll('div[id|="jobcard"]');
  jobElements = [...jobElements];
  const jobs = jobElements.map((card) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              ,
              { innerText: jobTitle },
              { innerText: salary },
              ,
              elementCompanyLocation1,
              elementCompanyLocation2,
            ],
          },
        ],
      },
    ] = card.children;

    const elementCompanyLocation = !elementCompanyLocation1?.querySelector("p")
      ? elementCompanyLocation2
      : elementCompanyLocation1;

    const { innerText: company = null } =
      elementCompanyLocation?.querySelector("label");
    const { innerText: location = null } =
      elementCompanyLocation?.querySelector("p");

    return { url, jobTitle, salary, company, location };
  });

  let information = document.querySelector("#search-success > p");
  information.innerHTML = jobs
    .map(
      (el) => `<a href='${el.url}'><p>${el.jobTitle}</p>
    <p>${el.salary}</p>
    <p>${el.company}</p>
    <p>${el.location}</p>
    </a>`
    )
    .join("");
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd === "scrap-jobs") {
      scrapJobs();
      port.postMessage({ success: true, message: "termino el scrapt" });
    }
  });
});
