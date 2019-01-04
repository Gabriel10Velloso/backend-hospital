var express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');


// Google
var CLIENT_ID = require('../config/config').CLIENT_ID;

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);




// =======================================================================
// Login GOOGLE
// =======================================================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name:  payload.name,
        email: payload.email,
        img:   payload.picture,
        google: true,
        // payload:   payload,
    }
}

app.post('/google', async(req, res, next) => {

    let idToken = req.body.idToken;

    var googleUser = await verify(idToken)
        .catch(err =>{
            return res.status(403).json({
                ok: false,
                mensagem: 'Token não é válido',
            });
        })

    res.status(200).json({
        ok: true,
        googleUser: googleUser,
    });

});



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