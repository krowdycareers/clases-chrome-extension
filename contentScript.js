function getJobs(){
    let jobElementInformation = document.querySelectorAll("div[id*=jobcard]");
    jobElementInformation = [...jobElementInformation];
    const jobJsonInformation = jobElementInformation.map((el) => {
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
    return jobJsonInformation;
  }
function classifyingJobs(jobsJson){
    const jobsCualified = {
        Date:{
            hoy:[]
        },
        Salary:{
            noMostrado: []
        }
    };

    jobsJson.forEach(element => {
        
        if(element.fecha.includes('Hoy')){
            jobsCualified.Date.hoy.push(element);
        }
        if(element.salary.includes('$')){
            var range = element.salary;
            if(jobsCualified.Salary[`Range: ${range}`]){
                jobsCualified.Salary[`Range: ${range}`].push(element)
            }else if(!jobsCualified.Salary[`Range: ${range}`]){
                jobsCualified.Salary[`Range: ${range}`] = [];
                jobsCualified.Salary[`Range: ${range}`].push(element);
            }
                 
        }else {
            jobsCualified.Salary.noMostrado.push(element);
        }

    });

    return jobsCualified;
}
  
  chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function ({ cmd }) {
        if (cmd === "scrapt") {
            const jobsReturnJson = classifyingJobs(getJobs());
            console.log(jobsReturnJson);
            port.postMessage({message: jobsReturnJson});
        }
    });
});