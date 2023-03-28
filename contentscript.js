console.log("Ejecutando el content script 3.0");

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "getJobs") {
        port.postMessage({ success: true, jobs: getJobs() });
    }
  });
});

// Connect to background
// const port = chrome.runtime.connect({ name: "content-background" });
// port.postMessage({ message: "Hola Background" });
// port.onMessage.addListener(async ({ message }) => {
//   alert(message);
// });

function getJobs() {
    const jobElements = Array.from(document.querySelectorAll("[id*='jobcard']"));
    const jobCards = jobElements.map((jobElement) => jobElement.querySelector("[class*='cardContent']"));
    const jobs = jobCards.map((jobCard) => {
        const [
            publicationDetailsContainer,
            titleContainer,
            salaryContainer
        ] = jobCard.children;

        const [publishedAt, recommeded] = publicationDetailsContainer.innerText.split("\n");

        return {
            publishedAt: publishedAt,
            recommended: Boolean(recommeded),
            title: titleContainer.innerText,
            salary: extractSalaryDetails(salaryContainer.innerText)
        };
    });

    return jobs;
}

function extractSalaryDetails(salaryDetails = "") {
    // $16,000 - $18,000 Mensual
    const result = salaryDetails.match(/^\$(.+) - \$(.+) Mensual/);

    if(!result) {
        return {
            hasSalaryDetails: false,
            message: salaryDetails
        };
    }

    const [, minSalaryString, maxSalaryString] = result;
    const [minSalary, maxSalary] = [Number.parseInt(minSalaryString.replace(",", "")), Number.parseInt(maxSalaryString.replace(",", ""))];

    return {
        hasSalaryDetails: true,
        minSalary,
        maxSalary
    };
}
