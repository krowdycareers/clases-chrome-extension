const btnScripting = document.getElementById("btnscript");
const pmessageElement=document.getElementById("mensaje")
btnScripting.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const portTabActive = chrome.tabs.connect(tab.id,{name:"popup"});

  portTabActive.onMessage.addListener(({message})=>{
  
    pmessageElement.innerText=JSON.stringify(message,null,2);
  })

  portTabActive.postMessage({cmd:"scrap"})
});


