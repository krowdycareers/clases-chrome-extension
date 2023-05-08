chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function ({ cmd }) {
    if (cmd == "start") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      let port = chrome.tabs.connect(tab.id, { name: "bg-content_script" });
      port.postMessage({cmd:"scrap"})
    }
  });
});
