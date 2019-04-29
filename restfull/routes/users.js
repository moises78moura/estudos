//npm install //instala/atualiza as dependencias do projeto
//npm install 'nome do pacote' --save instala o pacote e inclui a dependencia no package.json
//npm install 'nome do pacote' -g  instala o pacote mas não inclui a dependencia no package.json
//node 'nome do arquivo js' executa o arquivo
//
//const http = require('http');//carrega o modulo http
//cria um servidor http utilizando o express
// let express = require('express');//carrega o modulo http
// let routes  = express.Router();

let NeDB = require('nedb');

let db = new NeDB({
    filename:'users.db',
    autoload:true
});


module.exports = (app) =>{


    let route = app.route('/users');

    route.get((req, res) => {
    // app.get('/users', (req, res) => {

        console.log("URL -> ", req.url);
        console.log("METHOD -> ", req.method);
        db.find({}).sort({name:1}).exec((err, users) => {
            if(err){
             app.utils.error.send(err, req, res);
            }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({users});// no ecma06 quando se tem uma chave 'users' que o mesmo nome da variável pode usar somente a chave 
                // res.json({users:users }); de acordo com a descrição acima do ECMA06 a expressão acima é equivalente a essa aqui.
            }
        });//busca os dados no banco, e ordena por 'name/nome' em ordem crescente, -1 seria decrescente
       
    });
    
    route.post((req, res) => {

       if(!app.utils.validator.user(app, req, res)) return false;

    // app.post('/users', (req, res) => {
        //res.json(req.body);
        db.insert(req.body,(err,user) =>{
            if(err){
                app.utils.error.send(err, req, res);
                // console.log('error: ${err}');
                // res.status(400).json({error:err});
            }else{
                res.status(200).json(user);
            }
        });
    });


    let routeId = app.route('/users/:id');

    routeId.get((req, res) => {
        db.findOne({_id:req.params.id}).exec((err, user)=>{
            if(err){
                app.utils.error.send(err, req, res);
                // console.log('error: ${err}');
                // res.status(400).json({error:err});
            }else{
                res.status(200).json(user);
            }
        });
    });

    routeId.put((req, res) => {

        if(!app.utils.validator.user(app, req, res)) return false;
        
        db.update({_id:req.params.id}, req.body, err => {
            if(err){
                app.utils.error.send(err, req, res);
                // console.log('error: ${err}');
                // res.status(400).json({error:err});
            }else{
                res.status(200).json(Object.assign(req.params, req.body));
            }
        });
    });

    routeId.delete((req, res) => {

        db.remove({_id:req.params.id}, {}, err =>{
            if(err){
                app.utils.error.send(err, req, res);
                // console.log('error: ${err}');
                // res.status(400).json({error:err});
            }else{
                res.status(200).json(req.params);
            }
        } );
        
    });



};
// module.exports = routes;
