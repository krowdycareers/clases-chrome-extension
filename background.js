let jobs = [];

function addPageToURL(url) {
  const regex = /page=(\d+)/;
  const match = url.match(regex);
  const page = (match && match[1]) || "1";
  const newPage = parseInt(page) + 1;
  return url.replace(regex, `page=${newPage}`);
}


async function changeTabToNextPage(url, tabid) {
  const newURL = addPageToURL(url);
  await chrome.tabs.update(tabid, { url: newURL });
}


chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (params, sender) {
    const { cmd } = params
    if (cmd == "start") {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      let port = chrome.tabs.connect(tab.id,
        { name: "bg-content_script" });
      port.postMessage({ cmd: "scrap" });
    }
    if (cmd == "getInfo") {
      const { jobsInformation, nextPage } = params;
      jobs = [...jobs, ...jobsInformation];

      //console.log(sender);
      if (nextPage) {
        const {
          sender: {
            tab: { url, id },
           },
          } = sender
        changeTabToNextPage(url, id);
      }

    }
  });
});
