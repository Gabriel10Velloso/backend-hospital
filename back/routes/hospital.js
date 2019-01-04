var express = require('express');
var mdAutenticacacao = require('../middlewares/autenticacao');

var app = express();

var Hospital = require('../models/hospital');

// =======================================================================
// Listando Todos os Hospitais
// =======================================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nome email')
        .exec((err, hospitais)=> {
            if(err) {
                return  res.status(500).json({
                    ok: false,
                    mensagem: 'Erro ao carregar os hospitais',
                    errors: err
                });
            }
            Hospital.count({} , (err, contador) =>{
                res.status(200).json({
                    ok: true,
                    hospitais: hospitais,
                    total: contador
                });
            });           
    });
});


// =======================================================================
// Criar um Novo Hospital
// =======================================================================

app.post('/', mdAutenticacacao.verificaToken, (req, res, next) => {

    var body = req.body;

    var hospital = new Hospital({
        nome: body.nome,
        usuario: req.usuario._id,
  }); 

    hospital.save((err, hospitalGuardado) => {
        if(err) {
        return res.status(400).json({
            ok: false,
            mensagem: 'Erro ao criar o hospital',
            errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado  
        });
    });
  });




// =======================================================================
// Atualizar Hospital
// =======================================================================

app.put('/:id', mdAutenticacacao.verificaToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id,  (err, hospital)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao encontrar o hospital',
                errors: err
            });
        }
        if(!hospital){
            return res.status(400).json({
                ok: false,
                mensagem: 'O Hospital com o ' + id + ' não existe' ,
                errors: {mensagem: ' Não existe um hospital com esse ID'}
            });
        }
        // Atualizando hospital
        hospital.nome = body.nome,
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado)=> {
            if(err) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Erro ao atualizar hospital',
                errors: err
                });
            }      

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado  
            }); 
        });
    });
});



// =======================================================================
// DELETAR Hospital
// =======================================================================

app.delete('/:id', mdAutenticacacao.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id,(err, hospitalDeletado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao deletar hospital',
                errors: err
            });
        }
        if (!hospitalDeletado) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Não existe esse hospital com esse ID',
                errors: {mensagem: 'Não existe esse hospital com esse ID'}
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalDeletado  
        })    
    })  
});




module.exports = app;