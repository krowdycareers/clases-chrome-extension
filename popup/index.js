const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "hola" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});

<<<<<<< HEAD
function alertHelloWorld() {
  const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];
  const jobs = elemCardJobs.map((job) => {
    console.log(job);
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

  console.log(jobs);
}


// mi versión
// function alertHelloWorld() {
//   const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];

//   const jobs = elemCardJobs.map((job) => {
//     const currentDate = job.querySelector("label[class*='date-']").innerText;
//     const currentTitle = job.querySelector("h2").innerText;
//     const currentSalary = job.querySelector("span[class*='salary-']").innerText;
//     const currentcompanyName = job.querySelector("div[style='flex:1'] label").innerText;
//     const currentCityAndState = job.querySelector("div[style='flex:1'] p").innerText;
//     const currentBenefits = [...job.querySelectorAll("li[class*='li-']")];

//     const benefitsText =
//       (currentBenefits.length > 0)
//         ? currentBenefits.reduce((acc, benefit) => {
//             acc.push(benefit.innerText);
//             return acc;
//           }, [])
//         : "Sin Beneficios";

//     return {
//       date: currentDate,
//       title: currentTitle,
//       salary: currentSalary,
//       benefits: benefitsText,
//       location: currentCityAndState,
//       company: currentcompanyName,
//     };
//   });

//   console.log(jobs);
// }
=======
btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});
>>>>>>> ad5ec94cd7b5ad0fb783e44dcc77388f80689647
