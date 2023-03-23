const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: alertHelloWorld,
  });
});

function alertHelloWorld() {
  const elemCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const jobElement = elemCardJobs.map((cardjob) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              {
                children: [
                  {
                    children: [
                      {
                        children: [{ innerText: fecha }],
                      },
                    ],
                  },
                ],
              },
              { innerText: titulo }
            ],
          },
        ],
      },
    ] = cardjob.children;
    salario = cardjob.querySelector("[class*='salary-']").textContent;
    beneficios = [...cardjob.querySelectorAll("li")].map((Elementli) => Elementli.textContent);
    empresaDescripcion = cardjob.querySelector("[class*='descriptionText-']").textContent;
    empresaNombre = cardjob.querySelector("[class*='linkContainer-']").textContent;
    return {
      url,
      fecha,
      titulo,
      salario,
      empresaDescripcion,
      empresaNombre,
      beneficios
    };
  });
  console.log(jobElement);
}
