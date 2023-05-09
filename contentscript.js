console.log("Se está ejecutando el javascript con la extensión");

function getJobsInformation() {
  //alert("Hello World");

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

  //   console.log(jobJsonInformation);
  return jobJsonInformation;
}

// getJobsInformation();

const portBackground = chrome.runtime.connect({
  name: "content_script-background",
});

portBackground.postMessage({ cmd: "online" });

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ cmd }) => {
    // alert(message);

    if (cmd == "scrap") {
      const jobsInformation = getJobsInformation();
      const buttonNext = document.querySelector("[class*=next]");
      const nextPage = !buttonNext.className.includes("disabled");
      portBackground.postMessage({ cmd: "getInfo", jobsInformation, nextPage });
    }
  });
});
