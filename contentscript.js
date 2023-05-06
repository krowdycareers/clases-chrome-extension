function getJobInformation() {
  const elemCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const jobs = elemCardJobs.map((cardJob) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: fecha },
              { innerText: title },
              { innerText: salario },
              { innerText: beneficios },
              {},
              {
                children: [elementEmpresCiudad],
              },
            ],
          },
        ],
      },
    ] = cardJob.children;

    const empresa = elementEmpresCiudad?.querySelector("label")?.innerText;
    const ciudad = elementEmpresCiudad?.querySelector("p")?.innerText;
    return { url, fecha, title, salario, beneficios, empresa, ciudad };
  });

  return jobs;
}

//Connect to background
const portBackground = chrome.runtime.connect({
  name: "content_script-background",
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener( ({ cmd }) => {
    if (cmd === "scrap") {
      const jobsInformation = getJobInformation();
      const btnNext = document.querySelector("[class*=next]");
      const pageNext = !btnNext.className.includes("disabled");
      portBackground.postMessage({ cmd: "getInfo", jobsInformation, pageNext });
    }
  });
});
