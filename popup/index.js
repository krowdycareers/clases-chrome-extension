const btnScripting = document.getElementById("btnscript");

const pMessageElement = document.getElementById("mensaje");

const tbodyElement = document.getElementById("tbody");

btnScripting.addEventListener("click", async () => {
    // Le estoy diciendo a chrome que me devuelva el tab que esta activo
    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
    });

    // Le digo que se conecte a ese tab y que cree un puerto de coneccion
    const portTabActive = chrome.tabs.connect(tab.id, { name: "popup" });

    


    portTabActive.onMessage.addListener( function( {message} ) {

        // pMessageElement.innerText = JSON.stringify(message, null, 2);

        // Limpia la tabla antes de agregar nuevos datos
        tbodyElement.innerHTML = "";


        // Recorre los datos y crea elementos HTML para agregarlos a la tabla
        let index = 1;
        for (const fecha in message) {
            for (const salario in message[fecha]) {
                const empleos = message[fecha][salario];

                
                for (const empleo of empleos) {
                    const tr = document.createElement("tr");
                    const th = document.createElement("th");
                    th.setAttribute("scope", "row");
                    th.innerText = index++;
                    const tdFecha = document.createElement("td");
                    tdFecha.innerText = fecha;
                    const tdSalario = document.createElement("td");
                    tdSalario.innerText = `$${salario}`;
                    const tdTitle = document.createElement("td");
                    tdTitle.innerText = empleo.title;
                    tr.appendChild(th);
                    tr.appendChild(tdFecha);
                    tr.appendChild(tdSalario);
                    tr.appendChild(tdTitle);
                    tbodyElement.appendChild(tr);
                }
            }
        }

    });

    portTabActive.postMessage({ cmd: "scrap" });

});



