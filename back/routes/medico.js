var express = require('express');

var mdAutenticacacao = require('../middlewares/autenticacao');

var app = express();

var Medico = require('../models/medico');

// ==========================================
// GET Médicos
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nome email')
        .populate('hospital')
        .exec(
            (err, medicos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensagem: 'Erro ao carregar os médicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, contador) => {
                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: contador
                    });

                })

            });
});


// ==========================================
// Atualizar Medico
// ==========================================
app.put('/:id', mdAutenticacacao.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao encontrar médico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Não existe esse médico com esse ID ' + id,
                errors: { message: 'Não existe esse médico com esse ID' }
            });
        }


        medico.nome = body.nome;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensagem: 'Erro ao atualizar médico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});



// ==========================================
// Criando um novo Médico
// ==========================================
app.post('/', mdAutenticacacao.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nome: body.nome,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Erro ao criar médico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });


    });

});


// ============================================
//  DELETAR Médico
// ============================================
app.delete('/:id', mdAutenticacacao.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao deletar médico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Não existe esse médico com esse ID ' + id,
                errors: { message: 'Não existe esse médico com esse ID' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});


module.exports = app;