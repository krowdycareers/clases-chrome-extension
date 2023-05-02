
console.log("Se está ejecutando el JavaScript de background");

function getJobsInformation(url, numPages, filterByTitle = '') {
  const jobsInformationList = [];

  const filteredJobs = (jobsInformationList) => {
    if (filterByTitle) {
      const filteredJobsInformation = jobsInformationList.filter(job => job.title.includes(filterByTitle));
      return filteredJobsInformation;
    }
    return jobsInformationList;
  }

  const transformedData = (jobsInformationList) => {
    const transformedData = jobsInformationList.map(dato => {
      const salaryRange = dato.salary
      const formattedSalary = /\d/.test(salaryRange) ? salaryRange.replace(/[^\d-]/g, '') : 'Sueldo no mostrado';
      delete dato.salary;
      return {
        ...dato,
        salaryRange: formattedSalary,
        //fecha: dato.fecha === "HoyRecomendada" ? "Hoy" : dato.fecha
      };
    });

    const filteredData = [];

    transformedData.forEach(item => {
      const existingDate = filteredData.find(date => date.fecha === item.fecha);

      if (existingDate) {
        const existingSalaryRange = existingDate.rango.find(range => range.salario === item.salaryRange);

        if (existingSalaryRange) {
          existingSalaryRange.job.push(item.title);
        } else {
          existingDate.rango.push({
            salario: item.salaryRange,
            job: [item.title]
          });
        }
      } else {
        filteredData.push({
          fecha: item.fecha,
          rango: [
            {
              salario: item.salaryRange,
              job: [item.title]
            }
          ]
        });
      }
    });

    return filteredData;
  }

  const fetchJobsInformation = (pageNumber) => {
    return fetch(`${url}${pageNumber}`)
      .then(response => response.text())
      .then(data => {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(data, "text/html");
        let jobsElementInformation = htmlDoc.querySelectorAll("div[id*=jobcard]");
        jobsElementInformation = [...jobsElementInformation];
        const jobJSONInformation = jobsElementInformation.map(el => {
          const [{ href: url }, { children: [{ children: [{ innerText: fecha }, { innerText: title }, { innerText: salary }] }] }] = el.children;
          return { url, fecha, title, salary };
        });
        jobsInformationList.push(...jobJSONInformation);
        if (pageNumber < numPages) {
          return fetchJobsInformation(pageNumber + 1);
        } else {
          //console.log(jobsInformationList)
          return filteredJobs(jobsInformationList);
        }
      });
  }

  return fetchJobsInformation(1).then(transformedData);
}

chrome.runtime.onConnect.addListener(function(port) {
  console.log("Conectando al puerto:" + port.name);
  port.onMessage.addListener(function(msg) {
    if (msg.action === "scrapping") {
      const url = msg.url;
      const numPages = msg.numPages;
      const titleFilter = msg.filterByTitle;
      //console.log(titleFilter);
      getJobsInformation(url, numPages, titleFilter)
        .then(jobsInformation => {
          //console.log(jobsInformation);
          port.postMessage({message:jobsInformation});
        })
        .catch(error => console.error(error));
    }
  });
});

  



  

  
  