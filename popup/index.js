const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
// const pMensaje = document.getElementById("mensajes");
const divDatos = document.getElementById("mensaje_datos")


btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "getJobs" });
  port.onMessage.addListener(({ message, data }) => {
    if (message == "ok") {
      const dataJob = JSON.parse(JSON.stringify(data, null, 2))
      // pMensaje.innerText =JSON.stringify(data, null, 2)
      // Recorrer la lista de datos filtrados
      for (let i = 0; i < dataJob.length; i++) {
        const pais = dataJob[i].pais;
        const rangoSalarial = dataJob[i].rangoSalarial;

        // Crear un elemento de título para el país
        const tituloPais = document.createElement("h2");
        tituloPais.innerText = pais;

        // Agregar el título del país al div de datos
        divDatos.appendChild(tituloPais);

        // Recorrer los rangos salariales del país y crear elementos para mostrarlos
        for (let salario in rangoSalarial) {
          const cantidad = rangoSalarial[salario];

          // Crear un elemento de texto para el rango salarial y su cantidad
          const textoSalario = document.createElement("p");
          textoSalario.innerText = `${salario} --------------------> ${cantidad}`;

          // Agregar el elemento de texto al div de datos
          divDatos.appendChild(textoSalario);
        }
      }
    }
      
      
  });
});

btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
    
  });
});


