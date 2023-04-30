const btnScripting = document.getElementById("btnscript");
const pMessageElement = document.getElementById("message");
btnScripting.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });
    // chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     func: alertHelloWorld,
    // });

    const portTabActive = chrome.tabs.connect(tab.id, { name: "popup" });
    portTabActive.onMessage.addListener(function ({ message }) {
        pMessageElement.innerHTML = message;
    });
    portTabActive.postMessage({ cmd: "scrapt" });
});
