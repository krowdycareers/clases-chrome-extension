const saveObjectInLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set(key, () => {
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

const getObjectInLocalStorage = async function (key) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, (value) => {
        resolve(value);
      });
    } catch (error) {
      reject(error);
    }
  });
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ message }) {
    const status = "start";
    if (message === "Start scrap") {
      await saveObjectInLocalStorage(status);
    }
    if (message === "finish") {
      // const state = await getObjectInLocalStorage(status);
      // if (state === status)
      port.postMessage({ message: "next page" });
    }
  });
});
