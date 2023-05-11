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

const portBackground = chrome.runtime.connect(
  { name: 'content_script-background' });


chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd == "scrap") {
      const jobsInformation = getJobsInformation();
      //  const buttonNext = document.querySelectorAll("[class*=next]");
      const buttonNext = document.querySelector("[class*=next]");
      const nextPage = !buttonNext.className.includes("disabled");
      // const filteredJobsInformation = filterJobs(jobsInformation);
      portBackground.postMessage({ cmd: 'getInfo', jobsInformation, nextPage });

      // alert('Se procesó la información')
    }
  });
});
