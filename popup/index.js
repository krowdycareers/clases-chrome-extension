const btnScripting = document.getElementById("btnscript");

/* Un listener que ejecuta la función initScrapingJobs cuando se pulsa el botón. */
btnScripting.addEventListener("click", async () => {
  /* Utiliza la sintaxis de asignación de desestructuración para asignar el primer elemento del array devuelto por la
  a la variable tab. */
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  /* Ejecutando la función initScrapingJobs en la pestaña actual. */
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: initScrapingJobs,
  });
});

function initScrapingJobs() {
  
  const cardJobs = [...document.querySelectorAll('[id*="jobcard-"]')];
  console.log(cardJobs[0]);
  // Mapea los elementos seleccionados a un objeto con las propiedades url, nameJob, date y rangeSalary
  const listJobs = cardJobs.map((cardJob) => {
    /* Crear un array a partir de los hijos del elemento con el id "jobcard-". */
    const auxAray = Array.from(cardJob.children[1].children[0].children);

    /* Comprobación de si el elemento tiene beneficios o no a travez de la longitud del auxArray. */
    const hasBenefit = auxAray.length == 7 ? true : false;

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
  console.log(listJobs);

  const btn = document.querySelector(".next-0-2-620");
  btn.click();
}
