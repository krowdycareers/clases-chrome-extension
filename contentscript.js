function getJobsInformation() {
  let jobInfo = document.querySelectorAll("div[id*=jobcard]");
  jobInfo = [...jobInfo];
  const jobsJson = jobInfo.map((el) => {
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

    return { url, fecha, title, salary, location };
  });
  return jobsJson;
}

function jobsFilter(jsonJobs) {
  const filteredJobs = {};

  jsonJobs.forEach((job) => {
    let fecha = job.fecha.split("\n")[0];
    let salary = job.salary.split("\n")[0];
    if (filteredJobs.hasOwnProperty(fecha)) {
      if (filteredJobs[fecha].hasOwnProperty(salary)) {
        filteredJobs[fecha][salary]["jobs"].push(job.title);
        filteredJobs[fecha][salary]["count"]++;
      } else {
        filteredJobs[fecha][salary] = { count: 1, jobs: [job.title] };
      }
    } else {
      filteredJobs[fecha] = { [salary]: {count: 1, jobs: [job.title]  } };
    }
  });
  return filteredJobs;
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ cmd }) {
    if (cmd === "scrap") {
      const JobsInformation = getJobsInformation();
      const filteredJobs = jobsFilter(JobsInformation);
      port.postMessage({ message: filteredJobs });
    }
  });
});
