let jobs = [];
let start = false;

function addPageToURL(url) {
  const regex = /page=(\d+)/;
  const match = url.match(regex);
  const page = (match && match[1]) || "1";
  const newPage = parseInt(page) + 1;

  return url.replace(regex, `page=${newPage}`);
}

async function changeTabToNextPage(url, id) {
  const newUrl = addPageToURL(url);
  await chrome.tabs.update(id, { url: newUrl });
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (params, sender) {
    const { cmd } = params;
    if (cmd === "start") {
      start = true;
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      let port = chrome.tabs.connect(tab.id, { name: "bg-content_script" });
      port.postMessage({ cmd: "scrap" });
    }
    if (cmd === "online") {
      const {
        sender: {
          tab: { url, id },
        },
      } = sender;
      if (start) {
        let port = chrome.tabs.connect(id, { name: "bg-content_script" });
        port.postMessage({ cmd: "scrap" });
      }
    }
    if (cmd === "getInfo") {
      const { jobsInformation, pageNext } = params;
      jobs = [...jobs, ...jobsInformation];
      if (pageNext) {
        const {
          sender: {
            tab: { url, id },
          },
        } = sender;
        changeTabToNextPage(url, id);
      } else {
        start = false;
      }
    }
  });
});
