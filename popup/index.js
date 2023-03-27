const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const pMensaje = document.getElementById("mensajes");

const FiltroLugar = (arrayTrabajos) => {
  let auxfiltro = "lugar";
  let cantidad = {};
  let trabajoPorSalario = {};
  arrayTrabajos.forEach((trabajo) => {
    if (cantidad[trabajo[auxfiltro]]) {
      cantidad[trabajo[auxfiltro]].cantidad++;
      cantidad[trabajo[auxfiltro]].trabajos.push(trabajo);
      // cantidad[trabajo[auxfiltro]].enlaceTrabajo.push(trabajo.enlace);
      // cantidad[trabajo[auxfiltro]][valoraux].push(trabajo[valoraux]);
    } else {
      cantidad[trabajo[auxfiltro]] = {
        cantidad: 1,
        trabajos: [trabajo],
        // enlaceTrabajo: [trabajo.enlace],
      };
      // cantidad[trabajo[auxfiltro]][valoraux] = [trabajo[valoraux]];
    }

  });
  let auxfiltro2 = "sueldo";
  console.log(cantidad)
  // for (const ciudad in cantidad) {
  //   console.log(ciudad,cantidad[ciudad])
  // }
  // cantidad.trabajos.forEach((trabajo)=>{
  //   if (trabajoPorSalario[trabajo[auxfiltro2]]) {
  //     trabajoPorSalario[trabajo[auxfiltro2]].cantidad++;
  //     trabajoPorSalario[trabajo[auxfiltro2]].trabajos.push(trabajo.titulo);
      
  //   } else {
  //     trabajoPorSalario[trabajo[auxfiltro2]] = {
  //       trabajoPorSalario: 1,
  //       trabajos: [trabajo],
        
  //     };
  //   }
  // })
  // console.log({cantidad,trabajoPorSalario})
};

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "getJobs" });
  port.onMessage.addListener(function ({ message, data }) {
    if (message === "ok") {
      
      FiltroLugar(data)

      pMensaje.textContent = JSON.stringify(data, null, 2);
    }
    // alert(message);
  });
});

btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});
