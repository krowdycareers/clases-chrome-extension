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

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ cmd }) => {
    // alert(message);

    if (cmd == "scrap") {
      const jobsInformation = getJobsInformation();
      port.postMessage({ message: jobsInformation });
    }
  });
});
