console.log("Ejecutando el content script 2.0");
function getJobInformation() {
  const elemCardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  const listJobs = elemCardJobs.map((cardJob) => {
    /* Crear un array a partir de los hijos del elemento con el id "jobcard-". */
    const auxAray = Array.from(cardJob.children[1].children[0].children);

    /* Comprobación de si el elemento tiene beneficios o no a travez de la longitud del auxArray. */
    const hasBenefit = auxAray.length == 7 ? true : false;

    /* A destructuring assignment. */
    if (hasBenefit) {
      const [
        { href: url },
        {
          children: [
            {
              children: [
                date,
                nameJob,
                rangeSalary,
                benefits,
                ,
                {
                  children: [
                    {
                      children: [
                        {
                          children: [
                            {
                              children: [
                                {
                                  children: [factory, location],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] = cardJob.children;
      return {
        fecha: date.innerText,
        empresa: factory.innerText,
        puesto: nameJob.innerText,
        rangoSalarial: rangeSalary.innerText,
        beneficios: benefits.innerText,
        lugar: location.innerText,
        url,
      };
    } else {
      const [
        { href: url },
        {
          children: [
            {
              children: [
                date,
                nameJob,
                rangeSalary,
                ,
                {
                  children: [
                    {
                      children: [
                        {
                          children: [
                            {
                              children: [
                                {
                                  children: [factory, location],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ] = cardJob.children;
      return {
        fecha: date.innerText,
        empresa: factory.innerText,
        puesto: nameJob.innerText,
        rangoSalarial: rangeSalary.innerText,
        beneficios: "No se muestran",
        lugar: location.innerText,
        url,
      };
    }
  });
  return listJobs;
}

/**
 * It takes an array of objects, and returns an array of objects with the same properties, but with the
 * count of how many times each object appears in the original array.
 * @returns [
 *   {
 *     "pais": "Argentina",
 *     "rangoSalarial": "Entre .000.000 y .500.000",
 *     "cantidad": 1
 *   },
 *   {
 *     "pais": "Argentina",
 *     "rangoSalarial": "Entre 
 */
function filterJobCountrySalary(){
  const dataCountryFilter = []
  const allJobs = getJobInformation();
  allJobs.forEach((item) => {
    let repetir = allJobs.filter((reg) => {
        return (
        item.lugar.toLowerCase() === reg.lugar.toLowerCase() &&
        item.rangoSalarial.toLowerCase() === reg.rangoSalarial.toLowerCase()
        );
    });

    let cant = repetir.length;

    if (!dataCountryFilter.some((e) => e.lugar === item.lugar && e.rangoSalarial === item.rangoSalarial)) {
        let auxArray = {
        pais: item.lugar,
        rangoSalarial: item.rangoSalarial,
        cantidad: cant,
        };
        dataCountryFilter.push(auxArray);
    }
})
  console.log(dataCountryFilter)
  return dataCountryFilter;
}

/**
 * It takes the result of the previous function, and creates a new object with the country as the key,
 * and the salary range as the value.
 * @returns [
 *   {
 *     "pais": "Argentina",
 *     "rangoSalarial": {
 *       "0-1000": 1,
 *       "1000-2000": 1,
 *       "2000-3000": 1,
 *       "3000-4000": 1,
 *       "4000-5000": 1,
 *       "5000-6000": 1,
 */
function filterJobCountry(){
  const jobs = filterJobCountrySalary()
  let result = [];
  let obj = {};
  
  
  jobs.forEach(function(item) {
    if(!obj[item.pais]) {
      obj[item.pais] = {};
    }
    
    if(!obj[item.pais][item.rangoSalarial]) {
      
      obj[item.pais][item.rangoSalarial] = 0;
    }
    
    obj[item.pais][item.rangoSalarial] += item.cantidad;
  });
  
  for(let pais in obj) {
    let tempObj = {};
    tempObj.pais = pais;
    tempObj.rangoSalarial = obj[pais];
    result.push(tempObj);
  }
  console.log(result)
  return result;


}

//Connect to background
const portBackground = chrome.runtime.connect({ name: "content-background" });

portBackground.onMessage.addListener(async ({ message }) => {
  if ((message = "nextpage")) {
    const nextPageButton = document.querySelector("[class*=next-]");
    nextPageButton.click();
  }
});

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    if (message === "getJobs") {
      const jobs = filterJobCountry();
      port.postMessage({ message: "ok", data: jobs });
      portBackground.postMessage({ message: "finish" });
    }
  });
});
