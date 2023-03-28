console.log("Ejecutando el content script 1.0.2");

function getInformationRelatedToJobsFromDocument() {
    const jobCards = Array.from(document.querySelectorAll("[class*='cardContent']"));
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

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function ({ message }) {
        switch(message) {
            case "getJobs": {
                const jobs = getInformationRelatedToJobsFromDocument();
                
                port.postMessage({
                    message: "receivedJobs",
                    success: true,
                    jobs
                });
            }
            default: {
                throw new Error(`Unexpected Message: ${message}`);
            }
        }
    });
});

// Connect to background
// const port = chrome.runtime.connect({ name: "content-background" });
// port.postMessage({ message: "Hola Background" });
// port.onMessage.addListener(async ({ message }) => {
//   alert(message);
// });
