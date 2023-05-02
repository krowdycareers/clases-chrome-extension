const btnScripting = document.getElementById("btnscript")
const jobsList = document.getElementById("jobs-list")
let filterByTitle = ""

btnScripting.addEventListener("click", async () => {
  
  const input = document.getElementById("search-input");
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const port = chrome.tabs.connect(tab.id, { name: 'popup' });

  filterByTitle = input.value

  port.postMessage({
    action: 'scrapping',
    url: 'https://www.occ.com.mx/empleos/?page=',
    numPages: 6,
    filterByTitle: filterByTitle
  });

  port.onMessage.addListener(function ({ message }) {
    displayJobs(message);
    //jobsList.innerText = JSON.stringify(message,null,2)
  });
});



function displayJobs(jobs) {
  jobsList.innerHTML = '';

  if (jobs.length === 0) {
    jobsList.innerText = 'No se encontraron trabajos';
    return;
  }

  jobs.forEach(job => {
    const jobElement = document.createElement('div');
    jobElement.classList.add('job-element');

    const jobDate = document.createElement('p');
    jobDate.classList.add('job-date');
    jobDate.innerText = "Fecha: " + job.fecha;

    jobElement.appendChild(jobDate);

    job.rango.forEach(rango => {
      const jobSalary = document.createElement('p');
      jobSalary.classList.add('job-salary');
      jobSalary.innerText = "Rango Salarial: " + rango.salario;

      const jobList = document.createElement('ul');
      jobList.classList.add('job-list');

      rango.job.forEach(jobTitle => {
        const jobListItem = document.createElement('li');
        jobListItem.innerText = jobTitle;

        jobList.appendChild(jobListItem);
      });

      jobElement.appendChild(jobSalary);
      jobElement.appendChild(jobList);
    });

    jobsList.appendChild(jobElement);
  });
}

