//aqui vamos a injestar el codigo javascriptS
function getJobsInformation() {
    let jobElementInformation = document.querySelectorAll('div[id*=jobcard]');
    jobElementInformation = [...jobElementInformation];

    const jobJsonInformation = jobElementInformation.map(el => {
        const [
            { href: url },
            { children: [
                { children: [
                    { innerText: Fecha },
                    { innerText: title },
                    { innerText: salary }
                ] }]
            }] = el.children;
        return { url, Fecha, title, salary };
    }).reduce((collector, item) => {
        if (!collector[item.Fecha]) {
            collector[item.Fecha] = [];
        }
        console.log(collector[item.Fecha]);
        const existingJob = collector[item.Fecha].find(job => job.salary === item.salary);
        console.log(existingJob)
        if (existingJob) {
            existingJob.jobs.push({ title: item.title, url: item.url });
        } else {
            collector[item.Fecha].push({ salary: item.salary, jobs: [{ title: item.title, url: item.url }] });
        }
        console.log(collector)
        return collector;
    }, {});

    return jobJsonInformation
}

// getJobsInformation()


// cuando laguien se conecte atravez de un puerto
chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function ({ cmd }) {
        if (cmd == "scrap") {
            const jobsInformation = getJobsInformation();
            port.postMessage({ message: jobsInformation });
        }
    })
})