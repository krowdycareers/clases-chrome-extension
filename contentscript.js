function groupJobsJSON(jobsJson) {
    const groupingByDateSalary = jobsJson.reduce((result, job) => {
        const date = job.fecha.split("\n")[0];
        const salary = job.salary;

        if (!result[date]) {
            result[date] = {};
        }

        if (!result[date][salary]) {
            result[date][salary] = [];
        }

        result[date][salary].push(job);

        return result;
    }, {});
    return groupingByDateSalary;
}
function geretateTemplateToPrint(groupingJobs) {
    let template = ``;
    for (const date in groupingJobs) {
        if (Object.hasOwnProperty.call(groupingJobs, date)) {
            const item = groupingJobs[date];
            template += `
                <table class="table-jobs">
                    <thead>
                        <tr>
                            <th colspan="3">Fecha: ${date} </th>
                        </tr>
                        <tr>
                            <th>Titulo</th>
                            <th>Salario</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody> 
            `;
            for (const k in item) {
                if (Object.hasOwnProperty.call(item, k)) {
                    const salary = item[k];
                    salary.forEach((job, index) => {
                        if (index == 0) {
                            template += `
                            <tr>
                                <td>${job.title}</td>
                                <td rowspan=${salary.length}>${job.salary}</td>
                                <td><a href="${job.url}">Link</a></td>
                            </tr>`;
                        } else {
                            template += `
                                <tr>
                                    <td>${job.title}</td>
                                    <td><a href="${job.url}">Link</a></td>
                                </tr>`;
                        }
                    });
                }
            }
            template += `</tbody> </table>`;
        }
    }
    return template;
}
function getJobInformation() {
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
    const jsonJobsGrouping = groupJobsJSON(jobJsonInformation);

    return jsonJobsGrouping;
}

chrome.runtime.onConnect.addListener(function (port) {
    port.onMessage.addListener(function ({ cmd }) {
        if (cmd === "scrapt") {
            const jobsInformation = geretateTemplateToPrint(
                getJobInformation()
            );
            port.postMessage({ message: jobsInformation });
        }
    });
});
