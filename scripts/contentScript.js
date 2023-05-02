function scrapNow(){
    
    let jobElsInfo = document.querySelectorAll("div[id*=jobcard]");
    jobElsInfo = [...jobElsInfo];
    
    const jobJsonInfo = jobElsInfo.map(jobEl => {
        const [
            {
                href: url
            },
            {
                children: [
                    {
                        children: [
                            {innerText: date},
                            {innerText: title},
                            {innerText: salary}
                        ],
                },
            ],
        },
    ] = jobEl.children;
    
    return {url, date, title, salary};
})
return jobJsonInfo;
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
    const data = scrapNow();
    const search = document.getElementById("search-box-keyword").value;
    sendResponse({data, search});
    }
)