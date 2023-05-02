function getJobsInformation() {
  const jobElementInformation = [
    ...document.querySelectorAll('div[id*=jobcard]')
  ]

  const jobJsonInformation = jobElementInformation.map((el) => {
    const [
      { href: url },
      {
        children: [
          {
            children: [
              { innerText: fecha },
              { innerText: title },
              { innerText: salary }
            ]
          }
        ]
      }
    ] = el.children

    return { url, fecha, title, salary }
  })

  return jobJsonInformation
}

const dicJobs = { groupedByDate: [], gruopedBySalary: [] }
function groupJobs(value, dic) {
  value.forEach((job, i) => {
    const { fecha, salary: jobSalary, title, url } = job
    const trimFecha = fecha.split('\n')[0]
    const isExistDate = dic.groupedByDate.findIndex((u) => u.date === trimFecha)
    const isExistSalary = dic.gruopedBySalary.findIndex(
      (u) => u.salary === jobSalary
    )

    if (isExistDate === -1) {
      const obj = { date: trimFecha, works: [{ jobSalary, title, url }] }
      dic.groupedByDate.push(obj)
    } else {
      dic.groupedByDate[isExistDate].works.push({ jobSalary, title, url })
    }

    if (isExistSalary === -1) {
      const obj = { salary: jobSalary, works: [{ trimFecha, title, url }] }
      dic.gruopedBySalary.push(obj)
    } else {
      dic.gruopedBySalary[isExistSalary].works.push({
        trimFecha,
        title,
        url
      })
    }
  })
}

function createHTML({ groupedByDate, gruopedBySalary }) {
  let date = ''
  let salary = ''
  console.log(groupedByDate)
  groupedByDate.forEach((u) => {
    let str = ''

    u['works'].forEach((h) => {
      str += `
      <div class="jobsContainer">
      <p>${h.title}</p>
      <p>${h.jobSalary}</p>
      <a href=${h.url} target='_blank' />link</a>
      </div>
      `
    })

    date += `
   <div>
   <h3>${u.date}</h3>
   <div >
   ${str}
   </div>
   </div>
   `
  })

  gruopedBySalary.forEach((u) => {
    let str = ''

    u['works'].forEach((h) => {
      str += `
      <div class="jobsContainer">
      <p>${h.title}</p>
      <p>${h.trimFecha}</p>
      <a href=${h.url} target='_blank'/>link</a>
      </div>

      `
    })

    salary += `
    <div>
    <h3>${u.salary}</h3>
    <div >
    ${str}
    </div>
    </div>
    `
  })

  return { date, salary }
}

chrome.runtime.onConnect.addListener(function (port) {
  let count = 1
  let num = 0
  port.onMessage.addListener(({ cmd, number }) => {
    if (typeof number !== 'undefined') {
      num = number
    }

    if (cmd === 'scrap') {
      console.log('scrap', cmd)

      function recursiva() {
        const buttosig = document.querySelector('.next-0-2-622') || null
        if (!buttosig) {
          setTimeout(() => {
            return recursiva()
          }, 300)
        } else {
          groupJobs(getJobsInformation(), dicJobs)
          console.log(dicJobs)

          count++
          if (count <= num) buttosig.click()
          else port.postMessage({ message: createHTML(dicJobs) })
        }
      }
      recursiva()
    }
    // sendResponse({ result: 'Botón clickeado' })
  })
})
