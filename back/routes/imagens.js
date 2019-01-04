// Provar que as rotas existem antes de colocar o código

var express = require('express');

var app = express();
// para carregar as imagens
const path = require('path');

// verificar se a img existe no path
const fs = require('fs');


app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagem =  `./uploads/${tipo}/${img}`;

    if (!fs.existsSync(pathImagem)) { // retorna um tru ou false
        var pathImagem = `./assets/no-img.jpg`;     // verificando se a imagem existe
    }       
        res.sendFile(path.resolve(pathImagem));

});


module.exports = app;