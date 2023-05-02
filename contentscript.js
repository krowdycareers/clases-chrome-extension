console.log("Se esta ejecutando el javascript");
let jobsElementInformation = document.querySelectorAll("div[id*=jobcard]");

function getJobsInformation() {
    jobsElementInformation = [...jobsElementInformation];

    const jobsJsonInformation = jobsElementInformation.map((el) => {
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
        return { fecha, title, salary };
    });
    return jobsJsonInformation;

}

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(({ cmd }) => {
        if (cmd = "scrap") {
            const jobsInformation = getJobsInformation();
            
            const jobsDatesGroup = jobsInformation.reduce((groups, jobs) => {
                const date = jobs.fecha;
                if (!groups[date]) {
                    groups[date] = [];
                }
                groups[date].push(jobs);
                return groups;
            }, {});
            const jobsSalaryGroup = jobsInformation.reduce((groups, jobs) => {
                const salary = jobs.salary;
                if (!groups[salary]) {
                    groups[salary] = [];
                }
                groups[salary].push(jobs);
                return groups;
            }, {});
            
            console.log(jobsDatesGroup)
            console.log(jobsSalaryGroup)
            port.postMessage({ message: jobsInformation });
        }
    });
});
