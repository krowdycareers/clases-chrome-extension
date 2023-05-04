const btnScripting = document.getElementById("btnscript");
const pMessageElement = document.getElementById("mensaje")

btnScripting.addEventListener("click", () => {

  let loader = document.querySelector('.loader')

  loader?loader.style.display='block':''

  async function getJobsInformation(htmlW) {

    let listJob = htmlW.querySelectorAll('div[id*=jobcard-]')

    let data = [...listJob].map((job) => {
      let date = job.querySelector('label[class*=date]').innerText
      let nameJob = job.querySelector('h2[class*=job]').innerText
      let salary = job.querySelector('span[class*=salary]').innerText
      let zonesLink = job.querySelector('p[class*=zonesLink]').innerText


      return {
        dateNumber: date.replace(/,/g, "").match(/\d+(?=[^0-9]*$)/) ? parseInt(date.replace(/,/g, "").match(/\d+(?=[^0-9]*$)/)[0]) : 0,
        date,
        nameJob,
        salary,
        zonesLink,
      }
    })

    return data

  }


  let linkPages = ['https://www.occ.com.mx/empleos/de-recursos-humanos/?page=1',
    'https://www.occ.com.mx/empleos/de-recursos-humanos/?page=2',
    'https://www.occ.com.mx/empleos/de-recursos-humanos/?page=3']


  let dataLinkPages = linkPages.map(async (link) => {
    let peticion = await fetch(link)
    let peticionFi = await peticion.text()
    const parser = new DOMParser();
    let doc = parser.parseFromString(peticionFi, 'text/html')
    return await getJobsInformation(doc)
  })

  Promise.all(dataLinkPages).then(dl => {

    let data = dl.flat().sort((a, b) => a.dateNumber - b.dateNumber)
    let containerCard = document.querySelector('.container-card')
    console.log(data)
    containerCard.innerHTML = data.map((d) => {
      return `
        <div class="card">
          <div class="card__title">title : ${d.nameJob}</div>
          <div class="card__categoria">date : ${d.date}</div>
          <div class="card__categoria">salary : ${d.salary}</div>
          <div class="card__categoria">lugar : ${d.zonesLink}</div>
        </div>`
    }).join(' ')
  })


});





