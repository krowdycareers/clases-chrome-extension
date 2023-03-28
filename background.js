const saveObjectInLocalStorage = async function (obj) {
  return new Promise((res, rej) => {
    try {
      chrome.storage.local.set(obj, function () {
        res();
      });
    } catch (ex) {
      rej(ex);
    }
  });
};
const getObjectInLocalStorage = async function (obj) {
  return new Promise((res, rej) => {
    try {
      chrome.storage.local.get(key, function (value) {
        res(value);
      });
    } catch (ex) {
      rej(ex);
    }
  });
};
let irSiguiente = false;
let final = '4';
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }) {
    if (message === "startscrap") {
      const status = "start";
      await saveObjectInLocalStorage(status);
    }
    // if (message === "Hola BD")
    //   port.postMessage({ message: "Te hablo desde el background popup" });
    // if (message === "cargo la pagina")
    //   port.postMessage({ message: "Te hablo desde el background content" });
    if (message === "finish") {
      // const status = await getObjectInLocalStorage("status")
      // }
      // if(message == "start"){
      irSiguiente = true;
      // port.postMessage({ message: "nextpage" });
      port.postMessage({ message: "sgtePagina",final });
    }
    if (message === "siguiente") {
      console.log(message)
      console.log(irSiguiente)
      if (irSiguiente) {
        port.postMessage({ message: "sgtePagina",final });
      }
    }
  });
});
