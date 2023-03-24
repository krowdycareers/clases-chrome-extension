const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: alertHelloWorld,
  });
});

// function alertHelloWorld() {
//   const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];
//   const jobs = elemCardJobs.map((job) => {
//     console.log(job)
//     const [
//       { href: url },
//       {
//         children: [
//           {
//             children: [{ innerText: fecha }, { innerText: title }],
//           },
//         ],
//       },
//     ] = job.children;

//     return { url, fecha, title };
//   });

//   console.log(jobs);
// }

function alertHelloWorld() {
  const elemCardJobs = [...document.querySelectorAll("[id*='jobcard-']")];

  const jobs = elemCardJobs.map((job) => {
    const currentDate = job.querySelector("label[class*='date-']").innerText;
    const currentTitle = job.querySelector("h2").innerText;
    const currentSalary = job.querySelector("span[class*='salary-']").innerText;
    const currentcompanyName = job.querySelector("div[style='flex:1'] label").innerText;
    const currentCityAndState = job.querySelector("div[style='flex:1'] p").innerText;
    const currentBenefits = [...job.querySelectorAll("li[class*='li-']")];


    const benefitsText =
      (currentBenefits.length > 0)
        ? currentBenefits.reduce((acc, benefit) => {
            acc.push(benefit.innerText);
            return acc;
          }, [])
        : "Sin Beneficios";

    return {
      date: currentDate,
      title: currentTitle,
      salary: currentSalary,
      benefits: benefitsText,
      location: currentCityAndState,
      company: currentcompanyName,
    };
  });

  console.log(jobs);
}
