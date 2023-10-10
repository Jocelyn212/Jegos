recibirJuegos();

function recibirJuegos() {
  fetch("/api/juegos")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      let juegos = "";
      for (let i = 0; i < data.length; i++) {
        juegos += `
                <div class="card" >
                    <h3>${data[i].titulo}</h3>
                    <p>Genero: ${data[i].genero}</p>
                    <p>Plataforma: ${data[i].plataforma}</p>
                  <div>
                   <img src="${data[i].img}" alt="Juego" width="180" height="240">
                  </div>
                   <button id="agregarFavorito${i}" onclick="agregarFavorito('${data[i].titulo}')">Agregar a favoritos</button>
                 </div>
            `;
      }
      // USO DEL DOM.  IMPRIMO DESDE EL JS AL HTML
      document.getElementById("div1").innerHTML = juegos;
    });
}
// prueba modal
// Agrega estas funciones a tu archivo JavaScript
function buscar() {
  let titulo = document.getElementById("juegoBuscar").value;
  fetch("/api/juegos/" + titulo)
    .then(function (res) {
      return res.json();
    })
    .then(function (datos) {
      let juegos = "";
      for (let i = 0; i < datos.length; i++) {
        juegos += `
          <div class="card" >
            <h4>${datos[i].titulo}</h4>
            <p>Plataforma: ${datos[i].plataforma}</p>
            <p>Genero: ${datos[i].genero}</p>
            <div>
              <img src="${datos[i].img}" alt="Juego" width="180" height="240">
            </div>
            <button onclick="agregarFavorito('${datos[i].titulo}')">Agregar a favoritos</button>
          </div>
        `;
      }
      document.getElementById("modal-content").innerHTML = juegos;
      abrirModal();
    });
}

function abrirModal() {
  document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
  document.getElementById("modal").style.display = "none";
}

function insertarJuego() {
  let titulo = document.getElementById("titulo").value;
  let genero = document.getElementById("genero").value;
  let plataforma = document.getElementById("plataforma").value;
  let img = document.getElementById("img").value;
  let juegoInsertar = {
    titulo,
    genero,
    plataforma,
    img,
  };
  fetch("/api/nuevoJuego/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(juegoInsertar),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (datos) {
      console.log(datos);
      recibirJuegos();
    });
}

//FUCIONES PARA FAVORITOS:

// Función para agregar un juego a la lista de favoritos
function agregarFavorito(titulo) {
  // Enviar los datos del juego al servidor
  fetch("/api/agregarFavorito", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ titulo: titulo }),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (datos) {
      console.log(datos);
    });
  // Muestra un mensaje
  let mensaje = document.getElementById("mensaje");
  mensaje.textContent = "Agregado exitosamente";
  mensaje.style.display = "block";

  // Oculta el mensaje después de 3 segundos
  setTimeout(function () {
    mensaje.style.display = "none";
  }, 3000);
}

// Función para recuperar y mostrar los juegos favoritos
function mostrarFavoritos() {
  fetch("/api/favoritos")
    .then(function (res) {
      return res.json();
    })
    .then(function (juegos) {
      let html = "";
      for (let i = 0; i < juegos.length; i++) {
        html += `
          <div class="card" >
            <h3>${juegos[i].titulo}</h3>
            <p>Genero: ${juegos[i].genero}</p>
            <p>Plataforma: ${juegos[i].plataforma}</p>
            <div>
              <img src="${juegos[i].img}" alt="Juego" width="180" height="240">
            </div>
            <button onclick="eliminarFavorito('${juegos[i].titulo}')">Eliminar de favoritos</button>
          </div>
        `;
      }
      document.getElementById("favoritos").innerHTML = html;
    });
}
// Función para eliminar un juego de la lista de favoritos
function eliminarFavorito(titulo) {
  fetch("/api/favoritos/" + titulo, {
    method: "DELETE",
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (datos) {
      console.log(datos);
      // Volver a mostrar los juegos favoritos después de eliminar uno
      mostrarFavoritos();
    });
}

// Llamar a la función mostrarFavoritos cuando se carga la página
if (document.getElementById("favoritos")) {
  mostrarFavoritos();
}

//funciona editar un favorito 
function editar() {
  let titulo = document.getElementById("tituloEditar").value;
  let genero = document.getElementById("generoEditar").value;
  let plataforma = document.getElementById("plataformaEditar").value;
  let img = document.getElementById("imgEditar").value;
   let nuevo= {
    titulo:titulo,
    genero:genero,
    plataforma:plataforma,
    img:img
   }
   fetch("/api/favoritos", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nuevo),
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (datos) {
      console.log(datos);
      // Volver a mostrar los juegos favoritos después de editar uno
      mostrarFavoritos();
     
    });
   
}

