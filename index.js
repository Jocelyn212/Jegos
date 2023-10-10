
const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongodb = require("mongodb");

let MongoClient = mongodb.MongoClient;


// CONEXIÓN CON MONGODB VÍA MONGO CLIENT
MongoClient.connect(
  "mongodb+srv://jocelyncf:idvLvNUj0y9jNQtO@grupoc.myft7qs.mongodb.net/?retryWrites=true&w=majority",
  function (err, client) {
    if (err != null) {
      console.log(err);
      console.log("No se ha podido conectar con MongoDB");
    } else {
      app.locals.db = client.db("videoJuegos");
      console.log(
        "Conexión correcta a la base de datos videoJuegos de MongoDB"
      );
    }
  }
);
app.get("/api/juegos", mostrarJuego);
app.post("/api/nuevoJuego", añadirJuego);
app.get("/api/juegos/:titulo", buscarJuego);

// CONTROLADOR - VER TODOS LOS JUEGOS
function mostrarJuego(req, res) {
  app.locals.db
    .collection("juegos")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
}
app.get("/api/juegos", mostrarJuego);

function añadirJuego(req, res) {
  const juego = {
    titulo: req.body.titulo,
    genero : req.body.genero,
    plataforma: req.body.plataforma,
    img: req.body.img
    
  };
  app.locals.db.collection("juegos").insertOne(juego, function (err, res) {
    if (err) throw err;
    console.log("Nuevo Juego insertado");
  });
  res.redirect("/api/juegos");
}

// CONTROLADOR - BUSCAR JUEGO POR TITULO
function buscarJuego(req, res) {
  const titulo = req.params.titulo;
  app.locals.db
    .collection("juegos")
    .find({
      $or: [
        { titulo: { $regex: titulo, $options: "i" } },
        
      ],
    })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
}

//Rutas la nueva coleccion de favoritos

app.post("/api/agregarFavorito", function (req, res) {
  // Obtener los datos del juego desde el cuerpo de la solicitud
  const titulo = req.body.titulo;

  // Buscar el juego en la base de datos
  app.locals.db
    .collection("juegos")
    .findOne({ titulo: titulo }, function (err, juego) {
      if (err) throw err;

      // Verificar si el juego ya está en la lista de favoritos
      app.locals.db
        .collection("favoritos")
        .findOne({ titulo: titulo }, function (err, juegoFavorito) {
          if (err) throw err;

          if (juegoFavorito) {
            // El juego ya está en la lista de favoritos
            res.send({ mensaje: "El juego ya está en la lista de favoritos" });
          } else {
            // Agregar el juego a la lista de favoritos
            app.locals.db.collection("favoritos").insertOne(juego, function (
              err,
              result
            ) {
              if (err) throw err;
              res.send({ mensaje: "Juego agregado a favoritos" });
            });
          }
        });
    });
});
app.get("/api/favoritos", function (req, res) {
  // Buscar todos los juegos en la colección "favoritos"
  app.locals.db
    .collection("favoritos")
    .find({})
    .toArray(function (err, juegos) {
      if (err) throw err;
      res.send(juegos);
    });
});

//para editar un juego de la lista de favoritos
app.put("/api/favoritos", (req, res) => {
  let titulo = req.body.titulo;
  let genero = req.body.genero;
  let plataforma = req.body.plataforma;
  let img = req.body.img;

  app.locals.db.collection("favoritos").updateOne(
    { titulo: titulo },
    { $set: { genero: genero, plataforma: plataforma, img: img } },
    function (err, result) {
      if (err) throw err;
      res.send(result);
    }
  );
});

//para eliminar un juego de la lista de favoritos
app.delete("/api/favoritos/:titulo", function (req, res) {
  // Obtener el título del juego desde el parámetro de la ruta
  const titulo = req.params.titulo;

  // Eliminar el juego de la colección "favoritos"
  app.locals.db.collection("favoritos").deleteOne({ titulo: titulo }, function (
    err,
    result
  ) {
    if (err) throw err;
    res.send({ mensaje: "Juego eliminado de favoritos" });
  });
});




app.listen(3000);
  

