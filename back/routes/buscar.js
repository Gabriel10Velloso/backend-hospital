// Provar que as rotas existem antes de colocar o código

var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');


// ==============================
// Buscar por collection
// ==============================
app.get('/collection/:tabla/:buscando', (req, res) => {

    var buscando = req.params.buscando;
    var tabla = req.params.tabla;
    var regex = new RegExp(buscando, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(buscando, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(buscando, regex);
            break;

        case 'hospitais':
            promesa = buscarHospitais(buscando, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensagem: 'Os tipos de busca são para: Usuários, Médicos e Hospitais',
                error: { message: 'Tipo de tabla/collection não é valido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busca general
// ==============================
app.get('/todo/:buscando', (req, res, next) => {

    var buscando = req.params.buscando;
    var regex = new RegExp(buscando, 'i');


    Promise.all([
            buscarHospitais(buscando, regex),
            buscarMedicos(buscando, regex),
            buscarUsuarios(buscando, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitais: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        })


});


function buscarHospitais(buscando, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nome: regex })
            .populate('usuario', 'nome email')
            .exec((err, hospitais) => {

                if (err) {
                    reject('Erro ao carregar os hospitais', err);
                } else {
                    resolve(hospitais)
                }
            });
    });
}

function buscarMedicos(buscando, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nome: regex })
            .populate('usuario', 'nome email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('Erro ao carregar os medicos', err);
                } else {
                    resolve(medicos)
                }
            });
    });
}

function buscarUsuarios(buscando, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nome email role')
            .or([{ 'nome': regex }, { 'email': regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro ao carregar os usuários', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}



module.exports = app;