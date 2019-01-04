// Provar que as rotas existem antes de colocar o código

var express = require('express');
const fileUpload = require('express-fileupload');
// serve para apagar os arquivos que já existiem nas pastas e atualizarem
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    //id do usuário antes de colocar o nome da imagem 12312312312-123.png
    var id = req.params.id;

      // tiopos de collections
      var tiposValidos = ['hospitais' , 'medicos', 'usuarios']

      if (tiposValidos.indexOf(tipo) < 0) {
          return res.status(400).json({
              ok: false,
              mensagem: 'Tipo de coleção não é válida.',
              errors:{message: 'Tipo de coleção não é válida.'}
          });
      }

    if (!req.files) {    
        return res.status(400).json({
            ok: false,
            mensagem: 'Nem uma img foi selecionada.',
            errors:{message: 'Deve selecionar uma img.'}
        });
    }

    // Obeter noeme do arquivo

    var arquivoImg = req.files.img;
    var nomeCortado = arquivoImg.name.split('.');
    var extensionArquivoImg = nomeCortado[nomeCortado.length -1];


    // Extensão de arquivo válida
    var extensionValidate = ['png', 'jpg', 'gif', 'jpeg' ,'bmp'];

    if (extensionValidate.indexOf(extensionArquivoImg) < 0){
        return res.status(400).json({
            ok: false,
            mensagem: 'Extensão inválida.',
            errors:{message: 'As extensões válidas são: ' + extensionValidate.join(', ') }
        });
    }

        // Nome de archivo personalizado
    // 12312312312-123.png
    var nomeArquivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArquivoImg }`;

    // Mover o arquivo para um path (caminho)
    var path = `./uploads/${ tipo }/${ nomeArquivo }`;

    arquivoImg.mv(path, err =>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensagem: 'Erro ao mover arquivo',
                errors:err 
            });
        }

        subirPorTipo(tipo, id, nomeArquivo, res);    
        // res.status(200).json({
        //     ok: true,
        //     mensagem: 'Arquivo movido corretamente.',
        //     // nomeCortado: nomeCortado,
        //     extensionArquivoImg:extensionArquivoImg
        // });
    });          
});


function subirPorTipo(tipo, id, nomeArquivo, res) {

    if ( tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensagem: 'Usuario não existe',
                    errors: { message: 'Usuario não existe' }
                });
            }

            var pathCarregado = './uploads/usuarios/' + usuario.img;
           //se a imagem exister a mesma será apagada dessa forma seção: 11-128
            if (fs.existsSync(pathCarregado)) {
                fs.unlink(pathCarregado ,(err)=>{
                    if (err) {
                        return console.error(err);
                    }
                    console.log("Usuário img deletada com sucesso!");
                }); 
            }

            // Subindo IMG nova
            usuario.img = nomeArquivo;

            usuario.save((err, usuarioAtualizado) => {

                usuarioAtualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensagem: 'Imagem do usuário atualizada.',
                    // nomeCortado: nomeCortado,
                    usuario: usuarioAtualizado
                });
            });
        });
    }

    if ( tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensagem: 'Médico não existe',
                    errors: { message: 'Médico não existe' }
                });
            }

            var pathCarregado = './uploads/medicos/' + medico.img;
           //se a imagem exister a mesma será apagada dessa forma seção: 11-128
            if (fs.existsSync(pathCarregado)) {
                fs.unlink(pathCarregado ,(err)=>{
                    if (err) {
                        return console.error(err);
                    }
                    console.log("Médico img deletada com sucesso!");
                }); 
            }

            // Subindo IMG nova
            medico.img = nomeArquivo;

            medico.save((err, medicoAtualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensagem: 'Imagem do médico atualizada.',
                    // nomeCortado: nomeCortado,
                    medico: medicoAtualizado
                });
            });

        });       
    }

    if ( tipo === 'hospitais') {
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensagem: 'Hospital não existe',
                    errors: { message: 'Hospital não existe' }
                });
            }

            var pathCarregado = './uploads/hospitais/' + hospital.img;
           //se a imagem exister a mesma será apagada dessa forma seção: 11-128
            if (fs.existsSync(pathCarregado)) {
                fs.unlink(pathCarregado ,(err)=>{
                    if (err) {
                        return console.error(err);
                    }
                    console.log("Hospital img deletada com sucesso!");
                }); 
            }

            // Subindo IMG nova
            hospital.img = nomeArquivo;

            hospital.save((err, hospitalAtualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensagem: 'Imagem do hospital atualizada.',
                    // nomeCortado: nomeCortado,
                    hospital: hospitalAtualizado
                });
            });

        });        
    }

}

module.exports = app;