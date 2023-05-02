function getJobsInformation() {
    let jobsElementInformation = document.querySelectorAll("div[id*=jobcard]");
    jobsElementInformation = [...jobsElementInformation];

    // console.log(jobsElementInformation);

    let jobJsonInformation = jobsElementInformation.map((el) => {
        const [
            { href: url },
            {
                children: [
                    {
                        children: [
                            { innerText: fecha },
                            { innerText: title },
                            { innerText: salary },
                            { innerText: requisitos },
                        ],
                    },
                ],
            },
        ] = el.children;


        return { url, fecha, title, salary, requisitos};
    });


    jobJsonInformation.forEach(function(job) {
        // reemplazar la cadena "\nRecomendada" por una cadena vacía en la propiedad "fecha" de cada objeto
        job.fecha = job.fecha.replace("\nRecomendada", "");
    });

    // console.log(jobJsonInformation);

    let agrupacion = jobJsonInformation.reduce(function(obj, item) {

        if (!obj[item.fecha]) {
            obj[item.fecha] = {};
        }
        // let salario = item.salary.replace(/\D/g, ''); //extrae el número de salario eliminando el "$" y las ","
        let salario = item.salary.replace(/[^\d-]/g, "");
        if (!obj[item.fecha][salario]) {
            obj[item.fecha][salario] = [];
        }
        obj[item.fecha][salario].push(item);

        return obj;
    }, {});

    return agrupacion;
}


// Cuando el puerto de coneccion se cree va a establecer este Connect
chrome.runtime.onConnect.addListener(function (port) {
    // Con el puerto de coneccion le decimos -> a ese puerto quiero escuchar cuando me mandes algun tipo de comando
    port.onMessage.addListener( ({ cmd }) => {
        if (cmd == "scrap") {
            const jobsInformation = getJobsInformation();
            port.postMessage( { message: jobsInformation } )

        }


    });

    
});

