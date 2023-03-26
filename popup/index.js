const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getJobInformation,
  });
});

function getJobInformation() {
  alert("Hello World");

  
  const jobCardContent = [...document.querySelectorAll("[id*='jobcard-']")];
  const jobsInfo = jobCardContent.map((jobInfo) => {
    const [
      {href: urlJob},
      {
        children: [
          {
            children: [
              {innerText: jobDateAndRecommend},
              {innerText: jobType},
              {innerText: jobSalary},
              {innerText: jobBenefits},
              {},
              {
                children: [elementCompanyLocation]
              },

            ]
          }
        ]
      }
    ] = jobsInfo.children ;

    const jobDate = getDateJob(jobDateAndRecommend);
    const jobRecommend = getIfIsRecommendated(jobDateAndRecommend);
    const jobCompany = elementCompanyLocation?.querySelector("label")?.innerText;

    const locationsElement = elementCompanyLocation.querySelector("p");

    const jobLocations = [].slice.call(locationsElement.children);

    return {urlJob,jobDate,jobRecommend,jobType,jobSalary,jobBenefits,jobCompany,jobLocations }
  });

  console.log(jobsInfo);
}

function getDateJob(job){
  return job.split("\n",1);
}

function getIfIsRecommendated(job) {
  let validation = job.split("\n",2)[1];
  return validation ? validation : "No recomendada";
  
}
