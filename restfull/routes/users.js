//npm install //instala/atualiza as dependencias do projeto
//npm install 'nome do pacote' --save instala o pacote e inclui a dependencia no package.json
//npm install 'nome do pacote' -g  instala o pacote mas não inclui a dependencia no package.json
//node 'nome do arquivo js' executa o arquivo
//
//const http = require('http');//carrega o modulo http
//cria um servidor http utilizando o express
// let express = require('express');//carrega o modulo http
// let routes  = express.Router();

module.exports = (app) =>{
    app.get('/users', (req, res) => {

        console.log("URL -> ", req.url);
        console.log("METHOD -> ", req.method);
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({users:[{
                        name:'Moises', 
                        profile:'Usuário', 
                        email:'moises@ig.com', 
                        id:1
                    }]
                });
    });
    
    app.post('/users', (req, res) => {
    
        res.json(req.body);
    });
};
// module.exports = routes;
