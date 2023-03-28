console.log("Ejecutando el content script 2.0");

function getJobInformation() {
  const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];
  const jobs = elemCardJobs.map((job) => {
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
                children: [elementEmpresaCiudad]
              }
            ],
          },
        ],
      },
    ] = job.children;

    const empresa = elementEmpresaCiudad?.querySelector("label")?.innerText;
    const ciudad = elementEmpresaCiudad?.querySelector("p")?.innerText;

    return { url, fecha, title, salario, beneficios, empresa, ciudad };
  });

  return jobs
}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.onMessage.addListener(async ({ message }) => {
  if (message === "nextpage") {
    const nextPageButton = document.querySelector("[class*=next-]")
    nextPageButton.click()
  }
});

//Connect from popup
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    // alert(`${port.name}: ${message}`);
    // console.log(message)
    // if (message === "hola") port.postMessage({ message: "Como estas?" });

    if (message = "getJobs") {
      const jobs = getJobInformation()
      port.postMessage({message: "ok", data: jobs})
      portBackground.postMessage({ message: "finish" });
    }
  });
});




