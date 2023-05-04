console.log("se esta ejecutando el javascript")
const showData = document.getElementById('mensaje');

const getJobsInformation = () => {
  const jobData = document.querySelectorAll('div[id^="jobcard"]')
  const jobsData = [...jobData];

  const jobJsonInfo = jobsData.map((job) => ({
    title: job.querySelector('h2[class*="subheading"]').innerText,
    date: job.querySelector('label[class*="highEmphasis"]').innerText,
    url: job.querySelector('a').href,
    location: job.querySelector('p[class*="zonesLinks"]').innerText,
    salary: job.querySelector('span[class*="salary"]').innerText,
  }));

  const data = Object.fromEntries(
    jobJsonInfo.map((job) => [
      job.date,
      Object.fromEntries([
        [job.salary, jobJsonInfo.filter((j) => j.date === job.date && j.salary === job.salary)],
      ]),
    ])
  );

  return JSON.stringify(data, null, 2);
};

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    let cmd = msg.cmd;
    if (cmd === 'active') {
      const jobsInformation = getJobsInformation();
      port.postMessage({ mesage: jobsInformation });
    }
  });
});


// function getJobsInformation() {
//     let jobsElementInformation = document.querySelectorAll("div[id*=jobcard]");
//     jobsElementInformation= [...jobsElementInformation];
//     const jobJsonInformation = jobsElementInformation.map((el)=>{
//       const [
//         { href: url},
//         {
//           children:[
//             {
//               children:[
//                 { innerText: fecha },
//                 { innerText: title},
//                 { innerText: salary},
//               ],
//             }
//           ]
//         }
//       ] = el.children;
  
//       return { url,fecha,title,salary}
//     })
//     return jobJsonInformation;
// }
// // getJobsInformation();

// // estoy generando un puerto de conexion con el navegador
// chrome.runtime.onConnect.addListener(function(port){
//     // y a ese puerto quiero escuchar cuando me mandes
//     // algun tipo de comando
//     port.onMessage.addListener(({cmd})=>{
//         if(cmd=="scrap"){
//             const jobsInformation =getJobsInformation();
//             port.postMessage({message:jobsInformation})
//         }
//     });
// })