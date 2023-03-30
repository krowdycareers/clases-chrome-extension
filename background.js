const saveObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

const getObjectInLocalStorage = async function (obj) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value) {
        resolve(value);
      })
    } catch (error) {
      reject(error);
    }
  })
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener( async function ({ message }) {
    if (message === "Hola BD"){
      const status = 'start';
      await saveObjectInLocalStorage(status);
    } else if (message === "Hola Background"){
      const status = await getObjectInLocalStorage('status');
      if (status === 'start' ) port.postMessage({ message: "Te hablo desde el background content" });
    }
  });
});


chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }) {
    if (message === "startscrap") {
      const status = "start";
      await saveObjectInLocalStorage(status);
    }else if (message === "nextPage") {
      // const status = await getObjectInLocalStorage("status");
      // if (status == "start")
      port.postMessage({ message: "ok" });
    }
  });
});