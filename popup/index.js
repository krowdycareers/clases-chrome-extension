const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: alertHelloWorld,
    });
});

function alertHelloWorld() {
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
    
    console.log(jobs);

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
}
