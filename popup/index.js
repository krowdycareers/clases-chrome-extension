
const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapping,
  });
});

function scrapping() {

  const cardContent = document.querySelectorAll('[class*="cardContent-"]');

  const jobs = [...cardContent]

  const infoJobs = jobs.map(job => {

    let{innerText: fecha} = job.children[0];
    const{innerText: title} = job.children[1];
    const{innerText: rangeSalary} = job.children[2];

    fecha = fecha.split("\n")[0] ?? 'No hay fecha';

    return {
      fecha,
      title,
      rangeSalary
    }
  })

  console.log(infoJobs);
}
