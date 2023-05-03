const JOB_DATE = [];
const JOB_SALARY_RANGE = [];

function getJobsInformation() {
  let jobs = document.querySelectorAll("div[id*=jobcard]");
  jobs = [...jobs];

  const jobsJson = jobs.map(el => {
    const [
      {href: url},
      {
        children: [
          {
            children: [
              {innerText: date},
              {innerText: title},
              {innerText: salary},
            ]
          }]
      }] = el.children;
    if (!JOB_DATE.includes(date)) JOB_DATE.push(date);
    if (!JOB_SALARY_RANGE.includes(salary)) JOB_SALARY_RANGE.push(salary);
    return {url, date, title, salary}
  });

  let sumaryTemplate = '';
  let filteredJobs;
  JOB_DATE.forEach(d => {
    sumaryTemplate += '<div class="information__jobs">';
    JOB_SALARY_RANGE.forEach(s => {
      filteredJobs = jobsJson.filter(({date, salary}) => date === d && salary === s);
      if (filteredJobs.length > 0) {
        sumaryTemplate += '<div class="information__jobs__job"><p>' + d + '</p><p>' + s + '</p><p>' + filteredJobs.length + '</p></div>';
      }
    })
    sumaryTemplate += '</div>'
  });
  return sumaryTemplate;
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({cmd}) {
    if (cmd == "scrap") {
      port.postMessage({message: getJobsInformation()})
    }
  })
});

