console.log("Se esta ejecutando el javascript");

function getJobsInformation() {
  const jobsElementsInformation = [...document.querySelectorAll("div[id^=jobcard]")];

  const jobsInformation = jobsElementsInformation.map((job) => {
    const [
      {},
      {
        children: [
          {
            children: [
              { innerText: date },
              { innerText: title },
              { innerText: salary },
            ],
          },
        ],
      },
    ] = job.children;

    return { title, salary: salary.replace("\n", " "), date: date.split("\n")[0] };
  });

  const totalJobs = (!sessionStorage.hasOwnProperty('totalJobs'))
                    ? jobsInformation
                    : jobsInformation.concat(JSON.parse(sessionStorage.getItem('totalJobs')));
                
  sessionStorage.setItem('totalJobs', JSON.stringify(totalJobs));

  const allDates = [...new Set(totalJobs.map(job => job.date))];
  
  const groupedJobs = allDates.map(date => {
        const jobsBydate = totalJobs.filter(job => job.date === date);
    
        const salariesByDate = [...new Set(jobsBydate.map(job => job.salary))];

        const jobsBySalary = salariesByDate.map(salary=> { return {
            salary,
            jobs: jobsBydate.filter(job => job.salary === salary).length
        }});

        return { date, jobsBySalary };
  });

  return groupedJobs;
}

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener(({cmd}) => {
        if (cmd === 'scrap')  {
            const jobsInformation = getJobsInformation();
            port.postMessage({message: jobsInformation});
        }
    });
});