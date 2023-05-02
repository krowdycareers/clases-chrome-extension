// date
const parseStringToDate = {
  "Hace 1 día": 1,
  "Hace 2 días": 2,
  "Hace 3 días": 3,
  "Hace 4 días": 4,
  "Hace 5 días": 5,
  "Hace 6 días": 6,
  "Hace 1 semana": 7,
  "Hace 2 semanas": 14,
};

const convertToLocalDate = (numberOfDaysToSubtracted) => {
  const today = new Date();
  const amountMilisecondsPerDay = 86400000;
  const substractDates = new Date(today.getTime() - numberOfDaysToSubtracted * amountMilisecondsPerDay);
  return substractDates.getDate() + "/" + (substractDates.getMonth() + 1) + "/" + substractDates.getFullYear();
};

const convertDateStringInDate = (job) => {
  const dayOfPublicationInString = job.querySelector("[class*='date'").textContent.replace(/\s+/g, " ").trim();
  const namberOfDatesToSubstract = parseStringToDate[dayOfPublicationInString] || 0;
  return convertToLocalDate(namberOfDatesToSubstract);
};
// end date

// ubication
const getJobUbication = (job) => {
  let ubication = "";
  const zoneLinksWithUbication = job.querySelector("[class*='zonesLinks'");
  const allInformationOfUbication = zoneLinksWithUbication.querySelectorAll("a");
  allInformationOfUbication.forEach((infoUbication) => {
    ubication = `${ubication} ${infoUbication.textContent} `.replace(/\s+/g, " ").trim();
  });

  return ubication;
};
// end ubication

const getJobsInformation = (nodeListWithJobs) => {
  return [...nodeListWithJobs].map((job) => {
    // ejemplo obtención de fecha desde HTML -> {date: 'Hace 4 días'}
    const date = convertDateStringInDate(job);
    const jobDescription = job.querySelector("[class*='job-']").textContent.trim();
    const jobSalary = job.querySelector("[class*='salary-']").textContent.trim().replace(/\s+/g, " ");
    const ubication = getJobUbication(job);

    return { date, ubication, jobDescription, jobSalary };
  });
};

const groupJobsByDate = (arrayWithJobsInformation) =>
  arrayWithJobsInformation.reduce((acc, { date, ubication, jobDescription, jobSalary }) => {
    const existingDate = acc.find((item) => item.date === date);

    if (existingDate) {
      const existingSalaryRange = existingDate.DescriptionJobBySalary.find((item) => item.jobSalary === jobSalary);

      if (existingSalaryRange) existingSalaryRange.jobRole.push({ job: jobDescription, ubication: ubication });
      else existingDate.DescriptionJobBySalary.push({ jobSalary, jobRole: [{ job: jobDescription, ubication: ubication }] });
    } else acc.push({ date, DescriptionJobBySalary: [{ jobSalary, jobRole: [{ job: jobDescription, ubication: ubication }] }] });

    return acc;
  }, []);

const handlerClickToGetJobInformation = (jobCardsAsNodeList) => groupJobsByDate(getJobsInformation(jobCardsAsNodeList));

chrome.runtime.onConnect.addListener((port) => {
  const jobCardsAsNodeList = document.querySelectorAll('[id*="jobcard"]');

  port.onMessage.addListener(({ command }) => {
    if (command === "scrap") port.postMessage({ message: handlerClickToGetJobInformation(jobCardsAsNodeList) });
  });
});
