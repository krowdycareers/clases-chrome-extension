const btnScripting = document.getElementById("btnscript");

const filtros = (resultados) => {
  const fragment = document.createDocumentFragment();
  resultados.forEach((element) => {
    const itemTrabajo = document.createElement("li");
    const enlaceTrabajo = document.createElement("a");
    const titulo = document.createElement("p");
    const caracteristicas = document.createElement("div");
    const sueldo = document.createElement("p");
    const empresa = document.createElement("p");
    const fecha = document.createElement("p");

    titulo.textContent = element.titulo;
    sueldo.textContent = element.sueldo;
    empresa.textContent = element.empresa;
    enlaceTrabajo.href = element.url;
    titulo.textContent = element.titulo;
    fecha.textContent = element.fecha;
    itemTrabajo.setAttribute("data-recomendado", `${element.recomendado}`);
    itemTrabajo.setAttribute("data-fecha", `${element.fecha}`);

    caracteristicas.appendChild(sueldo);
    caracteristicas.appendChild(empresa);
    caracteristicas.appendChild(fecha);
    enlaceTrabajo.appendChild(titulo);
    enlaceTrabajo.appendChild(caracteristicas);

    itemTrabajo.appendChild(enlaceTrabajo);
    fragment.appendChild(itemTrabajo);
  });
  // trabajos.appendChild(fragment);
  return fragment;
};

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let res = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: alertHelloWorld,
  });
  let resultados = res[0].result;
  let trabajos = document.getElementById("trabajos");
  trabajos.appendChild(filtros(resultados));
  let elementosFiltro = Array.from(trabajos.children);
  console.log(elementosFiltro)
  
  //Filtros
  let chekRecomendados = document.getElementById("recomendada");
  let chekHoy = document.getElementById("hoy");
  console.log(elementosFiltro[0].dataset.recomendado)
  //
  
  chekRecomendados.addEventListener("change", (e) => {
    if (chekRecomendados.checked) {
      
        elementosFiltro.forEach(function (elemento) {
          if(elemento.dataset.recomendado !== 'Recomendada'){
            console.log(elemento.dataset.recomendado)
            elemento.classList.add("ocultar")
          }
        });
    }
    else{
      
        elementosFiltro.forEach(function (elemento) {
          elemento.classList.remove("ocultar");
        });
    }
  });
   chekHoy.addEventListener("change", (e) => {
    if (chekHoy.checked) {
      
         elementosFiltro.forEach(function (elemento) {
          
          console.log(!elemento.dataset.fecha.includes('día'),"día")
          console.log(elemento.dataset.fecha!=="Hoy","hoy")
          if(!(elemento.dataset.fecha=="Hoy" || elemento.dataset.fecha.includes('día'))){
            
            elemento.classList.add("ocultar")
          }
        });
    }
    else{
      
        elementosFiltro.forEach(function (elemento) {
          elemento.classList.remove("ocultar");
        });
    }
  });
  
})();

function alertHelloWorld() {
  //query selector jobcard
  const empleos = document.querySelectorAll("div[id*=jobcard-]");
  const arrayEmpleos = Array.from(empleos);
  const caracteristicasEmpleos = arrayEmpleos.map((empleo) => {
    let data = {
      recomendado: "Sin recomendacion",
    };
    data.url = empleo.querySelector("a[class*=jobcard-]").href;
    let caracteristicasEmpleo = empleo.children[1].children[0];
    let hijosEmpleoRecuperar =
      caracteristicasEmpleo.children[0].querySelectorAll("label");
    data.fecha = hijosEmpleoRecuperar[0].textContent;
    if (hijosEmpleoRecuperar.length >= 2) {
      data.recomendado = hijosEmpleoRecuperar[1].textContent;
    }
    data.titulo = caracteristicasEmpleo.children[1].textContent;
    data.sueldo = caracteristicasEmpleo.children[2].textContent;
    data.empresa =
      caracteristicasEmpleo.children[
        caracteristicasEmpleo.children.length - 2
      ].querySelector("label").textContent;
    data.lugar =
      caracteristicasEmpleo.children[
        caracteristicasEmpleo.children.length - 2
      ].querySelector("p").textContent;
    // if(caracteristicasEmpleo.children.length == 7){
    //   data.empresa = caracteristicasEmpleo.children[5].querySelector('label')
    //   data.empresa = caracteristicasEmpleo.children[5].querySelector('p')
    // }
    // else if(caracteristicasEmpleo.children.length == 6) {

    //   data.empresa = caracteristicasEmpleo.children[4].querySelector('label')
    //   data.empresa = caracteristicasEmpleo.children[4].querySelector('p')
    // }
    // data.lugar = caracteristicasEmpleo.children[5].querySelector('p').innerText

    return data;
  });
  // console.log(caracteristicasEmpleos)
  return caracteristicasEmpleos;
}
