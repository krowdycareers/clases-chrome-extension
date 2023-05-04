console.log("Se está ejecutando");


function getJobsInformation() {
  let jobsElementInformation = document.querySelectorAll("div[id*=jobcard]");
  jobsElementInformation = [...jobsElementInformation];

  const jobJsonInformation = jobsElementInformation.map((el) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: fecha },
              { innerText: title },
              { innerText: salary },
            ],
          },
        ],
      },
    ] = el.children;

    return { url, fecha, title, salary };
  });

  return jobJsonInformation;
}

function filterJobs(jobsData) {
  const filteredJobs = {};

  for (const job of jobsData) {
    const fecha = job.fecha.split("\n")[0];
    const salary = job.salary.split("\n")[0];

    if (!filteredJobs[fecha]) {
      filteredJobs[fecha] = {};
    }

    if (!filteredJobs[fecha][salary]) {
      filteredJobs[fecha][salary] = { count: 0, jobs: [] };
    }

    filteredJobs[fecha][salary].count++;
    filteredJobs[fecha][salary].jobs.push(job.title);
  }

  return filteredJobs;
}



// getJobsInformation();
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ cmd }) => {
    if ((cmd = "scrap")) {
      const jobsInformation = getJobsInformation();
      const filteredJobsInformation = filterJobs(jobsInformation);
      port.postMessage({ message: filteredJobsInformation });
    }
  });
});
