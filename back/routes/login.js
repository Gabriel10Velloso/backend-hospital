var express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');


// Google
var GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(GOOGLE_CLIENT_ID);




// =======================================================================
// Login GOOGLE
// =======================================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        // tem que ser idToken --- se colocar token:token dá erro
        idToken: token,
        audience: GOOGLE_CLIENT_ID,  // Specify the GOOGLE_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[GOOGLE_CLIENT_ID_1, GOOGLE_CLIENT_ID_2, GOOGLE_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nome:  payload.name,
        email: payload.email,
        img:   payload.picture,
        google: true,
        // payload:   payload,
    }
}


app.post('/google', async(req, res, next) => {
    //token = google
    let token = req.body.token;

    var googleUser = await verify(token)
        .catch(e =>{
            return res.status(403).json({
                ok: false,
                mensagem: 'Token não é válido',
            });
        });
    
    // Gavabdo o login do google na minha base de Dados
    Usuario.findOne({email:googleUser.email}, (err, usuarioDb)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao buscar usuários',
                errors: err
            });
        } 

        if(usuarioDb) {
            
            if (usuarioDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensagem: 'Deve usar sua autentiação normal',
                });
            } else {
                var token = jwt.sign({usuario: usuarioDb}, SEED, {expiresIn: 140000})
                    //token = minha base de dados
                    res.status(201).json({
                        ok: true,
                        usuario: usuarioDb,
                        token: token,
                        id: usuarioDb._id
                    });
            }
        } else {
            // 1º Cadastro - Usuário não exite .... tem que ser criado
            var usuario = new Usuario();

            usuario.nome = googleUser.nome;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDb) => {

                var token = jwt.sign({usuario: usuarioDb}, SEED, {expiresIn: 140000})
                //token = minha base de dados
                res.status(201).json({
                    ok: true,
                    usuario: usuarioDb,
                    token: token,
                    id: usuarioDb._id
                });
            })
        }

    });

    // res.status(200).json({
    //     ok: true,
    //     googleUser: googleUser,
    // });

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