const showData = document.getElementById('showData');

const getJobsInformation = () => {
  const jobsInfo = [...document.querySelectorAll('div[id^="jobcard"]')];

  const data = {};
  const jobJsonInfo = jobsInfo.map((job) => ({
    title: job.querySelector('h2[class*="subheading"]').innerText,
    date: job.querySelector('label[class*="highEmphasis"]').innerText,
    url: job.querySelector('a').href,
    location: job.querySelector('p[class*="zonesLinks"]').innerText,
    salary: job.querySelector('span[class*="salary"]').innerText,
  }));

  jobJsonInfo.forEach((job) => {
    if (data.hasOwnProperty(job.date)) {
      if (data[job.date].hasOwnProperty(job.salary)) {
        data[job.date][job.salary].push(job);
      } else {
        data[job.date][job.salary] = [job];
      }
    } else {
      data[job.date] = {};
      data[job.date][job.salary] = [job];
    }
  });

  return JSON.stringify(data, null, 2);
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    let cmd = msg.cmd;
    if (cmd === 'active') {
      const jobsInformation = getJobsInformation();
      port.postMessage({ mesage: jobsInformation });
    }
  });
});
