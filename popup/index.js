const btnScripting = document.getElementById("btnscript");

btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: alertHelloWorld,
  });
});

function alertHelloWorld() {
  alert("Hello World");
}
