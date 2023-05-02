console.log("Se esta ejecutando el javascript");


function getJobsInformation() {
    let jobsElementInformation = document.querySelectorAll('div[id*=jobcard]');
    jobsElementInformation = [...jobsElementInformation];

    const jobJsonInformation = jobsElementInformation.map(el => {
        const [
            { href: url },
            {
                children: [
                    {
                        children: [
                            { innerText: date },
                            { innerText: title },
                            { innerText: salary },
                        ],
                    },
                ],
            },
        ] = el.children;
        let salaryChange = salary.replace('Mensual','');
        return { url, date, title, salaryChange };
        
    });
    
    return jobJsonInformation;
}

function countDatesAndSalaries(jobsInformation) {
    const dateCount = {};
    const salaryCount = {};

    // Contar las fechas
    jobsInformation.reduce((_, job) => {
        if (job.date in dateCount) {
            dateCount[job.date]++;
        } else {
            dateCount[job.date] = 1;
        }
    }, {});

    // Contar los salarios
    jobsInformation.reduce((_, job) => {
        if (job.salaryChange in salaryCount) {
            salaryCount[job.salaryChange]++;
        } else {
            salaryCount[job.salaryChange] = 1;
        }
    }, {});

    return { dateCount, salaryCount };
}
function displayDateAndSalaryCount(counts) {
    const { dateCount, salaryCount } = counts;
    
    // Mostrar información de fechas  
    let dateAll = "";
    for (const date in dateCount) {
        dateAll +=(`${date}: ${dateCount[date]}\n`);
    }

    // Mostrar información de salarios
    let salaryAll = "";
    for (const salary in salaryCount) {
        salaryAll +=(`${salary}: ${salaryCount[salary]}\n`);
    }
    dateAll = dateAll.replace(/\n/g, ' ');
    salaryAll = salaryAll.replace(/\n/g, '   ');  
    return {dateAll ,salaryAll};
}

chrome.runtime.onConnect.addListener(function(port){
    port.onMessage.addListener(({cmd})=> {
        if(cmd=="scrap") {
            const jobsInformation = getJobsInformation();
            const counts = countDatesAndSalaries(jobsInformation);
            const JobsInformationCount = displayDateAndSalaryCount(counts);
            port.postMessage({message:JobsInformationCount});
        }
    });
});