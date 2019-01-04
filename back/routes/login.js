var express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// =======================================================================
// Login Usuário
// =======================================================================

app.post('/', (req, res, next) => {
  body = req.body;
  Usuario.findOne( {email: body.email}, (err, usuarioDb) => {

    if(err) {
        return res.status(500).json({
            ok: false,
            mensagem: 'Erro ao buscar usuários',
            errors: err
        });
    } 
    if(!usuarioDb){
        return res.status(400).json({
            ok: false,
            mensagem: 'Email incorreto' ,
            errors: err
        });
    } 

    if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
        return res.status(400).json({
            ok: false,
            mensagem: 'Senha incorreta' ,
            errors: err
        });
    }

    // Criando o Token
    usuarioDb.password =':)';
    var token = jwt.sign({usuario: usuarioDb}, SEED, {expiresIn: 140000})

    res.status(201).json({
        ok: true,
        usuario: usuarioDb,
        token: token,
        id: usuarioDb._id
    });
  });
});



module.exports = app;