function getDataScraping() {
  const nodeListOfJobCard = document.querySelectorAll("[id*='jobcard-']");
  const jobCardArray = [...nodeListOfJobCard];

  const dataScraping = jobCardArray.map((jobCardElement) => {
    const postLink = jobCardElement.querySelector("a.jobcard-0-2-559").href;
    const datePosted = jobCardElement.querySelector(
      "label.text-0-2-82.small-0-2-90"
    ).innerText;
    const jobPosition = jobCardElement.querySelector(
      "h2.text-0-2-82.subheading-0-2-86"
    ).innerText;
    const salaryRange = jobCardElement.querySelector(
      "span.text-0-2-82.standard-0-2-89"
    ).innerText;
    const jobDescription = jobCardElement.querySelector(
      "p.text-0-2-82.small-0-2-90"
    ).innerText;
    const companyElement = jobCardElement.querySelector(
      "label.text-0-2-82.standard-0-2-89"
    );
    const locationsElement = jobCardElement.querySelector(
      "p.zonesLinks-0-2-602"
    );

    const locationsNamesArray = locationsElement.innerText
      .split(",")
      .map((locationName) => locationName.trim());
    const locationChildrenArray = [...locationsElement.children];

    const locations = locationsNamesArray.map((locationName) => {
      const locationElement = locationChildrenArray.find((locationChildren) =>
        locationChildren.innerText.includes(locationName)
      );

      return {
        link: locationElement && locationElement.href,
        location: locationName,
      };
    });

    return {
      postLink,
      datePosted,
      jobPosition,
      salaryRange,
      jobDescription,
      company: {
        link: companyElement.children[0].href,
        name: companyElement.innerText,
      },
      locations,
    };
  });

  return dataScraping;
}

function printDataScraping() {
  const dataScraping = getDataScraping();
  console.log(dataScraping);
}

printDataScraping();
