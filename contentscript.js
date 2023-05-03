console.log("Ejecutando ContentScript");

function getJobsInformation() {
  let listCardJob = document.querySelectorAll("div[id*=jobcard-]>a");
  listCardJob = [...listCardJob];

  const jobLink = listCardJob.map((el) => el.href);
  let doc;
  return jobLink.map((urlJob) => {
    return fetch(urlJob)
      .then((response) => response.text())
      .then((html) => {
        const parser = new DOMParser();
        doc = parser.parseFromString(html, "text/html");

        let jobContainer = doc.querySelector("div[class*=card-][class*=flat-]");
        const [
          {
            children: [
              {
                children: [
                  { innerText: date },
                  { innerText: title },
                  { innerText: range },
                  { innerText: workPlace },
                ],
              },
            ],
          },
          ,
          {
            children: [
              ,
              {
                children: [
                  {
                    children: [
                      ,
                      {
                        children: [
                          {
                            children: [, { innerText: category }]
                          },
                          {
                            children: [, { innerText: subCategory }]
                          },
                        ],
                      },
                    ],
                  },
                  ,
                  ,
                  {
                    //children: [{outerText:contractName}, { outerText: contract }]
                    outerText: contract
                  },
                  { outerText: detail1 },
                  { outerText: detail2 },
                  { outerText: detail3 },
                ],
              },
            ],
          },
        ] = jobContainer.children;
        const details = [contract,detail1, detail2, detail3];
        return {
          Fecha: date,
          Titulo: title,
          Salario: range,
          Lugar: workPlace,
          Categoria: category,
          Subcategoria: subCategory,
          Detalles: Object.values(details),
        };
      })
      .catch((error) => console.log(error));
  });
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd == "scrap") {
      const infoJsonJobs = getJobsInformation();
      Promise.all(infoJsonJobs)
        .then((result) => {

            let jobsInfoArray = result.map((el) => {
                return el.Salario;
            });

            let groupBySalary = jobsInfoArray.filter((v, i, a) => {
                return a.indexOf(v) == i;
            });            

            let salaryFilterResult = groupBySalary.map(salary =>{
                let filteredJob = result.filter(result => result.Salario.includes(salary));

                return {
                    maxAmount:salary.replace(/,/g, "").match(/\d+(?=[^0-9]*$)/) ? parseInt(salary.replace(/,/g, "").match(/\d+(?=[^0-9]*$)/)[0]) : 'Salario no mostrado por compañía.',
                    Salarios:salary,
                    Trabajos:filteredJob
                }
            })

            let validateString='Salario no mostrado por compañía.'
            let sortedJobsBySalaryAmount=salaryFilterResult.filter((objJob)=>objJob.maxAmount !==validateString)
            .sort((a,b)=>b.maxAmount - a.maxAmount)

            let concatJobsObject=[
              ...sortedJobsBySalaryAmount,
              ...salaryFilterResult.filter((objJob)=>objJob.maxAmount == validateString)
            ]

            let resultJsonJobs = concatJobsObject.map((t)=>{
              return {Salarios:t.Salarios,Trabajos:t.Trabajos}
            })
            
            port.postMessage({message: resultJsonJobs})
        })
        .catch((error) => console.log(error));
    }
  });
});


