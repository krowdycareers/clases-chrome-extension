const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const pMensaje = document.getElementById("mensajes");

const FiltroLugar = (arrayTrabajos,filtro) => {
  let cantidad = {};
  
  arrayTrabajos.forEach((trabajo) => {
    if (cantidad[trabajo[filtro]]) {
      cantidad[trabajo[filtro]].cantidad++;
      cantidad[trabajo[filtro]].trabajos.push(trabajo);
      
    } else {
      cantidad[trabajo[filtro]] = {
        cantidad: 1,
        trabajos: [trabajo],
        
      };
      
    }

  });
  return cantidad
  
};

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let port = chrome.tabs.connect(tab.id, { name: "popup" });
  port.postMessage({ message: "getJobs" });
  port.onMessage.addListener(function ({ message, data }) {
    // if (message === "ok") {
      
    //   let lugares = FiltroLugar(data,"lugar")
    //   let ciudades = Object.keys(lugares)
    //   let sueldoPorCiudad =[]
    //   ciudades.forEach(ciudad =>{
    //     const trabajoPorCiudad =  lugares[ciudad].trabajos;
    //     sueldoPorCiudad.push(FiltroLugar(trabajoPorCiudad,"sueldo"))
    //   })
     
    //   console.log(lugares)
    //   console.log(ciudades)
    //   console.log(sueldoPorCiudad)
    //   pMensaje.textContent = JSON.stringify(data, null, 2);
    // }
    
    
  });
});

btnScriptingBackground.addEventListener("click", async () => {
  var port = chrome.runtime.connect({ name: "popup-background" });
  port.postMessage({ message: "Hola BD" });
  port.onMessage.addListener(function ({ message }) {
    alert(message);
  });
});
