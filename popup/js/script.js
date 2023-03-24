function findElementByClassName(elementsArray, className) {
  return elementsArray.find((element) => element.className.includes(className));
}

function getDataScraping() {
  const nodeListOfJobCard = document.querySelectorAll("[id*='jobcard-']");
  const jobCardArray = [...nodeListOfJobCard];

  const dataScraping = jobCardArray.map((jobCardElement) => {
    const pElemetsArray = [...jobCardElement.getElementsByTagName("p")];
    const aElementsArray = [...jobCardElement.getElementsByTagName("a")];
    const h2ElemetsArray = [...jobCardElement.getElementsByTagName("h2")];
    const spanElemetsArray = [...jobCardElement.getElementsByTagName("span")];
    const labelElemetsArray = [...jobCardElement.getElementsByTagName("label")];

    const postLink = findElementByClassName(
      aElementsArray,
      "jobcard-0-2-559"
    ).href;
    const datePosted = findElementByClassName(
      labelElemetsArray,
      "text-0-2-82 small-0-2-90"
    ).innerText;
    const jobPosition = findElementByClassName(
      h2ElemetsArray,
      "text-0-2-82 subheading-0-2-86"
    ).innerText;
    const salaryRange = findElementByClassName(
      spanElemetsArray,
      "text-0-2-82 standard-0-2-89"
    ).innerText;
    const jobDescription = findElementByClassName(
      pElemetsArray,
      "text-0-2-82 small-0-2-90"
    ).innerText;
    const companyElement = findElementByClassName(
      labelElemetsArray,
      "text-0-2-82 standard-0-2-89"
    );
    const locationsElement = findElementByClassName(
      pElemetsArray,
      "zonesLinks-0-2-602"
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
