console.log("Ejecutando el content script 2.0");
const getJobInformation = () => {
  const elemCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  // console.log(elemCardJobs);
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
              { innerText: beneficio },
              {},
              {
                children: [elementEmpresaCiudad],
              },
            ],
          },
        ],
      },
    ] = cardJob.children;
    const empresa = elementEmpresaCiudad?.querySelector("label").innerText;
    const ciudad = elementEmpresaCiudad?.querySelector("label").innerText;
    return { url, fecha, title, salario, beneficio, empresa, ciudad };
  });
  return jobs;
};

//Connect to background

const portBackground = chrome.runtime.connect({ name: "content-background" });

// port.postMessage({ message: "Hola Background" });
portBackground.onMessage.addListener(async ({ message }) => {
  // alert(message);
  // console.log(message);
  if(message === 'nextpage'){
    const nextPageButton = document.querySelector("[class*=next-]")
    nextPageButton.click()
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    // alert(`${port.name}: message`);
    if (message === "getJobs") {
      const jobs = getJobInformation();
      port.postMessage({ message:"ok", data:jobs });
      portBackground.postMessage({ message:"finish"});
    }
  });
});

