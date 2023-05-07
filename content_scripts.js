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
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd === "scrap") {
      const jobsInformation = getJobInformation();
      port.postMessage({ message: jobsInformation });
    }
  });
});
