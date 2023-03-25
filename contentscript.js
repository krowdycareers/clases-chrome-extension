console.log("Ejecutando el content script 1.0");
function getLocationsData(locationsElement) {
  /*
  locationsElement: 
    <p class="zonesLinks-0-2-602">
      Cancún Centro, 
      <a class="link-0-2-603" href="/ciudad-benito-juarez">
        Benito Juárez
      </a>
    </p>
  */
  const locationsNamesArray =
    locationsElement.innerText /* Cancún Centro, Benito Juárez */
      .split(",") /* ["Cancún Centro ", "Benito Juárez"] */
      .map((locationName) =>
        locationName.trim()
      ); /* => ["Cancún Centro", "Benito Juárez"] */

  const locationChildrenArray = [
    ...locationsElement.children,
  ]; /* [a.link-0-2-603] */

  const locations = locationsNamesArray.map(
    (locationName /* Cancún Centro | Benito Juárez */) => {
      const locationElement = locationChildrenArray.find(
        (
          locationChildren
          /* <a class="link-0-2-603" href="/ciudad-benito-juarez">
              Benito Juárez
            </a> */
        ) => locationChildren.innerText.includes(locationName)
      ); /* return undefined | a.link-0-2-603 */

      return {
        link:
          locationElement &&
          locationElement.href /* undefined |  /ciudad-benito-juarez */,
        location: locationName /* Cancún Centro | Benito Juárez */,
      };
    }
  );

  return locations;
}

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
      locations: getLocationsData(locationsElement),
    };
  });

  return dataScraping;
}

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function ({ message }) {
    const jobData = getDataScraping();
    if (message === "getJobsData")
      port.postMessage({ message: "ok", data: jobData });
  });
});
