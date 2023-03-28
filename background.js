const saveObjectInLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(key, function () {
        resolve();
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

const getObjectInLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, (value) => {
        resolve(value);
      });
    } catch (ex) {
      reject(ex);
    }
  });
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }) {
    if (message === "startscrap") {
      const status = "start";
      await saveObjectInLocalStorage(status);
    }

    if (message === "finish") {
      // const status = await getObjectInLocalStorage("status");
      // if (status === "start") 
        port.postMessage({ message: "nextpage" });
    }
  });
});
