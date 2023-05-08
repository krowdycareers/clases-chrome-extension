// const baseUrl = "https://www.occ.com.mx/empleos/?page=";
// const totalPages = 7806;

// async function fetchData(url) {
//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log(data);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// async function iteratePages() {
//   for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
//     const url = baseUrl + currentPage;
//     await fetchData(url);
//   }
// }

function getJobInformation() {
  // iteratePages();
  let jobElementInformation = document.querySelectorAll("div[id*=jobcard]");
  jobElementInformation = [...jobElementInformation];

  // get job information
  const jobJsonInformation = jobElementInformation.map((el) => {
    const [
      {},
      {
        children: [
          {
            children: [{ innerText: date }, {}, { innerText: salaryRange }],
          },
        ],
      },
    ] = el.children;
    dateSplit = date.split("\n")[0];
    country = el.querySelector("p[class*=zonesLinks]").innerText;
    return { dateSplit, salaryRange, country };
  });

  return jobJsonInformation;
}
const portBackground = chrome.runtime.connect({
  name:"content_script-background"
})

portBackground.postMessage({cmd:'online'})

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd == "scrap") {
      const jobsInformation = getJobInformation();
      const buttonNext = document.querySelector("[class*=next]")
      const nextPage = !buttonNext.className.includes("disabled")
      port.postMessage({ cmd:'getInfo',jobs: jobsInformation, nextPage });
      alert("se proceso la información")
    }
  });
});
