function getJobInformation() {
  let jobElementInformation = document.querySelectorAll("div[id*=jobcard]");
  jobElementInformation = [...jobElementInformation];
  const jobJsonInformation = jobElementInformation.map((el) => {
    console.log(el.children);
    const [
      { ariaLabel: title },
      {
        children: [
          {
            children: [
              {},
              {},
              { innerText: salaryRange },
              {},
              {
                children: [{ innerText: country }],
              },
            ],
          },
        ],
      },
    ] = el.children;
    return { title, salaryRange, country };
  });
  return jobJsonInformation;
}
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd === "scrap") {
      const jobsInformation = getJobInformation();
      port.postMessage({ message: jobsInformation });
    }
  });
});
