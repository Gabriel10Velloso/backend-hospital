var express = require('express');
const bcrypt = require('bcryptjs');
var mdAutenticacacao = require('../middlewares/autenticacao');

var app = express();

var Usuario = require('../models/usuario');

// =======================================================================
// Listando Todos os Usuários
// =======================================================================

app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);
    
    Usuario.find({}, 'nome email img role')
        .skip(desde)
        .limit(5)
        .exec((err, usuarios)=> {
            if(err) {
                return  res.status(500).json({
                    ok: false,
                    mensagem: 'Erro ao carregar os usuários',
                    errors: err
                });
            }
            Usuario.count({}, (err, contador) => {

                res.status(200).json({
                    ok: true,
                    usuarios: usuarios,
                    total: contador
                });

            })
    });
});


// =======================================================================
// Criar um Novo Usuário
// =======================================================================

app.post('/', mdAutenticacacao.verificaToken, (req, res, next) => {

    var body = req.body;

    var usuario = new Usuario({
        nome: body.nome,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role    
  }); 

    usuario.save((err, usuarioGuardado) => {
        if(err) {
        return res.status(400).json({
            ok: false,
            mensagem: 'Erro ao criar usuário',
            errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado  
        });
    });
  });




// =======================================================================
// Atualizar Usuário
// =======================================================================

app.put('/:id', mdAutenticacacao.verificaToken, (req, res, next) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById( id,  (err, usuario)=>{

        if(err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao encontrar usuário',
                errors: err
            });
        }
        if(!usuario){
            return res.status(400).json({
                ok: false,
                mensagem: 'Usuário com o ' + id + ' não existe' ,
                errors: {mensagem: ' Não existe um usuário com esse ID'}
            });
        }
        // Atualizando Usuário
        usuario.nome = body.nome,
        usuario.email = body.email,
        usuario.role = body.role,

        usuario.save((err, usuarioGuardado)=> {
            if(err) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Erro ao atualizar usuário',
                errors: err
                });
            }      

            usuarioGuardado.password = ':)'

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado  
            }); 
        });
    });
});



// =======================================================================
// DELETAR Usuário
// =======================================================================

app.delete('/:id', mdAutenticacacao.verificaToken, (req, res, next) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id,(err, usuarioDeletado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao deletar usuário',
                errors: err
            });
        }
        if (!usuarioDeletado) {
            return res.status(400).json({
                ok: false,
                mensagem: 'Não existe esse usuário',
                errors: {mensagem: 'Não existe esse usuário'}
            });
        }
        res.status(200).json({
            ok: true,
            usuario: usuarioDeletado  
        })    
    })  
});




module.exports = app;