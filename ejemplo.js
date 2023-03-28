// Crear botón de inicio
var button = document.createElement("button");
button.innerHTML = "Start";
button.style.margin = "10px";

// Agregar botón a la página
document.body.appendChild(button);

// Manejador de eventos para el botón de inicio
button.addEventListener("click", function() {
  // Inicializar variables
  var currentPage = 1;
  var totalPages = 1;
  
  // Obtener número total de páginas
  var pageNumbers = document.querySelectorAll(".pagination li a");
  if (pageNumbers.length > 0) {
    totalPages = parseInt(pageNumbers[pageNumbers.length-2].innerHTML);
  }
  
  // Función para procesar una página
  var processPage = function() {
    console.log("Procesando página " + currentPage);
    // Aquí puedes agregar el código para procesar la página actual, por ejemplo:
    // var jobListings = document.querySelectorAll(".job-listing");
    // console.log("Número de trabajos en la página: " + jobListings.length);
    // ...
    
    // Ir a la siguiente página
    if (currentPage < totalPages) {
      currentPage++;
      window.location.href = "https://www.occ.com.mx/empleos/trabajo-en-contabilidad-finanzas/?tm=0&page=" + currentPage;
    }
  };
  
  // Comenzar a procesar páginas
  processPage();
});
