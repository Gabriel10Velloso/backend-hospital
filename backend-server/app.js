// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variáveis
var app = express();

// Body-Parser parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar Rotas 
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');



// Comexção da base de dados 
mongoose.connection.openUri('mongodb://gabriel:gabriel@clusterspider1-shard-00-00-x0ls9.mongodb.net:27017,clusterspider1-shard-00-01-x0ls9.mongodb.net:27017,clusterspider1-shard-00-02-x0ls9.mongodb.net:27017/hospitalDB?ssl=true&replicaSet=ClusterSpider1-shard-0&authSource=admin&retryWrites=true', (err, res) => {

    if (err) throw err;

    console.log('Base de dados: \x1b[32m%s\x1b[0m', 'online');

});


// Rotas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escutando o Servidor
app.listen(3000, () => {
    console.log('Express server porta 3000: \x1b[32m%s\x1b[0m', 'online');
});