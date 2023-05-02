let JOBS_INFORMATION_FORMATTED = []

const getJobsInformation = () => {
  const jobElementInformation = document.querySelectorAll('div[id*=jobcard-]')
  const jobElementInfomationArray = Array.from(jobElementInformation)

  const jobJsonInformation = jobElementInfomationArray.map((element) => {
    const [
      { href: jobUrl },
      {
        children: [
          {
            children: [
              { innerText: jobDate },
              { innerText: jobTitle },
              { innerText: jobSalary },
            ],
          },
        ],
      },
    ] = element.children

    return {
      jobUrl,
      jobDate: jobDate.split('\n')[0],
      jobTitle,
      jobSalary: jobSalary.split(' Mensual')[0],
    }
  })

  return jobJsonInformation
}

const summarizeJobInformation = () => {
  const uniqueJobDate = [
    ...new Set(JOBS_INFORMATION_FORMATTED.map((item) => item.jobDate)),
  ]

  const jobsInfo = uniqueJobDate.map((date) => {
    const jobsByDate = JOBS_INFORMATION_FORMATTED.filter(
      (job) => job.jobDate === date
    )

    const uniqueJobSalaryRange = [
      ...new Set(jobsByDate.map((item) => item.jobSalary)),
    ]

    const jobsSalaryRangeDetails = uniqueJobSalaryRange.map((salary) => {
      const jobsDetails = jobsByDate.filter((job) => job.jobSalary === salary)

      return {
        salaryRange: salary,
        jobsDetails,
      }
    })

    return {
      jobsDate: date,
      jobsSalaryRange: jobsSalaryRangeDetails,
    }
  })

  return jobsInfo
}

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(({ cmd }) => {
    if (cmd === 'scrap') {
      console.log('Obtener información de esta página')
      JOBS_INFORMATION_FORMATTED = JOBS_INFORMATION_FORMATTED.concat(
        getJobsInformation()
      )
    }

    if (cmd === 'show') {
      console.log('JOBS_INFORMATION_FORMATTED: ', JOBS_INFORMATION_FORMATTED)
      console.log('Mostrar información resumida')
      const summaryInfo = summarizeJobInformation()
      console.log('summaryInfo: ', summaryInfo)
      port.postMessage({ message: summaryInfo })
    }
  })
})
