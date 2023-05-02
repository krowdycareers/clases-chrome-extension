const myButton = document.getElementById("btnAlert");
const container = document.getElementById("tableContainer");

const sendMessageToActiveTab = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true});

  await chrome.tabs.sendMessage(tab.id, {msg: "Hola"}, SetTableData);
}

function SetTableData({data, search}){  
  if(data){
    GenerateTable(data, search);
  }
}

myButton.addEventListener('click', sendMessageToActiveTab);

function GenerateTable(data, searchParam) {
  myButton.remove();
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    const caption = document.createElement("caption");
    caption.innerText = searchParam.toUpperCase();
    tbl.appendChild(caption);
    // Table Head ------------------------------------------
    //#region 
    const tbHead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    //Get all Object Keys as <th>{key}</th>
    const allKeys = Object.keys(data[0]);
    
    allKeys.forEach(key => {
      const theader = document.createElement("th");
      const thText = document.createTextNode(key.toUpperCase());
      theader.appendChild(thText);
      headerRow.appendChild(theader);
    })

    tbHead.appendChild(headerRow);
    tbl.appendChild(tbHead);
    //--------------------------------------------------------
    //#endregion

    const tblBody = document.createElement("tbody");
  
    // creating all cells
    data.forEach(job => {
      // creates a table row
      const row = document.createElement("tr");

      for (let j = 0; j < allKeys.length; j++) {
        // Create a <td> element and a text node, make the text
        // node the contents of the <td>, and put the <td> at
        // the end of the table row
        const cell = document.createElement("td");
        if(allKeys[j] == "url"){
          const aElement = document.createElement("a");
          aElement.innerText = "Link";
          aElement.setAttribute("href", job[allKeys[j]]);
          aElement.setAttribute("target", "_blank");
          cell.appendChild(aElement);
        }
        else{
          const cellText = document.createTextNode(job[allKeys[j]]);
          cell.appendChild(cellText);
        }

        row.appendChild(cell);
      }
  
      // add the row to the end of the table body
      tblBody.appendChild(row);
    }
    )

    // put the <tbody> in the <table>
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    document.body.appendChild(tbl);
    // sets the border attribute of tbl to '2'
    tbl.setAttribute("border", "2");


    container.appendChild(tbl);
  }