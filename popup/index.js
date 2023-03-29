const btnScripting = document.getElementById("btncomunicacion");
const btnScriptingBackground = document.getElementById("btncomunicacionbckg");
const results = document.querySelector("#results");

btnScripting.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let port = chrome.tabs.connect(tab.id, { name: "popup" });

    port.postMessage({ message: "getJobs" });
  
    port.onMessage.addListener(function (result) {
        if(!result.success) return;
        
        switch(result.message) {
            case "receivedJobs": {
                results.innerHTML = JSON.stringify(result.jobs, null, 2);
            }
            default: {
                throw new Error(`Unexpected Message: ${result.message}`);
            }
        }
    });
});

btnScriptingBackground.addEventListener("click", async () => {
    var port = chrome.runtime.connect({ name: "popup-background" });
    port.postMessage({ message: "Hola BDxd" });
    port.onMessage.addListener(function({ message, success }) {
        if(!success) {
            alert(message);
        }

        switch(message) {
            case "Hola BD":
            case "Hola Background": {
                alert(message);
            }
        }
    });
});
